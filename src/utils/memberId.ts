/**
 * Utility untuk membuat dan menyelesaikan Nomor ID Anggota Perpustakaan (Member ID)
 * Format standar: PK-YYYY-XXXXXX (Contoh: PK-2026-849201)
 */

export function generateMemberId(seed?: string): string {
  const year = new Date().getFullYear();
  if (seed && typeof seed === 'string') {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    const num = (Math.abs(hash) % 900000) + 100000;
    return `PK-${year}-${num}`;
  }
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `PK-${year}-${randomNum}`;
}

export function resolveUserMemberId(user?: { 
  identityNumber?: string; 
  nisn?: string; 
  nip?: string; 
  email?: string; 
  id?: string; 
} | null): string {
  if (!user) return '-';
  if (user.identityNumber && user.identityNumber.trim() && user.identityNumber !== '-') {
    return user.identityNumber.trim();
  }
  if (user.nisn && user.nisn.trim() && user.nisn !== '-') {
    return user.nisn.trim();
  }
  if (user.nip && user.nip.trim() && user.nip !== '-') {
    return user.nip.trim();
  }
  return generateMemberId(user.email || user.id);
}
