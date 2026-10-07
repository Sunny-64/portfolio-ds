from PIL import Image

src_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791377728433.jpg'
img = Image.open(src_path)

# Let's save the original as sunny_full.jpg
img.save('public/images/profile/sunny_full.jpg', quality=95)

# For 4:5 aspect ratio:
# In the reference image, the framing shows head down to upper chest/hoodie:
# Let's see: width = 820, height = 1024
crop_4_5 = img.crop((102, 0, 922, 1024))
crop_4_5.save('public/images/profile/sunny.png')

print("Saved sunny.png and sunny_full.jpg")
