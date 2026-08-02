import { useRef, useState } from 'react';
import { Book } from '../types';

interface BookShelf3DProps {
  books: Book[];
  onBookClick: (id: string) => void;
}

function ShelfBook({ book, onBookClick }: { book: Book; onBookClick: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setRotate({
      x: -((y - cy) / cy) * 12,
      y: ((x - cx) / cx) * 12,
    });
  };

  const hasImage = Boolean(book.coverUrl) && !imgError;

  return (
    <div
      ref={ref}
      className="relative flex-shrink-0 cursor-pointer group px-1"
      style={{
        width: '100px',
        height: '148px',
        perspective: '600px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setRotate({ x: 0, y: 0 });
      }}
      onClick={() => onBookClick(book.id)}
    >
      {/* Realistic Standing Book Cover Card */}
      <div
        className="w-full h-full relative rounded-lg overflow-hidden shadow-lg transition-all"
        style={{
          transformStyle: 'preserve-3d',
          transform: hovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-14px) scale(1.08)`
            : 'rotateX(4deg) rotateY(0deg) translateY(0px)',
          transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          boxShadow: hovered
            ? '0 20px 30px -10px rgba(0,0,0,0.7), 0 0 20px rgba(59,130,246,0.35)'
            : '0 8px 16px -4px rgba(0,0,0,0.5)',
        }}
      >
        {hasImage ? (
          <div className="absolute inset-0 w-full h-full bg-slate-900">
            <img
              src={book.coverUrl}
              alt={book.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Book spine lighting & 3D bevel overlay */}
            <div className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-l from-black/30 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-white/35 to-transparent pointer-events-none z-10" />
          </div>
        ) : (
          <div
            className="w-full h-full flex flex-col justify-between p-2.5 relative text-white"
            style={{
              background: book.coverColor
                ? `linear-gradient(135deg, ${book.coverColor.replace('from-', '').replace('to-', '')})`
                : 'linear-gradient(135deg, #1e3a8a, #312e81)',
            }}
          >
            {/* Spine lighting overlay */}
            <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

            <div className="space-y-1 z-10">
              <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-black/40 text-amber-300 rounded border border-amber-400/30 inline-block">
                {book.category}
              </span>
              <h4 className="text-[10px] font-black text-white leading-tight line-clamp-3 drop-shadow">
                {book.title}
              </h4>
            </div>

            <div className="pt-1 border-t border-white/20 z-10 flex justify-between items-center text-[9px]">
              <span className="text-white/80 truncate font-medium text-[8px]">{book.author}</span>
              <span className="text-amber-300 font-bold">★ {book.rating}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-900/95 text-white text-[10px] font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-2xl border border-slate-700 z-30 pointer-events-none animate-fadeIn"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-[160px] truncate text-white">{book.title}</div>
          <div className="text-slate-400 text-[9px] mt-0.5 font-medium">{book.author}</div>
          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800 text-[9px]">
            <span className="text-amber-400 font-bold">★ {book.rating}</span>
            <span className="text-blue-400 font-extrabold ml-2">Klik untuk Baca →</span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900/95 rotate-45 border-b border-r border-slate-700" />
        </div>
      )}
    </div>
  );
}

export default function BookShelf3D({ books, onBookClick }: BookShelf3DProps) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!shelfRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - shelfRef.current.offsetLeft);
    setScrollLeft(shelfRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !shelfRef.current) return;
    e.preventDefault();
    const x = e.pageX - shelfRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    shelfRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full" style={{ perspective: '1200px' }}>
      {/* Shelf structure */}
      <div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(4deg)',
        }}
      >
        {/* Books container */}
        <div
          ref={shelfRef}
          className="flex items-end overflow-x-auto select-none py-3 px-3"
          style={{
            paddingBottom: '14px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            gap: '8px',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {books.map((book) => (
            <ShelfBook
              key={book.id}
              book={book}
              onBookClick={onBookClick}
            />
          ))}
        </div>

        {/* Wooden shelf plank */}
        <div
          className="relative w-full h-4 rounded-sm shadow-2xl"
          style={{
            background: 'linear-gradient(180deg, #8B4513 0%, #6B3410 40%, #4a2409 100%)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          {/* Wood grain texture */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,0,0,0.15) 30px, rgba(0,0,0,0.15) 31px)',
          }} />
        </div>

        {/* Shelf shadow below */}
        <div
          className="w-full h-4 rounded-b-sm"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
            transform: 'rotateX(-90deg)',
            transformOrigin: 'top center',
          }}
        />
      </div>

      {/* Scroll fade hints */}
      <div className="absolute top-0 left-0 bottom-4 w-10 bg-gradient-to-r from-slate-950/70 to-transparent pointer-events-none z-10 rounded-l" />
      <div className="absolute top-0 right-0 bottom-4 w-10 bg-gradient-to-l from-slate-950/70 to-transparent pointer-events-none z-10 rounded-r" />

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
