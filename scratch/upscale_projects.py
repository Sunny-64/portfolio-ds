from PIL import Image

for name in ['webpos.png', 'dashboard.png', 'webstore.png']:
    p = f'public/images/projects/{name}'
    img = Image.open(p)
    # Upscale ~3x with Lanczos for retina displays
    w, h = img.size
    up = img.resize((w * 4, h * 4), Image.Resampling.LANCZOS)
    up.save(p)
print("Project images upscaled cleanly.")
