import React, { type ReactElement } from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { PhraseProvider, usePhrases } from '@/contexts/phrase-context';
import type { Phrase } from '@/types';
import { renderHook } from '@testing-library/react';

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

const TestConsumerComponent = ({ testPhrase }: { testPhrase?: string } = {}) => {
  const { phrases, searchTerm, addPhrase, deletePhrase, setSearchTerm, filteredPhrases } = usePhrases();
  return (
    <div>
      <button onClick={() => addPhrase(testPhrase || 'Nueva frase de prueba')}>Añadir Frase</button>
      <button onClick={() => phrases.length > 0 && deletePhrase(phrases[0].id)}>Eliminar Primera Frase</button>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar"
        aria-label="search-term-input"
      />
      <div data-testid="phrases-count">{phrases.length}</div>
      <div data-testid="filtered-phrases-count">{filteredPhrases.length}</div>
      <ul data-testid="phrases-list">
        {filteredPhrases.map(p => <li key={p.id}>{p.text}</li>)}
      </ul>
    </div>
  );
};

const renderWithProvider = (ui: ReactElement) => {
  return render(<PhraseProvider>{ui}</PhraseProvider>);
};

describe('PhraseContext', () => {
  let mockToastFn: jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    mockToastFn = jest.fn();
    (require('@/hooks/use-toast').useToast as jest.Mock).mockReturnValue({
      toast: mockToastFn,
    });
  });

  it('debería inicializar con frases vacías si no hay datos en localStorage', () => {
    renderWithProvider(<TestConsumerComponent />);
    expect(screen.getByTestId('phrases-count').textContent).toBe('0');
    expect(screen.getByTestId('filtered-phrases-count').textContent).toBe('0');
  });

  it('debería añadir una frase', async () => {
    renderWithProvider(<TestConsumerComponent />);
    const addButton = screen.getByText('Añadir Frase');

    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByTestId('filtered-phrases-count').textContent).toBe('1');
    expect(screen.getByText('Nueva frase de prueba')).toBeInTheDocument();
    expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({ title: "Éxito", description: "¡Frase añadida con éxito!" }));
  });

  it('debería eliminar una frase', async () => {
    const initialPhrases: Phrase[] = [{ id: '1', text: 'Frase a eliminar', createdAt: new Date() }];
    localStorage.setItem('phraseMatrixApp_phrases_es', JSON.stringify(initialPhrases));

    renderWithProvider(<TestConsumerComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText('Frase a eliminar')).toBeInTheDocument();

    const deleteButton = screen.getByText('Eliminar Primera Frase');
    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('0');
    });
    expect(screen.queryByText('Frase a eliminar')).not.toBeInTheDocument();
    expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({ title: "Éxito", description: "¡Frase eliminada con éxito!" }));
  });

  it('debería filtrar frases según el término de búsqueda', async () => {
    const initialPhrases: Phrase[] = [
      { id: '1', text: 'Manzana roja', createdAt: new Date() },
      { id: '2', text: 'Banana amarilla', createdAt: new Date() },
      { id: '3', text: 'Manzana verde', createdAt: new Date() },
    ];
    localStorage.setItem('phraseMatrixApp_phrases_es', JSON.stringify(initialPhrases));

    renderWithProvider(<TestConsumerComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('3');
    });
    expect(screen.getByTestId('filtered-phrases-count').textContent).toBe('3');

    const searchInput = screen.getByLabelText('search-term-input');
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'manzana' } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-phrases-count').textContent).toBe('2');
    });
    expect(screen.getByText('Manzana roja')).toBeInTheDocument();
    expect(screen.queryByText('Banana amarilla')).not.toBeInTheDocument();
    expect(screen.getByText('Manzana verde')).toBeInTheDocument();

    act(() => {
      fireEvent.change(searchInput, { target: { value: 'amarilla' } });
    });
    await waitFor(() => {
      expect(screen.getByTestId('filtered-phrases-count').textContent).toBe('1');
    });
    expect(screen.queryByText('Manzana roja')).not.toBeInTheDocument();
    expect(screen.getByText('Banana amarilla')).toBeInTheDocument();

  });

  it('debería cargar frases desde localStorage al inicio', async () => {
    const storedPhrases: Phrase[] = [
      { id: 'test1', text: 'Frase guardada 1', createdAt: new Date() },
      { id: 'test2', text: 'Frase guardada 2', createdAt: new Date() },
    ];
    localStorage.setItem('phraseMatrixApp_phrases_es', JSON.stringify(storedPhrases));

    renderWithProvider(<TestConsumerComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('2');
    });
    expect(screen.getByText('Frase guardada 1')).toBeInTheDocument();
    expect(screen.getByText('Frase guardada 2')).toBeInTheDocument();
  });

  it('debería guardar frases en localStorage cuando se añaden o eliminan', async () => {
    renderWithProvider(<TestConsumerComponent />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('phraseMatrixApp_phrases_es') || '[]')).toHaveLength(1);
    });

    const deleteButton = screen.getByText('Eliminar Primera Frase');
    act(() => {
      fireEvent.click(deleteButton);
    });
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('phraseMatrixApp_phrases_es') || '[]')).toHaveLength(0);
    });
  });

  it('no añade una frase si el texto está vacío y muestra un toast', async () => {
    renderWithProvider(<TestConsumerComponent />);
    const addButton = screen.getByRole('button', { name: 'Añadir Frase' });

    const { result } = renderHook(() => usePhrases(), { wrapper: PhraseProvider });

    act(() => {
      result.current.addPhrase('');
    });

    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error de Validación",
        description: "El texto de la frase no puede estar vacío.",
        variant: "destructive",
      }));
    });
    expect(screen.getByTestId('phrases-count').textContent).toBe('0');
  });

  it('no añade una frase duplicada y muestra un toast', async () => {
    renderWithProvider(<TestConsumerComponent />);
    const addButton = screen.getByText('Añadir Frase');

    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });

    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error de Validación",
        description: "Esta frase ya existe en la matriz.",
        variant: "destructive",
      }));
    });
    expect(screen.getByTestId('phrases-count').textContent).toBe('1');
  });

  it('maneja correctamente la búsqueda sin resultados', async () => {
    const initialPhrases: Phrase[] = [
      { id: '1', text: 'Manzana roja', createdAt: new Date() },
      { id: '2', text: 'Banana amarilla', createdAt: new Date() },
    ];
    localStorage.setItem('phraseMatrixApp_phrases_es', JSON.stringify(initialPhrases));

    renderWithProvider(<TestConsumerComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('2');
    });

    const searchInput = screen.getByLabelText('search-term-input');
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'pera' } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-phrases-count').textContent).toBe('0');
    });
    expect(screen.queryByText('Manzana roja')).not.toBeInTheDocument();
    expect(screen.queryByText('Banana amarilla')).not.toBeInTheDocument();
  });

  it('maneja correctamente la eliminación con lista vacía', async () => {
    renderWithProvider(<TestConsumerComponent />);
    const deleteButton = screen.getByText('Eliminar Primera Frase');

    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('0');
    });
    expect(mockToastFn).not.toHaveBeenCalled();
  });

  it('maneja correctamente frases con caracteres especiales', async () => {
    renderWithProvider(<TestConsumerComponent testPhrase="¡Hola! ¿Cómo estás? #Test @Usuario" />);
    const addButton = screen.getByText('Añadir Frase');

    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText('¡Hola! ¿Cómo estás? #Test @Usuario')).toBeInTheDocument();
  });

  it('maneja correctamente frases con espacios múltiples', async () => {
    renderWithProvider(<TestConsumerComponent testPhrase="  Frase  con  espacios  múltiples  " />);
    const addButton = screen.getByText('Añadir Frase');

    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText('Frase con espacios múltiples')).toBeInTheDocument();
  });

  it('maneja correctamente la búsqueda con caracteres especiales', async () => {
    const initialPhrases: Phrase[] = [
      { id: '1', text: '¡Hola! ¿Cómo estás?', createdAt: new Date() },
      { id: '2', text: 'Buenos días', createdAt: new Date() },
    ];
    localStorage.setItem('phraseMatrixApp_phrases_es', JSON.stringify(initialPhrases));

    renderWithProvider(<TestConsumerComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('2');
    });

    const searchInput = screen.getByLabelText('search-term-input');
    act(() => {
      fireEvent.change(searchInput, { target: { value: '¡Hola!' } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText('¡Hola! ¿Cómo estás?')).toBeInTheDocument();
    expect(screen.queryByText('Buenos días')).not.toBeInTheDocument();
  });

  it('maneja correctamente el error de localStorage', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const mockLocalStorage = {
      getItem: jest.fn(() => {
        throw new Error('Error de acceso');
      }),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    renderWithProvider(<TestConsumerComponent />);

    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error",
        description: "No se pudieron cargar las frases del almacenamiento.",
        variant: "destructive",
      }));
    });
    expect(screen.getByTestId('phrases-count').textContent).toBe('0');

    console.error = originalConsoleError;
  });
});
