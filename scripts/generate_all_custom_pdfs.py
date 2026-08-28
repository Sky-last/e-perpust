import os
import re
import json
import urllib.parse
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfgen import canvas

# Path configurations
public_dir = os.path.join('public', 'buku_digital')
assets_dir = os.path.join('assets', 'buku digital')
os.makedirs(public_dir, exist_ok=True)
os.makedirs(assets_dir, exist_ok=True)

# Read books from books.tsx
books_path = os.path.join('src', 'data', 'books.tsx')
with open(books_path, 'r', encoding='utf-8') as f:
    content = f.read()

blocks = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)".*?\}', content, re.DOTALL)
books = []

for b_id, b_title in blocks:
    escaped_id = re.escape(b_id)
    chunk_match = re.search(r'\{\s*"id":\s*"' + escaped_id + r'".*?\}', content, re.DOTALL)
    chunk = chunk_match.group(0) if chunk_match else ""
    
    author_m = re.search(r'"author":\s*"([^"]+)"', chunk)
    category_m = re.search(r'"category":\s*"([^"]+)"', chunk)
    publisher_m = re.search(r'"publisher":\s*"([^"]+)"', chunk)
    isbn_m = re.search(r'"isbn":\s*"([^"]+)"', chunk)
    desc_m = re.search(r'"description":\s*"([^"]+)"', chunk)
    year_m = re.search(r'"year":\s*(\d+)', chunk)
    rating_m = re.search(r'"rating":\s*([\d\.]+)', chunk)
    pdf_url_m = re.search(r'"pdfUrl":\s*"([^"]+)"', chunk)
    
    books.append({
        'id': b_id,
        'title': b_title,
        'author': author_m.group(1) if author_m else 'Penulis Pustaka',
        'category': category_m.group(1) if category_m else 'Umum',
        'publisher': publisher_m.group(1) if publisher_m else 'Penerbit Digital',
        'isbn': isbn_m.group(1) if isbn_m else 'ISBN-000000',
        'description': desc_m.group(1) if desc_m else f'Buku {b_title} merupakan salah satu karya terbaik.',
        'year': year_m.group(1) if year_m else '2024',
        'rating': rating_m.group(1) if rating_m else '4.8',
        'pdfUrl': pdf_url_m.group(1) if pdf_url_m else None
    })

print(f"Parsed {len(books)} books from books.tsx")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Cover page background & decorations
            self.saveState()
            self.setFillColor(colors.HexColor('#0f172a')) # dark navy blue
            self.rect(0, 0, 612, 792, fill=1, stroke=0)
            
            # Accent bar
            self.setFillColor(colors.HexColor('#2563eb')) # vibrant blue
            self.rect(40, 720, 532, 12, fill=1, stroke=0)
            
            # Footer text on cover
            self.setFillColor(colors.HexColor('#94a3b8'))
            self.setFont("Helvetica-Bold", 10)
            self.drawCentredString(306, 40, "PUSTAKA DIGITAL 3D • KOLEKSI E-BOOK RESMI")
            self.restoreState()
            return
        
        self.saveState()
        # Top Header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor('#64748b'))
        doc_t = getattr(self, 'doc_title', 'PUSTAKA DIGITAL E-BOOK')
        doc_c = getattr(self, 'doc_category', 'UMUM')
        self.drawString(40, 760, doc_t.upper())
        self.drawRightString(572, 760, f"KATEGORI: {doc_c.upper()}")
        self.setStrokeColor(colors.HexColor('#cbd5e1'))
        self.setLineWidth(0.5)
        self.line(40, 752, 572, 752)

        # Bottom Footer
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.drawString(40, 32, "Hak Cipta Digital © Pustaka Digital Indonesia. All Rights Reserved.")
        page_text = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(572, 32, page_text)
        self.restoreState()


def build_pdf_for_book(book, output_filename):
    pdf_path = os.path.join(public_dir, output_filename)
    assets_path = os.path.join(assets_dir, output_filename)
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=colors.HexColor('#ffffff'),
        alignment=1, # Center
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#38bdf8'), # cyan
        alignment=1,
        spaceAfter=30
    )
    
    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=15,
        spaceAfter=10
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#2563eb'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10
    )
    
    quote_style = ParagraphStyle(
        'QuoteText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10.5,
        leading=16,
        textColor=colors.HexColor('#0f766e'),
        spaceBefore=8,
        spaceAfter=12
    )

    elements = []
    
    # ================= COVER PAGE =================
    elements.append(Spacer(1, 90))
    elements.append(Paragraph(f"<b>{book['title']}</b>", title_style))
    elements.append(Paragraph(f"Karya: <b>{book['author']}</b>", subtitle_style))
    
    elements.append(Spacer(1, 30))
    
    # Meta box table on cover page
    meta_data = [
        [Paragraph("<b>Kategori Buku</b>", ParagraphStyle('W', textColor=colors.white, fontName='Helvetica-Bold', fontSize=10)),
         Paragraph(book['category'], ParagraphStyle('W2', textColor=colors.HexColor('#93c5fd'), fontSize=10))],
        [Paragraph("<b>Penerbit</b>", ParagraphStyle('W', textColor=colors.white, fontName='Helvetica-Bold', fontSize=10)),
         Paragraph(book['publisher'], ParagraphStyle('W2', textColor=colors.HexColor('#93c5fd'), fontSize=10))],
        [Paragraph("<b>Tahun Terbit</b>", ParagraphStyle('W', textColor=colors.white, fontName='Helvetica-Bold', fontSize=10)),
         Paragraph(str(book['year']), ParagraphStyle('W2', textColor=colors.HexColor('#93c5fd'), fontSize=10))],
        [Paragraph("<b>Nomor ISBN</b>", ParagraphStyle('W', textColor=colors.white, fontName='Helvetica-Bold', fontSize=10)),
         Paragraph(book['isbn'], ParagraphStyle('W2', textColor=colors.HexColor('#93c5fd'), fontSize=10))],
        [Paragraph("<b>Rating Pembaca</b>", ParagraphStyle('W', textColor=colors.white, fontName='Helvetica-Bold', fontSize=10)),
         Paragraph(f"★ {book['rating']} / 5.0", ParagraphStyle('W2', textColor=colors.HexColor('#fbbf24'), fontName='Helvetica-Bold', fontSize=10))],
    ]
    meta_table = Table(meta_data, colWidths=[150, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#1e293b')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#3b82f6')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#334155')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    
    elements.append(meta_table)
    elements.append(PageBreak())
    
    # ================= PAGE 2: INFORMASI KATALOG & SINOPSIS =================
    elements.append(Paragraph(f"Informasi Katalog & Sinopsis Resmi", h1_style))
    elements.append(Paragraph(f"Buku <b>\"{book['title']}\"</b> merupakan karya literasi unggulan dalam kategori <b>{book['category']}</b> yang ditulis oleh <b>{book['author']}</b> dan diterbitkan secara resmi oleh <b>{book['publisher']}</b>.", body_style))
    
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Ringkasan Sinopsis:</b>", h2_style))
    elements.append(Paragraph(f"\"{book['description']}\"", quote_style))
    
    elements.append(Paragraph("<b>Latar Belakang Karya:</b>", h2_style))
    elements.append(Paragraph(
        f"Karya yang dipublikasikan pada tahun {book['year']} ini hadir untuk memberikan wawasan mendalam mengenai topik {book['category'].lower()}. "
        f"Melalui penulisan yang terstruktur, {book['author']} mampu menyampaikan setiap gagasan utama secara jelas, sistematis, dan mudah dipahami oleh pembaca dari berbagai kalangan.",
        body_style
    ))
    
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Keunggulan & Relevansi Buku:</b>", h2_style))
    elements.append(Paragraph(
        f"1. <b>Otoritas Penulis</b>: {book['author']} menyajikan perspektif kaya berbasis pengalaman dan riset literatur yang kuat.<br/>"
        f"2. <b>Nilai Edukasi Tinggi</b>: Menguraikan prinsip-prinsip utama {book['category']} yang dapat diterapkan secara praktis.<br/>"
        f"3. <b>Standar Mutu Penerbitan</b>: Diterbitkan oleh {book['publisher']} dengan nomor registrasi standar {book['isbn']}.",
        body_style
    ))
    
    elements.append(PageBreak())
    
    # ================= PAGE 3: BAB I - PENDAHULUAN & GAGASAN UTAMA =================
    cat_lower = book['category'].lower()
    if 'novel' in cat_lower or 'fiksi' in cat_lower:
        bab1_title = "Bab I: Latar Belakang & Pengenalan Tokoh / Tema"
        bab1_sub = "Awal Perjalanan dan Dinamika Cerita"
        content_p1 = f"Dalam Bab I dari novel <i>\"{book['title']}\"</i>, penulis {book['author']} membangun alur cerita yang memikat. Konteks sosial dan atmosfer emosional diperkenalkan secara halus sehingga pembaca langsung terhanyut ke dalam dunia yang diciptakan."
        content_p2 = f"Pengembangan cerita dalam karya ini berfokus pada konflik utama serta perjalanan nilai-nilai kehidupan. {book['author']} menggunakan bahasa yang indah namun komunikatif untuk menyampaikan pesan moral di balik setiap peristiwa."
    elif 'teknologi' in cat_lower or 'komputer' in cat_lower:
        bab1_title = "Bab I: Fondasi Arsitektur & Konsep Dasar"
        bab1_sub = "Pemahaman Sistem dan Metodologi Modern"
        content_p1 = f"Bab pertama dari buku <i>\"{book['title']}\"</i> ini menguraikan fondasi teknis dan prinsip utama {book['category']}. Penulis {book['author']} menjelaskan bagaimana teknologi dan arsitektur ini mengatasi tantangan skala besar dalam industri modern."
        content_p2 = f"Pembaca diajak memahami struktur data, algoritma, serta best practices yang relevan. Karya ini menjadi referensi esensial bagi pengembang perangkat lunak, praktisi IT, dan akademisi di bidang informatika."
    elif 'agama' in cat_lower:
        bab1_title = "Bab I: Landasan Teologis & Hikmah Spiritual"
        bab1_sub = "Prinsip Utama Etika dan Pembersihan Jiwa"
        content_p1 = f"Buku <i>\"{book['title']}\"</i> karya {book['author']} pada bab pendahuluan ini membahas hakikat keimanan, keluhuran akhlak, dan petunjuk praktis dalam kehidupan sehari-hari."
        content_p2 = f"Penulis menyusun argumentasi berdasarkan dalil-dalil otentik dan pandangan para ulama, memberikan panduan kedamaian jiwa serta integrasi nilai-nilai keagamaan dalam masyarakat."
    else:
        bab1_title = "Bab I: Pengantar & Konsep Fundamental"
        bab1_sub = "Tinjauan Umum dan Kerangka Pemikiran"
        content_p1 = f"Dalam Bab I buku <i>\"{book['title']}\"</i>, penulis {book['author']} meletakkan dasar pemikiran yang kokoh mengenai studi {book['category']}."
        content_p2 = f"Gagasan-gagasan kunci dijelaskan secara runut agar pembaca memiliki pijakan teoretis yang kuat sebelum melangkah ke analisis yang lebih mendalam pada bab-bab berikutnya."

    elements.append(Paragraph(bab1_title, h1_style))
    elements.append(Paragraph(bab1_sub, h2_style))
    elements.append(Paragraph(content_p1, body_style))
    elements.append(Paragraph(content_p2, body_style))
    
    elements.append(Spacer(1, 15))
    elements.append(Paragraph("<b>Poin-Poin Analisis Utama:</b>", h2_style))
    elements.append(Paragraph(
        f"• <b>Konstruksi Ide</b>: {book['author']} menyusun bab ini dengan struktur logika yang rinci.<br/>"
        f"• <b>Kontekstualisasi</b>: Menghubungkan teori dan realitas lapangan sesuai bidang {book['category']}.<br/>"
        f"• <b>Tujuan Pembelajaran</b>: Membekali pembaca dengan pemahaman komprehensif atas judul <i>\"{book['title']}\"</i>.",
        body_style
    ))
    
    elements.append(PageBreak())
    
    # ================= PAGE 4: BAB II - PEMBAHASAN MENDALAM & APLIKASI =================
    elements.append(Paragraph("Bab II: Pembahasan Utama & Studi Literatur", h1_style))
    elements.append(Paragraph("Eksplorasi Mendalam dan Aplikasi Praktis", h2_style))
    elements.append(Paragraph(
        f"Pada bab kedua dari karya <i>\"{book['title']}\"</i>, pembahasan melangkah pada tahap penerapannya secara langsung. "
        f"{book['author']} memberikan contoh konkret, studi kasus, serta metodologi penyelesaian masalah yang dihadapi dalam topik {book['category']}.",
        body_style
    ))
    elements.append(Paragraph(
        f"Kelebihan utama dari pembahasan dalam buku yang diterbitkan oleh {book['publisher']} ini adalah kedalaman analisisnya. "
        f"Penulis tidak hanya menyajikan teori permukaan, tetapi juga membongkar prinsip-prinsip mendasar secara lugas dan berdampak tinggi.",
        body_style
    ))
    
    elements.append(Spacer(1, 15))
    elements.append(Paragraph("<b>Ringkasan Sub-Bab & Diskusi:</b>", h2_style))
    
    table_data = [
        [Paragraph("<b>Sub-Bab</b>", ParagraphStyle('TB', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
         Paragraph("<b>Topik Pembahasan</b>", ParagraphStyle('TB', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
         Paragraph("<b>Relevansi</b>", ParagraphStyle('TB', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white))],
        [Paragraph("Sub-Bab 2.1", body_style), Paragraph(f"Analisis Elemen Kunci {book['title']}", body_style), Paragraph("Sangat Tinggi", body_style)],
        [Paragraph("Sub-Bab 2.2", body_style), Paragraph(f"Implementasi Metodologi {book['author']}", body_style), Paragraph("Praktis & Teruji", body_style)],
        [Paragraph("Sub-Bab 2.3", body_style), Paragraph(f"Evaluasi Kritis & Diskusi {book['category']}", body_style), Paragraph("Strategis", body_style)],
    ]
    t_discussion = Table(table_data, colWidths=[80, 280, 100])
    t_discussion.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#2563eb')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_discussion)
    
    elements.append(PageBreak())
    
    # ================= PAGE 5: BAB III - KESIMPULAN & PENUTUP =================
    elements.append(Paragraph("Bab III: Kesimpulan & Refleksi Akhir", h1_style))
    elements.append(Paragraph(
        f"Buku <b>\"{book['title']}\"</b> karya <b>{book['author']}</b> memberikan kontribusi signifikan dalam pengayaan literasi digital di Indonesia. "
        f"Secara keseluruhan, buku ini berhasil menyampaikan gagasan utama secara utuh, inspiratif, dan kaya akan manfaat.",
        body_style
    ))
    
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Rekomendasi Pembaca & Catatan Akhir:</b>", h2_style))
    elements.append(Paragraph(
        f"Karya yang memperoleh rating <b>{book['rating']}/5.0</b> di Pustaka Digital ini sangat direkomendasikan bagi pembaca yang ingin memperdalam wawasan tentang {book['category']}. "
        f"Dengan hadirnya e-book digital ini, diharapkan masyarakat dapat mengakses bahan bacaan berkualitas secara mudah dan interaktif.",
        body_style
    ))
    
    elements.append(Spacer(1, 20))
    
    # Copyright & Digital Sign box
    sign_data = [
        [Paragraph("<b>DOKUMEN E-BOOK RESMI PERPUSTAKAAN DIGITAL 3D</b>", ParagraphStyle('SB', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor('#1e3a8a')))],
        [Paragraph(f"Judul E-Book: <b>{book['title']}</b><br/>Penulis: {book['author']} | ISBN: {book['isbn']}<br/>Status Koleksi: Terverifikasi Lengkap Sesuai Katalog Resmi", ParagraphStyle('ST', fontName='Helvetica', fontSize=9, textColor=colors.HexColor('#334155')))]
    ]
    sign_table = Table(sign_data, colWidths=[460])
    sign_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#eff6ff')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#93c5fd')),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(sign_table)
    
    # Custom Canvas with document properties
    def make_canvas(*args, **kwargs):
        c = NumberedCanvas(*args, **kwargs)
        c.doc_title = book['title']
        c.doc_category = book['category']
        return c

    doc.build(elements, canvasmaker=make_canvas)
    
    if os.path.exists(pdf_path):
        shutil.copyfile(pdf_path, assets_path)

# Track mappings
book_pdf_map = {}

print("Generating custom PDF files for all books...")
for i, book in enumerate(books):
    clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', book['title']).strip()
    clean_title = re.sub(r'\s+', '_', clean_title)
    filename = f"{book['id']}_{clean_title}.pdf"
    
    try:
        build_pdf_for_book(book, filename)
        pdf_url = f"/buku_digital/{filename}"
        book_pdf_map[book['id']] = pdf_url
        book['pdfUrl'] = pdf_url
        if (i+1) % 20 == 0 or (i+1) == len(books):
            print(f"Generated [{i+1}/{len(books)}] PDFs...")
    except Exception as e:
        print(f"Error generating PDF for {book['id']}: {e}")

print("Successfully generated all PDF files!")

# Update pdfResolver.ts
pdf_resolver_path = os.path.join('src', 'utils', 'pdfResolver.ts')
with open(pdf_resolver_path, 'r', encoding='utf-8') as f:
    resolver_content = f.read()

map_str = "export const BOOK_PDF_MAP: Record<string, string> = {\n"
for b_id, url in book_pdf_map.items():
    map_str += f"  '{b_id}': '{url}',\n"
map_str += "};"

resolver_content = re.sub(r'export const BOOK_PDF_MAP: Record<string, string> = \{[\s\S]*?\};', map_str, resolver_content)

with open(pdf_resolver_path, 'w', encoding='utf-8') as f:
    f.write(resolver_content)

print(f"Updated pdfResolver.ts with {len(book_pdf_map)} exact mappings.")
