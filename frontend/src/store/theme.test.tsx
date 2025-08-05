import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from './theme';
import '@testing-library/jest-dom/vitest';

function TestComponent() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} data-theme={theme}>
      toggle
    </button>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('toggles html dark class', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const btn = getByRole('button');
    expect(document.documentElement).not.toHaveClass('dark');
    fireEvent.click(btn);
    expect(document.documentElement).toHaveClass('dark');
  });
});
