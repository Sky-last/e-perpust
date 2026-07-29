import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const DEST_DIR = path.join(process.cwd(), 'public', 'buku_digital');

const BOOKS_TO_SETUP = [
  {
    name: 'Letters_of_a_Javanese_Princess.pdf',
    url: 'https://archive.org/download/lettersofjavanes00kart/lettersofjavanes00kart.pdf', // ~14MB
    download: true
  },
  {
    name: 'Max_Havelaar.pdf',
    download: false
  },
  {
    name: 'The_History_of_Sumatra.pdf',
    download: false
  },
  {
    name: 'Lord_Jim.pdf',
    download: false
  },
  {
    name: 'The_History_of_Java.pdf',
    download: false
  },
  {
    name: 'The_Hidden_Force.pdf',
    download: false
  },
  {
    name: 'Monumental_Java.pdf',
    download: false
  },
  {
    name: 'Blown_to_Bits.pdf',
    download: false
  },
  {
    name: 'Java_Facts_and_Fancies.pdf',
    download: false
  },
  {
    name: 'Travels_in_the_East_Indian_Archipelago.pdf',
    download: false
  }
];

const SOURCE_FALLBACK = path.join(DEST_DIR, '69490a7377f5b-the-little-duke-or-richard-the-fearless-by-charlotte-mary-yonge.pdf');

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          downloadFile(redirectUrl, dest).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: Status Code ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  if (!fs.existsSync(SOURCE_FALLBACK)) {
    console.error(`Fallback source file not found at: ${SOURCE_FALLBACK}`);
    process.exit(1);
  }

  for (const book of BOOKS_TO_SETUP) {
    const targetPath = path.join(DEST_DIR, book.name);

    if (fs.existsSync(targetPath)) {
      console.log(`[SKIPPED] ${book.name} already exists.`);
      continue;
    }

    if (book.download && book.url) {
      console.log(`[DOWNLOADING] ${book.name} from ${book.url}...`);
      try {
        await downloadFile(book.url, targetPath);
        console.log(`[SUCCESS] Downloaded ${book.name}`);
      } catch (err: any) {
        console.error(`[ERROR] Failed to download ${book.name}: ${err.message}. Falling back to copying local template...`);
        fs.copyFileSync(SOURCE_FALLBACK, targetPath);
        console.log(`[FALLBACK] Copied template for ${book.name}`);
      }
    } else {
      console.log(`[COPYING TEMPLATE] Creating ${book.name} from template...`);
      try {
        fs.copyFileSync(SOURCE_FALLBACK, targetPath);
        console.log(`[SUCCESS] Created ${book.name} from template.`);
      } catch (err: any) {
        console.error(`[ERROR] Failed to copy template for ${book.name}: ${err.message}`);
      }
    }
  }

  console.log('\nAll e-books are successfully set up in public/buku_digital!');
}

main().catch(console.error);
