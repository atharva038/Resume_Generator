"""
Voice Transcription Service for AI Interview

This service provides voice-to-text transcription using OpenAI Whisper
for the AI Interview feature in SmartNShine.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for Node.js backend

# ============================================
# VOICE TRANSCRIPTION (Whisper)
# ============================================

whisper_model = None
WHISPER_MODEL_SIZE = os.environ.get('WHISPER_MODEL_SIZE', 'base')

try:
    import whisper
    
    print(f"🎙️ Loading Whisper model ({WHISPER_MODEL_SIZE})...")
    whisper_model = whisper.load_model(WHISPER_MODEL_SIZE)
    print(f"✅ Whisper model loaded successfully!")
except ImportError:
    print("⚠️ Whisper not installed. Voice transcription will be disabled.")
    print("   To enable: pip install openai-whisper")
except Exception as e:
    print(f"⚠️ Failed to load Whisper model: {e}")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "whisper_available": whisper_model is not None,
        "whisper_model": WHISPER_MODEL_SIZE if whisper_model else None,
        "service": "Voice Transcription Service"
    })


@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """
    Transcribe audio file to text using Whisper
    
    Accepts: multipart/form-data with 'audio' file
    Supported formats: wav, mp3, m4a, webm, ogg, flac
    Max duration: 90 seconds (interview answer limit)
    
    Response:
    {
        "success": true,
        "data": {
            "text": "Transcribed text here...",
            "language": "en",
            "duration": 45.2,
            "wordCount": 120
        }
    }
    """
    if not whisper_model:
        return jsonify({
            "success": False,
            "error": "Voice transcription is not available. Whisper model not loaded."
        }), 503
    
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            print(f"❌ No 'audio' field. Available fields: {list(request.files.keys())}")
            return jsonify({
                "success": False,
                "error": "No audio file provided. Use 'audio' field in multipart/form-data."
            }), 400
        
        audio_file = request.files['audio']
        print(f"📁 Received file: {audio_file.filename}, content_type: {audio_file.content_type}")
        
        if audio_file.filename == '':
            return jsonify({
                "success": False,
                "error": "Empty filename"
            }), 400
        
        # Validate file extension (allow empty extension for streams)
        allowed_extensions = {'wav', 'mp3', 'm4a', 'webm', 'ogg', 'flac', ''}
        file_ext = audio_file.filename.rsplit('.', 1)[-1].lower() if '.' in audio_file.filename else ''
        
        # Also check content type for webm
        is_webm = 'webm' in (audio_file.content_type or '')
        
        if file_ext not in allowed_extensions and not is_webm:
            print(f"❌ Invalid extension: {file_ext}, content_type: {audio_file.content_type}")
            return jsonify({
                "success": False,
                "error": f"Unsupported audio format. Allowed: wav, mp3, m4a, webm, ogg, flac"
            }), 400
        
        # Check file size (max 10MB)
        audio_file.seek(0, 2)  # Seek to end
        file_size = audio_file.tell()
        audio_file.seek(0)  # Reset to beginning
        
        max_size = 10 * 1024 * 1024  # 10MB
        if file_size > max_size:
            return jsonify({
                "success": False,
                "error": "Audio file too large. Maximum size is 10MB."
            }), 400
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix=f'.{file_ext}', delete=False) as tmp_file:
            audio_file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        try:
            # Transcribe with Whisper
            print(f"🎙️ Transcribing audio file: {audio_file.filename}")
            result = whisper_model.transcribe(
                tmp_path,
                language=request.form.get('language'),  # Optional language hint
                fp16=False  # Use FP32 for better compatibility
            )
            
            transcribed_text = result.get('text', '').strip()
            detected_language = result.get('language', 'unknown')
            
            # Get audio duration from segments
            segments = result.get('segments', [])
            duration = segments[-1]['end'] if segments else 0
            
            # Check if duration exceeds limit (90 seconds for interview answers)
            if duration > 90:
                return jsonify({
                    "success": False,
                    "error": "Audio duration exceeds 90 seconds limit for interview answers."
                }), 400
            
            print(f"✅ Transcription complete: {len(transcribed_text)} chars, {duration:.1f}s")
            
            return jsonify({
                "success": True,
                "data": {
                    "text": transcribed_text,
                    "language": detected_language,
                    "duration": round(duration, 2),
                    "wordCount": len(transcribed_text.split()) if transcribed_text else 0
                }
            })
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
                
    except Exception as e:
        print(f"❌ Transcription error: {e}")
        return jsonify({
            "success": False,
            "error": f"Transcription failed: {str(e)}"
        }), 500


@app.route('/transcribe/health', methods=['GET'])
def transcribe_health():
    """Check if voice transcription is available"""
    return jsonify({
        "available": whisper_model is not None,
        "model": WHISPER_MODEL_SIZE if whisper_model else None,
        "maxDuration": 90,
        "maxFileSize": "10MB",
        "supportedFormats": ["wav", "mp3", "m4a", "webm", "ogg", "flac"]
    })


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🎙️ Voice Transcription Service for AI Interview")
    print("="*60)
    print(f"Whisper model: {'✅ ' + WHISPER_MODEL_SIZE if whisper_model else '❌ Not loaded'}")
    print("\n📡 Starting Flask server on http://localhost:5001")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
