import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  console.log("=== ANALYZE START ===", new Date().toISOString());
  console.log("ANTHROPIC_API_KEY present:", !!process.env.ANTHROPIC_API_KEY);
  console.log("ANTHROPIC_API_KEY length:", process.env.ANTHROPIC_API_KEY?.length);
  console.log("Request body size:", JSON.stringify(req.body || {}).length);
  console.log("Story length:", req.body?.story?.length);
  console.log("IdeaType:", req.body?.ideaType);
  console.log("Method:", req.method);
  console.log("Body keys:", Object.keys(req.body || {}));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("MISSING ANTHROPIC_API_KEY");
    return res.status(500).json({
      error: "API key not configured",
      detail: "ANTHROPIC_API_KEY environment variable is missing"
    });
  }

  const {
    signal, idea, headline, story,
    ideaType = "personal",
    icp = "", method = "", destination = "", competition = "",
    q1 = "", q2 = "", q3 = ""
  } = req.body;

  const ideaText = idea || signal || "";

  if (!story || story.trim().length < 10) {
    console.error("Story too short:", story?.length);
    return res.status(400).json({
      error: "Story too short",
      detail: `Story length: ${story?.length || 0} characters`
    });
  }

  try {
    console.log("=== CALLING ANTHROPIC ===");

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const isPersonal = ideaType !== "business";

    const sharedContext = `
The thing they're circling: ${ideaText || "not specified"}
Headline they gave it: ${headline || "not specified"}
Story they wrote: ${story}
Their own reflections:
- Who's in the story / who isn't: ${q1 || "not answered"}
- What they assumed stayed the same: ${q2 || "not answered"}
- What they didn't write about: ${q3 || "not answered"}
`;

    const personalPrompt = `You are analyzing a 10-minute clarity sprint. Someone has been circling a decision or idea and wrote a story where it resolved. Surface what their writing reveals that they couldn't see by thinking about it directly.

For every finding, quote their exact words as evidence. If something is absent, name it — absence is information.

${sharedContext}

PART 0 — THE WORLDVIEW UNDERNEATH
What does this story assume to be permanently true about how the world works — about people, systems, what gets rewarded? What future does this worldview create if it's right? What falls through the cracks if it's wrong?

PART 1 — HIDDEN ASSUMPTIONS
The 5 most load-bearing assumptions. Rank 1-5, most load-bearing first. For each: quote the exact words, explain why it's load-bearing.

PART 2 — SIGNALS TO WATCH
3 signals classified:
EYEWITNESS: something they'd notice without trying, in daily life
EXPLAINER: connects this signal to other domains
EXPERT: only people deep in this space would catch this
Focus on the eyewitness signal most.

PART 3 — THREE THINGS TO DO THIS WEEK
3 actions. Each: under 2 hours, under $50, produces real signal — not motion, not planning. Specific to their situation.

PART 4 — WHAT'S MISSING
What was conspicuously absent? Name it directly. Absence of evidence is evidence.`;

    const businessPrompt = `You are analyzing a 10-minute clarity sprint about a business idea or career move. Someone has been circling this and wrote a story where it resolved. Surface what their writing reveals that they couldn't see by thinking about it directly.

For every finding, quote their exact words as evidence. If something is absent, name it — absence is information.

${sharedContext}
Their stated vision:
- Who it's for: ${icp || "not specified"}
- Method: ${method || "not specified"}
- Transformation: ${destination || "not specified"}
- What already exists: ${competition || "not specified"}

PART 0 — THE WORLDVIEW UNDERNEATH
What does this story assume to be permanently true about the market, customers, how value gets created? What future does this worldview create if right? What falls through the cracks if wrong?

PART 1 — HIDDEN ASSUMPTIONS
5 most load-bearing assumptions. Rank 1-5. Include assumptions about market, customer, timing, capability. Quote exact words for each.

PART 2 — STATED VISION VS WHAT THE STORY REVEALED
Compare what they said they were building vs what the story showed.

WHO IT'S FOR
Stated: ${icp || "not specified"}
Story revealed: [who actually appeared]
Evidence: [direct quote or note absence]

METHOD
Stated: ${method || "not specified"}
Story revealed: [how work was actually described]
Evidence: [direct quote or note absence]

DESTINATION
Stated: ${destination || "not specified"}
Story revealed: [where story actually ended up]
Evidence: [direct quote or note absence]

COMPETITION
Stated: ${competition || "not specified"}
Story revealed: [what story assumed didn't exist]
Evidence: [direct quote or note absence]

PART 3 — SIGNALS TO WATCH
3 signals:
EYEWITNESS: something they'd notice in daily life without trying
EXPLAINER: connects to other domains
EXPERT: only people deep in this market would catch
Then: who else is watching the same signals for different reasons?

PART 4 — THREE THINGS TO DO BEFORE ANNOUNCING
3 actions this week. Each: under 2 hours, under $50, produces signal from actual humans.

PART 5 — MARKET REALITY CHECK
Given what already exists, what would have to be true for this version to win? Most honest interpretation of differentiation.`;

    const prompt = isPersonal ? personalPrompt : businessPrompt;

    console.log("=== CALLING ANTHROPIC API ===");
    console.log("Prompt length:", prompt.length);
    console.log("Model: claude-sonnet-4-20250514");

    let response;
    try {
      response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }]
      });
      console.log("=== ANTHROPIC SUCCESS ===");
      console.log("Stop reason:", response.stop_reason);
      console.log("Input tokens:", response.usage?.input_tokens);
      console.log("Output tokens:", response.usage?.output_tokens);
    } catch (err) {
      console.error("=== ANTHROPIC CALL FAILED ===");
      console.error("Name:", err.name);
      console.error("Message:", err.message);
      console.error("Status:", err.status);
      console.error("Error body:", JSON.stringify(err.error || err, null, 2));
      return res.status(500).json({
        error: "Anthropic API call failed",
        name: err.name,
        message: err.message,
        status: err.status,
        detail: err.error || null
      });
    }

    const analysisText = response.content[0].text;
    console.log("Analysis length:", analysisText.length);

    return res.json({
      success: true,
      analysis: analysisText
    });

  } catch (err) {
    console.error("=== OUTER ERROR ===");
    console.error("Error type:", err.constructor.name);
    console.error("Error message:", err.message);
    console.error("Full error:", JSON.stringify(err, null, 2));

    return res.status(500).json({
      error: "Handler failed",
      type: err.constructor.name,
      message: err.message,
      status: err.status || null
    });
  }
}
