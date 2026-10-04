from PIL import Image

img = Image.open('public/logo.png')
print("Image size:", img.size)
# Get bounding box of non-transparent pixels
bbox = img.getbbox()
print("Non-transparent bbox:", bbox)
