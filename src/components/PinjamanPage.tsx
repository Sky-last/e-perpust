import { User, ViewType, Book } from '../types';
import { Calendar, RefreshCw, CheckCircle, Clock, ChevronRight, BookOpen } from 'lucide-react';
import Book3D from './Book3D';

interface PinjamanPageProps {
  currentUser: User;
  onNavigate: (view: ViewType, selectedId?: string) => void;
  onReturnBook: (borrowingId: string) => void;
  onExtendBook: (borrowingId: string) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function PinjamanPage({
  currentUser,
  onNavigate,
  onReturnBook,
  onExtendBook,
  addToast: _addToast
}: PinjamanPageProps) {
  const borrowings = currentUser.borrowings || [];
  
  // Sort borrowings: active first, then newest
  const sortedBorrowings = [...borrowings].sort((a, b) => {
    const activeStatuses = ['Sedang Dipinjam', 'approved', 'overdue'];
    const aActive = activeStatuses.includes(a.status);
    const bActive = activeStatuses.includes(b.status);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Pinjaman Buku</h1>
        <p className="text-slate-400 text-xs md:text-sm">Pantau status, lakukan perpanjangan durasi, atau kembalikan buku pinjaman Anda di sini.</p>
      </div>

      {sortedBorrowings.length > 0 ? (
        <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Buku</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tanggal Pinjam</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Batas Pengembalian</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tanggal Kembali</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Status</th>
                  <th className="p-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                {sortedBorrowings.map((item) => {
                  const isActive = ['Sedang Dipinjam', 'approved'].includes(item.status);
                  const isLate = item.status === 'overdue' || item.status === 'Terlambat';
                  const isReturned = item.status === 'returned' || item.status === 'Dikembalikan';
                  const isPending = item.status === 'pending';
                  const isRejected = item.status === 'rejected';
                  
                  // Label display
                  const statusLabel = 
                    isActive ? 'Aktif Dipinjam' :
                    isLate ? 'Terlambat' :
                    isReturned ? 'Dikembalikan' :
                    isPending ? 'Menunggu Verifikasi' :
                    isRejected ? 'Ditolak' : item.status;
                  
                  const statusClass =
                    isActive ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    isLate ? 'bg-red-50 text-red-600 border border-red-100' :
                    isReturned ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    isPending ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    'bg-slate-100 text-slate-500 border border-slate-200';
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Cover & Title */}
                      <td className="p-4.5">
                        <div className="flex items-center space-x-3">
                          <div 
                            onClick={() => onNavigate('detail-buku', item.bookId)}
                            className="cursor-pointer group flex-shrink-0"
                          >
                            <Book3D 
                              book={{
                                id: item.bookId,
                                title: item.bookTitle,
                                coverColor: item.coverColor,
                                coverUrl: item.coverUrl,
                                category: 'Pinjaman',
                                author: 'Pustaka',
                                publisher: 'Pustaka Digital',
                                isbn: '000-000',
                                description: '',
                                year: 2026,
                                rating: 5,
                                status: 'Tersedia',
                                stock: 1
                              }} 
                              size="xs" 
                            />
                          </div>
                          <div>
                            <h4 
                              onClick={() => onNavigate('detail-buku', item.bookId)}
                              className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-1"
                            >
                              {item.bookTitle}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono">ID Pinjam: #{item.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Borrow Date */}
                      <td className="p-4.5 text-slate-600 font-medium whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.borrowDate}</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="p-4.5 text-slate-600 font-medium whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                          <span className={isLate ? 'text-red-600 font-bold' : ''}>{item.dueDate}</span>
                        </div>
                      </td>

                      {/* Actual Return Date */}
                      <td className="p-4.5 text-slate-500 font-medium whitespace-nowrap">
                        {item.returnDate ? (
                          <div className="flex items-center space-x-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{item.returnDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Belum dikembalikan</span>
                        )}
                      </td>

                      {/* Status Stamp */}
                      <td className="p-4.5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="p-4.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {(isActive || isLate) && (
                            <>
                              <button 
                                onClick={() => onNavigate('detail-buku', item.bookId)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1 cursor-pointer"
                                title="Baca E-Book 3D"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Baca E-Book</span>
                              </button>
                              <button 
                                onClick={() => onExtendBook(item.id)}
                                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 hover:text-slate-800 text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                                title="Perpanjang 7 hari lagi"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Perpanjang</span>
                              </button>
                              <button 
                                onClick={() => onReturnBook(item.id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-sm shadow-blue-100 transition-all flex items-center space-x-1 cursor-pointer"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Kembalikan</span>
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => onNavigate('detail-buku', item.bookId)}
                            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Detail Buku"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[24px] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 text-lg">Riwayat Pinjaman Kosong</h3>
            <p className="text-slate-400 text-xs">
              Anda belum pernah melakukan peminjaman buku siber apa pun dari platform kami. Silakan kunjungi katalog untuk meminjam buku.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('katalog')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Buka Katalog Buku
          </button>
        </div>
      )}
    </div>
  );
}
