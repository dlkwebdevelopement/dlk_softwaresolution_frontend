import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AppRoute from "./routes/AppRoute";
import { BrowserRouter } from "react-router-dom";
import FloatingEnquiry from "./components/FloatingEnquiry";

const theme = createTheme({
  palette: {
    primary: {
      main: "#48723e",
      dark: "#1a4718",
      light: "#83a561",
    },
    secondary: {
      main: "#bfdb81",
    },
    background: {
      default: "#f7f7f7",
      paper: "#ffffff",
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      h1: { fontFamily: '"Urbanist", sans-serif', fontWeight: 800 },
      h2: { fontFamily: '"Urbanist", sans-serif', fontWeight: 800 },
      h3: { fontFamily: '"Urbanist", sans-serif', fontWeight: 700 },
      h4: { fontFamily: '"Urbanist", sans-serif', fontWeight: 700 },
      h5: { fontFamily: '"Urbanist", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Urbanist", sans-serif', fontWeight: 600 },
      subtitle1: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
      subtitle2: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
      body1: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
      body2: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
      button: { fontFamily: '"Urbanist", sans-serif', fontWeight: 700, textTransform: 'none' },
      caption: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
      overline: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #48723e;
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #1a4718;
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
          scrollbar-color: #48723e #f1f5f9;
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
        <AppRoute />

        {/* Only this */}
        <FloatingEnquiry />

      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;