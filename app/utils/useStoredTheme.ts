'use client';

import { useSyncExternalStore } from 'react';
import { ThemeId } from '../types';
import { THEMES } from './themes';

const STORAGE_KEY = 'presentation_theme';
const DEFAULT_THEME: ThemeId = 'glass';

const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === 'string' && THEMES.some((t) => t.id === value);

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // 'storage' fires in *other* tabs, so the presenter window follows along.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): ThemeId {
  const raw = localStorage.getItem(STORAGE_KEY);
  // A hand-edited or stale value must not become a bogus CSS class.
  return isThemeId(raw) ? raw : DEFAULT_THEME;
}

// The server has no localStorage; React hydrates with this, then re-renders
// with the real snapshot. That is what keeps markup from mismatching.
const getServerSnapshot = (): ThemeId => DEFAULT_THEME;

export function setStoredTheme(id: ThemeId) {
  localStorage.setItem(STORAGE_KEY, id);
  emit(); // 'storage' doesn't fire in the tab that wrote it
}

/**
 * Theme lives in localStorage, which is an external store — so read it with the
 * API meant for external stores instead of syncing it into state from an effect.
 */
export function useStoredTheme(): ThemeId {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
