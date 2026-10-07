'use client';
import { useState, useEffect } from 'react';

export function useLang() {
  const [lang, setLangState] = useState('id');

  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'id';
    setLangState(saved);
    const handler = (e) => setLangState(e.detail);
    window.addEventListener('langchange', handler);
    return () => window.removeEventListener('langchange', handler);
  }, []);

  function setLang(l) {
    localStorage.setItem('lang', l);
    window.dispatchEvent(new CustomEvent('langchange', { detail: l }));
    setLangState(l);
  }

  return [lang, setLang];
}
