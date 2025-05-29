import React, { type ReactElement } from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { PhraseProvider, usePhrases } from '@/contexts/phrase-context';
import type { Phrase } from '@/types';

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

const TestConsumerComponent = ({ testPhrase }: { testPhrase?: string } = {}) => {
  const { phrases, addPhrase, deletePhrase } = usePhrases();
  return (
    <div>
      <button onClick={() => addPhrase(testPhrase || 'Nueva frase de prueba')}>Añadir Frase</button>
      <button onClick={() => phrases.length > 0 && deletePhrase(phrases[0].id)}>Eliminar Primera Frase</button>
      <div data-testid="phrases-count">{phrases.length}</div>
      <ul data-testid="phrases-list">
        {phrases.map(p => <li key={p.id}>{p.text}</li>)}
      </ul>
    </div>
  );
};

const renderWithProvider = (ui: ReactElement) => {
  return render(<PhraseProvider>{ui}</PhraseProvider>);
};

describe('PhraseContext - Validaciones', () => {
  let mockToastFn: jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    mockToastFn = jest.fn();
    (require('@/hooks/use-toast').useToast as jest.Mock).mockReturnValue({
      toast: mockToastFn,
    });
  });

  it('rechaza frases vacías', async () => {
    renderWithProvider(<TestConsumerComponent testPhrase="   " />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith({
        title: 'Error de Validación',
        description: 'El texto de la frase no puede estar vacío.',
        variant: 'destructive',
      });
    });
    expect(screen.getByTestId('phrases-count').textContent).toBe('0');
  });

  it('rechaza frases duplicadas', async () => {
    const initialPhrases: Phrase[] = [
      { id: '1', text: 'Frase duplicada', createdAt: new Date() },
    ];
    localStorage.setItem('phraseMatrixApp_phrases_es', JSON.stringify(initialPhrases));

    renderWithProvider(<TestConsumerComponent testPhrase="Frase duplicada" />);

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith({
        title: 'Error de Validación',
        description: 'Esta frase ya existe en la matriz.',
        variant: 'destructive',
      });
    });
    expect(screen.getByTestId('phrases-count').textContent).toBe('1');
  });

  it('maneja correctamente frases con longitud máxima', async () => {
    const longPhrase = 'a'.repeat(280);
    renderWithProvider(<TestConsumerComponent testPhrase={longPhrase} />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText(longPhrase)).toBeInTheDocument();
  });

  it('rechaza frases que exceden la longitud máxima', async () => {
    const tooLongPhrase = 'a'.repeat(281);
    renderWithProvider(<TestConsumerComponent testPhrase={tooLongPhrase} />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith({
        title: 'Error de Validación',
        description: 'La frase no puede tener más de 280 caracteres.',
        variant: 'destructive',
      });
    });
    expect(screen.getByTestId('phrases-count').textContent).toBe('0');
    expect(screen.queryByText(tooLongPhrase)).not.toBeInTheDocument();
  });

  it('maneja correctamente frases con caracteres especiales', async () => {
    const specialPhrase = '¡Hola! ¿Cómo estás? #@$%^&*()';
    renderWithProvider(<TestConsumerComponent testPhrase={specialPhrase} />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText(specialPhrase)).toBeInTheDocument();
  });

  it('maneja correctamente frases con múltiples espacios', async () => {
    const spacedPhrase = 'Frase    con    múltiples    espacios';
    renderWithProvider(<TestConsumerComponent testPhrase={spacedPhrase} />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    const phraseElement = screen.getByText((content) => {
      return content.replace(/\s+/g, ' ').trim() === spacedPhrase.replace(/\s+/g, ' ').trim();
    });
    expect(phraseElement).toBeInTheDocument();
  });

  it('sanitiza correctamente contenido HTML malicioso', async () => {
    const maliciousPhrase = '<script>alert("XSS")</script>Hola mundo';
    renderWithProvider(<TestConsumerComponent testPhrase={maliciousPhrase} />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText('Hola mundo')).toBeInTheDocument();
    expect(screen.queryByText('<script>alert("XSS")</script>')).not.toBeInTheDocument();
  });

  it('sanitiza correctamente atributos HTML maliciosos', async () => {
    const maliciousPhrase = '<img src="x" onerror="alert(\'XSS\')">Hola mundo';
    renderWithProvider(<TestConsumerComponent testPhrase={maliciousPhrase} />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText('Hola mundo')).toBeInTheDocument();
    expect(screen.queryByText('<img src="x" onerror="alert(\'XSS\')">')).not.toBeInTheDocument();
  });

  it('sanitiza correctamente URLs maliciosas', async () => {
    const maliciousPhrase = 'javascript:alert("XSS")';
    renderWithProvider(<TestConsumerComponent testPhrase={maliciousPhrase} />);

    const addButton = screen.getByText('Añadir Frase');
    act(() => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('phrases-count').textContent).toBe('1');
    });
    expect(screen.getByText('javascript:alert("XSS")')).toBeInTheDocument();
  });
}); 