import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1877F2', // Facebook/TaskPlanet Blue
      light: '#e7f3ff',
      dark: '#166fe5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#42b72a', // Success Green
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0f2f5', // Soft gray background for the feed
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1e21',
      secondary: '#65676b',
    },
    divider: '#dadde1',
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 800,
      color: '#1877F2',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.2px',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f0f2f5',
          margin: 0,
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'rgba(24, 119, 242, 0.04)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#166fe5',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          border: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1c1e21',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #dadde1',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#f5f6f7',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: '#dadde1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1877F2',
            },
          },
        },
      },
    },
  },
});

export default theme;
