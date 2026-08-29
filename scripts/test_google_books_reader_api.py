import urllib.request
import urllib.parse
import json

title = "Bumi Manusia"
url = f"https://www.googleapis.com/books/v1/volumes?q={urllib.parse.quote(title)}&maxResults=1"

headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        if 'items' in data:
            item = data['items'][0]
            access_info = item.get('accessInfo', {})
            volume_info = item.get('volumeInfo', {})
            print("Title:", volume_info.get('title'))
            print("WebReaderLink:", access_info.get('webReaderLink'))
            print("Embeddable:", access_info.get('embeddable'))
            print("PDF info:", access_info.get('pdf'))
            print("Epub info:", access_info.get('epub'))
            print("Viewability:", access_info.get('viewability'))
            print("PreviewLink:", volume_info.get('previewLink'))
except Exception as e:
    print("Error:", e)
