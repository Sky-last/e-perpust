import os
import json
import re
import sys
from typing import Dict, List, Any

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False

class CatalogPdfAuditor:
    """
    Senior Backend Utility for PDF Asset Integrity & Catalog Synchronization Audit
    """
    def __init__(self, root_dir: str):
        self.root_dir = root_dir
        self.books_file = os.path.join(root_dir, 'src', 'data', 'books.tsx')
        self.assets_pdf_dir = os.path.join(root_dir, 'assets', 'buku digital')
        self.public_pdf_dir = os.path.join(root_dir, 'public', 'buku_digital')

    def load_catalog(self) -> List[Dict[str, Any]]:
        """Extract INITIAL_BOOKS dataset from books.tsx"""
        if not os.path.exists(self.books_file):
            raise FileNotFoundError(f"Books file not found at {self.books_file}")

        with open(self.books_file, 'r', encoding='utf-8') as f:
            content = f.read()

        match = re.search(r'export const INITIAL_BOOKS: Book\[\] = (\[.*\]);', content, re.DOTALL)
        if not match:
            raise ValueError("Could not parse INITIAL_BOOKS from books.tsx")

        return json.loads(match.group(1))

    def validate_pdf_file(self, filepath: str) -> Dict[str, Any]:
        """Validate if PDF exists, is non-empty, has valid header, and can be read by pypdf"""
        if not os.path.exists(filepath):
            return {"valid": False, "reason": "MISSING_PDF", "pages": 0, "sample_text": ""}

        file_size = os.path.getsize(filepath)
        if file_size < 1000:
            return {"valid": False, "reason": "CORRUPTED_EMPTY_FILE", "pages": 0, "sample_text": ""}

        # Check binary magic header %PDF-
        with open(filepath, 'rb') as f:
            header = f.read(5)
            if header != b'%PDF-':
                return {"valid": False, "reason": "INVALID_PDF_HEADER", "pages": 0, "sample_text": ""}

        if not PYPDF_AVAILABLE:
            # Basic validation if pypdf is unavailable
            return {"valid": True, "reason": "VALID_HEADER_ONLY", "pages": 1, "sample_text": "pypdf not installed"}

        try:
            reader = pypdf.PdfReader(filepath)
            num_pages = len(reader.pages)
            if num_pages == 0:
                return {"valid": False, "reason": "ZERO_PAGES", "pages": 0, "sample_text": ""}

            first_page_text = reader.pages[0].extract_text() or ""
            return {
                "valid": True,
                "reason": "OK",
                "pages": num_pages,
                "file_size_kb": round(file_size / 1024, 2),
                "sample_text": first_page_text[:150].replace('\n', ' ').strip()
            }
        except Exception as e:
            return {"valid": False, "reason": f"UNREADABLE_PDF_STREAM: {str(e)}", "pages": 0, "sample_text": ""}

    def run_audit(self) -> Dict[str, Any]:
        catalog_books = self.load_catalog()
        catalog_pdf_filenames = set()

        audit_summary = {
            "total_catalog_books": len(catalog_books),
            "match_valid": [],
            "missing_pdf": [],
            "corrupted_unreadable": [],
            "orphan_pdf": []
        }

        # 1. Audit Catalog Entries
        for book in catalog_books:
            b_id = book.get('id')
            title = book.get('title')
            pdf_url = book.get('pdfUrl', '')
            filename = os.path.basename(pdf_url)
            catalog_pdf_filenames.add(filename.lower())

            # Check public path
            public_path = os.path.join(self.public_pdf_dir, filename)
            assets_path = os.path.join(self.assets_pdf_dir, filename)

            target_path = public_path if os.path.exists(public_path) else assets_path
            validation = self.validate_pdf_file(target_path)

            record = {
                "id": b_id,
                "title": title,
                "author": book.get('author'),
                "pdf_filename": filename,
                "target_path": target_path,
                "file_size_kb": validation.get("file_size_kb", 0),
                "pages": validation.get("pages", 0),
                "details": validation.get("reason"),
                "sample_text": validation.get("sample_text", "")
            }

            if not os.path.exists(target_path):
                audit_summary["missing_pdf"].append(record)
            elif not validation["valid"]:
                audit_summary["corrupted_unreadable"].append(record)
            else:
                audit_summary["match_valid"].append(record)

        # 2. Check Orphan Files in Assets & Public
        for check_dir in [self.public_pdf_dir, self.assets_pdf_dir]:
            if not os.path.exists(check_dir):
                continue
            for f in os.listdir(check_dir):
                if f.endswith('.pdf'):
                    if f.lower() not in catalog_pdf_filenames and not any(r['pdf_filename'].lower() == f.lower() for r in audit_summary["orphan_pdf"]):
                        file_p = os.path.join(check_dir, f)
                        audit_summary["orphan_pdf"].append({
                            "pdf_filename": f,
                            "filepath": file_p,
                            "file_size_kb": round(os.path.getsize(file_p) / 1024, 2)
                        })

        return audit_summary

def print_audit_report(summary: Dict[str, Any]):
    print("\n" + "="*85)
    print("REPORT AUDIT KATALOG & ASSET FILE PDF PERPUSTAKAAN DIGITAL")
    print("="*85)
    print(f"Total Buku di Katalog  : {summary['total_catalog_books']}")
    print(f"[VALID/MATCH]          : {len(summary['match_valid'])}")
    print(f"[MISSING PDF]          : {len(summary['missing_pdf'])}")
    print(f"[CORRUPTED/UNREADABLE] : {len(summary['corrupted_unreadable'])}")
    print(f"[ORPHAN PDF]           : {len(summary['orphan_pdf'])}")
    print("="*85 + "\n")

    if summary['match_valid']:
        print("--- DAFTAR BUKU VALID & MATCH (SAMPLE 10 ENTRIES) ---")
        for b in summary['match_valid'][:10]:
            print(f"  * [{b['id']}] {b['title'][:35]:<35} | {b['pages']} Hal | {b['file_size_kb']} KB | Path: {os.path.basename(b['target_path'])}")
        if len(summary['match_valid']) > 10:
            print(f"  ... dan {len(summary['match_valid']) - 10} buku valid lainnya.")

    if summary['missing_pdf']:
        print("\n--- DAFTAR BUKU MISSING PDF ---")
        for b in summary['missing_pdf']:
            print(f"  * [{b['id']}] {b['title']} -> File tidak ada: {b['pdf_filename']}")

    if summary['corrupted_unreadable']:
        print("\n--- DAFTAR BUKU CORRUPTED / UNREADABLE ---")
        for b in summary['corrupted_unreadable']:
            print(f"  * [{b['id']}] {b['title']} -> Reason: {b['details']}")

    if summary['orphan_pdf']:
        print("\n--- DAFTAR ORPHAN PDF (ADA DI DISK, TIDAK ADA DI KATALOG) ---")
        for o in summary['orphan_pdf'][:10]:
            print(f"  * {o['pdf_filename']} ({o['file_size_kb']} KB)")

    print("\n" + "="*85)

if __name__ == '__main__':
    root_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    auditor = CatalogPdfAuditor(root_directory)
    report = auditor.run_audit()
    print_audit_report(report)

    # Save output to JSON artifact
    output_path = os.path.join(root_directory, 'scripts', 'audit_report_output.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"\n[OK] Audit log report generated successfully at: {output_path}")
