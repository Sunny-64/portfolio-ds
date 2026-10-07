from PIL import Image

ref_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791374632593.jpg'
img = Image.open(ref_path)

# Look at desktop dark or desktop light:
# In desktop light, the portrait is at (228, 53, 316, 155) approx.
# Let's crop tight inside the portrait (e.g. 228 to 316 is width 88):
# Let's see: on the left of portrait in desktop light, background is ~ (247, 247, 245)
# Portrait left edge has dark background ~ (70, 70, 70).
# Let's find the exact rectangle by scanning lines:

# Let's crop a slightly wider region and check coordinates:
crop_test = img.crop((224, 50, 320, 160))
# Let's save a coordinate-marked version or find edges:
# Looking at crop_test:
# Let's find columns where pixels are dark across the portrait height:
y_mid = 100
for x in range(220, 235):
    p = img.getpixel((x, y_mid))
    # print x and pixel
# Let's crop cleanly:
portrait_clean = img.crop((228, 55, 316, 155))
portrait_clean.save('public/images/profile/sunny.png')
print("Clean portrait saved. Size:", portrait_clean.size)
