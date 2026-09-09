"""
Script untuk mengecek PDF yang tidak punya cover
"""

from pathlib import Path

# Setup paths
script_dir = Path(__file__).parent
project_dir = script_dir.parent
pdf_dir = project_dir / 'public' / 'buku_digital'
cover_dir = project_dir / 'public' / 'buku_sampul'

# Get all PDFs
pdf_files = list(pdf_dir.glob('*.pdf'))
print(f"📚 Total PDF: {len(pdf_files)}")

# Get all covers
cover_files = {f.name for f in cover_dir.glob('*.jpg')}
print(f"🎨 Total Cover: {len(cover_files)}")
print()

# Check missing covers
missing_covers = []
for pdf in pdf_files:
    expected_cover = f"cover_{pdf.stem}.jpg"
    if expected_cover not in cover_files:
        missing_covers.append(pdf.name)
        # Check file size
        size_mb = pdf.stat().st_size / (1024 * 1024)
        print(f"❌ {pdf.name} ({size_mb:.2f} MB)")

print()
print("=" * 60)
if len(missing_covers) == 0:
    print("✅ Semua PDF punya cover!")
else:
    print(f"⚠️  {len(missing_covers)} PDF tidak punya cover")
    print()
    print("💡 Jalankan script ini untuk generate cover yang hilang:")
    print("   python scripts/generate_covers_portable.py")
print("=" * 60)
