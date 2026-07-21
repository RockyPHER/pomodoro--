import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./theme/ThemeProvider";
import { I18nProvider } from "./i18n/context";
import { SpotifyAuthProvider } from "./contexts/SpotifyAuthContext";
import { SpotifyPlayerProvider } from "./contexts/SpotifyPlayerContext";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <I18nProvider>
    <ThemeProvider>
      <SpotifyAuthProvider>
        <SpotifyPlayerProvider>
          <App />
        </SpotifyPlayerProvider>
      </SpotifyAuthProvider>
    </ThemeProvider>
  </I18nProvider>,
);
