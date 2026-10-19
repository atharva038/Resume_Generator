# AI Interview Product, Cost, and Implementation Roadmap

This document is the source of truth for improving SmartNShine's AI interview system. Work through it one item at a time and update the checkbox and implementation notes when an item ships.

## Goals

- Deliver useful, realistic interview practice at a predictable cost.
- Keep a valuable free experience without funding unlimited paid API usage.
- Use Sarvam where it creates clear value for Indian accents, Indic languages, and natural interviewer voices.
- Keep evaluation grounded in the candidate's resume, job description, questions, and actual answers.
- Protect candidate audio, transcripts, personal data, and provider credentials.

## Cost model

Each live session may consume three separately billed resources:

| Resource | Billing unit | Primary cost driver |
| --- | --- | --- |
| Sarvam Saaras STT | Audio minutes | Candidate speech and uploaded silence |
| Sarvam Bulbul TTS | Characters | Questions, greetings, and transition phrases |
| LLM generation/evaluation | Tokens | Resume context, transcripts, generated questions, and reports |

Exact prices depend on the active provider plan and can change. Check the provider billing dashboard before assigning rupee or dollar estimates. Track real usage in production instead of relying on hard-coded projections.

## Current implementation

- [x] Sarvam is accessed from the backend; the API key is not exposed to the client.
- [x] Sarvam Saaras v4 is used for interview transcription.
- [x] Candidates can select automatic language detection or one of 23 supported answer languages.
- [x] Code-mixed and Indian-accent speech can be transcribed.
- [x] The transcription response includes provider, detected language, language confidence, and word count.
- [x] Sarvam STT can fall back to OpenAI Whisper or local Whisper.
- [x] Sarvam TTS can fall back to browser speech synthesis.
- [x] Client-side silence detection ends recorded answer segments.
- [x] The live interview supports interruption/barge-in behavior.
- [x] Sarvam voice-answer response construction no longer references local-only Whisper state.
- [x] Interview setup reads the correct local Whisper health state.
- [x] Spoken introductions include the selected target role.
- [x] Text interview sessions accept the `none` voice engine state.
- [ ] Full multilingual questions and feedback are not implemented. Questions currently remain in English.

## Phase 1: Cost controls and reliability

These items should be implemented before adding expensive real-time features.

### 1. Combine evaluation and next-question generation

- [ ] Replace separate evaluation and question-generation calls with one structured LLM call.
- [ ] Return evaluation, difficulty, follow-up decision, and next question in one validated JSON object.
- [ ] Make the operation idempotent so retries do not create duplicate questions.

Suggested response shape:

```json
{
  "evaluation": {
    "score": 78,
    "strengths": ["Clear explanation"],
    "improvements": ["Explain the trade-off"]
  },
  "nextQuestion": {
    "text": "How would you handle cache failure?",
    "difficulty": "medium"
  },
  "shouldFollowUp": true
}
```

### 2. Introduce a low-cost free interview pipeline

- [ ] Limit free interviews to three questions and about five minutes.
- [ ] Use browser TTS for free interviews.
- [ ] Use segmented Saaras STT only while the candidate is answering.
- [ ] Generate standard questions in one batch at session start.
- [ ] Run one combined evaluation after the interview.
- [ ] Limit free accounts by day and month.

Recommended free pipeline:

```text
3 questions
5-minute maximum
Browser TTS
Saaras v4 segmented STT
1 question-generation call
1 final evaluation call
No stored audio by default
```

### 3. Add hard session budgets

- [ ] Set a maximum STT duration per session.
- [ ] Set a maximum TTS character count per session.
- [ ] Set maximum LLM input and output tokens.
- [ ] Set maximum question and follow-up counts.
- [ ] Stop, downgrade, or request an upgrade before exceeding the budget.
- [ ] Enforce per-user daily and monthly quotas on the server.

### 4. Track actual usage and estimated cost

- [ ] Record STT audio seconds and provider.
- [ ] Record TTS characters, speaker, language, and provider.
- [ ] Record LLM input/output tokens, provider, and model.
- [ ] Record retries, fallbacks, timeouts, and failed calls.
- [ ] Show cost per completed interview in the admin dashboard.
- [ ] Alert when daily or monthly spend crosses a configured threshold.

The primary startup metric is:

```text
total AI spend / completed interviews
```

### 5. Reduce TTS usage

- [ ] Use Sarvam TTS only for greetings, questions, and the closing message.
- [ ] Use browser TTS, a sound cue, or cached audio for acknowledgements and transitions.
- [ ] Cache synthesized audio using text, language, speaker, pace, and model as the cache key.
- [ ] Strip Markdown, URLs, repeated whitespace, and non-spoken symbols before synthesis.
- [ ] Set cache retention and invalidation rules when a model or voice changes.

### 6. Reduce STT usage

- [ ] Keep segmented recording instead of continuously transmitting microphone audio.
- [ ] Trim leading and trailing silence before upload.
- [ ] Stop recording after confirmed silence.
- [ ] Reject empty or near-empty recordings locally.
- [ ] Compress or resample audio to the provider's recommended format without harming accuracy.

### 7. Reduce LLM context and token usage

- [ ] Build a compact candidate profile once per session.
- [ ] Summarize previous answers instead of resending full transcripts every turn.
- [ ] Send only the current question, current answer, compact profile, and remaining skills.
- [ ] Apply strict structured-output schemas and completion limits.
- [ ] Use a lower-cost model for turn decisions and a stronger model only for the final report when necessary.
- [ ] Keep stable prompt content in a cache-friendly order where the selected provider supports prompt caching.

### 8. Make answer submission safe to retry

- [ ] Generate a unique client answer ID for every recorded or typed answer.
- [ ] Store the ID with the question response.
- [ ] Return the existing result when the same ID is submitted twice.
- [ ] Retry STT and TTS at most once with a bounded timeout.
- [ ] Do not automatically repeat a non-idempotent session mutation.

### 9. Strengthen provider fallback behavior

- [ ] Keep STT priority configurable: Sarvam, OpenAI Whisper, then local Whisper.
- [ ] Keep TTS priority configurable: Sarvam, then browser TTS.
- [ ] Use short provider timeouts so a fallback does not make the interview stall.
- [ ] Return the provider used in every voice response.
- [ ] Surface degraded voice mode to the client without ending the interview.

## Phase 2: Interview quality

### 10. Add role-specific Saaras keyterms

- [ ] Build technical vocabulary lists for each supported role.
- [ ] Add relevant resume, company, product, framework, and skill names.
- [ ] Send no more than the provider-supported keyterm limit.
- [ ] Sanitize and deduplicate keyterms.
- [ ] Measure whether keyterms reduce transcript corrections and failed evaluations.

Example backend vocabulary:

```text
Node.js, PostgreSQL, Redis, Kafka, Kubernetes,
microservices, idempotency, observability, load balancing
```

### 11. Generate contextual follow-up questions

- [ ] Ask follow-ups based on facts in the candidate's previous answer.
- [ ] Prefer trade-offs, measurement, failures, alternatives, and personal contribution.
- [ ] Limit follow-ups per main question to control cost and session length.
- [ ] Never invent technologies, metrics, or responsibilities the candidate did not mention.

### 12. Add adaptive difficulty

- [ ] Move to deeper questions after strong answers.
- [ ] Ask foundation questions after weak answers.
- [ ] Ask for concrete evidence after vague answers.
- [ ] Ask for clarification after contradictory answers.
- [ ] Keep difficulty appropriate for the selected experience level.

### 13. Ground questions in the resume

- [ ] Ask candidates to explain specific resume claims and metrics.
- [ ] Distinguish verified resume facts from assumptions.
- [ ] Request missing context instead of fabricating it.
- [ ] Flag interview claims that are not present in the selected resume as unverified, not false.

### 14. Measure job-description coverage

- [ ] Extract important responsibilities and skills from the job description.
- [ ] Map each requirement to questions and candidate evidence.
- [ ] Show which requirements were demonstrated, weakly demonstrated, or not assessed.
- [ ] Avoid treating keyword absence alone as proof of a skills gap.

### 15. Add STAR analysis for behavioral answers

- [ ] Detect Situation, Task, Action, and Result.
- [ ] Identify the missing component.
- [ ] Emphasize personal action and measurable outcome.
- [ ] Provide an outline based only on the candidate's supplied facts.

### 16. Separate evaluation dimensions

- [ ] Score technical accuracy.
- [ ] Score relevance to the question.
- [ ] Score evidence and concrete examples.
- [ ] Score answer structure.
- [ ] Score observable communication delivery.
- [ ] Score alignment with the target role.
- [ ] Keep a transparent weighting configuration.

### 17. Make feedback evidence-based

- [ ] Tie strengths and weaknesses to transcript excerpts or clearly identified omissions.
- [ ] Replace generic advice such as “be confident” with specific actions.
- [ ] Explain why a score changed.
- [ ] Preserve candidate facts when creating an improved answer outline.

### 18. Use accurate confidence language

- [ ] Rename subjective “confidence” scoring to “delivery confidence indicators.”
- [ ] Use observable signals such as pauses, restarts, extremely short answers, pace, and uncertainty phrases.
- [ ] Do not infer personality, employability, honesty, or protected characteristics from voice.

### 19. Build compact interviewer memory

- [ ] Maintain a short running session summary.
- [ ] Track demonstrated strengths, unresolved weaknesses, and remaining skills.
- [ ] Pass the summary into later questions instead of the full conversation.
- [ ] Persist enough state to recover after a refresh.

### 20. Improve the final report

- [ ] Show question-level transcript and score breakdown.
- [ ] Identify the strongest part of each answer.
- [ ] Identify missing evidence or reasoning.
- [ ] Provide an improved structure and targeted follow-up.
- [ ] Show the three highest-priority actions for the next practice session.
- [ ] Compare progress with earlier sessions.

### 21. Add targeted retries

- [ ] Allow retrying one weak question without restarting the interview.
- [ ] Preserve the original attempt for comparison.
- [ ] Show which score dimensions improved.
- [ ] Apply quotas to repeated paid transcription and evaluation.

## Phase 3: Speech and multilingual experience

### 22. Add complete multilingual interviews

- [ ] Translate questions into the selected language.
- [ ] Speak translated questions with a compatible Bulbul voice.
- [ ] Transcribe the candidate in the selected or automatically detected language.
- [ ] Translate transcripts to English when required by the evaluator.
- [ ] Generate feedback in the candidate's selected language.
- [ ] Store original and translated text separately.
- [ ] Mark machine-translated content clearly.

This feature adds translation, TTS, and evaluation cost and should be metered or paid.

### 23. Improve code-mixed speech handling

- [ ] Preserve English technical terms inside Indic-language answers.
- [ ] Compare normal and code-mix modes on real candidate recordings.
- [ ] Keep the original transcript for review.
- [ ] Avoid translating product names, framework names, and code identifiers.

### 24. Recognize interview commands locally

- [ ] Detect repeat, clarify, skip, stop, continue, and hint requests.
- [ ] Support English and selected Indic-language phrases.
- [ ] Handle clear commands with local rules instead of an LLM.
- [ ] Do not submit commands as interview answers.

Examples:

```text
Can you repeat the question?
Question repeat karo.
Please explain that more simply.
Give me a hint.
Skip this question.
```

### 25. Add pronunciation dictionaries

- [ ] Create dictionaries for common technical terms and company names.
- [ ] Support role-specific pronunciation sets.
- [ ] Associate dictionary IDs with TTS requests.
- [ ] Review pronunciation after model or voice changes.

### 26. Add verbatim delivery analysis

- [ ] Preserve filler words and verbal restarts for communication analysis.
- [ ] Measure filler frequency, pace, pauses, repetitions, and answer duration.
- [ ] Use normalized transcription separately for technical evaluation.
- [ ] Avoid paying for a second STT request unless the feature is paid or demonstrably valuable.

### 27. Consider real-time WebSocket transcription last

- [ ] Prototype partial transcripts with Saaras real-time streaming.
- [ ] Stream only during confirmed candidate speech.
- [ ] Implement reconnect, timeout, ordering, and partial/final transcript handling.
- [ ] Compare real-time cost and accuracy with segmented uploads.
- [ ] Roll out only if the latency improvement justifies operational complexity and spend.

## Phase 4: Product experience

### 28. Add a microphone readiness check

- [ ] Request microphone access before session creation.
- [ ] Display the selected input device and live input level.
- [ ] Record a short test sample.
- [ ] Detect silence, clipping, excessive background noise, and the wrong microphone.
- [ ] Allow device selection when supported by the browser.

### 29. Add transcript review and recovery

- [ ] Show the transcript after recording when practice mode allows review.
- [ ] Allow retry, edit, or typed-answer fallback.
- [ ] Keep failed audio temporarily in browser memory for one-click retry.
- [ ] Do not force a candidate to repeat a long answer after a provider timeout.

### 30. Separate practice and assessment modes

- [ ] Practice mode allows hints, transcript review, retries, and immediate coaching.
- [ ] Assessment mode limits hints and repeats and shows feedback at the end.
- [ ] Apply the same transparent scoring dimensions in both modes.

### 31. Add interviewer intensity

- [ ] Support supportive, realistic, and challenging interview styles.
- [ ] Change follow-up depth and tone without silently changing the scoring standard.
- [ ] Explain the selected style before the session starts.

### 32. Offer focused interview formats

- [ ] HR screening.
- [ ] Behavioral and STAR.
- [ ] Technical fundamentals.
- [ ] System design.
- [ ] Resume defense.
- [ ] Frontend practical discussion.
- [ ] Backend architecture.
- [ ] Leadership and management.
- [ ] Salary negotiation.
- [ ] Rapid-fire revision.

Launch only a few well-tested formats first.

### 33. Add an interview readiness summary

- [ ] Show microphone, network, resume, role, language, duration, and question-count readiness.
- [ ] Explain whether browser or premium voice will be used.
- [ ] Display relevant limits before the session starts.

### 34. Improve session recovery

- [ ] Restore an active session after refresh.
- [ ] Restore the current question and timer safely.
- [ ] Never resubmit the last answer automatically.
- [ ] Expire abandoned sessions and release temporary data.

### 35. Detect poor connectivity

- [ ] Monitor request latency and failures.
- [ ] Offer browser TTS or text mode when cloud voice is unstable.
- [ ] Preserve the current answer during a temporary outage.
- [ ] Avoid repeatedly calling unavailable providers.

### 36. Add annotated replay

- [ ] Show question, transcript, timestamps, feedback, and improved structure together.
- [ ] Allow audio replay only when the candidate opted into audio storage.
- [ ] Highlight strong and weak moments without overstating emotion detection.

### 37. Add export and sharing

- [ ] Export a concise PDF report.
- [ ] Keep transcripts private by default.
- [ ] Require explicit action before creating a shareable link.
- [ ] Allow revoking shared reports.

### 38. Add a low-cost onboarding demo

- [ ] Offer one sample question without creating a full interview.
- [ ] Use browser TTS and local delivery scoring.
- [ ] Explain the value of the full report after completion.

## Phase 5: Privacy, security, and trust

### 39. Add explicit recording consent

- [ ] Explain what is recorded and why.
- [ ] Identify which providers process the audio and transcript.
- [ ] State whether audio is stored and for how long.
- [ ] Require consent before microphone capture starts.

### 40. Minimize audio retention

- [ ] Delete audio immediately after successful transcription by default.
- [ ] Store audio only after explicit opt-in for replay.
- [ ] Configure automatic deletion for stored recordings.
- [ ] Keep transcripts and audio under separate retention controls.

### 41. Add candidate deletion controls

- [ ] Delete individual interview reports.
- [ ] Delete transcripts.
- [ ] Delete stored recordings.
- [ ] Delete full interview history.
- [ ] Ensure deletion covers caches and background storage.

### 42. Redact sensitive transcript data

- [ ] Optionally redact phone numbers, email addresses, addresses, and government identifiers before evaluation.
- [ ] Preserve required technical context.
- [ ] Record when redaction occurred without logging the removed value.

### 43. Protect credentials and logs

- [ ] Keep provider keys in server-only environment variables.
- [ ] Never print keys, authorization headers, or full sensitive transcripts in logs.
- [ ] Rotate keys and separate development from production credentials.
- [ ] Rate-limit voice and evaluation endpoints.

### 44. Avoid unsafe voice inference

- [ ] Do not infer age, gender, ethnicity, disability, health, honesty, or personality from voice.
- [ ] Do not claim the system can determine employability from vocal traits.
- [ ] Limit communication feedback to observable delivery signals.

## Packaging and monetization

### 45. Free tier

- [ ] About five minutes and three questions.
- [ ] Browser TTS.
- [ ] Saaras segmented STT.
- [ ] Standard question batch.
- [ ] One final evaluation.
- [ ] Limited monthly sessions and recent history.

### 46. Paid tier

- [ ] Ten to twenty minutes and five to ten questions.
- [ ] Sarvam interviewer voices.
- [ ] Adaptive follow-ups.
- [ ] Per-answer coaching where valuable.
- [ ] Full multilingual interviews.
- [ ] Progress history, retries, and richer reports.

### 47. Usage-based safeguards

- [ ] Prevent unlimited repeated recordings within one question.
- [ ] Apply fair-use limits even on subscriptions.
- [ ] Show users their remaining interview allowance.
- [ ] Gracefully fall back to browser voice when premium voice allowance is exhausted.

## Analytics and experiments

### 48. Product funnel

- [ ] Track setup started, setup completed, interview started, and interview completed.
- [ ] Track abandonment by interview phase.
- [ ] Track return for a second interview.
- [ ] Track free-to-paid conversion after report viewing.

### 49. Voice reliability

- [ ] Track transcription failure and retry rates.
- [ ] Track TTS fallback rate.
- [ ] Track average STT and TTS latency.
- [ ] Track repeat-question and transcript-correction rates.
- [ ] Compare languages and devices without collecting unnecessary personal data.

### 50. Interview effectiveness

- [ ] Track questions completed and average answer length.
- [ ] Track which feedback actions users retry.
- [ ] Track score improvement across sessions.
- [ ] Collect optional user ratings for question relevance and report usefulness.

### 51. Cost experiments

- [ ] Compare final-only evaluation with per-answer evaluation.
- [ ] Compare browser TTS with Bulbul conversion and retention.
- [ ] Compare batched questions with adaptive generation.
- [ ] Compare segmented STT with real-time streaming.
- [ ] Base rollout decisions on cost per completed useful interview.

## Recommended implementation order

1. [ ] Add usage metering and session budgets.
2. [ ] Combine evaluation and next-question generation.
3. [ ] Create the three-question low-cost free pipeline.
4. [ ] Move free sessions to browser TTS and cache repeated premium audio.
5. [ ] Add idempotent answer submission and bounded fallback timeouts.
6. [ ] Add role-specific Saaras v4 keyterms.
7. [ ] Compact resume, job-description, and conversation context.
8. [ ] Improve the evidence-backed final report.
9. [ ] Add resume grounding, STAR analysis, and adaptive follow-ups.
10. [ ] Add targeted retries and progress tracking.
11. [ ] Add full multilingual questions and feedback as a metered feature.
12. [ ] Evaluate real-time WebSocket transcription only after production cost data exists.

## Features to avoid at the current stage

- [ ] Do not offer unlimited free voice interviews.
- [ ] Do not keep the microphone streaming during interviewer speech or idle time.
- [ ] Do not use paid TTS for every acknowledgement and transition.
- [ ] Do not run separate LLM calls when one structured call can perform both tasks.
- [ ] Do not store raw audio by default.
- [ ] Do not launch real-time streaming before usage metering and cost caps exist.
- [ ] Do not publish fixed cost claims without validating current provider pricing.
- [ ] Do not fabricate candidate achievements in example answers or reports.

## Definition of done for each roadmap item

Before checking off an item:

- [ ] The behavior works in the relevant text, voice, and fallback paths.
- [ ] Usage and failure states are observable.
- [ ] Server-side limits prevent accidental overspend.
- [ ] Candidate-facing errors provide a recovery action.
- [ ] Privacy and retention behavior is documented.
- [ ] Relevant builds, syntax checks, and focused functional tests pass.
- [ ] The changelog records the shipped behavior.
