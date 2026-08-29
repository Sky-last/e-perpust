import os
import re
import time
import urllib.request
import json
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
        'author': author_m.group(1) if author_m else '',
        'category': category_m.group(1) if category_m else 'Umum',
        'publisher': publisher_m.group(1) if publisher_m else 'Pustaka Digital',
        'isbn': isbn_m.group(1) if isbn_m else '',
    })

print(f"Parsed {len(books)} books to fetch real published covers.")

def clean_isbn(isbn):
    return re.sub(r'[^0-9X]', '', isbn, flags=re.IGNORECASE)

def fetch_real_cover_url(title, author, isbn):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    
    # 1. Try Google Books API by ISBN
    clean = clean_isbn(isbn)
    if clean and len(clean) >= 10:
        try:
            url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{clean}&maxResults=1"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                if 'items' in data and len(data['items']) > 0:
                    links = data['items'][0].get('volumeInfo', {}).get('imageLinks', {})
                    img_url = links.get('extraLarge') or links.get('large') or links.get('medium') or links.get('thumbnail') or links.get('smallThumbnail')
                    if img_url:
                        return img_url.replace('http:', 'https:').replace('&edge=curl', '')
        except Exception:
            pass

    # 2. Try Google Books API by Title + Author
    try:
        author_first = author.split()[0] if author else ""
        query = f"intitle:{urllib.parse.quote(title)}"
        if author_first:
            query += f"+inauthor:{urllib.parse.quote(author_first)}"
            
        url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=1"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            if 'items' in data and len(data['items']) > 0:
                links = data['items'][0].get('volumeInfo', {}).get('imageLinks', {})
                img_url = links.get('extraLarge') or links.get('large') or links.get('medium') or links.get('thumbnail') or links.get('smallThumbnail')
                if img_url:
                    return img_url.replace('http:', 'https:').replace('&edge=curl', '')
    except Exception:
        pass

    # 3. Try Open Library by ISBN
    if clean and len(clean) >= 10:
        ol_url = f"https://covers.openlibrary.org/b/isbn/{clean}-L.jpg"
        return ol_url

    return None

def download_and_verify_image(img_url, dest_path):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    try:
        req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
            if len(data) < 1000: # Too small, probably 1x1 error pixel
                return False
            with open(dest_path, 'wb') as f:
                f.write(data)
            # Verify valid image file
            with Image.open(dest_path) as im:
                im.verify()
            return True
    except Exception:
        if os.path.exists(dest_path):
            os.remove(dest_path)
        return False

# Fallback styled cover if real image is truly un-fetchable
def generate_fallback_cover(book, dest_path):
    width, height = 600, 900
    img = Image.new('RGB', (width, height), (15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    # Custom Gradient
    for y in range(height):
        factor = y / float(height)
        r = int(15 + (30 - 15) * factor)
        g = int(23 + (58 - 23) * factor)
        b = int(42 + (138 - 42) * factor)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    draw.rectangle([(20, 20), (width-20, height-20)], outline=(56, 189, 248), width=3)
    
    try:
        font_title = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 36)
        font_author = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 24)
    except Exception:
        font_title = ImageFont.load_default()
        font_author = ImageFont.load_default()
        
    draw.text((40, 200), book['title'], font=font_title, fill=(255, 255, 255))
    draw.text((40, 400), book['author'], font=font_author, fill=(251, 191, 36))
    img.save(dest_path, 'JPEG', quality=90)

book_cover_map = {}
success_count = 0
fallback_count = 0

print("Fetching real published book covers from Google Books & Open Library...")

for i, book in enumerate(books):
    clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', book['title']).strip()
    clean_title = re.sub(r'\s+', '_', clean_title)
    filename = f"real_cover_{book['id']}_{clean_title}.jpg"
    dest_path = os.path.join(covers_dir, filename)
    
    real_url = fetch_real_cover_url(book['title'], book['author'], book['isbn'])
    downloaded = False
    
    if real_url:
        downloaded = download_and_verify_image(real_url, dest_path)
        
    if downloaded:
        success_count += 1
        cover_path_url = f"/buku_sampul/{filename}"
        book_cover_map[book['id']] = cover_path_url
    else:
        # Generate clean fallback
        generate_fallback_cover(book, dest_path)
        fallback_count += 1
        cover_path_url = f"/buku_sampul/{filename}"
        book_cover_map[book['id']] = cover_path_url
        
    if (i + 1) % 15 == 0 or (i + 1) == len(books):
        print(f"Processed [{i+1}/{len(books)}] covers... (Real fetched: {success_count}, Fallback: {fallback_count})")
    time.sleep(0.1) # Be gentle to API rate limits

print(f"\nFinished fetching real covers! Real: {success_count}, Fallback: {fallback_count}")

# Update books.tsx with new coverUrl
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

print("Updated coverUrl in books.tsx with real fetched covers.")
