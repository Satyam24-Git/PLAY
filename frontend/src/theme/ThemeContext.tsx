import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Colors } from './colors';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  navBackground: string;
}

export const lightTheme: ThemeColors = {
  background: '#F2F2F7',
  cardBackground: '#FFFFFF',
  text: '#000000',
  textSecondary: '#6C6C6C',
  border: 'rgba(0,0,0,0.1)',
  navBackground: 'rgba(255,255,255,0.6)',
};

export const darkTheme: ThemeColors = {
  background: Colors.textPrimary, // #0A0A0A
  cardBackground: 'rgba(255,255,255,0.05)',
  text: '#FFFFFF',
  textSecondary: Colors.textSecondary,
  border: 'rgba(255,255,255,0.05)',
  navBackground: 'rgba(0,0,0,0.6)',
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  theme: darkTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
