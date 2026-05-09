EWS — System Contract
Write Your Future · Modern Myths · Mohammad Khan
This document defines the invariant structure of the Early Warning System (EWS). It is the highest-level specification in the system. It is the first document every Claude Code session must read.
All implementation, prompts, UI decisions, and data models must conform to this contract.
If a proposed change cannot be mapped to one of the six primitives, it does not belong in EWS.

1. WHAT EWS IS
EWS is a story-based self-recognition system.
It allows a user to:
Write an unguarded fictional story set five years in the future
Receive an analysis of what the story reveals that analytical thinking couldn't reach
See their Default Narrative named precisely — the story running underneath their decisions
Receive a narrative report that maps where that narrative leads if unexamined
Take one concrete move that generates signal about whether their direction is right
EWS is fundamentally about:
Returning people to what they already know but cannot access analytically.
The story is the instrument. The analysis is the mirror. The Default Narrative is the thing they came to find — whether they knew it or not.
EWS is an extension of SenseMakers — Mohammad's live session methodology. It allows a person to go through that session without Mohammad present.

2. WHAT EWS IS NOT
EWS is explicitly NOT:
A journaling app
A therapy tool
A personality assessment
A goal-setting or productivity tool
A content generator
A coaching chatbot
A survey or questionnaire
A prediction engine
An engagement-optimized experience
EWS does NOT optimize for:
Session length
Repeat usage loops
Emotional comfort
Validation or affirmation
Comprehensive coverage of every possible insight
EWS does NOT attempt to:
Diagnose psychological conditions
Replace human judgment or live facilitation
Automate the session Mohammad runs in person
Tell people what to do
Resolve the tension the analysis surfaces
The tool has one ceiling it does not pretend to clear: it cannot ask, adjust, and sit with someone the way Mohammad does in a live session. No amount of prompt engineering removes that ceiling. The calibration stage narrows it. The fork narrows it further. The ceiling is real and acknowledged.

3. THE SIX IMMUTABLE PRIMITIVES
The entire system is built on six primitives. These must never be removed or redefined.
Primitive 1 — Signal
What the user is circling. The idea, decision, or question they haven't been able to resolve analytically.
Not a goal. Not a problem statement. The thing they keep coming back to.
Signal is the root input. No valid output exists without it.
Primitive 2 — Story
A free-written fictional account, set five years in the future, where the thing they're circling has resolved.
Stories are multidimensional. A plan, a goal list, a brainstorm — those are one-dimensional. A story cannot stay in the lane the writer already knows. Details surface that the writer didn't decide to put there. It is harder to lie in 15 minutes than in a planning session that took three hours.
The story doesn't care what the writer meant to say. It shows what they're actually carrying.
Invariant rules:
The story must be timed (default: 10 minutes)
The anchor prompt is fixed: "Start with a specific morning. Where are you? What do you see first."
Voice input is supported (Chrome only via Web Speech API)
The story cannot be skipped, pre-filled in production, or replaced by a form
Primitive 3 — Calibration
Context gathered before the analysis fires. Two inputs:
Where they are (required, single select): early / mid / deep
Lens (optional, free text): a tradition, lineage, or way of seeing the world central to their thinking
Calibration determines interpretive mode. It is the mechanism by which the system reads the room before it interprets.
early or mid → DISCOVERY mode
deep → VERIFICATION mode
Calibration is not a survey. It is two inputs and one continue button. It must remain fast and frictionless.
Primitive 4 — Analysis
The primary AI output. A structured reading of the story across eight dimensions:
YOUR OWN WORDS
PART 0 — THE WORLDVIEW UNDERNEATH
PART 1 — WHAT YOU DIDN'T PLAN TO WRITE
PART 2 — THE EMOTIONAL FIELD UNDERNEATH
PART 3 — THE ASSUMPTIONS RUNNING YOUR STORY
PART 4 — WHAT MUST BE TRUE FOR THIS FUTURE TO EXIST
PART 5 — WHAT TO WATCH FOR RIGHT NOW
PART 6 — WHAT'S MISSING AND WHAT THAT MEANS
PART 8 — DEFAULT NARRATIVE (includes NAME IT, WHY IT MATTERS, THE EVIDENCE, WHAT IT COSTS or WHAT THIS CONFIRMS, ONE MOVE)
The analysis prompt is locked. It may be refined but never replaced with a different structure. The two modes (DISCOVERY / VERIFICATION) are permanent — they adjust tone and framing, not the section order.
The tone invariant: the person should read the analysis and think "how did it know that" — not "I'm being analyzed."
Primitive 5 — Default Narrative
The named story running underneath the writer's decisions — the cultural, inherited, or deliberately built narrative they're operating inside.
The Default Narrative is the connective tissue between EWS, Modern Myths (the publication), and the $500 consultation. It is the thing the sprint finds. The session is where they examine what to do about it.
Invariant rules:
Every analysis must name a Default Narrative
Discovery mode: names it as something worth examining
Verification mode: names it accurately as methodology, not trap
The narrative report (second PDF) maps where it leads if unexamined
Timeline vignettes are always written in second person ("you") — never by the writer's name
Primitive 6 — One Move
A single concrete action. Under 2 hours. Under $50. Produces real signal from actual humans.
The invariant constraint: The move must tell them something they don't currently know. Not a step toward the goal — a test that produces signal about whether the direction is right.
The move is never planning, research, or more thinking.

4. THE TWO-MODE ROUTING SYSTEM
All analysis is conditioned on Calibration. There is no identity-free interpretation.


DISCOVERY mode
VERIFICATION mode
Trigger
stage = early or mid
stage = deep
Stance
The writer may not know what they want
The writer has a formed worldview
Default Narrative
Something worth examining
Deliberate methodology — name it accurately
"Unplanned" content
Slipped past editorial control
Precisely articulated, possibly for the first time
Cost section
WHAT IT COSTS
WHAT THIS CONFIRMS
Question variant
"What surprised you the most?"
"What in this story felt most true?"
Timeline vignettes
Warning / cost spiral
Map of where the work could go

If a lens is provided: it is an instruction, not context. Terms of art from the writer's tradition are intentional and load-bearing. The system does not reinterpret them through a therapeutic, creator-economy, or psychological frame.

5. THE STAGE FLOW
stage-1 → stage-2 → stage-3-5 → stage-4 → stage-3 → stage-4.5 → stage-5 → stage-6 → stage-7 → stage-7.5 → stage-8
  Intro    Signal    Context     Story    Headline  Calibration  Question  Analysis  Download  Reflection    CTA

This order is permanent. Stages may not be reordered or merged.
Stage 7.5 (Reflection fork) is the product research primitive:
"Surfaced something new" → push session booking
"Confirmed what I knew" → two deeper questions + feedback
reflection_type saved to Google Sheet column M — this is the most important product research column in the system

6. EWS_STATE — CANONICAL STATE OBJECT
All system state must be derivable from EWS_STATE. Persisted to localStorage under key wyfSession with 24-hour expiry.
EWS_STATE = {
  sessionId,        // crypto.randomUUID() — anonymous, persists session
  signal,           // Primitive 1 — what they're circling
  story,            // Primitive 2 — full free-written text
  timerDuration,    // how long the timer ran
  headline,         // one-line title the writer gives their story
  stage,            // Primitive 3 — 'early' | 'mid' | 'deep'
  lens,             // Primitive 3 — free text or ''
  questions[],      // q1: response to question variant
  questionVariant,  // 'surprised' | 'mostTrue'
  analysisRaw,      // Primitive 4 — full analysis text from API
  analysisSections, // parsed section map
  narrativeReport,  // Primitive 5 — full narrative report text
  email,            // optional — for report delivery
  reflectionType,   // Primitive 6 fork — 'new' | 'confirmed'
  feedbackLiked,    // free text
  feedbackWish,     // free text
}


7. PERSISTENCE LAYERS
localStorage     — session continuity, 24-hour expiry, cleared on Start Over
Google Sheets    — append on session save, update by sessionId for analysis + feedback

Google Sheet column map:
A  timestamp
B  idea (signal)
C  headline
D  story
E  q1
F  analysis
G  email
H  completionTime
I  adminMode
J  partial
K  sessionId
L  stage
M  reflection_type
N  liked
O  wishThis

No authentication. Session ID is identity. No cross-device persistence in V1.

8. WHAT CAN NEVER CHANGE
8.1 Story as Primary Input The timed free-write is the mechanism. It cannot be replaced by a form, a questionnaire, or structured prompts. The anchor line ("Start with a specific morning") is fixed.
8.2 Two-Mode Routing DISCOVERY and VERIFICATION are permanent. The system always reads calibration before interpreting. There is no single-mode operation.
8.3 Default Narrative as Output Every analysis names a Default Narrative. There is no valid analysis without it.
8.4 Second-Person Vignettes Timeline vignettes are always written in second person. The writer's name is never used.
8.5 One Move Constraint The move generates signal. It is never a step toward the goal — always a test of whether the direction is right.
8.6 Non-Automation Principle EWS never acts on the user's behalf. All outputs are read, not acted upon. The system surfaces — it does not decide.
8.7 The Ceiling Acknowledgment EWS does not claim to replace a live session. The $500 consultation exists because EWS has a real ceiling. The system must never oversell its own depth.
8.8 Color System #0a0a0a background · #f0ece4 text · #b87333 copper accents · rgba variants only. No green. No new color values.

9. THE CLOSED LOOP
Signal → Story → Calibration → Analysis → Default Narrative → One Move → Signal

Signal shapes the story. The story shapes the analysis. The analysis names the Default Narrative. The Default Narrative generates one move. The move produces signal about whether the direction is right.
The loop closes where it opened — not with an answer, but with better information.

10. FINAL PRINCIPLE
EWS is not a tool for telling people what to do.
EWS is a tool for returning people to what they already know — precisely enough that they can act on it.
All design, implementation, and evolution must preserve that distinction.
"The unexamined life isn't a philosophy problem. It's a ten-minute problem."

