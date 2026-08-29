import os
import re
import time
import urllib.request
import urllib.parse
import json
from PIL import Image

covers_dir = os.path.join('public', 'buku_sampul')
os.makedirs(covers_dir, exist_ok=True)

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
    
    # Strip "(Edisi Kolektor)", "Jilid II", etc. for cleaner API search
    clean_search_title = re.sub(r'\(Edisi Kolektor\)|Edisi Kolektor|Jilid II', '', b_title).strip()
    
    books.append({
        'id': b_id,
        'title': b_title,
        'search_title': clean_search_title,
        'author': author_m.group(1) if author_m else '',
        'category': category_m.group(1) if category_m else 'Umum',
        'publisher': publisher_m.group(1) if publisher_m else 'Pustaka Digital',
        'isbn': isbn_m.group(1) if isbn_m else '',
    })

print(f"Loaded {len(books)} books for enhanced real cover fetching.")

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

def get_google_cover(query):
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q={urllib.parse.quote(query)}&maxResults=3"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            if 'items' in data:
                for item in data['items']:
                    links = item.get('volumeInfo', {}).get('imageLinks', {})
                    img_url = links.get('extraLarge') or links.get('large') or links.get('medium') or links.get('thumbnail') or links.get('smallThumbnail')
                    if img_url:
                        # Upgrade resolution
                        img_url = img_url.replace('http:', 'https:').replace('&edge=curl', '').replace('zoom=1', 'zoom=2')
                        return img_url
    except Exception:
        pass
    return None

def get_openlibrary_cover(title, author):
    try:
        query = f"{title} {author}".strip()
        url = f"https://openlibrary.org/search.json?q={urllib.parse.quote(query)}&limit=1"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            if 'docs' in data and len(data['docs']) > 0:
                doc = data['docs'][0]
                cover_i = doc.get('cover_i')
                if cover_i:
                    return f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg"
    except Exception:
        pass
    return None

def fetch_best_real_cover(book):
    # Strategy 1: Google Books with ISBN
    clean_isbn = re.sub(r'[^0-9X]', '', book['isbn'], flags=re.IGNORECASE)
    if clean_isbn and len(clean_isbn) >= 10:
        c = get_google_cover(f"isbn:{clean_isbn}")
        if c: return c
        
    # Strategy 2: Google Books with Title + Author
    c = get_google_cover(f"{book['search_title']} {book['author']}")
    if c: return c
    
    # Strategy 3: Google Books Title Only
    c = get_google_cover(book['search_title'])
    if c: return c
    
    # Strategy 4: Open Library Search API
    c = get_openlibrary_cover(book['search_title'], book['author'])
    if c: return c
    
    # Strategy 5: Open Library direct ISBN
    if clean_isbn and len(clean_isbn) >= 10:
        return f"https://covers.openlibrary.org/b/isbn/{clean_isbn}-L.jpg"
        
    return None

def download_and_verify(img_url, dest_path):
    try:
        req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req, timeout=7) as resp:
            data = resp.read()
            if len(data) < 1500: # skip empty 1x1 pixels
                return False
            with open(dest_path, 'wb') as f:
                f.write(data)
            with Image.open(dest_path) as im:
                im.verify()
            return True
    except Exception:
        if os.path.exists(dest_path):
            os.remove(dest_path)
        return False

book_cover_map = {}
success_count = 0
failed_count = 0

print("Fetching real covers with multi-tier Google & OpenLibrary search...")

for i, book in enumerate(books):
    clean_title_fn = re.sub(r'[^a-zA-Z0-9\s-]', '', book['title']).strip()
    clean_title_fn = re.sub(r'\s+', '_', clean_title_fn)
    filename = f"real_cover_{book['id']}_{clean_title_fn}.jpg"
    dest_path = os.path.join(covers_dir, filename)
    
    cover_url = fetch_best_real_cover(book)
    ok = False
    if cover_url:
        ok = download_and_verify(cover_url, dest_path)
        
    if ok:
        success_count += 1
        book_cover_map[book['id']] = f"/buku_sampul/{filename}"
    else:
        failed_count += 1
        # Keep existing cover file if available
        if os.path.exists(dest_path):
            book_cover_map[book['id']] = f"/buku_sampul/{filename}"
        else:
            book_cover_map[book['id']] = f"/buku_sampul/cover_{book['id']}_{clean_title_fn}.jpg"
            
    if (i+1) % 20 == 0 or (i+1) == len(books):
        print(f"Progress: [{i+1}/{len(books)}] Real fetched: {success_count}, Remaining: {failed_count}")
        
    time.sleep(0.05)

print(f"\nDone! Successfully fetched REAL published covers for {success_count}/{len(books)} books.")

# Update books.tsx
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
