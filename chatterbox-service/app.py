"""
Chatterbox TTS Service for AI Interview

This service provides text-to-speech synthesis using Chatterbox TTS
(open-source alternative to ElevenLabs) for the AI Interview feature.
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import io
import torch
import torchaudio as ta

app = Flask(__name__)
CORS(app)  # Enable CORS for Node.js backend

# ============================================
# CHATTERBOX TTS SETUP
# ============================================

chatterbox_model = None
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_TYPE = os.environ.get('CHATTERBOX_MODEL', 'turbo')  # turbo, standard, or multilingual

# Default voice reference audio (optional - can be provided per request)
DEFAULT_VOICE_REF = os.environ.get('DEFAULT_VOICE_REF', None)

print(f"🎙️ Initializing Chatterbox TTS Service...")
print(f"   Device: {DEVICE}")
print(f"   Model Type: {MODEL_TYPE}")

try:
    if MODEL_TYPE == 'turbo':
        from chatterbox.tts_turbo import ChatterboxTurboTTS
        print(f"📥 Loading Chatterbox-Turbo model...")
        chatterbox_model = ChatterboxTurboTTS.from_pretrained(device=DEVICE)
        print(f"✅ Chatterbox-Turbo loaded successfully!")
    elif MODEL_TYPE == 'multilingual':
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        print(f"📥 Loading Chatterbox-Multilingual model...")
        chatterbox_model = ChatterboxMultilingualTTS.from_pretrained(device=DEVICE)
        print(f"✅ Chatterbox-Multilingual loaded successfully!")
    else:  # standard
        from chatterbox.tts import ChatterboxTTS
        print(f"📥 Loading Chatterbox model...")
        chatterbox_model = ChatterboxTTS.from_pretrained(device=DEVICE)
        print(f"✅ Chatterbox loaded successfully!")
except ImportError as e:
    print(f"⚠️ Chatterbox not installed: {e}")
    print("   To enable: pip install chatterbox-tts")
except Exception as e:
    print(f"⚠️ Failed to load Chatterbox model: {e}")


# ============================================
# API ENDPOINTS
# ============================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "chatterbox_available": chatterbox_model is not None,
        "model_type": MODEL_TYPE if chatterbox_model else None,
        "device": DEVICE,
        "service": "Chatterbox TTS Service"
    })


@app.route('/tts/synthesize', methods=['POST'])
def synthesize_speech():
    """
    Synthesize speech from text using Chatterbox TTS
    
    Request body (JSON):
    {
        "text": "Text to synthesize",
        "audio_prompt_path": "path/to/reference/voice.wav" (optional),
        "language": "en" (optional, for multilingual model)
    }
    
    Returns: MP3 audio stream
    """
    if not chatterbox_model:
        return jsonify({
            "success": False,
            "error": "Chatterbox TTS not available"
        }), 503

    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'text' field"
            }), 400

        text = data['text']
        audio_prompt_path = data.get('audio_prompt_path', DEFAULT_VOICE_REF)
        language = data.get('language', 'en')

        print(f"🔊 Synthesizing: {text[:50]}...")
        
        # Generate audio
        if MODEL_TYPE == 'turbo' and audio_prompt_path:
            # Turbo requires a reference voice
            wav = chatterbox_model.generate(text, audio_prompt_path=audio_prompt_path)
        elif MODEL_TYPE == 'multilingual':
            # Multilingual supports language_id
            wav = chatterbox_model.generate(
                text, 
                language_id=language,
                audio_prompt_path=audio_prompt_path if audio_prompt_path else None
            )
        else:
            # Standard model
            if audio_prompt_path:
                wav = chatterbox_model.generate(text, audio_prompt_path=audio_prompt_path)
            else:
                wav = chatterbox_model.generate(text)

        # Convert to bytes
        buffer = io.BytesIO()
        ta.save(buffer, wav, chatterbox_model.sr, format='wav')
        buffer.seek(0)

        print(f"✅ Audio generated successfully ({buffer.getbuffer().nbytes} bytes)")

        return send_file(
            buffer,
            mimetype='audio/wav',
            as_attachment=False,
            download_name='speech.wav'
        )

    except Exception as e:
        print(f"❌ TTS synthesis error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/tts/voices', methods=['GET'])
def list_voices():
    """
    List available voice options
    For Chatterbox, voices are created from reference audio files
    """
    return jsonify({
        "success": True,
        "message": "Chatterbox uses voice cloning from reference audio",
        "default_voice": DEFAULT_VOICE_REF,
        "note": "Provide 'audio_prompt_path' in synthesis request to use custom voice"
    })


# ============================================
# RUN SERVER
# ============================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🎙️ Chatterbox TTS Service for AI Interview")
    print("="*60)
    print(f"Model: {'✅ ' + MODEL_TYPE if chatterbox_model else '❌ Not loaded'}")
    print(f"Device: {DEVICE}")
    print("\n📡 Starting Flask server on http://localhost:5002")
    print("="*60 + "\n")
    
    # Run on port 5002 (5001 is used by voice-service for Whisper)
    app.run(host='0.0.0.0', port=5002, debug=False)
