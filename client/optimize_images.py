import os
from PIL import Image

CLIENT_PUBLIC = os.path.abspath("public")

targets = [
    # (relative path, max_width, max_height, quality)
    ("logo-light.png", 64, 64, 90),
    ("logo-dark.png", 64, 64, 90),
    ("images/sample-resume.png", 400, 550, 88),
    ("img/Resume/1.png", 600, 820, 88),
    ("img/Resume/2.png", 600, 820, 88),
    ("img/Resume/3.png", 600, 820, 88),
    ("img/portfolios/1.png", 960, 1400, 86),
    ("img/portfolios/2.png", 960, 1400, 86),
    ("img/portfolios/3.png", 960, 1400, 86),
    ("img/portfolios/4.png", 960, 1400, 86),
    ("img/portfolios/6.png", 960, 1400, 86),
]

total_orig = 0
total_opt = 0

print(f"{'Image':<35} | {'Original':<12} | {'WebP Size':<12} | {'Savings'}")
print("-" * 75)

for rel_path, max_w, max_h, quality in targets:
    orig_path = os.path.join(CLIENT_PUBLIC, rel_path)
    if not os.path.exists(orig_path):
        print(f"Skipping {rel_path} (not found)")
        continue

    orig_sz = os.path.getsize(orig_path)
    total_orig += orig_sz

    with Image.open(orig_path) as img:
        # Convert RGBA / RGB
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA")

        # Calculate aspect-ratio preserving 2x size
        orig_w, orig_h = img.size
        scale = min(max_w / orig_w, max_h / orig_h, 1.0) # do not upscale
        new_w = int(orig_w * scale)
        new_h = int(orig_h * scale)

        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

        # Output WebP
        webp_rel = os.path.splitext(rel_path)[0] + ".webp"
        webp_path = os.path.join(CLIENT_PUBLIC, webp_rel)
        
        resized.save(webp_path, "WEBP", quality=quality, method=6)
        webp_sz = os.path.getsize(webp_path)
        total_opt += webp_sz

        savings = ((orig_sz - webp_sz) / orig_sz) * 100
        print(f"{rel_path:<35} | {orig_sz/1024:>9.1f} KB | {webp_sz/1024:>9.1f} KB | {savings:>6.1f}%")

print("-" * 75)
print(f"Total: {total_orig/1024/1024:.2f} MB -> {total_opt/1024/1024:.2f} MB (Saved {((total_orig - total_opt)/total_orig)*100:.1f}%)")
