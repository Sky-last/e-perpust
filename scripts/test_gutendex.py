import urllib.request
import json

url = "https://gutendex.com/books/?search=Max%20Havelaar"
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("Count:", data.get('count'))
        if data.get('results'):
            b = data['results'][0]
            print("Title:", b.get('title'))
            print("Authors:", [a['name'] for a in b.get('authors', [])])
            print("Formats:", list(b.get('formats', {}).keys()))
            for fmt, link in b.get('formats', {}).items():
                if 'pdf' in fmt or 'text/html' in fmt or 'epub' in fmt or 'txt' in fmt:
                    print(f"  - {fmt}: {link}")
except Exception as e:
    print("Error:", e)
