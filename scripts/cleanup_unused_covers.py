"""
Script untuk membersihkan cover yang tidak terpakai
(cover yang tidak punya PDF pasangannya)
"""

from pathlib import Path

# Setup paths
script_dir = Path(__file__).parent
project_dir = script_dir.parent
pdf_dir = project_dir / 'public' / 'buku_digital'
cover_dir = project_dir / 'public' / 'buku_sampul'

print("🔍 Scanning files...")
print()

# Get all PDFs
pdf_files = list(pdf_dir.glob('*.pdf'))
pdf_stems = {f.stem for f in pdf_files}

print(f"📚 Total PDF: {len(pdf_files)}")

# Get all covers
cover_files = list(cover_dir.glob('*.jpg'))
print(f"🎨 Total Cover: {len(cover_files)}")
print()

# Find unused covers
unused_covers = []
for cover in cover_files:
    # Expected PDF name from cover
    # Format: cover_NamaPDF.jpg -> NamaPDF.pdf
    if cover.name.startswith('cover_'):
        pdf_name = cover.name[6:-4]  # Remove 'cover_' prefix and '.jpg' suffix
        
        if pdf_name not in pdf_stems:
            unused_covers.append(cover)

if len(unused_covers) == 0:
    print("✅ Tidak ada cover yang tidak terpakai!")
else:
    print(f"⚠️  Ditemukan {len(unused_covers)} cover tidak terpakai:")
    print("=" * 70)
    
    # Group by size for easy review
    small_covers = []
    normal_covers = []
    
    for cover in unused_covers[:20]:  # Show first 20
        size_kb = cover.stat().st_size / 1024
        if size_kb < 10:
            small_covers.append((cover.name, size_kb))
        else:
            normal_covers.append((cover.name, size_kb))
        print(f"  {cover.name} ({size_kb:.1f} KB)")
    
    if len(unused_covers) > 20:
        print(f"  ... dan {len(unused_covers) - 20} lainnya")
    
    print()
    print("=" * 70)
    print()
    
    # Calculate space
    total_size_mb = sum(c.stat().st_size for c in unused_covers) / (1024 * 1024)
    print(f"💾 Total ukuran: {total_size_mb:.2f} MB")
    print()
    
    # Ask confirmation
    print("❓ Apakah Anda ingin menghapus cover yang tidak terpakai?")
    print("   Ketik 'yes' untuk menghapus, atau tekan Enter untuk batal")
    response = input("> ").strip().lower()
    
    if response == 'yes':
        print()
        print("🗑️  Menghapus cover yang tidak terpakai...")
        deleted = 0
        for cover in unused_covers:
            try:
                cover.unlink()
                deleted += 1
            except Exception as e:
                print(f"   ❌ Gagal hapus {cover.name}: {e}")
        
        print(f"✅ Berhasil menghapus {deleted} cover")
        print(f"💾 Space yang dibebaskan: {total_size_mb:.2f} MB")
        
        # Verify
        remaining = len(list(cover_dir.glob('*.jpg')))
        print()
        print(f"📊 Cover tersisa: {remaining}")
        print(f"📚 PDF total: {len(pdf_files)}")
        
        if remaining == len(pdf_files):
            print("✅ Perfect! Sekarang 1 PDF = 1 Cover")
        elif remaining > len(pdf_files):
            print(f"⚠️  Masih ada {remaining - len(pdf_files)} cover ekstra")
    else:
        print("❌ Dibatalkan. Tidak ada file yang dihapus.")

print()
print("=" * 70)
print("✨ Selesai!")
