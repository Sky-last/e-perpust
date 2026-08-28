import os
import re

books_path = os.path.join('src', 'data', 'books.tsx')
with open(books_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Load mapping from pdfResolver.ts
pdf_resolver_path = os.path.join('src', 'utils', 'pdfResolver.ts')
with open(pdf_resolver_path, 'r', encoding='utf-8') as f:
    pdf_res_content = f.read()

pdf_map = {}
for m in re.finditer(r'[\'"]([^\'"]+)[\'"]:\s*[\'"]([^\'"]+)[\'"]', pdf_res_content):
    pdf_map[m.group(1)] = m.group(2)

print(f"Loaded {len(pdf_map)} mappings from pdfResolver.ts")

# Replace pdfUrl in each book object in books.tsx
def replace_pdf_url(match):
    full_block = match.group(0)
    b_id_match = re.search(r'"id":\s*"([^"]+)"', full_block)
    if b_id_match:
        b_id = b_id_match.group(1)
        if b_id in pdf_map:
            new_url = pdf_map[b_id]
            # Replace or insert pdfUrl
            if '"pdfUrl":' in full_block:
                full_block = re.sub(r'"pdfUrl":\s*"[^"]+"', f'"pdfUrl": "{new_url}"', full_block)
            else:
                # insert before closing brace
                full_block = re.sub(r'(\s*\})', f',\n    "pdfUrl": "{new_url}"\1', full_block)
    return full_block

# Match each book object
updated_content = re.sub(r'\{\s*"id":\s*"[^"]+".*?\}', replace_pdf_url, content, flags=re.DOTALL)

with open(books_path, 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Successfully updated books.tsx with new pdfUrl values!")
