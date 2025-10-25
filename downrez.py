import os
import shutil
from PIL import Image

BASE_DIR = r"C:\Users\tunio\Documents\GitHub\gen_web_2025\sketches"
OUTPUT_DIR = os.path.join(BASE_DIR, "thumbs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Reasonable thresholds
MAX_SIZE = (480, 480)        # Target display size
MAX_FILE_SIZE_KB = 400       # Only optimize if file is bigger than this

for item in os.listdir(BASE_DIR):
    sketch_path = os.path.join(BASE_DIR, item)
    if not os.path.isdir(sketch_path) or not item.startswith("sketch"):
        continue

    sketch_num = item.replace("sketch", "")
    found_thumb = None

    for root, dirs, files in os.walk(sketch_path):
        for f in files:
            if f.lower().startswith("thumb."):
                found_thumb = os.path.join(root, f)
                break
        if found_thumb:
            break

    if not found_thumb:
        print(f"❌ No thumb found for {item}")
        continue

    output_path = os.path.join(OUTPUT_DIR, f"sketch{sketch_num}.jpg")

    try:
        file_size_kb = os.path.getsize(found_thumb) / 1024
        with Image.open(found_thumb) as img:
            width, height = img.size

            needs_resize = width > MAX_SIZE[0] or height > MAX_SIZE[1]
            needs_compress = file_size_kb > MAX_FILE_SIZE_KB

            if not needs_resize and not needs_compress:
                # ✅ Already small enough — just copy directly
                shutil.copy2(found_thumb, output_path)
                print(f"🟢 Copied {item} (no optimization needed)")
                continue

            # 🧠 Optimize if necessary
            img.thumbnail(MAX_SIZE, Image.LANCZOS)

            # Handle transparency (RGBA or LA)
            if img.mode in ("RGBA", "LA"):
                bg = Image.new("RGB", img.size, (255, 255, 255))  # white background
                bg.paste(img, mask=img.getchannel("A"))
                img = bg
            elif img.mode != "RGB":
                img = img.convert("RGB")

            img.save(output_path, "JPEG", quality=80, optimize=True)
            print(f"✅ Optimized {item} → {output_path}")

    except Exception as e:
        print(f"⚠️ Error processing {item}: {e}")

print("\n🎨 Done generating thumbnails!")
