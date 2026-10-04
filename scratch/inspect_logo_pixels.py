from PIL import Image

img = Image.open('public/logo.png')
print("Mode:", img.mode)
print("Corners pixels:", [img.getpixel((0,0)), img.getpixel((852,0)), img.getpixel((0,1023)), img.getpixel((852,1023))])
