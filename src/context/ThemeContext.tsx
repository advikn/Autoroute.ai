import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if user has a preference stored in localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'dark';
  });

  // Update the theme attribute on the document when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Apply theme variables
    if (theme === 'light') {
      document.documentElement.style.setProperty('--primary', '#FF5E5B');
      document.documentElement.style.setProperty('--primary-dark', '#E54542');
      document.documentElement.style.setProperty('--primary-light', '#FF7A78');
      document.documentElement.style.setProperty('--text-primary', '#000000');
      document.documentElement.style.setProperty('--text-secondary', '#666666');
      document.documentElement.style.setProperty('--bg-light', '#FFFFFF');
      document.documentElement.style.setProperty('--bg-dark', '#F5F5F5');
      document.documentElement.style.setProperty('--border-color', '#EAEAEA');
      document.documentElement.style.setProperty('--primary-rgb', '255, 94, 91');
    } else {
      document.documentElement.style.setProperty('--primary', '#00E5A0');
      document.documentElement.style.setProperty('--primary-dark', '#00C288');
      document.documentElement.style.setProperty('--primary-light', '#33FFBE');
      document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
      document.documentElement.style.setProperty('--text-secondary', '#a0a0a0');
      document.documentElement.style.setProperty('--bg-light', '#121212');
      document.documentElement.style.setProperty('--bg-dark', '#0a0a0a');
      document.documentElement.style.setProperty('--border-color', '#333333');
      document.documentElement.style.setProperty('--primary-rgb', '0, 229, 160');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};