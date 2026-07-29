import { useRef, useState } from 'react';
import { Book } from '../types';

interface BookShelf3DProps {
  books: Book[];
  onBookClick: (id: string) => void;
}

function ShelfBook({ book, index, onBookClick }: { book: Book; index: number; onBookClick: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
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
      x: -((y - cy) / cy) * 15,
      y: ((x - cx) / cx) * 15,
    });
  };

  // Varied widths to simulate different book thicknesses
  const widths = [32, 28, 36, 24, 30, 38, 26, 34];
  const w = widths[index % widths.length];

  // Extract a solid color from the gradient for the spine
  const getSpineColor = (coverColor: string): string => {
    const parts = coverColor.split(' ');
    const from = parts.find(p => p.startsWith('from-'));
    if (!from) return '#1d4ed8';
    const colorMap: Record<string, string> = {
      'from-blue-600': '#2563eb', 'from-indigo-600': '#4f46e5', 'from-emerald-700': '#047857',
      'from-rose-700': '#be123c', 'from-amber-600': '#d97706', 'from-purple-800': '#6b21a8',
      'from-teal-700': '#0f766e', 'from-cyan-700': '#0e7490', 'from-green-600': '#16a34a',
      'from-slate-700': '#334155', 'from-zinc-800': '#27272a', 'from-red-600': '#dc2626',
      'from-orange-600': '#ea580c', 'from-violet-650': '#7c3aed', 'from-pink-600': '#db2777',
      'from-sky-500': '#0ea5e9', 'from-indigo-800': '#3730a3', 'from-green-800': '#166534',
      'from-amber-700': '#b45309', 'from-blue-900': '#1e3a8a', 'from-lime-700': '#4d7c0f',
      'from-orange-700': '#c2410c',
    };
    return colorMap[from] || '#2563eb';
  };

  const spineColor = getSpineColor(book.coverColor || '');

  // Determine text color based on spine color brightness
  const textColor = '#ffffff';

  return (
    <div
      ref={ref}
      className="relative flex-shrink-0 cursor-pointer group"
      style={{
        width: `${w}px`,
        height: '160px',
        perspective: '500px',
        marginRight: '2px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setRotate({ x: 0, y: 0 }); }}
      onClick={() => onBookClick(book.id)}
    >
      {/* Book Spine (Main visible part on shelf) */}
      <div
        className="w-full h-full relative transition-all"
        style={{
          transformStyle: 'preserve-3d',
          transform: hovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-18px) scale(1.05)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        {/* Front face - book spine */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-sm shadow-md"
          style={{
            backgroundColor: spineColor,
            background: `linear-gradient(180deg, ${spineColor}dd 0%, ${spineColor} 50%, ${spineColor}aa 100%)`,
          }}
        >
          {/* Spine lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/20" />
          
          {/* Vertical title text */}
          <div
            className="text-[7px] font-bold uppercase tracking-widest select-none px-1 z-10"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              color: textColor,
              opacity: 0.95,
              maxHeight: '140px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {book.title}
          </div>

          {/* Top edge light */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-sm" />
        </div>

        {/* Left side - book thickness */}
        <div
          className="absolute top-0 bottom-0 left-0 w-2 rounded-l-sm"
          style={{
            backgroundColor: `${spineColor}88`,
            transform: 'translateX(-8px) rotateY(-90deg)',
            transformOrigin: 'right center',
          }}
        />

        {/* Hover tooltip */}
        {hovered && (
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-900/95 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-slate-700 z-30 pointer-events-none"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <div className="max-w-[140px] truncate">{book.title}</div>
            <div className="text-slate-400 text-[8px] mt-0.5">{book.author}</div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 rotate-45 border-b border-r border-slate-700" />
          </div>
        )}
      </div>
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
          transform: 'rotateX(8deg)',
        }}
      >
        {/* Books container */}
        <div
          ref={shelfRef}
          className="flex items-end overflow-x-auto select-none"
          style={{
            paddingBottom: '16px',
            paddingLeft: '12px',
            paddingRight: '12px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            gap: '2px',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {books.map((book, idx) => (
            <ShelfBook
              key={book.id}
              book={book}
              index={idx}
              onBookClick={onBookClick}
            />
          ))}
        </div>

        {/* Wooden shelf plank */}
        <div
          className="relative w-full h-4 rounded-sm shadow-xl"
          style={{
            background: 'linear-gradient(180deg, #8B4513 0%, #6B3410 40%, #4a2409 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {/* Wood grain texture */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,0,0,0.1) 30px, rgba(0,0,0,0.1) 31px)',
          }} />
        </div>

        {/* Shelf shadow below */}
        <div
          className="w-full h-3 rounded-b-sm"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
            transform: 'rotateX(-90deg)',
            transformOrigin: 'top center',
          }}
        />
      </div>

      {/* Scroll fade hints */}
      <div className="absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-slate-950/60 to-transparent pointer-events-none z-10 rounded-l" />
      <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-slate-950/60 to-transparent pointer-events-none z-10 rounded-r" />

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
