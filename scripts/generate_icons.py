from PIL import Image, ImageEnhance, ImageFilter
import os

def create_brand_icons():
    logo_path = 'public/logo.jpg'
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found")
        return

    im = Image.open(logo_path)
    
    # Crop the iconic chevron emblem with neon blue aura
    # The chevron spans from x=140 to x=1396, y=0 to y=618 in logo.jpg (1536x1024)
    chevron = im.crop((140, 0, 1396, 618))
    cw, ch = chevron.size
    
    # Sample dark luxury background color from the corner of logo.jpg
    bg_color = (6, 12, 22) # Rich deep obsidian navy
    
    # 1. Create a 1024x1024 master icon
    target_dim = max(cw, ch) + 80
    master = Image.new('RGB', (target_dim, target_dim), bg_color)
    paste_x = (target_dim - cw) // 2
    paste_y = (target_dim - ch) // 2
    master.paste(chevron, (paste_x, paste_y))
    
    # Enhance contrast and sharpness slightly so 16x16 / 32x32 favicons pop vividly
    enhancer = ImageEnhance.Sharpness(master)
    master_sharp = enhancer.enhance(1.2)
    contrast = ImageEnhance.Contrast(master_sharp)
    master_high_contrast = contrast.enhance(1.1)

    # Save master preview
    master_high_contrast.save('public/icon-master.png', quality=100)
    print("Created public/icon-master.png")

    # 2. Generate multi-resolution favicon.ico
    # Windows / Chrome / Edge tabs use 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256
    ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    master_high_contrast.save('public/favicon.ico', format='ICO', sizes=ico_sizes)
    master_high_contrast.save('src/app/favicon.ico', format='ICO', sizes=ico_sizes)
    print("Created public/favicon.ico and src/app/favicon.ico")

    # 3. Generate PNG favicons for modern browsers
    icon_16 = master_high_contrast.resize((16, 16), Image.Resampling.LANCZOS)
    icon_16.save('public/favicon-16x16.png')

    icon_32 = master_high_contrast.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save('public/favicon-32x32.png')

    icon_48 = master_high_contrast.resize((48, 48), Image.Resampling.LANCZOS)
    icon_48.save('public/favicon-48x48.png')
    print("Created PNG favicons (16x16, 32x32, 48x48)")

    # 4. Generate apple-icon.png (180x180)
    apple_icon = master_high_contrast.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save('public/apple-icon.png')
    apple_icon.save('src/app/apple-icon.png')
    print("Created public/apple-icon.png and src/app/apple-icon.png")

    # 5. Generate icon.png (512x512) for PWA / Android / Next.js
    icon_512 = master_high_contrast.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save('public/icon.png')
    icon_512.save('src/app/icon.png')
    print("Created public/icon.png and src/app/icon.png")

    # 6. Generate optimized OpenGraph & WhatsApp preview images
    # WhatsApp requires < 300KB, ideally 1200x630 JPEG
    # Let's create a stunning 1200x630 banner with the full logo and tagline
    og_canvas = Image.new('RGB', (1200, 630), bg_color)
    
    # We can use the full logo.jpg (1536x1024) scaled to fit nicely in 1200x630
    logo_full = Image.open('public/logo.jpg')
    # Fit logo within 1100x560
    logo_full.thumbnail((1100, 560), Image.Resampling.LANCZOS)
    lw, lh = logo_full.size
    og_canvas.paste(logo_full, ((1200 - lw) // 2, (630 - lh) // 2))
    
    og_canvas.save('public/og-image.jpg', quality=90, optimize=True)
    og_canvas.save('public/whatsapp-preview.jpg', quality=90, optimize=True)
    print("Created public/og-image.jpg and public/whatsapp-preview.jpg")

    # 7. Create a 600x600 square preview for WhatsApp (some versions prefer square previews)
    sq_canvas = Image.new('RGB', (600, 600), bg_color)
    logo_sq = Image.open('public/logo.jpg')
    logo_sq.thumbnail((560, 560), Image.Resampling.LANCZOS)
    sw, sh = logo_sq.size
    sq_canvas.paste(logo_sq, ((600 - sw) // 2, (600 - sh) // 2))
    sq_canvas.save('public/whatsapp-square.jpg', quality=90, optimize=True)
    print("Created public/whatsapp-square.jpg")

if __name__ == '__main__':
    create_brand_icons()
