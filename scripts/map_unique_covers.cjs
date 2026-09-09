const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const covers = fs.readdirSync('public/buku_sampul');
const catalog = JSON.parse(fs.readFileSync('scripts/complete_catalog.json'));

console.log('Total files in public/buku_sampul:', covers.length);

function getFileHash(filepath) {
  if (!fs.existsSync(filepath)) return null;
  return crypto.createHash('md5').update(fs.readFileSync(filepath)).digest('hex');
}

// Find best cover for each book
const mapping = [];

for (const b of catalog) {
  let matchedCover = null;

  // 1. Check if there is a real_cover_gut-X matching
  if (b.filename.includes('Letters_of_a_Javanese_Princess')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-1_') || c.includes('cover_gut-1_'));
  } else if (b.filename.includes('Max_Havelaar')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-2_') || c.includes('cover_gut-2_'));
  } else if (b.filename.includes('Lord_Jim')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-4_') || c.includes('cover_gut-4_'));
  } else if (b.filename.includes('The_Hidden_Force')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-6_') || c.includes('cover_gut-6_'));
  } else if (b.filename.includes('Blown_to_Bits')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-8_') || c.includes('cover_gut-8_'));
  } else if (b.filename.includes('The_History_of_Sumatra')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-3_') || c.includes('cover_gut-3_'));
  } else if (b.filename.includes('The_History_of_Java')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-5_') || c.includes('cover_gut-5_'));
  } else if (b.filename.includes('Monumental_Java')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-7_') || c.includes('cover_gut-7_'));
  } else if (b.filename.includes('Java_Facts_and_Fancies')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-9_') || c.includes('cover_gut-9_'));
  } else if (b.filename.includes('Travels_in_the_East_Indian_Archipelago')) {
    matchedCover = covers.find(c => c.includes('real_cover_gut-10_') || c.includes('cover_gut-10_'));
  }

  // 2. Check for real_bks_XX matching
  const bksMatch = b.filename.match(/^real_bks_(\d+)/i);
  if (!matchedCover && bksMatch) {
    const num = bksMatch[1];
    // Find cover_bks_<num>_ or cover_real_bks_<num>_
    const found = covers.find(c => 
      c.startsWith(`cover_bks_${num}_`) || 
      c.startsWith(`cover_real_bks_${num}_`) ||
      c.startsWith(`cover_bks-${num}_`)
    );
    if (found) matchedCover = found;
  }

  // 3. Check exact base filename match: cover_<baseName>.jpg
  if (!matchedCover) {
    const baseName = b.filename.replace(/\.pdf$/i, '');
    const found = covers.find(c => 
      c === `cover_${baseName}.jpg` || 
      c === `cover_${baseName}.jpeg` ||
      c.toLowerCase() === `cover_${baseName.toLowerCase()}.jpg`
    );
    if (found) matchedCover = found;
  }

  // 4. Fallback to current cover
  if (!matchedCover) {
    matchedCover = `cover_${b.id}.jpg`;
  }

  mapping.push({
    id: b.id,
    title: b.title,
    filename: b.filename,
    assignedCover: matchedCover
  });
}

console.log('Mapped', mapping.length, 'books.');

// Check for duplicates in assigned covers
const hashCount = {};
for (const m of mapping) {
  const coverPath = path.resolve('public/buku_sampul', m.assignedCover);
  const hash = getFileHash(coverPath) || m.assignedCover;
  if (!hashCount[hash]) hashCount[hash] = [];
  hashCount[hash].push(m);
}

let dups = 0;
for (const [h, list] of Object.entries(hashCount)) {
  if (list.length > 1) {
    dups++;
    console.log('\nStill duplicate (' + list.length + ' books):');
    list.forEach(item => console.log('  -', item.id, item.title, '->', item.assignedCover));
  }
}

console.log('\nTotal duplicate cover groups remaining:', dups);
