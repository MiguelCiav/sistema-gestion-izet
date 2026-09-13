import '@testing-library/jest-dom'

// Polyfill localStorage for jsdom environments if needed
if (typeof window !== 'undefined') {
  const store: Record<string, string> = {}
  const mockStorage = {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = String(value)
    },
    removeItem: (key: string): void => {
      delete store[key]
    },
    clear: (): void => {
      for (const k in store) {
        delete store[k]
      }
    },
    key: (index: number): string | null => Object.keys(store)[index] ?? null,
    get length(): number {
      return Object.keys(store).length
    },
  }

  try {
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    })
  } catch {
    // Already defined
  }
}
