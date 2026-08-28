import os
import re
import json
import pypdf
import urllib.parse

books_path = os.path.join('src', 'data', 'books.tsx')
with open(books_path, 'r', encoding='utf-8') as f:
    content = f.read()

blocks = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)".*?\}', content, re.DOTALL)
books = []
for b_id, b_title in blocks:
    chunk_search = re.search(rf'"id":\s*"{b_id}".*?"pdfUrl":\s*"([^"]+)"', content, re.DOTALL)
    pdf_url = chunk_search.group(1) if chunk_search else None
    books.append({'id': b_id, 'title': b_title, 'pdfUrl': pdf_url})

pdf_resolver_path = os.path.join('src', 'utils', 'pdfResolver.ts')
pdf_map = {}
if os.path.exists(pdf_resolver_path):
    with open(pdf_resolver_path, 'r', encoding='utf-8') as f:
        pdf_res_content = f.read()
    for m in re.finditer(r'[\'"]([^\'"]+)[\'"]:\s*[\'"]([^\'"]+)[\'"]', pdf_res_content):
        pdf_map[m.group(1)] = m.group(2)

results = []

for b in books:
    b_id = b.get('id')
    title = b.get('title')
    
    pdf_rel_path = pdf_map.get(b_id) or b.get('pdfUrl')
    if not pdf_rel_path:
        clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip()
        clean_title = re.sub(r'\s+', '_', clean_title)
        pdf_rel_path = f"/buku_digital/{b_id}_{clean_title}.pdf"
    
    pdf_filename = pdf_rel_path.replace('/buku_digital/', '')
    pdf_filename_decoded = urllib.parse.unquote(pdf_filename)
    pdf_full_path = os.path.join('public', 'buku_digital', pdf_filename_decoded)
    
    status = "UNKNOWN"
    extracted_text_sample = ""
    match_quality = "MISMATCH"
    pdf_pages = 0
    file_size = 0
    pdf_title_meta = ""
    match_reason = ""
    detected_real_content = "Unknown"
    
    if os.path.exists(pdf_full_path):
        file_size = os.path.getsize(pdf_full_path)
        try:
            reader = pypdf.PdfReader(pdf_full_path)
            pdf_pages = len(reader.pages)
            
            if reader.metadata and reader.metadata.title:
                pdf_title_meta = str(reader.metadata.title)
                
            text = ""
            for i in range(min(5, pdf_pages)):
                page_text = reader.pages[i].extract_text() or ""
                text += page_text + " "
            
            extracted_text_sample = text[:500].replace('\n', ' ')
            
            # INSIDE CONTENT ONLY (Metadata title + actual extracted page text)
            inside_content = (pdf_title_meta + " " + extracted_text_sample).lower()
            
            # Detect what template/real book this PDF content actually belongs to:
            if "berani jadi software engineer" in inside_content or "mulia rahmad" in inside_content:
                detected_real_content = "Berani Jadi Software Engineer"
            elif "little duke" in inside_content or "richard the fearless" in inside_content:
                detected_real_content = "The Little Duke / Richard the Fearless"
            elif "mistress wilding" in inside_content:
                detected_real_content = "Mistress Wilding"
            elif "advice for the muslim" in inside_content:
                detected_real_content = "Advice for the Muslim"
            elif "scratch" in inside_content or "coding projects in scratch" in inside_content:
                detected_real_content = "Coding Projects in Scratch"
            elif "documents of the right word" in inside_content:
                detected_real_content = "Documents of the Right Word"
            elif "islam and christianity" in inside_content:
                detected_real_content = "Islam and Christianity"
            elif "puisi" in inside_content or "kajian puisi" in inside_content:
                detected_real_content = "Kajian Puisi Indonesia Modern"
            elif "konspirasi alam semesta" in inside_content or "fiersa besari" in inside_content:
                detected_real_content = "Konspirasi Alam Semesta"
            elif "ujung tanduk" in inside_content or "negeri di ujung tanduk" in inside_content:
                detected_real_content = "Negeri di Ujung Tanduk"
            elif "prosiding sosiologi" in inside_content or "politik identitas" in inside_content:
                detected_real_content = "Prosiding Sosiologi: Konflik dan Politik Identitas"
            elif "geografi agraria" in inside_content:
                detected_real_content = "Sejarah Geografi Agraria Indonesia"
            elif "suara dari kelas kecil" in inside_content or "antikorupsi" in inside_content:
                detected_real_content = "Suara dari Kelas Kecil"
            elif "bulan" in inside_content and "tere liye" in inside_content:
                detected_real_content = "Bulan (Tere Liye)"
            elif "tentang kamu" in inside_content and "tere liye" in inside_content:
                detected_real_content = "Tentang Kamu (Tere Liye)"
            elif "matahari" in inside_content and "tere liye" in inside_content:
                detected_real_content = "Matahari (Tere Liye)"
            elif "keto" in inside_content:
                detected_real_content = "The Deliciously Keto Cookbook"
            elif "forensics" in inside_content or "cyber investigation" in inside_content:
                detected_real_content = "Computer Forensics and Cyber Investigation"
            elif "laskar pelangi" in inside_content:
                detected_real_content = "Laskar Pelangi"
            elif "bumi manusia" in inside_content:
                detected_real_content = "Bumi Manusia"
            elif "javanese princess" in inside_content or "kartini" in inside_content:
                detected_real_content = "Letters of a Javanese Princess"
            elif "max havelaar" in inside_content or "multatuli" in inside_content:
                detected_real_content = "Max Havelaar"
            elif "lord jim" in inside_content:
                detected_real_content = "Lord Jim"
            elif "hidden force" in inside_content:
                detected_real_content = "The Hidden Force"
            elif "history of java" in inside_content:
                detected_real_content = "The History of Java"
            elif "history of sumatra" in inside_content:
                detected_real_content = "The History of Sumatra"
            elif "monumental java" in inside_content:
                detected_real_content = "Monumental Java"
            elif "blown to bits" in inside_content or "rakata" in inside_content:
                detected_real_content = "Blown to Bits"
            elif "facts and fancies" in inside_content:
                detected_real_content = "Java Facts and Fancies"
            elif "archipelago" in inside_content or "bickmore" in inside_content:
                detected_real_content = "Travels in the East Indian Archipelago"
            else:
                detected_real_content = "Other/Unknown Text"

            # Check keyword match against title
            title_words = [w.lower() for w in re.findall(r'[a-zA-Z0-9]+', title) if len(w) > 3]
            matched_words = [w for w in title_words if w in inside_content]
            
            if len(title_words) > 0 and len(matched_words) / len(title_words) >= 0.5:
                match_quality = "MATCH"
                match_reason = f"Inside text matches title keywords: {matched_words}"
            elif len(matched_words) > 0:
                match_quality = "PARTIAL_MATCH"
                match_reason = f"Inside text matches some keywords: {matched_words}"
            else:
                match_quality = "TEMPLATE_COPY (MISMATCH)"
                match_reason = f"Inside text is actually '{detected_real_content}', does not match book title '{title}'"
                
            status = "EXISTS"
        except Exception as e:
            status = f"ERROR: {str(e)}"
    else:
        status = "FILE_MISSING"
        match_quality = "MISSING_FILE"
        match_reason = f"File not found"
        
    results.append({
        'id': b_id,
        'title': title,
        'pdf_path': pdf_rel_path,
        'actual_file': pdf_filename_decoded,
        'file_exists': status == "EXISTS",
        'file_size_bytes': file_size,
        'pages': pdf_pages,
        'match_quality': match_quality,
        'detected_real_content': detected_real_content,
        'match_reason': match_reason,
        'pdf_title_meta': pdf_title_meta,
        'sample_text': extracted_text_sample[:150]
    })

report_path = os.path.join('scripts', 'pdf_check_report.json')
with open(report_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

total = len(results)
exists = sum(1 for r in results if r['file_exists'])
accurate = sum(1 for r in results if r['match_quality'] == 'MATCH')
partial = sum(1 for r in results if r['match_quality'] == 'PARTIAL_MATCH')
templates = sum(1 for r in results if r['match_quality'] == 'TEMPLATE_COPY (MISMATCH)')
missing = sum(1 for r in results if r['match_quality'] == 'MISSING_FILE')

print("=== INSIDE CONTENT VERIFICATION SUMMARY ===")
print(f"Total Books in Catalog     : {total}")
print(f"PDF Files Found            : {exists}")
print(f"Content Matches Title      : {accurate}")
print(f"Partial Content Match      : {partial}")
print(f"Template Copy (Mismatch)   : {templates}")
print(f"Missing PDF Files          : {missing}")

# Group template distribution
template_dist = {}
for r in results:
    if r['match_quality'] == 'TEMPLATE_COPY (MISMATCH)':
        c = r['detected_real_content']
        template_dist[c] = template_dist.get(c, 0) + 1

print("\nTemplate Distribution among Mismatched Books:")
for k, v in sorted(template_dist.items(), key=lambda x: x[1], reverse=True):
    print(f"  - {k}: {v} books")
