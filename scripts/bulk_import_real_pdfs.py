import os
import sys
import shutil
import re
from difflib import SequenceMatcher

input_dir = os.path.join(os.getcwd(), 'input_pdfs')
dest_dir = os.path.join(os.getcwd(), 'public', 'buku_digital')
books_path = os.path.join(os.getcwd(), 'src', 'data', 'books.tsx')

os.makedirs(input_dir, exist_ok=True)
os.makedirs(dest_dir, exist_ok=True)

def string_similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def bulk_import():
    print("=========================================================")
    print("SINKRONISASI & IMPORT MASSAL PDF BUKU ASLI PERPUSTAKAAN")
    print("=========================================================")
    print(f"Folder Input PDF: {input_dir}")
    print(f"Folder Target   : {dest_dir}\n")

    input_files = [f for f in os.listdir(input_dir) if f.endswith('.pdf')]
    
    if not input_files:
        print("[INFO] TIPS CARA PENGGUNAAN MASSAL:")
        print("1. Salin/Taruh semua file PDF asli milik Anda ke dalam folder:")
        print(f"   {input_dir}")
        print("2. Jalankan kembali perintah:")
        print("   python scripts/bulk_import_real_pdfs.py")
        print("\nSkrip akan secara otomatis mencocokkan setiap file PDF dengan buku di katalog!")
        return

    with open(books_path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)".*?\}', content, re.DOTALL)
    
    matched_count = 0
    book_pdf_map = {}

    for pdf_file in input_files:
        pdf_name_no_ext = os.path.splitext(pdf_file)[0]
        best_match_id = None
        best_match_title = None
        highest_score = 0.0

        for b_id, title in blocks:
            # Direct ID match e.g. "eb-14.pdf"
            if pdf_name_no_ext.lower() == b_id.lower():
                highest_score = 1.0
                best_match_id = b_id
                best_match_title = title
                break

            # Exact or fuzzy title match
            score = string_similarity(pdf_name_no_ext, title)
            if title.lower() in pdf_name_no_ext.lower() or pdf_name_no_ext.lower() in title.lower():
                score = max(score, 0.85)

            if score > highest_score and score >= 0.55:
                highest_score = score
                best_match_id = b_id
                best_match_title = title

        if best_match_id:
            clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', best_match_title).strip()
            clean_title = re.sub(r'\s+', '_', clean_title)
            dest_filename = f"{best_match_id}_{clean_title}.pdf"
            
            src_path = os.path.join(input_dir, pdf_file)
            dest_path = os.path.join(dest_dir, dest_filename)

            shutil.copy2(src_path, dest_path)
            book_pdf_map[best_match_id] = f"/buku_digital/{dest_filename}"
            matched_count += 1
            print(f"[MATCHED] [{matched_count}] '{pdf_file}' -> '{best_match_title}' ({best_match_id})")
        else:
            print(f"[SKIP] Tidak menemukan pasangan katalog untuk: '{pdf_file}'")

    if book_pdf_map:
        def update_pdf_url(match):
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

        updated_content = re.sub(r'\{\s*"id":\s*"[^"]+".*?\}', update_pdf_url, content, flags=re.DOTALL)
        with open(books_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        print(f"\n[SUKSES] Berhasil mengimpor {matched_count} PDF asli & memperbarui katalog secara massal!")

if __name__ == '__main__':
    bulk_import()
