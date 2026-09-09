"""
Script untuk generate cover untuk 1 file PDF spesifik
"""

from pathlib import Path

try:
    from pdf2image import convert_from_path
    from PIL import Image
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False
    print("❌ Dependencies tidak lengkap. Install dengan:")
    print("   pip install pdf2image Pillow")
    exit(1)

# Setup paths
script_dir = Path(__file__).parent
project_dir = script_dir.parent
pdf_dir = project_dir / 'public' / 'buku_digital'
cover_dir = project_dir / 'public' / 'buku_sampul'
poppler_dir = project_dir / '.poppler'

# Find poppler
possible_paths = [
    poppler_dir / "poppler-24.08.0" / "Library" / "bin",
    poppler_dir / "Library" / "bin",
    poppler_dir / "bin"
]

poppler_path = None
for path in possible_paths:
    if path.exists() and (path / "pdfinfo.exe").exists():
        poppler_path = str(path)
        break

if not poppler_path:
    print("⚠️  Poppler portable tidak ditemukan di .poppler/")
    print("💡 Akan mencoba tanpa poppler_path (gunakan system PATH)")

# Target file
pdf_file = pdf_dir / "Tere_Liye_-_Matahari.pdf.pdf"

if not pdf_file.exists():
    print(f"❌ File tidak ditemukan: {pdf_file}")
    exit(1)

cover_filename = f"cover_{pdf_file.stem}.jpg"
cover_path = cover_dir / cover_filename

print(f"📄 PDF: {pdf_file.name}")
print(f"🎨 Cover: {cover_filename}")
print()

try:
    print("🔄 Generating cover...")
    
    # Convert
    images = convert_from_path(
        str(pdf_file),
        first_page=1,
        last_page=1,
        dpi=200,
        fmt='jpeg',
        thread_count=2,
        poppler_path=poppler_path,
        timeout=30
    )
    
    if not images:
        print("❌ Tidak ada gambar yang dihasilkan")
        exit(1)
    
    # Resize if needed
    image = images[0]
    max_width = 1200
    if image.width > max_width:
        ratio = max_width / image.width
        new_height = int(image.height * ratio)
        image = image.resize((max_width, new_height), Image.LANCZOS)
    
    # Save
    image.save(cover_path, 'JPEG', quality=90, optimize=True)
    
    print(f"✅ Berhasil: {cover_filename}")
    print(f"📁 Lokasi: {cover_path}")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    exit(1)
