import os
import shutil
import re
from difflib import SequenceMatcher

user_profile = os.environ.get('USERPROFILE', 'C:\\Users\\ACER')
search_dirs = [
    os.path.join(user_profile, 'Downloads'),
    os.path.join(user_profile, 'Documents'),
    os.path.join(user_profile, 'Desktop'),
    os.path.join(os.getcwd(), 'input_pdfs'),
]

dest_dir = os.path.join(os.getcwd(), 'public', 'buku_digital')
books_path = os.path.join(os.getcwd(), 'src', 'data', 'books.tsx')

os.makedirs(dest_dir, exist_ok=True)

def string_similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def auto_scan():
    print("=========================================================")
    print("MENCARI FILE PDF BUKU ASLI DI KOMPUTER ANDA")
    print("=========================================================")
    
    found_pdfs = []
    for s_dir in search_dirs:
        if os.path.exists(s_dir):
            try:
                for root, dirs, files in os.walk(s_dir):
                    # Don't recurse too deep
                    if root.count(os.sep) - s_dir.count(os.sep) > 2:
                        continue
                    for f in files:
                        if f.endswith('.pdf') and not f.startswith('~$'):
                            found_pdfs.append(os.path.join(root, f))
            except Exception as e:
                pass

    print(f"Ditemukan {len(found_pdfs)} file PDF di folder Downloads / Documents / Desktop / input_pdfs.")

    if not found_pdfs:
        print("\nPetunjuk:")
        print("Silakan taruh/pindahkan file PDF novel asli milik Anda ke folder:")
        print(f"  {os.path.join(os.getcwd(), 'input_pdfs')}")
        print("Lalu jalankan skrip ini kembali.")
        return

    with open(books_path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)".*?\}', content, re.DOTALL)
    
    matched_count = 0
    book_pdf_map = {}

    for pdf_path in found_pdfs:
        pdf_file = os.path.basename(pdf_path)
        pdf_name_no_ext = os.path.splitext(pdf_file)[0]
        
        # Skip generated default PDFs if any
        if 'buku_digital' in pdf_path and ('eb-' in pdf_file or 'gut-' in pdf_file):
            continue

        best_match_id = None
        best_match_title = None
        highest_score = 0.0

        for b_id, title in blocks:
            if pdf_name_no_ext.lower() == b_id.lower():
                highest_score = 1.0
                best_match_id = b_id
                best_match_title = title
                break

            score = string_similarity(pdf_name_no_ext, title)
            if title.lower() in pdf_name_no_ext.lower() or pdf_name_no_ext.lower() in title.lower():
                score = max(score, 0.85)

            if score > highest_score and score >= 0.50:
                highest_score = score
                best_match_id = b_id
                best_match_title = title

        if best_match_id and highest_score >= 0.50:
            clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', best_match_title).strip()
            clean_title = re.sub(r'\s+', '_', clean_title)
            dest_filename = f"{best_match_id}_{clean_title}.pdf"
            dest_path = os.path.join(dest_dir, dest_filename)

            try:
                shutil.copy2(pdf_path, dest_path)
                book_pdf_map[best_match_id] = f"/buku_digital/{dest_filename}"
                matched_count += 1
                print(f"[TERHUBUNG] '{pdf_file}' -> Buku '{best_match_title}' ({best_match_id})")
            except Exception as e:
                print(f"[GAGAL] Tidak bisa menyalin {pdf_file}: {e}")

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

        updated_content = re.sub(r'\{\s*"id":\s*"([^"]+".*?)\}', update_pdf_url, content, flags=re.DOTALL)
        with open(books_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        print(f"\n[SUKSES] Berhasil menghubungkan {matched_count} PDF asli dari komputer Anda ke katalog perpustakaan!")
    else:
        print("\nBelum ada nama file PDF di Downloads/Documents yang cocok otomatis dengan judul buku di katalog.")
        print("Silakan taruh file PDF novel Anda di folder `input_pdfs` di folder proyek, atau sebutkan lokasi filenya!")

if __name__ == '__main__':
    auto_scan()
