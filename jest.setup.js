import '@testing-library/jest-dom';

Object.defineProperty(global, 'crypto', {
  value: {
    ...global.crypto,
    randomUUID: () => 'mocked-uuid-string',
  },
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => {
      if (typeof key !== 'string') {
        throw new Error('localStorage.getItem: key must be a string');
      }
      return store[key] || null;
    },
    setItem: (key, value) => {
      if (typeof key !== 'string') {
        throw new Error('localStorage.setItem: key must be a string');
      }
      if (typeof value !== 'string') {
        value = JSON.stringify(value);
      }
      store[key] = value;
    },
    removeItem: (key) => {
      if (typeof key !== 'string') {
        throw new Error('localStorage.removeItem: key must be a string');
      }
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: Object.keys(store).length,
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
