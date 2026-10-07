from PIL import Image

ref_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791374632593.jpg'
img = Image.open(ref_path)

# Let's crop tight inside the portrait:
# Looking at the coordinates:
# Left edge is ~ 229
# Right edge is ~ 313
# Top edge is ~ 57
# Bottom edge is ~ 155
portrait_tight = img.crop((229, 58, 310, 155))
portrait_tight.save('public/images/profile/sunny.png')

# Let's upscale it with Lanczos to high-resolution (450x530)
upscaled = portrait_tight.resize((450, 530), Image.Resampling.LANCZOS)
upscaled.save('public/images/profile/sunny.png')
print("Saved upscaled sunny.png")
