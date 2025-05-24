import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPhraseForm from '@/components/add-phrase-form';
import { usePhrases } from '@/contexts/phrase-context';
import { Toaster } from "@/components/ui/toaster";

jest.mock('@/contexts/phrase-context', () => ({
  usePhrases: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

jest.mock('@/components/ui/toaster', () => ({
  __esModule: true,
  Toaster: () => <div data-testid="mock-toaster" />,
}));

describe('AddPhraseForm', () => {
  const mockAddPhrase = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    mockAddPhrase.mockClear();
    mockToast.mockClear();
    (usePhrases as jest.Mock).mockReturnValue({
      addPhrase: mockAddPhrase,
    });
    (require('@/hooks/use-toast').useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  const renderComponent = () => render(
    <>
      <AddPhraseForm />
      <Toaster />
    </>
  );


  it('renderiza el formulario para añadir frases', () => {
    renderComponent();
    expect(screen.getByText(/añadir nueva frase/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/escribe tu frase inspiradora aquí.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir frase/i })).toBeInTheDocument();
  });

  it('permite al usuario escribir en el textarea', () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(/escribe tu frase inspiradora aquí.../i);
    fireEvent.change(textarea, { target: { value: 'Nueva frase de prueba' } });
    expect(textarea).toHaveValue('Nueva frase de prueba');
  });

  it('llama a addPhrase y resetea el formulario al enviar una frase válida', async () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(/escribe tu frase inspiradora aquí.../i);
    const submitButton = screen.getByRole('button', { name: /añadir frase/i });

    fireEvent.change(textarea, { target: { value: 'Frase válida' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddPhrase).toHaveBeenCalledWith('Frase válida');
    });
    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
  });

  it('muestra un mensaje de error si la frase está vacía al enviar', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button', { name: /añadir frase/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/la frase no puede estar vacía./i)).toBeInTheDocument();
    });
    expect(mockAddPhrase).not.toHaveBeenCalled();
  });

  it('muestra un mensaje de error si la frase es demasiado larga', async () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(/escribe tu frase inspiradora aquí.../i);
    const submitButton = screen.getByRole('button', { name: /añadir frase/i });

    const longText = 'a'.repeat(281);
    fireEvent.change(textarea, { target: { value: longText } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/la frase es demasiado larga./i)).toBeInTheDocument();
    });
    expect(mockAddPhrase).not.toHaveBeenCalled();
  });
});
