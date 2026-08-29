import os
import re
import urllib.request
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

os.makedirs(os.path.join('public', 'buku_digital'), exist_ok=True)

# List of Gutenberg real public domain books in catalog
GUTENBERG_BOOKS = [
    {
        'id': 'eb-1',
        'title': 'The Little Duke or Richard the Fearless',
        'author': 'Charlotte Mary Yonge',
        'gutenberg_id': '4571',
        'url': 'https://www.gutenberg.org/files/4571/4571-0.txt'
    },
    {
        'id': 'eb-2',
        'title': 'Mistress Wilding',
        'author': 'Rafael Sabatini',
        'gutenberg_id': '1906',
        'url': 'https://www.gutenberg.org/files/1906/1906-0.txt'
    },
    {
        'id': 'gut-1',
        'title': 'Letters of a Javanese Princess',
        'author': 'Raden Adjeng Kartini',
        'gutenberg_id': '34062',
        'url': 'https://www.gutenberg.org/files/34062/34062-0.txt'
    },
    {
        'id': 'gut-2',
        'title': 'Max Havelaar',
        'author': 'Multatuli',
        'gutenberg_id': '11024',
        'url': 'https://www.gutenberg.org/files/11024/11024-0.txt'
    },
    {
        'id': 'gut-3',
        'title': 'The History of Sumatra',
        'author': 'William Marsden',
        'gutenberg_id': '8435',
        'url': 'https://www.gutenberg.org/files/8435/8435-0.txt'
    },
    {
        'id': 'gut-4',
        'title': 'Lord Jim',
        'author': 'Joseph Conrad',
        'gutenberg_id': '5658',
        'url': 'https://www.gutenberg.org/files/5658/5658-0.txt'
    },
    {
        'id': 'gut-5',
        'title': 'The History of Java Vol 1 2',
        'author': 'Sir Stamford Raffles',
        'gutenberg_id': '49842',
        'url': 'https://www.gutenberg.org/files/49842/49842-0.txt'
    },
    {
        'id': 'gut-6',
        'title': 'The Hidden Force A Story of Modern Java',
        'author': 'Louis Couperus',
        'gutenberg_id': '57297',
        'url': 'https://www.gutenberg.org/files/57297/57297-0.txt'
    },
    {
        'id': 'gut-7',
        'title': 'Monumental Java',
        'author': 'J. F. Scheltema',
        'gutenberg_id': '34542',
        'url': 'https://www.gutenberg.org/files/34542/34542-0.txt'
    },
    {
        'id': 'gut-8',
        'title': 'Blown to Bits or The Lonely Man of Rakata',
        'author': 'R. M. Ballantyne',
        'gutenberg_id': '21731',
        'url': 'https://www.gutenberg.org/files/21731/21731-0.txt'
    },
    {
        'id': 'gut-9',
        'title': 'Java Facts and Fancies',
        'author': 'Augusta de Wit',
        'gutenberg_id': '35147',
        'url': 'https://www.gutenberg.org/files/35147/35147-0.txt'
    },
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch_gutenberg_text(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            text = resp.read().decode('utf-8', errors='ignore')
            # Strip Project Gutenberg header and footer if present
            if '*** START OF THE PROJECT GUTENBERG' in text:
                text = text.split('*** START OF THE PROJECT GUTENBERG')[1]
            if '*** END OF THE PROJECT GUTENBERG' in text:
                text = text.split('*** END OF THE PROJECT GUTENBERG')[0]
            return text.strip()
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def build_pdf_from_text(book_info, text_content, pdf_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54, rightMargin=54,
        topMargin=54, bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'BookTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=colors.HexColor('#1e293b'),
        alignment=1, # Center
        spaceAfter=15
    )
    
    author_style = ParagraphStyle(
        'BookAuthor',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#475569'),
        alignment=1,
        spaceAfter=30
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=20,
        spaceAfter=10
    )

    body_style = ParagraphStyle(
        'BookBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#1f2937'),
        alignment=4, # Justified
        spaceAfter=12,
        firstLineIndent=20
    )

    story = []

    # COVER PAGE
    story.append(Spacer(1, 1.5 * inch))
    story.append(Paragraph(book_info['title'], title_style))
    story.append(Paragraph(f"Karya: {book_info['author']}", author_style))
    story.append(HRFlowable(width="60%", thickness=2, color=colors.HexColor('#3b82f6'), spaceBefore=20, spaceAfter=40))
    story.append(Paragraph("EDISI NASKAH ASLI — PERPUSTAKAAN DIGITAL", ParagraphStyle('Sub', parent=author_style, fontSize=11, textColor=colors.HexColor('#64748b'))))
    story.append(PageBreak())

    # BODY TEXT
    paragraphs = text_content.split('\n\n')
    count = 0
    # Process up to 150 main paragraphs for a substantial 20-30 page PDF
    for p in paragraphs:
        cleaned = p.strip().replace('\n', ' ')
        if len(cleaned) > 20:
            if cleaned.startswith('CHAPTER') or cleaned.startswith('LETTER') or cleaned.startswith('BOOK'):
                story.append(Paragraph(cleaned, heading_style))
            else:
                story.append(Paragraph(cleaned, body_style))
            count += 1
            if count >= 180:
                break

    doc.build(story)
    print(f"Successfully created real PDF for: {book_info['title']} ({count} paragraphs)")

print("Downloading REAL original text from Project Gutenberg and compiling full PDFs...")

for b in GUTENBERG_BOOKS:
    clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', b['title']).strip()
    clean_title = re.sub(r'\s+', '_', clean_title)
    filename = f"{b['id']}_{clean_title}.pdf"
    pdf_path = os.path.join('public', 'buku_digital', filename)

    text = fetch_gutenberg_text(b['url'])
    if text:
        try:
            build_pdf_from_text(b, text, pdf_path)
        except Exception as e:
            print(f"Failed to build PDF for {b['id']}: {e}")
    else:
        print(f"Failed to fetch text for {b['id']}")

print("Finished compiling real Gutenberg PDFs!")
