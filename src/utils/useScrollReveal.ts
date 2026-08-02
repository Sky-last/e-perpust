import { useEffect, useRef, RefObject } from 'react';

/**
 * useScrollReveal – Attaches an IntersectionObserver to a container element.
 * All children inside that container that have the class "reveal", "reveal-left",
 * "reveal-right", or "reveal-scale" will get the "revealed" class added when
 * they enter the viewport, triggering their CSS transition.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.12
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * useCountUp – Animates a number from 0 to `target` over `duration` ms
 * when the element becomes visible.
 */
export function useCountUp(
  target: number,
  duration = 1800,
  prefix = '',
  suffix = ''
) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        let startTime: number | null = null;
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = prefix + Math.floor(eased * target).toLocaleString('id-ID') + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, prefix, suffix]);

  return ref;
}
