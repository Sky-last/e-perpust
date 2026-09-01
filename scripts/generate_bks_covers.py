import os
import re
from PIL import Image, ImageDraw, ImageFont

covers_dir = os.path.join('public', 'buku_sampul')
os.makedirs(covers_dir, exist_ok=True)

THEMES = {
    'Cerita Anak': {'bg_top': (255, 238, 204), 'bg_bot': (255, 183, 77), 'accent': (230, 81, 0), 'text': (62, 39, 35)},
    'Buku Pelajaran': {'bg_top': (224, 242, 254), 'bg_bot': (56, 189, 248), 'accent': (3, 105, 161), 'text': (12, 74, 110)},
    'Sejarah': {'bg_top': (254, 243, 199), 'bg_bot': (245, 158, 11), 'accent': (180, 83, 9), 'text': (120, 53, 15)},
    'Sejarah & Cerita Rakyat': {'bg_top': (254, 243, 199), 'bg_bot': (245, 158, 11), 'accent': (180, 83, 9), 'text': (120, 53, 15)},
    'Sejarah & Budaya': {'bg_top': (254, 243, 199), 'bg_bot': (245, 158, 11), 'accent': (180, 83, 9), 'text': (120, 53, 15)},
    'Novel & Sastra': {'bg_top': (243, 232, 255), 'bg_bot': (192, 132, 252), 'accent': (126, 34, 206), 'text': (88, 28, 135)},
    'Bahasa & Sastra': {'bg_top': (236, 253, 245), 'bg_bot': (52, 211, 153), 'accent': (4, 120, 87), 'text': (6, 78, 59)},
}

DEFAULT_THEME = {'bg_top': (241, 245, 249), 'bg_bot': (148, 163, 184), 'accent': (30, 41, 59), 'text': (15, 23, 42)}

def get_font(size, is_bold=False):
    fonts_dir = r'C:\Windows\Fonts'
    font_name = 'segoeuib.ttf' if is_bold else 'segoeui.ttf'
    p = os.path.join(fonts_dir, font_name)
    if os.path.exists(p):
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()

def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                lines.append(word)
                current_line = []
    if current_line:
        lines.append(' '.join(current_line))
    return lines

def generate_cover(b_id, title, author, category):
    slug = re.sub(r'[^a-zA-Z0-9]', '_', title).strip('_')
    filename = f"cover_bks_{b_id}_{slug}.jpg"
    dest_path = os.path.join(covers_dir, filename)
    
    width, height = 600, 900
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    theme = THEMES.get(category, DEFAULT_THEME)
    
    r1, g1, b1 = theme['bg_top']
    r2, g2, b2 = theme['bg_bot']
    for y in range(height):
        factor = y / float(height)
        r = int(r1 + (r2 - r1) * factor)
        g = int(g1 + (g2 - g1) * factor)
        b = int(b1 + (b2 - b1) * factor)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    draw.rectangle([(20, 20), (width - 20, height - 20)], outline=theme['accent'], width=3)
    
    # Category tag
    cat_font = get_font(18, is_bold=True)
    draw.text((40, 50), category.upper(), font=cat_font, fill=theme['accent'])
    
    # Title
    t_font_size = 36 if len(title) < 30 else (28 if len(title) < 50 else 22)
    t_font = get_font(t_font_size, is_bold=True)
    lines = wrap_text(title, t_font, width - 80, draw)
    
    start_y = 200
    for line in lines:
        draw.text((40, start_y), line, font=t_font, fill=theme['text'])
        start_y += t_font_size + 8
        
    # Author
    a_font = get_font(22, is_bold=False)
    draw.text((40, height - 120), f"Penulis: {author}", font=a_font, fill=theme['text'])
    
    # Footer
    f_font = get_font(14, is_bold=False)
    draw.text((40, height - 60), "PERPUSTAKAAN DIGITAL • KOLEKSI RESMI", font=f_font, fill=theme['accent'])
    
    img.save(dest_path, 'JPEG', quality=90)
    return f"/buku_sampul/{filename}"

if __name__ == '__main__':
    print("Cover generator helper ready.")
