const themeScript = (() => {
  try {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme =
      savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : prefersDark ? 'dark' : 'light';

    document.documentElement.classList.toggle('dark', theme === 'dark');

    const observer = new MutationObserver(() => {
      try {
        const isDark = document.documentElement.classList.contains('dark');
        const current = localStorage.getItem('theme');
        const next = isDark ? 'dark' : 'light';
        if (current !== next) {
          localStorage.setItem('theme', next);
        }
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  } catch (e) {
    console.warn('Theme initialization failed:', e);
  }
})();
