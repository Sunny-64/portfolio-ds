from PIL import Image

ref_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791374632593.jpg'
img = Image.open(ref_path)

# Let's save a crop of y: 500 to 580, x: 50 to 325 with a grid/coordinates
# so we see exactly where the card pictures start!
for y_offset in [515, 520, 525, 530, 535]:
    # Let's check pixel brightness at x=80
    print(f"y={y_offset}: pixel={img.getpixel((80, y_offset))}")

# Look at desktop dark for clean project images without text:
# In desktop dark (x: 355 to 670, y: 485 to 595):
# Card 1 (WebPOS dark): x: 390 to 470, y: 528 to 568
# Let's crop from desktop dark or light where there is no header text:
crop_dark_card1 = img.crop((393, 528, 470, 570))
crop_dark_card1.save('scratch/crops/card1_dark.png')

# In desktop light, the image card 1 is around:
# Let's find exactly where "Selected Work." is:
# "Selected Work." in light is at y: 495 to 510.
# The card frame starts around y: 528!
crop_card1 = img.crop((57, 528, 133, 570))
crop_card1.save('scratch/crops/card1_test.png')

print("Saved test crops")
