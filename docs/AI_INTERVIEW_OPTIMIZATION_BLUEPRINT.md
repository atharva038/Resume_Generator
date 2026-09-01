# AI Interview Optimization Blueprint: UX, Token & Cost Engineering

This blueprint outlines comprehensive optimizations to maximize candidate user experience (UX), lower voice response latency, reduce token consumption by up to **70%**, and cut Sarvam AI voice costs by **50%**.

---

## 1. Token & LLM Cost Reduction (50% – 70% Token Savings)

### A. Prefix Prompt Caching (OpenAI & Gemini)
- **Mechanism**: OpenAI (GPT-4o / GPT-4o-mini) and Google Gemini offer **50% discounts on cached input tokens** when system prompts > 1,024 tokens remain static across turns.
- **Implementation**:
  - Keep standard evaluation guidelines, system instructions, and candidate resume text pinned at the **very beginning of the prompt**.
  - Append dynamic turn data (current question and user answer) only at the end.
- **Projected Savings**: 50% discount on all repeated prompt context tokens per turn.

### B. Sliding Context Window & Incremental Evaluation
- **Problem**: Re-sending all 10 previous Q&A transcripts on every question generation consumes 2,500+ tokens per call.
- **Implementation**:
  - **Question Generation**: Pass only the *last question asked + 1-sentence summary of the candidate's answer + remaining target skills list*.
  - **Answer Evaluation**: Evaluate each answer in isolation against the question rubric with a hard limit of 350 completion tokens.
- **Projected Savings**: Drops per-turn prompt size from ~2,500 tokens down to ~600 tokens.

### C. Tiered Model Architecture
- **Turn-by-Turn Dialogue (Real-time)**: Use **GPT-4o-mini** / **Gemini 1.5 Flash** ($0.15 / 1M input tokens ≈ ₹13 / 1M). Fast (~500ms TTFT) and highly cost-efficient.
- **Final Detailed Scorecard & Report**: Perform a single batch LLM pass at the end of the session to generate comprehensive feedback, radar metrics, and improvement recommendations.

---

## 2. Audio & Sarvam AI Credit Optimization (40% – 60% Voice Cost Savings)

### A. Pre-Cached Static Audio (₹0.00 Cost for Standard Prompts)
- **Problem**: Sarvam Bulbul TTS is repeatedly billed for identical static phrases across every interview session.
- **Implementation**:
  - Pre-generate high-quality audio files once and host them in `client/public/audio/interview/`:
    1. `welcome.mp3`: *"Hello! Welcome to your AI mock interview. Whenever you're ready, let's begin."*
    2. `next_question.mp3`: *"Got it. Let's move to the next question."*
    3. `thinking.mp3`: *"Thank you for your response. Let me assess that..."*
    4. `outro.mp3`: *"That concludes our interview today. Generating your detailed report now."*
- **Projected Savings**: Eliminates ~1,200 characters of TTS billing per session.

### B. Client-Side Voice Activity Detection (VAD) & Silence Trimming
- **Problem**: Candidates thinking or pausing before speaking results in dead silence being sent to Sarvam Saaras STT (billed per second).
- **Implementation**:
  - Run client-side Web Audio API RMS / VAD to detect when speech actually starts and ends.
  - Trim silence before uploading audio to `/api/voice/stt/transcribe`.
- **Projected Savings**: Cuts 25% – 35% of audio duration billed per response.

### C. Text-to-Speech Markdown Stripping
- **Problem**: Unstripped markdown tags (`**`, bullets, markdown links, emoji) sent to TTS consume character credits and produce unnatural pauses.
- **Implementation**:
  - Clean text with a regex normalizer prior to calling `/api/voice/tts/synthesize`:
    ```javascript
    const cleanTextForTTS = (text) => text.replace(/[*_#`~\[\]\(\)]/g, "").replace(/\s+/g, " ").trim();
    ```

---

## 3. User Experience (UX) & Latency Engineering

### A. Instant Audio Feedback & Real-Time Speaking States
- **Visual Waveform States**:
  - **Green Soundwave**: Candidate is speaking / microphone active.
  - **Purple Glow**: AI is generating question & evaluation.
  - **Cyan Ripple**: AI Interviewer voice is playing.
- **Sub-1s Time-to-First-Audio (TTFA)**: Stream LLM sentences into TTS chunks so speech begins playing in ~800ms instead of waiting for the full question text.

### B. Live Transcript Preview & Edit Mode
- Display the speech-to-text transcript on-screen immediately after speaking.
- Allow the candidate to click *"Edit response"* or *"Re-record"* before submission, eliminating misinterpretations from background noise.

### C. Adaptive 6-Question High-Signal Assessment
- Instead of forcing 10 rigid questions, use an adaptive 6-question format (2 technical deep-dive, 2 behavioral/STAR, 2 scenario/problem solving).
- Achieves equal or better evaluation accuracy with **40% lower total API costs**.

---

## 4. Cost Comparison Matrix (Per 10-Minute Live Voice Session)

| Component | Unoptimized Baseline | Optimized Target | Total Savings |
| :--- | :--- | :--- | :--- |
| **STT Audio Duration (Sarvam)** | ~6.5 mins audio (₹3.25) | ~3.8 mins trimmed audio (₹1.90) | **41% saved** |
| **TTS Characters (Sarvam)** | ~2,500 chars (₹7.50) | ~1,200 chars dynamic (₹3.60) + Cached Audio | **52% saved** |
| **LLM Tokens (Input & Output)** | ~18,000 tokens (₹0.45) | ~6,000 tokens cached (₹0.12) | **73% saved** |
| **Total Real API Cost / Session** | **₹11.20** | **₹5.62** | **~50% Cost Cut** |
| **Response Latency** | ~3.5 seconds | **~0.9 - 1.2 seconds** | **3x Faster** |

---

## 5. Phased Implementation Roadmap

1. **Phase 1 (Quick Wins - Days 1–2)**:
   - Implement static audio pre-caching for greetings & transitions.
   - Clean question markdown text before TTS synthesis.
   - Implement sliding context prompt structure for OpenAI & Gemini.

2. **Phase 2 (Audio & Token Pipeline - Days 3–4)**:
   - Add client-side silence trimming & VAD.
   - Constrain evaluation output schema tokens.

3. **Phase 3 (UX Polish - Days 5–6)**:
   - Add visual waveform status orb.
   - Add live transcript verification / edit modal before question submission.
