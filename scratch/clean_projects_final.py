from PIL import Image

ref_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791374632593.jpg'
img = Image.open(ref_path)

c1 = img.crop((56, 529, 134, 570)).resize((78 * 5, 41 * 5), Image.Resampling.LANCZOS)
c1.save('public/images/projects/webpos.png')

c2 = img.crop((147, 529, 226, 570)).resize((79 * 5, 41 * 5), Image.Resampling.LANCZOS)
c2.save('public/images/projects/dashboard.png')

c3 = img.crop((239, 529, 318, 570)).resize((79 * 5, 41 * 5), Image.Resampling.LANCZOS)
c3.save('public/images/projects/webstore.png')

print("All 3 project thumbnails cleanly saved.")
