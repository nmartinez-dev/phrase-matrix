import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme, ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/theme-toggle';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {ui}
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    mockSetTheme.mockClear();
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'light',
      themes: ['light', 'dark', 'system'],
    });
  });

  it('renderiza el botón de cambio de tema', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /cambiar tema/i });
    expect(button).toBeInTheDocument();
  });

  it('muestra los iconos de sol y luna', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /cambiar tema/i }).querySelector('.lucide-sun')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cambiar tema/i }).querySelector('.lucide-moon')).toBeInTheDocument();
  });

  it('abre el menú desplegable al hacer clic', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /cambiar tema/i });

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: /claro/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /oscuro/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /sistema/i })).toBeInTheDocument();
    });
  });

  it('llama a setTheme con "light" cuando se selecciona la opción Claro', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /cambiar tema/i });

    await user.click(button);

    const lightOption = await screen.findByRole('menuitem', { name: /claro/i });
    await user.click(lightOption);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('llama a setTheme con "dark" cuando se selecciona la opción Oscuro', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /cambiar tema/i });

    await user.click(button);

    const darkOption = await screen.findByRole('menuitem', { name: /oscuro/i });
    await user.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('llama a setTheme con "system" cuando se selecciona la opción Sistema', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /cambiar tema/i });

    await user.click(button);

    const systemOption = await screen.findByRole('menuitem', { name: /sistema/i });
    await user.click(systemOption);

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});
