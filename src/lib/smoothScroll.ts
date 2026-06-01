/** Fixed header height — keep in sync with scroll-padding-top in index.css */
export const HEADER_SCROLL_OFFSET = 72;

export const scrollToSection = (hash: string, behavior: ScrollBehavior = "smooth") => {
  const id = hash.replace(/^#/, "");
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
};

export const scrollToTop = (behavior: ScrollBehavior = "smooth") => {
  window.scrollTo({ top: 0, behavior });
};
