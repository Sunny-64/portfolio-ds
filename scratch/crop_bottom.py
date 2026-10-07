from PIL import Image

for theme in ['light', 'dark']:
    p = f'scratch/shot_desktop_{theme}_full.png'
    img = Image.open(p)
    w, h = img.size
    # Crop bottom from y: 2200 to 3800
    bottom = img.crop((0, 2200, w, h))
    bottom.save(f'scratch/crops/bottom_{theme}.png')

print("Bottom cropped successfully.")
