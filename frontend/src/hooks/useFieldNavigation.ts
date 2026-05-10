import { useEffect } from 'react';

export function useFieldNavigation() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const tag = target.tagName;
      const role = target.getAttribute('role');

      // Allow INPUT, SELECT, TEXTAREA, or elements with role="combobox" (MUI Select)
      if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(tag) && role !== 'combobox') return;

      // if TEXTAREA and Shift+Enter, allow new line (don't navigate)
      if (tag === 'TEXTAREA' && e.key === 'Enter' && e.shiftKey) return;

      // Stop if any dropdown/autocomplete (MUI) is open
      if (document.querySelector('[role="listbox"]')) return;

      // 🔥 GLOBAL: get ALL inputs on the page
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(
          'input:not([disabled]):not([readonly]), ' +
            'select:not([disabled]):not([readonly]), ' +
            'textarea:not([disabled]):not([readonly]), ' +
            'button[type="submit"]:not([disabled]),' +
            '[role="combobox"]:not([disabled]):not([readonly]) '
        )
      )
        .filter((el) => el.dataset.nav !== 'skip') // Skip elements with data-nav="skip"
        .sort((a, b) => {
          const na = Number(a.dataset.nav ?? 9999);
          const nb = Number(b.dataset.nav ?? 9999);
          return na - nb;
        });

      const index = elements.indexOf(target);
      if (index === -1) return;

      const total = elements.length;

      const nextIndex = (index + 1) % total;
      // const prevIndex = (index - 1 + total) % total;

      const focusElement = (i: number) => {
        const el = elements[i];
        if (el) {
          e.preventDefault();
          el.focus();

          if ('select' in el) {
            try {
              (el as HTMLInputElement).select();
            } catch {
              console.warn('Failed to select input content');
            }
          }

          el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      };

      switch (e.key) {
        case 'Enter':
          focusElement(nextIndex);
          break;

        // case 'ArrowRight':
        //   focusElement(nextIndex);
        //   break;

        // case 'ArrowLeft':
        //   focusElement(prevIndex);
        //   break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
  }, []);
}
