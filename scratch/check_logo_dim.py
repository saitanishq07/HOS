from PIL import Image

img = Image.open('public/logo.png')
print(f"Format: {img.format}, Size: {img.size} (Width x Height), Mode: {img.mode}")
