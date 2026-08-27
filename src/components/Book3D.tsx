import React, { useRef, useState, useEffect } from 'react';
import { Book } from '../types';
import { resolveBookCover, getCachedCover, resolveBookCoverFallback } from '../utils/coverResolver';

interface Book3DProps {
  book: Book;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export default function Book3D({ book, size = 'md', className = '', onClick }: Book3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  // Cover URL state — starts with cached or existing cover, then resolves dynamically
  const cached = getCachedCover(book.isbn || '', book.title);
  const [resolvedCover, setResolvedCover] = useState<string | null>(
    cached !== undefined ? cached : (book.coverUrl || null)
  );
  const [coverLoadFailed, setCoverLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // If we already have a resolved cover from cache, use it
    if (cached !== undefined) {
      setResolvedCover(cached);
      setCoverLoadFailed(false);
      return;
    }
    resolveBookCover(book.isbn || '', book.title, book.author, book.coverUrl).then(url => {
      if (!cancelled) {
        setResolvedCover(url);
        setCoverLoadFailed(false);
      }
    });
    return () => { cancelled = true; };
  }, [book.id, book.isbn, book.title, book.author, book.coverUrl]);

  // When the img fails to load, try fetching from Google Books API without the existing URL
  const handleCoverError = () => {
    resolveBookCoverFallback(book.isbn || '', book.title, book.author).then(url => {
      if (url && url !== resolvedCover) {
        setResolvedCover(url);
        setCoverLoadFailed(false);
      } else {
        setCoverLoadFailed(true);
      }
    });
  };


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMoving(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 22;
    const rotateX = -((y - centerY) / centerY) * 22;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsMoving(false);
    setRotate({ x: 0, y: 0 });
  };

  // Luxury Hardcover Dimension Presets
  const sizes = {
    xs: { width: 64, height: 92, depth: 14, textTitle: 'text-[7px]', textAuthor: 'text-[6px]', padding: 'p-2' },
    sm: { width: 110, height: 160, depth: 20, textTitle: 'text-[10px]', textAuthor: 'text-[8px]', padding: 'p-3' },
    md: { width: 160, height: 230, depth: 26, textTitle: 'text-xs font-black', textAuthor: 'text-[10px]', padding: 'p-4' },
    lg: { width: 210, height: 300, depth: 32, textTitle: 'text-sm font-black', textAuthor: 'text-xs', padding: 'p-5' },
    xl: { width: 240, height: 345, depth: 36, textTitle: 'text-base font-black', textAuthor: 'text-xs', padding: 'p-6' },
  };

  const dim = sizes[size];
  const halfDepth = dim.depth / 2;

  // Curated color themes
  const getGradient = (coverColor?: string) => {
    if (!coverColor) return 'from-slate-900 via-indigo-950 to-blue-900';
    if (coverColor.includes('indigo')) return 'from-slate-900 via-indigo-900 to-slate-950';
    if (coverColor.includes('rose')) return 'from-stone-900 via-rose-950 to-slate-950';
    if (coverColor.includes('emerald')) return 'from-slate-900 via-emerald-950 to-teal-950';
    if (coverColor.includes('amber')) return 'from-stone-900 via-amber-950 to-slate-950';
    if (coverColor.includes('purple')) return 'from-slate-900 via-purple-950 to-slate-950';
    return 'from-slate-900 via-blue-950 to-slate-950';
  };

  const gradient = getGradient(book.coverColor);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative select-none flex-shrink-0 cursor-pointer ${className}`}
      style={{
        width: `${dim.width}px`,
        height: `${dim.height}px`,
        perspective: '1200px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Drop Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-lg transition-all duration-300 pointer-events-none"
        style={{
          width: `${dim.width * 0.85}px`,
          height: '18px',
          background: 'rgba(0, 0, 0, 0.7)',
          transform: isHovered
            ? `translateY(${dim.depth * 0.6}px) scale(1.1)`
            : 'translateY(12px) scale(0.95)',
          opacity: isHovered ? 0.9 : 0.5,
        }}
      />

      {/* 3D Book Container */}
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          transition: isMoving
            ? 'transform 0.05s ease-out'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(10px)`
            : 'rotateX(8deg) rotateY(-18deg) rotateZ(0deg)',
        }}
      >
        {/* FRONT COVER */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} text-white flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10 rounded-r-md`}
          style={{
            transform: `translateZ(${halfDepth}px)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {resolvedCover && !coverLoadFailed ? (
            <div className="w-full h-full relative">
              <img
                src={resolvedCover}
                alt={book.title}
                onError={handleCoverError}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none z-10" />
            </div>
          ) : (
            <div className={`w-full h-full ${dim.padding} flex flex-col justify-between relative`}>
              {/* Spine shadow overlay */}
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

              <div className="space-y-2 z-10">
                <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/10 text-slate-300 rounded border border-white/10 backdrop-blur-md">
                  {book.category}
                </span>
                <h4 className={`${dim.textTitle} text-white leading-snug drop-shadow line-clamp-3 mt-1`}>
                  {book.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-white/10 z-10 flex justify-between items-center text-slate-300">
                <p className={`${dim.textAuthor} truncate max-w-[75%] font-medium opacity-90`}>{book.author}</p>
                {size !== 'xs' && (
                  <span className="text-[9px] font-black text-amber-400">
                    ★ {book.rating}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Glossy light sheen */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `linear-gradient(${120 + rotate.y}deg, rgba(255,255,255,0.25) 0%, transparent 60%)`,
              opacity: isHovered ? 0.8 : 0.2,
            }}
          />
        </div>

        {/* BACK COVER */}
        <div
          className={`absolute inset-0 bg-gradient-to-tl ${gradient} text-slate-400 p-4 flex flex-col justify-between overflow-hidden border border-white/10 rounded-l-md`}
          style={{
            transform: `rotateY(180deg) translateZ(${halfDepth}px)`,
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="text-[9px] font-sans leading-relaxed space-y-1">
            <p className="font-bold text-white uppercase text-[8px] tracking-wider">Perpustakaan Digital</p>
            <p className="line-clamp-6 text-slate-300">{book.description || 'Koleksi e-book literasi digital berkualitas.'}</p>
          </div>
          <div className="text-[8px] font-mono text-slate-500 text-center border-t border-white/10 pt-2">
            ISBN {book.isbn}
          </div>
        </div>

        {/* CURVED SPINE */}
        <div
          className={`absolute top-0 bottom-0 bg-gradient-to-r ${gradient} flex items-center justify-center border-r border-black/40 shadow-inner`}
          style={{
            width: `${dim.depth}px`,
            left: `-${halfDepth}px`,
            transform: 'rotateY(-90deg)',
            transformStyle: 'preserve-3d',
            borderRadius: '2px 0 0 2px',
          }}
        >
          <div
            className="text-[8px] font-bold text-white/80 uppercase tracking-widest font-mono whitespace-nowrap overflow-hidden select-none"
            style={{
              transform: 'rotate(-90deg)',
              width: `${dim.height}px`,
              textAlign: 'center',
            }}
          >
            {book.title}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-white/10 to-black/40 pointer-events-none" />
        </div>

        {/* RIGHT PAGES EDGE */}
        <div
          className="absolute"
          style={{
            width: `${dim.depth - 2}px`,
            top: '2px',
            bottom: '2px',
            right: `-${halfDepth - 1}px`,
            transform: 'rotateY(90deg)',
            backgroundColor: '#f8f5ee',
            backgroundImage: 'repeating-linear-gradient(90deg, #e7e2d4, #e7e2d4 1px, #f8f5ee 1px, #f8f5ee 3px)',
            boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.12)',
          }}
        />

        {/* TOP PAGES */}
        <div
          className="absolute"
          style={{
            height: `${dim.depth - 2}px`,
            left: '2px',
            right: '2px',
            top: `-${halfDepth - 1}px`,
            transform: 'rotateX(90deg)',
            backgroundColor: '#f8f5ee',
            backgroundImage: 'repeating-linear-gradient(0deg, #e7e2d4, #e7e2d4 1px, #f8f5ee 1px, #f8f5ee 3px)',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.12)',
          }}
        />

        {/* BOTTOM PAGES */}
        <div
          className="absolute"
          style={{
            height: `${dim.depth - 2}px`,
            left: '2px',
            right: '2px',
            bottom: `-${halfDepth - 1}px`,
            transform: 'rotateX(-90deg)',
            backgroundColor: '#f8f5ee',
            backgroundImage: 'repeating-linear-gradient(0deg, #e7e2d4, #e7e2d4 1px, #f8f5ee 1px, #f8f5ee 3px)',
            boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.12)',
          }}
        />
      </div>
    </div>
  );
}
