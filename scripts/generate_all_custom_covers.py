import os
import re
import math
from PIL import Image, ImageDraw, ImageFont

# Directory for cover images
covers_dir = os.path.join('public', 'buku_sampul')
os.makedirs(covers_dir, exist_ok=True)

# Read books from books.tsx
books_path = os.path.join('src', 'data', 'books.tsx')
with open(books_path, 'r', encoding='utf-8') as f:
    content = f.read()

blocks = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)".*?\}', content, re.DOTALL)
books = []

for b_id, b_title in blocks:
    escaped_id = re.escape(b_id)
    chunk_match = re.search(r'\{\s*"id":\s*"' + escaped_id + r'".*?\}', content, re.DOTALL)
    chunk = chunk_match.group(0) if chunk_match else ""
    
    author_m = re.search(r'"author":\s*"([^"]+)"', chunk)
    category_m = re.search(r'"category":\s*"([^"]+)"', chunk)
    publisher_m = re.search(r'"publisher":\s*"([^"]+)"', chunk)
    isbn_m = re.search(r'"isbn":\s*"([^"]+)"', chunk)
    
    books.append({
        'id': b_id,
        'title': b_title,
        'author': author_m.group(1) if author_m else 'Penulis Pustaka',
        'category': category_m.group(1) if category_m else 'Umum',
        'publisher': publisher_m.group(1) if publisher_m else 'Pustaka Digital',
        'isbn': isbn_m.group(1) if isbn_m else 'ISBN-000000',
    })

print(f"Parsed {len(books)} books for cover generation.")

# Font loader with fallback
def get_font(size, is_bold=False, is_serif=False):
    fonts_dir = r'C:\Windows\Fonts'
    font_names = []
    if is_serif:
        font_names = ['georgiab.ttf', 'georgia.ttf', 'timesbd.ttf', 'times.ttf']
    elif is_bold:
        font_names = ['segoeuib.ttf', 'arialbd.ttf', 'trebucbd.ttf']
    else:
        font_names = ['segoeui.ttf', 'arial.ttf', 'trebuc.ttf']
        
    for name in font_names:
        p = os.path.join(fonts_dir, name)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

# Category Theme Color Palettes (Top Color, Bottom Color, Accent Color, Text Color)
THEMES = {
    'Teknologi': {
        'bg_top': (15, 23, 42),       # Slate 900
        'bg_bot': (30, 58, 138),      # Blue 900
        'accent': (56, 189, 248),     # Cyan 400
        'gold': (147, 197, 253),      # Blue 300
    },
    'Novel': {
        'bg_top': (24, 16, 38),       # Dark Violet/Plum
        'bg_bot': (88, 28, 135),      # Purple 900
        'accent': (244, 114, 182),    # Pink 400
        'gold': (253, 224, 71),       # Yellow 300
    },
    'Fiksi': {
        'bg_top': (17, 24, 39),       # Dark Slate
        'bg_bot': (6, 78, 59),        # Emerald 900
        'accent': (52, 211, 153),     # Emerald 400
        'gold': (251, 191, 36),       # Amber 400
    },
    'Agama': {
        'bg_top': (20, 30, 25),       # Deep Forest Dark
        'bg_bot': (4, 120, 87),       # Emerald 700
        'accent': (251, 191, 36),     # Gold/Amber
        'gold': (253, 230, 138),      # Light Gold
    },
    'Pendidikan': {
        'bg_top': (30, 27, 75),       # Indigo 950
        'bg_bot': (67, 56, 202),      # Indigo 700
        'accent': (129, 140, 248),    # Indigo 400
        'gold': (253, 224, 71),       # Amber 300
    },
    'Sejarah': {
        'bg_top': (41, 23, 16),       # Deep Warm Brown
        'bg_bot': (120, 53, 15),      # Amber 900
        'accent': (251, 146, 60),     # Orange 400
        'gold': (254, 215, 170),      # Warm Peach
    },
    'Sains': {
        'bg_top': (8, 47, 73),        # Sky 950
        'bg_bot': (14, 116, 144),     # Cyan 700
        'accent': (103, 232, 249),    # Cyan 300
        'gold': (224, 242, 254),      # Sky 100
    },
    'Pengembangan Diri': {
        'bg_top': (28, 25, 23),       # Stone 900
        'bg_bot': (120, 53, 15),      # Amber 900
        'accent': (245, 158, 11),     # Amber 500
        'gold': (254, 240, 138),      # Light Amber
    },
}

DEFAULT_THEME = {
    'bg_top': (15, 23, 42),
    'bg_bot': (30, 58, 138),
    'accent': (56, 189, 248),
    'gold': (251, 191, 36)
}

def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        w = bbox[2] - bbox[0]
        if w <= max_width:
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

def generate_cover_image(book, filename):
    width, height = 600, 900
    img = Image.new('RGB', (width, height), (15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    # Pick theme
    theme = THEMES.get(book['category'], DEFAULT_THEME)
    
    # Vertical Gradient
    r1, g1, b1 = theme['bg_top']
    r2, g2, b2 = theme['bg_bot']
    for y in range(height):
        factor = y / float(height)
        r = int(r1 + (r2 - r1) * factor)
        g = int(g1 + (g2 - g1) * factor)
        b = int(b1 + (b2 - b1) * factor)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # Decorative Geometric Accents
    # Outer luxury border
    border_margin = 24
    draw.rectangle(
        [(border_margin, border_margin), (width - border_margin, height - border_margin)],
        outline=theme['accent'],
        width=2
    )
    
    inner_margin = 32
    draw.rectangle(
        [(inner_margin, inner_margin), (width - inner_margin, height - inner_margin)],
        outline=(255, 255, 255, 60),
        width=1
    )
    
    # Category Tag Pill at Top
    cat_text = f"  {book['category'].upper()}  "
    cat_font = get_font(16, is_bold=True)
    cat_bbox = draw.textbbox((0, 0), cat_text, font=cat_font)
    cat_w = cat_bbox[2] - cat_bbox[0]
    cat_h = cat_bbox[3] - cat_bbox[1]
    
    cat_x = (width - cat_w) // 2
    cat_y = 65
    draw.rectangle(
        [(cat_x - 12, cat_y - 6), (cat_x + cat_w + 12, cat_y + cat_h + 10)],
        fill=(15, 23, 42),
        outline=theme['accent'],
        width=1
    )
    draw.text((cat_x, cat_y), cat_text, font=cat_font, fill=theme['accent'])
    
    # Title Section (Centered in Top 60%)
    title_font_size = 42
    if len(book['title']) > 45:
        title_font_size = 32
    elif len(book['title']) > 25:
        title_font_size = 36
        
    is_serif = book['category'] in ['Novel', 'Fiksi', 'Agama', 'Sejarah']
    title_font = get_font(title_font_size, is_bold=True, is_serif=is_serif)
    
    max_title_w = width - 120
    lines = wrap_text(book['title'], title_font, max_title_w, draw)
    
    # Calculate vertical center for title block
    line_height = title_font_size + 10
    total_title_h = len(lines) * line_height
    start_y = 220 + (220 - total_title_h) // 2
    
    # Decorative line above title
    draw.line([(180, start_y - 30), (width - 180, start_y - 30)], fill=theme['gold'], width=2)
    
    for line in lines:
        l_bbox = draw.textbbox((0, 0), line, font=title_font)
        l_w = l_bbox[2] - l_bbox[0]
        l_x = (width - l_w) // 2
        
        # Soft text shadow
        draw.text((l_x + 2, start_y + 2), line, font=title_font, fill=(0, 0, 0))
        draw.text((l_x, start_y), line, font=title_font, fill=(255, 255, 255))
        start_y += line_height

    # Decorative line below title
    draw.line([(180, start_y + 15), (width - 180, start_y + 15)], fill=theme['gold'], width=2)

    # Center Emblem / Star Icon
    emblem_y = start_y + 70
    draw.ellipse([(width//2 - 20, emblem_y - 20), (width//2 + 20, emblem_y + 20)], outline=theme['gold'], width=2)
    draw.polygon([
        (width//2, emblem_y - 12),
        (width//2 + 4, emblem_y - 4),
        (width//2 + 12, emblem_y - 4),
        (width//2 + 6, emblem_y + 2),
        (width//2 + 8, emblem_y + 10),
        (width//2, emblem_y + 5),
        (width//2 - 8, emblem_y + 10),
        (width//2 - 6, emblem_y + 2),
        (width//2 - 12, emblem_y - 4),
        (width//2 - 4, emblem_y - 4),
    ], fill=theme['gold'])

    # Author Section (Bottom 25%)
    author_font = get_font(24, is_bold=True)
    by_font = get_font(14, is_bold=False)
    
    by_text = "KARYA PENULIS"
    by_bbox = draw.textbbox((0, 0), by_text, font=by_font)
    draw.text(((width - (by_bbox[2] - by_bbox[0])) // 2, height - 210), by_text, font=by_font, fill=(203, 213, 225))
    
    author_text = book['author']
    a_bbox = draw.textbbox((0, 0), author_text, font=author_font)
    a_w = a_bbox[2] - a_bbox[0]
    draw.text(((width - a_w) // 2, height - 180), author_text, font=author_font, fill=theme['gold'])
    
    # Publisher & ISBN Footer
    footer_font = get_font(13, is_bold=False)
    pub_text = f"{book['publisher']} • {book['isbn']}"
    f_bbox = draw.textbbox((0, 0), pub_text, font=footer_font)
    draw.text(((width - (f_bbox[2] - f_bbox[0])) // 2, height - 70), pub_text, font=footer_font, fill=(148, 163, 184))
    
    # Save Image
    save_path = os.path.join(covers_dir, filename)
    img.save(save_path, 'JPEG', quality=95)

book_cover_map = {}
print("Generating high-res custom book covers for all 160 books...")

for i, book in enumerate(books):
    clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', book['title']).strip()
    clean_title = re.sub(r'\s+', '_', clean_title)
    filename = f"cover_{book['id']}_{clean_title}.jpg"
    
    try:
        generate_cover_image(book, filename)
        cover_url = f"/buku_sampul/{filename}"
        book_cover_map[book['id']] = cover_url
        if (i+1) % 20 == 0 or (i+1) == len(books):
            print(f"Generated [{i+1}/{len(books)}] covers...")
    except Exception as e:
        print(f"Error generating cover for {book['id']}: {e}")

print("Successfully generated all cover images!")

# Update books.tsx with coverUrl
with open(books_path, 'r', encoding='utf-8') as f:
    books_content = f.read()

def replace_cover_url(match):
    full_block = match.group(0)
    b_id_match = re.search(r'"id":\s*"([^"]+)"', full_block)
    if b_id_match:
        b_id = b_id_match.group(1)
        if b_id in book_cover_map:
            new_cover = book_cover_map[b_id]
            if '"coverUrl":' in full_block:
                full_block = re.sub(r'"coverUrl":\s*"[^"]+"', f'"coverUrl": "{new_cover}"', full_block)
            else:
                full_block = re.sub(r'(\s*\})', f',\n    "coverUrl": "{new_cover}"\1', full_block)
    return full_block

updated_books_content = re.sub(r'\{\s*"id":\s*"[^"]+".*?\}', replace_cover_url, books_content, flags=re.DOTALL)

with open(books_path, 'w', encoding='utf-8') as f:
    f.write(updated_books_content)

print("Updated coverUrl in books.tsx for all 160 books.")
