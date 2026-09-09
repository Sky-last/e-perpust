"""
Script untuk generate cover PDF dengan Poppler portable (tanpa install ke PATH)
Script ini akan otomatis download Poppler jika belum ada.

Cara menjalankan:
    pip install pdf2image Pillow requests
    python scripts/generate_covers_portable.py
"""

import os
import sys
import zipfile
from pathlib import Path
from typing import Optional
import tempfile

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    print("⚠️  requests tidak terinstall. Install dengan: pip install requests")

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


def download_poppler(install_dir: Path) -> Optional[Path]:
    """Download dan extract Poppler untuk Windows"""
    if not REQUESTS_AVAILABLE:
        print("❌ Package 'requests' diperlukan untuk download Poppler")
        return None
    
    print("📥 Downloading Poppler (portable)...")
    
    # URL Poppler release terbaru
    poppler_url = "https://github.com/oschwartz10612/poppler-windows/releases/download/v24.08.0-0/Release-24.08.0-0.zip"
    
    try:
        # Download
        response = requests.get(poppler_url, stream=True)
        response.raise_for_status()
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as tmp_file:
            total_size = int(response.headers.get('content-length', 0))
            downloaded = 0
            
            for chunk in response.iter_content(chunk_size=8192):
                tmp_file.write(chunk)
                downloaded += len(chunk)
                if total_size > 0:
                    percent = (downloaded / total_size) * 100
                    print(f"\r   Progress: {percent:.1f}%", end='')
            
            print()  # New line
            tmp_path = tmp_file.name
        
        # Extract
        print("📦 Extracting Poppler...")
        install_dir.mkdir(parents=True, exist_ok=True)
        
        with zipfile.ZipFile(tmp_path, 'r') as zip_ref:
            zip_ref.extractall(install_dir)
        
        # Clean up
        os.unlink(tmp_path)
        
        # Find bin directory
        bin_dir = install_dir / "poppler-24.08.0" / "Library" / "bin"
        if not bin_dir.exists():
            # Try alternative structure
            bin_dir = install_dir / "Library" / "bin"
        
        if bin_dir.exists():
            print(f"✅ Poppler installed to: {bin_dir}")
            return bin_dir
        else:
            print("❌ Poppler bin directory not found after extraction")
            return None
            
    except Exception as e:
        print(f"❌ Error downloading Poppler: {e}")
        return None


def get_poppler_path() -> Optional[Path]:
    """Get or download Poppler path"""
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    poppler_dir = project_dir / ".poppler"
    
    # Check if already downloaded
    possible_paths = [
        poppler_dir / "poppler-24.08.0" / "Library" / "bin",
        poppler_dir / "Library" / "bin",
        poppler_dir / "bin"
    ]
    
    for path in possible_paths:
        if path.exists() and (path / "pdfinfo.exe").exists():
            print(f"✅ Menggunakan Poppler dari: {path}")
            return path
    
    # Download if not found
    print("⚠️  Poppler portable tidak ditemukan")
    print("🔄 Mencoba download otomatis...")
    
    return download_poppler(poppler_dir)


def generate_cover(pdf_path: Path, output_path: Path, poppler_path: Optional[Path]) -> tuple[bool, str]:
    """Ekstrak halaman pertama PDF sebagai gambar JPG"""
    if not PDF2IMAGE_AVAILABLE:
        return False, "pdf2image tidak tersedia"
    
    try:
        # Convert path to string
        poppler_path_str = str(poppler_path) if poppler_path else None
        
        # Konversi halaman pertama PDF ke gambar
        images = convert_from_path(
            str(pdf_path),
            first_page=1,
            last_page=1,
            dpi=200,
            fmt='jpeg',
            thread_count=2,
            poppler_path=poppler_path_str,  # Use portable poppler
            timeout=30
        )
        
        if not images:
            return False, "Tidak ada gambar yang dihasilkan"
        
        # Simpan gambar pertama
        image = images[0]
        
        # Resize jika terlalu besar
        max_width = 1200
        if image.width > max_width:
            ratio = max_width / image.width
            new_height = int(image.height * ratio)
            image = image.resize((max_width, new_height), Image.LANCZOS)
        
        # Simpan sebagai JPEG
        image.save(output_path, 'JPEG', quality=90, optimize=True)
        
        return True, "Success"
        
    except Exception as e:
        return False, str(e)


def main():
    # Check dependencies
    if not all([PDF2IMAGE_AVAILABLE, PILLOW_AVAILABLE]):
        print("\n❌ Dependencies tidak lengkap. Install dengan:")
        print("   pip install pdf2image Pillow requests\n")
        return
    
    # Setup paths
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    pdf_dir = project_dir / 'public' / 'buku_digital'
    cover_dir = project_dir / 'public' / 'buku_sampul'
    
    cover_dir.mkdir(parents=True, exist_ok=True)
    
    print('=' * 60)
    print('🚀 PDF Cover Generator (Portable Poppler)')
    print('=' * 60)
    print()
    
    # Get or download Poppler
    poppler_path = get_poppler_path()
    
    if not poppler_path:
        print("\n❌ Gagal mendapatkan Poppler.")
        print("💡 Alternatif: Install Poppler manual dan tambahkan ke PATH")
        print("   Download: https://github.com/oschwartz10612/poppler-windows/releases/")
        return
    
    print()
    
    # Get PDF files
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
        
        # Skip if cover exists
        if cover_path.exists():
            print(f"[{idx}/{len(pdf_files)}] ⏭️  Skip: {pdf_name}")
            skip_count += 1
            continue
        
        print(f"[{idx}/{len(pdf_files)}] 🔄 {pdf_name}...", end=' ')
        
        success, error_msg = generate_cover(pdf_file, cover_path, poppler_path)
        
        if success:
            print("✅")
            success_count += 1
        else:
            print(f"❌ ({error_msg[:50]}...)" if len(error_msg) > 50 else f"❌ ({error_msg})")
            error_count += 1
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
        print('\n📋 ERROR DETAILS:')
        for error_type, count in sorted(error_details.items(), key=lambda x: -x[1]):
            print(f'   • {error_type}: {count} file(s)')
    
    if success_count > 0:
        print(f'\n✨ {success_count} cover berhasil di-generate!')
        print('   📁 Lokasi: public/buku_sampul/')
        print('   🔄 Refresh aplikasi untuk melihat cover baru.')


if __name__ == '__main__':
    main()
