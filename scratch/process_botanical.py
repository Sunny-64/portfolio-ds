from PIL import Image

# Load the leaf crop
img = Image.open('scratch/crops/botanical_crop.png').convert('RGBA')
w, h = img.size

out = Image.new('RGBA', (w, h))

for y in range(h):
    for x in range(w):
        r, g, b, a = img.getpixel((x, y))
        gray = 0.299 * r + 0.587 * g + 0.114 * b
        if gray > 235:
            out.putpixel((x, y), (0, 0, 0, 0))
        else:
            # Map darkness to alpha: 235 -> 0, 50 -> 255
            alpha = int(min(255, max(0, (235 - gray) / 185.0 * 255)))
            # Keep the RGB tone
            out.putpixel((x, y), (int(r * 0.9), int(g * 0.9), int(b * 0.9), alpha))

out.save('public/images/botanical.png')
print("Botanical saved successfully.")
