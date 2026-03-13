import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AppRoute from "./routes/AppRoute";
import { BrowserRouter } from "react-router-dom";
import FloatingEnquiry from "./components/FloatingEnquiry";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3DB843",
      dark: "#2e9133",
      light: "#e8f7e9",
    },
    secondary: {
      main: "#c2eac4",
    },
    text: {
      primary: "#1a2b1b",
      secondary: "#6b8f6d",
    },
    background: {
      default: "#ffffff",
      paper: "#f7fdf7",
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600 },
    subtitle1: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
    subtitle2: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
    body1: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
    body2: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
    button: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, textTransform: 'none' },
    caption: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
    overline: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        :root {
          --green: #3DB843;
          --green-dark: #2e9133;
          --green-deep: #1f6b24;
          --green-light: #e8f7e9;
          --green-mid: #c2eac4;
          --green-pale: #f2fbf2;
          --dark: #111c12;
          --text: #1a2b1b;
          --text-mid: #3d5c3f;
          --text-muted: #6b8f6d;
          --border: #d4ead5;
          --white: #ffffff;
          --off-white: #f7fdf7;
          --yellow: #f5c842;
          --orange: #f47c2f;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f7fdf7;
        }
        ::-webkit-scrollbar-thumb {
          background: #c2eac4;
          border-radius: 10px;
          border: 2px solid #f7fdf7;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3DB843;
        }
        ::-webkit-scrollbar-button {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        ::-webkit-scrollbar-corner {
          background: transparent;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #c2eac4 #f7fdf7;
        }
        body {
          font-family: "Plus Jakarta Sans", sans-serif !important;
          background-color: #ffffff;
          color: #1a2b1b;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: "Bricolage Grotesque", sans-serif !important;
          color: #111c12;
        }
      `,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1a2b1b',
              borderRadius: '16px',
              padding: '16px 24px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              boxShadow: '0 10px 30px -5px rgba(61, 184, 43, 0.15), 0 8px 10px -6px rgba(61, 184, 43, 0.1)',
              border: '1px solid rgba(61, 184, 67, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#3DB843',
                secondary: '#fff',
              },
              style: {
                border: '1px solid rgba(61, 184, 67, 0.2)',
                boxShadow: '0 10px 40px -10px rgba(61, 184, 67, 0.4)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                border: '1px solid rgba(239, 68, 68, 0.2)',
                boxShadow: '0 10px 40px -10px rgba(239, 68, 68, 0.3)',
              },
            },
          }}
        />
        <AppRoute />

        {/* Only this */}
        <FloatingEnquiry />

      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;