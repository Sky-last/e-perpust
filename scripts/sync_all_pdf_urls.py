import os
import re

pdf_dir = os.path.join('public', 'buku_digital')
pdf_files = os.listdir(pdf_dir)

books_path = os.path.join('src', 'data', 'books.tsx')
with open(books_path, 'r', encoding='utf-8') as f:
    content = f.read()

blocks = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)".*?\}', content, re.DOTALL)

book_pdf_map = {}

for b_id, b_title in blocks:
    clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', b_title).strip()
    clean_title = re.sub(r'\s+', '_', clean_title)
    
    matched = None
    # 1. Match exact prefix e.g. "eb-14_Bulan.pdf" or "gut-1_Letters..."
    for f in pdf_files:
        if f.startswith(f"{b_id}_") and f.endswith(".pdf"):
            matched = f
            break
            
    # 2. Match ID prefix e.g. "eb-14.pdf"
    if not matched:
        for f in pdf_files:
            if f == f"{b_id}.pdf":
                matched = f
                break

    if matched:
        book_pdf_map[b_id] = f"/buku_digital/{matched}"
    else:
        book_pdf_map[b_id] = f"/buku_digital/{b_id}_{clean_title}.pdf"

print(f"Mapped PDF URLs for {len(book_pdf_map)} books.")

# Update books.tsx
def replace_pdf_url(match):
    full_block = match.group(0)
    b_id_match = re.search(r'"id":\s*"([^"]+)"', full_block)
    if b_id_match:
        b_id = b_id_match.group(1)
        if b_id in book_pdf_map:
            new_pdf = book_pdf_map[b_id]
            if '"pdfUrl":' in full_block:
                full_block = re.sub(r'"pdfUrl":\s*"[^"]+"', f'"pdfUrl": "{new_pdf}"', full_block)
            else:
                full_block = re.sub(r'(\s*\})', f',\n    "pdfUrl": "{new_pdf}"\1', full_block)
    return full_block

updated_content = re.sub(r'\{\s*"id":\s*"[^"]+".*?\}', replace_pdf_url, content, flags=re.DOTALL)

with open(books_path, 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Synchronized all pdfUrl values in books.tsx.")
