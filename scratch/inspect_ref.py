import os
from PIL import Image

ref_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791374632593.jpg'
img = Image.open(ref_path)
w, h = img.size
print(f"Original image size: {w}x{h}")

os.makedirs('scratch/crops', exist_ok=True)
# Desktop Light (top left)
img.crop((0, 0, w // 2, int(h * 0.735))).save('scratch/crops/desktop_light.png')
# Desktop Dark (top right)
img.crop((w // 2, 0, w, int(h * 0.735))).save('scratch/crops/desktop_dark.png')
# Bottom responsive views
img.crop((0, int(h * 0.735), w, h)).save('scratch/crops/responsive.png')

# Let's also crop the profile image from Desktop Light and Desktop Dark
# In desktop light, the portrait is around top right of that half
# Let's extract portrait
portrait_crop_light = img.crop((215, 55, 310, 158))
portrait_crop_light.save('scratch/crops/portrait_crop.png')

print("Done cropping.")
