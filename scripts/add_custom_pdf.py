import os
import sys
import shutil
import re

def list_books():
    books_path = os.path.join('src', 'data', 'books.tsx')
    with open(books_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    blocks = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"author":\s*"([^"]+)".*?\}', content, re.DOTALL)
    print("\n=== DAFTAR BUKU DI KATALOG PERPUSTAKAAN DIGITAL ===")
    for b_id, title, author in blocks[:20]:
        print(f"[{b_id}] {title} - karya {author}")
    if len(blocks) > 20:
        print(f"...dan {len(blocks) - 20} buku lainnya.\n")

def add_custom_pdf(source_pdf_path, book_id_or_title):
    if not os.path.exists(source_pdf_path):
        print(f"ERROR: File '{source_pdf_path}' tidak ditemukan!")
        return

    books_path = os.path.join('src', 'data', 'books.tsx')
    with open(books_path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)".*?\}', content, re.DOTALL)
    
    target_id = None
    target_title = None

    for b_id, title in blocks:
        if b_id.lower() == book_id_or_title.lower() or book_id_or_title.lower() in title.lower():
            target_id = b_id
            target_title = title
            break

    if not target_id:
        print(f"ERROR: Buku dengan ID/Judul '{book_id_or_title}' tidak ditemukan di katalog!")
        return

    clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', target_title).strip()
    clean_title = re.sub(r'\s+', '_', clean_title)
    
    dest_filename = f"{target_id}_{clean_title}.pdf"
    dest_path = os.path.join('public', 'buku_digital', dest_filename)

    shutil.copy2(source_pdf_path, dest_path)
    print(f"✅ Berhasil menyalin file PDF asli ke: {dest_path}")

    new_pdf_url = f"/buku_digital/{dest_filename}"

    def update_block(match):
        block = match.group(0)
        if f'"id": "{target_id}"' in block or f'"id":"{target_id}"' in block:
            if '"pdfUrl":' in block:
                block = re.sub(r'"pdfUrl":\s*"[^"]+"', f'"pdfUrl": "{new_pdf_url}"', block)
            else:
                block = re.sub(r'(\s*\})', f',\n    "pdfUrl": "{new_pdf_url}"\1', block)
        return block

    updated_content = re.sub(r'\{\s*"id":\s*"[^"]+".*?\}', update_block, content, flags=re.DOTALL)
    
    with open(books_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"🎉 Sukses! PDF buku '{target_title}' ({target_id}) telah resmi diganti dengan file PDF asli milik Anda!")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Penggunaan:")
        print("  python scripts/add_custom_pdf.py \"C:\\path\\ke\\file_asli.pdf\" \"eb-14\"")
        print("  python scripts/add_custom_pdf.py \"C:\\path\\ke\\file_asli.pdf\" \"Bulan\"")
        list_books()
    else:
        pdf_file = sys.argv[1]
        book_id_or_title = sys.argv[2]
        add_custom_pdf(pdf_file, book_id_or_title)
