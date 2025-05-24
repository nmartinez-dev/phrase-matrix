
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '@/components/search-input';
import { usePhrases } from '@/contexts/phrase-context';

jest.mock('@/contexts/phrase-context', () => ({
  usePhrases: jest.fn(),
}));

describe('SearchInput', () => {
  const mockSetSearchTerm = jest.fn();

  beforeEach(() => {
    mockSetSearchTerm.mockClear();
    (usePhrases as jest.Mock).mockReturnValue({
      searchTerm: '',
      setSearchTerm: mockSetSearchTerm,
    });
  });

  it('renderiza el campo de búsqueda', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText(/buscar frases.../i);
    expect(input).toBeInTheDocument();
    expect(screen.getByLabelText(/buscar frases/i)).toBeInTheDocument();
  });

  it('muestra el valor actual de searchTerm', () => {
    (usePhrases as jest.Mock).mockReturnValue({
      searchTerm: 'test search',
      setSearchTerm: mockSetSearchTerm,
    });
    render(<SearchInput />);
    expect(screen.getByPlaceholderText(/buscar frases.../i)).toHaveValue('test search');
  });

  it('llama a setSearchTerm cuando el valor del input cambia', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText(/buscar frases.../i);
    fireEvent.change(input, { target: { value: 'nueva búsqueda' } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith('nueva búsqueda');
  });

  it('renderiza el icono de búsqueda', () => {
    render(<SearchInput />);
    const inputContainer = screen.getByPlaceholderText(/buscar frases.../i).parentElement;
    expect(inputContainer?.querySelector('svg.lucide-search')).toBeInTheDocument();
  });
});
