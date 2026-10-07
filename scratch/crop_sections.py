import os
from PIL import Image

ref_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791374632593.jpg'
img = Image.open(ref_path)

# Let's crop individual sections from desktop light (x: 20 to 330, y: 10 to 730)
# Hero: y 10 to 190
# About: y 190 to 280
# Skills: y 280 to 350
# Experience: y 350 to 480
# Projects: y 480 to 590
# Education: y 590 to 660
# Contact & Footer: y 660 to 740

sections = {
    'hero_light': (20, 10, 335, 195),
    'about_light': (20, 195, 335, 290),
    'skills_light': (20, 290, 335, 360),
    'experience_light': (20, 360, 335, 485),
    'projects_light': (20, 485, 335, 595),
    'education_light': (20, 595, 335, 665),
    'contact_light': (20, 665, 335, 740),
    'hero_dark': (355, 10, 670, 195),
    'about_dark': (355, 195, 670, 290),
    'skills_dark': (355, 290, 670, 360),
    'experience_dark': (355, 360, 670, 485),
    'projects_dark': (355, 485, 670, 595),
    'education_dark': (355, 595, 670, 665),
    'contact_dark': (355, 665, 670, 740),
}

for name, box in sections.items():
    img.crop(box).save(f'scratch/crops/{name}.png')

# Also crop exact portrait photo
# In hero_light, portrait is around x: 220 to 318, y: 53 to 157
portrait = img.crop((220, 53, 318, 157))
portrait.save('scratch/crops/portrait_extracted.png')

# Also crop project images:
# in projects_light: card1, card2, card3
# card1: x: 55 to 135, y: 516 to 563
img.crop((55, 516, 134, 563)).save('scratch/crops/proj_webpos.png')
img.crop((146, 516, 226, 563)).save('scratch/crops/proj_dashboard.png')
img.crop((238, 516, 318, 563)).save('scratch/crops/proj_webstore.png')

print("All sections and assets cropped.")
