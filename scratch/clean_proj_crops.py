from PIL import Image

ref_path = r'C:/Users/Sunny/.gemini/antigravity/brain/2c78640a-8b4f-4ee9-9f49-efa15d59b81a/.user_uploaded/media_1791374632593.jpg'
img = Image.open(ref_path)

# Clean tight crop for project cards (y: 524 to 563):
# Card 1 (WebPOS)
proj1 = img.crop((55, 524, 134, 563))
proj1 = proj1.resize((proj1.width * 5, proj1.height * 5), Image.Resampling.LANCZOS)
proj1.save('public/images/projects/webpos.png')

# Card 2 (Data Dashboard)
proj2 = img.crop((147, 524, 226, 563))
proj2 = proj2.resize((proj2.width * 5, proj2.height * 5), Image.Resampling.LANCZOS)
proj2.save('public/images/projects/dashboard.png')

# Card 3 (WebStore)
proj3 = img.crop((239, 524, 318, 563))
proj3 = proj3.resize((proj3.width * 5, proj3.height * 5), Image.Resampling.LANCZOS)
proj3.save('public/images/projects/webstore.png')

print("Clean project images re-cropped and saved.")
