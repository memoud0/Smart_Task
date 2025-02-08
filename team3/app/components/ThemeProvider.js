"use client"
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  if (!mounted) return null;

  return (
    <NextThemesProvider attribute="class">
      <MuiThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </NextThemesProvider>
  );
};

export default ThemeProvider;
