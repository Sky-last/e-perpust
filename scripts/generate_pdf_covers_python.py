"""
Script Python untuk mengekstrak cover (halaman pertama) dari file PDF
dan menyimpannya sebagai gambar JPG di folder public/buku_sampul

Cara install dependencies:
    pip install PyPDF2 Pillow pdf2image

Cara menjalankan:
    python scripts/generate_pdf_covers_python.py

Note: Untuk pdf2image, di Windows perlu install poppler:
    1. Download dari: https://github.com/oschwartz10612/poppler-windows/releases/
    2. Extract dan tambahkan bin/ ke PATH
"""

import os
import sys
from pathlib import Path
from typing import Optional

try:
    from pdf2image import convert_from_path
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False
    print("⚠️  pdf2image tidak terinstall. Install dengan: pip install pdf2image")

try:
    from PIL import Image
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False
    print("⚠️  Pillow tidak terinstall. Install dengan: pip install Pillow")


def generate_cover(pdf_path: Path, output_path: Path, verbose: bool = True) -> tuple[bool, str]:
    """Ekstrak halaman pertama PDF sebagai gambar JPG"""
    if not PDF2IMAGE_AVAILABLE:
        msg = "pdf2image tidak tersedia"
        if verbose:
            print(f"   ❌ Gagal: {msg}")
        return False, msg
    
    try:
        # Cek apakah file PDF valid dan bisa dibaca
        if not pdf_path.exists():
            msg = "File tidak ditemukan"
            if verbose:
                print(f"   ❌ Error: {msg}")
            return False, msg
        
        if pdf_path.stat().st_size == 0:
            msg = "File PDF kosong (0 bytes)"
            if verbose:
                print(f"   ❌ Error: {msg}")
            return False, msg
        
        # Konversi hanya halaman pertama PDF ke gambar
        # Tambahkan timeout untuk file yang terlalu besar atau bermasalah
        images = convert_from_path(
            str(pdf_path),
            first_page=1,
            last_page=1,
            dpi=200,  # Turunkan DPI untuk proses lebih cepat
            fmt='jpeg',
            thread_count=2,
            use_pdftocairo=False,  # Gunakan pdftoppm (lebih kompatibel)
            timeout=30  # Timeout 30 detik
        )
        
        if not images:
            msg = "Tidak ada gambar yang dihasilkan"
            if verbose:
                print(f"   ❌ Error: {msg}")
            return False, msg
        
        # Simpan gambar pertama
        image = images[0]
        
        # Resize jika terlalu besar (max 1200px width)
        max_width = 1200
        if image.width > max_width:
            ratio = max_width / image.width
            new_height = int(image.height * ratio)
            image = image.resize((max_width, new_height), Image.LANCZOS)
        
        # Simpan sebagai JPEG dengan kualitas tinggi
        image.save(output_path, 'JPEG', quality=90, optimize=True)
        
        return True, "Success"
        
    except FileNotFoundError as e:
        msg = f"File tidak ditemukan: {str(e)}"
        if verbose:
            print(f"   ❌ Error: {msg}")
        return False, msg
    except PermissionError as e:
        msg = f"Permission error: {str(e)}"
        if verbose:
            print(f"   ❌ Error: {msg}")
        return False, msg
    except Exception as e:
        msg = str(e)
        if verbose:
            print(f"   ❌ Error: {msg}")
        return False, msg


def main():
    # Setup paths
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    pdf_dir = project_dir / 'public' / 'buku_digital'
    cover_dir = project_dir / 'public' / 'buku_sampul'
    
    # Pastikan folder cover ada
    cover_dir.mkdir(parents=True, exist_ok=True)
    print('✅ Folder buku_sampul siap\n')
    
    # Cek dependencies
    if not PDF2IMAGE_AVAILABLE or not PILLOW_AVAILABLE:
        print("\n❌ Dependencies tidak lengkap. Install dengan:")
        print("   pip install pdf2image Pillow\n")
        return
    
    print('🚀 Memulai ekstraksi cover dari PDF...\n')
    
    # Test poppler
    print('🔍 Mengecek Poppler installation...')
    try:
        from pdf2image.exceptions import PDFInfoNotInstalledError
        # Try a simple test
        test_pdf = list(pdf_dir.glob('*.pdf'))[0] if list(pdf_dir.glob('*.pdf')) else None
        if test_pdf:
            # Just check if we can get info
            from pdf2image import pdfinfo_from_path
            info = pdfinfo_from_path(test_pdf, userpw=None, poppler_path=None)
            print(f'   ✅ Poppler terdeteksi! (PDF pages: {info.get("Pages", "unknown")})\n')
    except Exception as e:
        error_msg = str(e).lower()
        if 'poppler' in error_msg or 'pdfinfo' in error_msg:
            print('\n' + '=' * 60)
            print('❌ POPPLER TIDAK DITEMUKAN!')
            print('=' * 60)
            print('\n📥 Install Poppler terlebih dahulu:\n')
            print('Windows:')
            print('  1. Download: https://github.com/oschwartz10612/poppler-windows/releases/')
            print('  2. Extract ke C:\\poppler')
            print('  3. Tambahkan C:\\poppler\\Library\\bin ke PATH')
            print('  4. Restart terminal\n')
            print('Linux:')
            print('  sudo apt-get install poppler-utils\n')
            print('Mac:')
            print('  brew install poppler\n')
            print('Setelah install, jalankan script ini lagi.')
            print('=' * 60)
            return
        else:
            print(f'   ⚠️  Warning: {str(e)}\n')
    
    # Baca semua file PDF
    pdf_files = sorted(pdf_dir.glob('*.pdf'))
    
    if not pdf_files:
        print('❌ Tidak ada file PDF ditemukan di public/buku_digital/')
        return
    
    print(f'📚 Ditemukan {len(pdf_files)} file PDF\n')
    
    success_count = 0
    skip_count = 0
    error_count = 0
    error_details = {}
    
    for idx, pdf_file in enumerate(pdf_files, 1):
        pdf_name = pdf_file.name
        cover_filename = f"cover_{pdf_name.replace('.pdf', '.jpg')}"
        cover_path = cover_dir / cover_filename
        
        # Skip jika cover sudah ada
        if cover_path.exists():
            print(f"[{idx}/{len(pdf_files)}] ⏭️  Skip: {pdf_name} (cover sudah ada)")
            skip_count += 1
            continue
        
        print(f"[{idx}/{len(pdf_files)}] 🔄 Proses: {pdf_name}...")
        
        success, error_msg = generate_cover(pdf_file, cover_path, verbose=False)
        
        if success:
            print(f"   ✅ Berhasil: {cover_filename}")
            success_count += 1
        else:
            print(f"   ❌ Gagal: {error_msg}")
            error_count += 1
            # Catat jenis error
            error_type = error_msg.split(':')[0] if ':' in error_msg else error_msg
            error_details[error_type] = error_details.get(error_type, 0) + 1
    
    # Summary
    print('\n' + '=' * 60)
    print('📊 RINGKASAN:')
    print(f'   ✅ Berhasil: {success_count}')
    print(f'   ⏭️  Dilewati: {skip_count}')
    print(f'   ❌ Gagal: {error_count}')
    print(f'   📚 Total: {len(pdf_files)}')
    print('=' * 60)
    
    if error_count > 0:
        print('\n📋 RINCIAN ERROR:')
        for error_type, count in sorted(error_details.items(), key=lambda x: -x[1]):
            print(f'   • {error_type}: {count} file(s)')
        
        print('\n💡 TIPS TROUBLESHOOTING:')
        print('   1. Pastikan Poppler sudah terinstall dengan benar')
        print('   2. Coba jalankan di terminal: pdfinfo -v')
        print('   3. Pastikan file PDF tidak corrupt atau password-protected')
        print('   4. Coba proses 1 file dulu untuk debug: python -c "from pdf2image import convert_from_path; convert_from_path(\'path/to/file.pdf\', first_page=1, last_page=1)"')
        print('\n   Dokumentasi: https://github.com/Belval/pdf2image')
    
    if success_count > 0:
        print(f'\n✨ {success_count} cover berhasil di-generate!')
        print('   Refresh aplikasi untuk melihat cover baru.')



if __name__ == '__main__':
    main()
