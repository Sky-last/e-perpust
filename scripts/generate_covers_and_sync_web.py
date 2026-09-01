import os
import re
import json
from PIL import Image, ImageDraw, ImageFont

covers_dir = os.path.join('public', 'buku_sampul')
os.makedirs(covers_dir, exist_ok=True)

THEMES = {
    'Cerita Anak': {
        'bg_top': (24, 30, 56), 'bg_mid': (45, 85, 125), 'bg_bot': (234, 88, 12),
        'badge_bg': (249, 115, 22), 'badge_txt': (255, 255, 255),
        'title_txt': (255, 255, 255), 'author_txt': (254, 215, 170),
        'accent': (251, 146, 60), 'gradient_cls': 'from-amber-500 to-orange-700'
    },
    'Buku Pelajaran': {
        'bg_top': (15, 23, 42), 'bg_mid': (30, 58, 138), 'bg_bot': (2, 132, 199),
        'badge_bg': (14, 165, 233), 'badge_txt': (255, 255, 255),
        'title_txt': (255, 255, 255), 'author_txt': (186, 230, 253),
        'accent': (56, 189, 248), 'gradient_cls': 'from-sky-600 to-blue-900'
    },
    'Sejarah': {
        'bg_top': (28, 25, 23), 'bg_mid': (120, 53, 15), 'bg_bot': (180, 83, 9),
        'badge_bg': (217, 119, 6), 'badge_txt': (255, 255, 255),
        'title_txt': (255, 255, 255), 'author_txt': (254, 243, 199),
        'accent': (251, 191, 36), 'gradient_cls': 'from-amber-700 to-amber-950'
    },
    'Sejarah & Cerita Rakyat': {
        'bg_top': (28, 25, 23), 'bg_mid': (120, 53, 15), 'bg_bot': (180, 83, 9),
        'badge_bg': (217, 119, 6), 'badge_txt': (255, 255, 255),
        'title_txt': (255, 255, 255), 'author_txt': (254, 243, 199),
        'accent': (251, 191, 36), 'gradient_cls': 'from-amber-700 to-amber-950'
    },
    'Sejarah & Budaya': {
        'bg_top': (28, 25, 23), 'bg_mid': (120, 53, 15), 'bg_bot': (180, 83, 9),
        'badge_bg': (217, 119, 6), 'badge_txt': (255, 255, 255),
        'title_txt': (255, 255, 255), 'author_txt': (254, 243, 199),
        'accent': (251, 191, 36), 'gradient_cls': 'from-amber-700 to-amber-950'
    },
    'Novel & Sastra': {
        'bg_top': (24, 15, 38), 'bg_mid': (76, 29, 149), 'bg_bot': (147, 51, 234),
        'badge_bg': (168, 85, 247), 'badge_txt': (255, 255, 255),
        'title_txt': (255, 255, 255), 'author_txt': (233, 213, 255),
        'accent': (192, 132, 252), 'gradient_cls': 'from-purple-800 to-indigo-950'
    },
    'Bahasa & Sastra': {
        'bg_top': (6, 78, 59), 'bg_mid': (4, 120, 87), 'bg_bot': (16, 185, 129),
        'badge_bg': (16, 185, 129), 'badge_txt': (255, 255, 255),
        'title_txt': (255, 255, 255), 'author_txt': (167, 243, 208),
        'accent': (52, 211, 153), 'gradient_cls': 'from-emerald-700 to-teal-950'
    },
}

DEFAULT_THEME = {
    'bg_top': (15, 23, 42), 'bg_mid': (51, 65, 85), 'bg_bot': (100, 116, 139),
    'badge_bg': (71, 85, 105), 'badge_txt': (255, 255, 255),
    'title_txt': (255, 255, 255), 'author_txt': (226, 232, 240),
    'accent': (148, 163, 184), 'gradient_cls': 'from-slate-700 to-slate-950'
}

def get_font(size, is_bold=False):
    fonts_dir = r'C:\Windows\Fonts'
    font_names = ['segoeuib.ttf', 'arialbd.ttf', 'calibrib.ttf'] if is_bold else ['segoeui.ttf', 'arial.ttf', 'calibri.ttf']
    for font_name in font_names:
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

def generate_ultra_cover(b_id, title, author, category):
    slug = re.sub(r'[^a-zA-Z0-9]', '_', title).strip('_')
    filename = f"cover_bks_{b_id}_{slug}.jpg"
    dest_path = os.path.join(covers_dir, filename)
    
    width, height = 600, 900
    img = Image.new('RGB', (width, height), (15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    theme = THEMES.get(category, DEFAULT_THEME)
    
    # Smooth 3-stop Gradient
    r1, g1, b1 = theme['bg_top']
    r2, g2, b2 = theme['bg_mid']
    r3, g3, b3 = theme['bg_bot']
    
    for y in range(height):
        factor = y / float(height)
        if factor < 0.5:
            f2 = factor * 2.0
            r = int(r1 + (r2 - r1) * f2)
            g = int(g1 + (g2 - g1) * f2)
            b = int(b1 + (b2 - b1) * f2)
        else:
            f2 = (factor - 0.5) * 2.0
            r = int(r2 + (r3 - r2) * f2)
            g = int(g2 + (g3 - g2) * f2)
            b = int(b2 + (b3 - b2) * f2)
        
        # Clamp to 0-255 range
        r = max(0, min(255, r))
        g = max(0, min(255, g))
        b = max(0, min(255, b))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # Geometric decorative accents (glowing circles & lines)
    draw.ellipse([(-100, -100), (300, 300)], outline=(255, 255, 255, 30), width=2)
    draw.ellipse([(width - 250, height - 250), (width + 100, height + 100)], outline=theme['accent'], width=2)
    
    # Outer frame
    draw.rectangle([(24, 24), (width - 24, height - 24)], outline=theme['accent'], width=3)
    draw.rectangle([(30, 30), (width - 30, height - 30)], outline=(255, 255, 255, 60), width=1)
    
    # Category Pill Badge
    cat_font = get_font(16, is_bold=True)
    cat_text = category.upper()
    cat_bbox = draw.textbbox((0, 0), cat_text, font=cat_font)
    cat_w = cat_bbox[2] - cat_bbox[0] + 30
    cat_h = cat_bbox[3] - cat_bbox[1] + 16
    
    badge_x1 = 50
    badge_y1 = 60
    draw.rounded_rectangle([(badge_x1, badge_y1), (badge_x1 + cat_w, badge_y1 + cat_h)], radius=8, fill=theme['badge_bg'])
    draw.text((badge_x1 + 15, badge_y1 + 6), cat_text, font=cat_font, fill=theme['badge_txt'])
    
    # Book Title Typography
    t_font_size = 38 if len(title) < 25 else (30 if len(title) < 45 else 24)
    t_font = get_font(t_font_size, is_bold=True)
    lines = wrap_text(title, t_font, width - 100, draw)
    
    start_y = 220
    for line in lines:
        # Drop shadow effect
        draw.text((52, start_y + 3), line, font=t_font, fill=(0, 0, 0, 180))
        draw.text((50, start_y), line, font=t_font, fill=theme['title_txt'])
        start_y += t_font_size + 10
        
    # Accent Line Separator
    draw.line([(50, start_y + 15), (200, start_y + 15)], fill=theme['accent'], width=4)
    
    # Author Tag
    a_font = get_font(20, is_bold=False)
    draw.text((52, height - 140 + 2), f"Karya: {author}", font=a_font, fill=(0, 0, 0, 150))
    draw.text((50, height - 140), f"Karya: {author}", font=a_font, fill=theme['author_txt'])
    
    # Official Library Crest Footer
    f_font = get_font(13, is_bold=True)
    draw.line([(50, height - 80), (width - 50, height - 80)], fill=(255, 255, 255, 50), width=1)
    draw.text((50, height - 60), "PERPUSTAKAAN DIGITAL • EDISI KOLEKSI RESMI", font=f_font, fill=theme['accent'])
    
    img.save(dest_path, 'JPEG', quality=95)
    return f"/buku_sampul/{filename}"

def main():
    print("=========================================================")
    print("MEMBUAT COVER BUKU ULTRA-PREMIUM & MENAMPILKAN DI WEBSITE")
    print("=========================================================\n")
    
    books_ts_path = os.path.join('scripts', 'books.ts')
    with open(books_ts_path, 'r', encoding='utf-8') as f:
        ts_content = f.read()
        
    books_match = re.search(r'export const books: Book\[\] = (\[[\s\S]*?\]);', ts_content)
    if not books_match:
        print("Gagal membaca books.ts")
        return
        
    books_data = json.loads(books_match.group(1))
    print(f"Memproses {len(books_data)} buku...")
    
    web_books = []
    
    for i, b in enumerate(books_data):
        cover_url = generate_ultra_cover(b['id'], b['title'], b['author'], b['category'])
        b['coverUrl'] = cover_url
        print(f"[{b['id']}/50] Cover dibuat -> {cover_url}")
        
        theme = THEMES.get(b['category'], DEFAULT_THEME)
        
        web_books.append({
            "id": f"bks-{b['id']}",
            "title": b['title'],
            "author": b['author'],
            "category": b['category'],
            "publisher": "Kementerian Pendidikan dan Kebudayaan",
            "isbn": f"978-602-BKS-{b['id']:03d}",
            "description": b['description'],
            "year": b['year'],
            "rating": 4.8,
            "status": "Tersedia",
            "stock": 5,
            "coverColor": theme['gradient_cls'],
            "coverUrl": cover_url,
            "pdfUrl": b['pdfUrl']
        })

    # Update scripts/books.ts
    updated_ts_json = json.dumps(books_data, indent=4)
    new_ts_content = re.sub(r'export const books: Book\[\] = \[[\s\S]*?\];', f'export const books: Book[] = {updated_ts_json};', ts_content)
    with open(books_ts_path, 'w', encoding='utf-8') as f:
        f.write(new_ts_content)

    # Sync into src/data/books.tsx
    books_tsx_path = os.path.join('src', 'data', 'books.tsx')
    with open(books_tsx_path, 'r', encoding='utf-8') as f:
        tsx_content = f.read()
        
    # Read existing INITIAL_BOOKS from books.tsx
    init_match = re.search(r'export const INITIAL_BOOKS: Book\[\] = (\[[\s\S]*?\]);', tsx_content)
    if init_match:
        existing_books = json.loads(init_match.group(1))
        
        # Filter out old bks- entries if any, then append
        filtered_existing = [eb for eb in existing_books if not str(eb['id']).startswith('bks-')]
        combined_books = filtered_existing + web_books
        
        combined_json = json.dumps(combined_books, indent=2)
        new_tsx_content = re.sub(r'export const INITIAL_BOOKS: Book\[\] = \[[\s\S]*?\];', f'export const INITIAL_BOOKS: Book[] = {combined_json};', tsx_content)
        
        with open(books_tsx_path, 'w', encoding='utf-8') as f:
            f.write(new_tsx_content)
            
        print(f"\n[SUKSES MERGE] Total buku di website (INITIAL_BOOKS): {len(combined_books)} buku (Termasuk 50 buku baru!)")

    # Update src/utils/pdfResolver.ts map
    pdf_resolver_path = os.path.join('src', 'utils', 'pdfResolver.ts')
    with open(pdf_resolver_path, 'r', encoding='utf-8') as f:
        resolver_content = f.read()
        
    for wb in web_books:
        entry = f"  '{wb['id']}': '{wb['pdfUrl']}',\n"
        if entry not in resolver_content:
            resolver_content = resolver_content.replace("export const BOOK_PDF_MAP: Record<string, string> = {\n", f"export const BOOK_PDF_MAP: Record<string, string> = {{\n{entry}")
            
    with open(pdf_resolver_path, 'w', encoding='utf-8') as f:
        f.write(resolver_content)
        
    print("[SUKSES RESOLVER] pdfResolver.ts diperbarui untuk navigasi e-book 3D reader.")

if __name__ == '__main__':
    main()
