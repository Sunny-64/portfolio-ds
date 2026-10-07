import os
from PIL import Image

ref_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791374632593.jpg'
img = Image.open(ref_path)

os.makedirs('public/images/profile', exist_ok=True)
os.makedirs('public/images/projects', exist_ok=True)

# In desktop light, the portrait is located at:
# x: 220 to 318, y: 53 to 157
# Let's inspect the actual photo bounding box inside the frame:
# In hero_light (x: 20 to 335, y: 10 to 195)
# Relative to img:
# The photo itself has x around 221 to 317, y around 53 to 157.
# Notice the blue rectangle is top-right, protruding outside the photo (x: 297 to 321, y: 44 to 70).
# The actual photo box is roughly: x: 221, y: 53, w: 96, h: 104 -> x2: 317, y2: 157.
portrait = img.crop((221, 53, 317, 157))
portrait.save('public/images/profile/sunny.png')

# Project thumbnails from desktop light:
# Card 1 (WebPOS): x: 55 to 134, y: 516 to 563
proj1 = img.crop((55, 516, 134, 563))
proj1.save('public/images/projects/webpos.png')

# Card 2 (Data Dashboard): x: 147 to 226, y: 516 to 563
proj2 = img.crop((147, 516, 226, 563))
proj2.save('public/images/projects/dashboard.png')

# Card 3 (WebStore): x: 239 to 318, y: 516 to 563
proj3 = img.crop((239, 516, 318, 563))
proj3.save('public/images/projects/webstore.png')

# Also botanical illustration on right of education/contact:
# x: 290 to 335, y: 610 to 715
leaf = img.crop((290, 610, 335, 715))
leaf.save('scratch/crops/botanical_crop.png')

print("Extracted base images to public/images/")
