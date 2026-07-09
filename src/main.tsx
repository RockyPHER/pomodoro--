import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./theme/ThemeProvider";
import { SpotifyAuthProvider } from "./contexts/SpotifyAuthContext";
import { SpotifyPlayerProvider } from "./contexts/SpotifyPlayerContext";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <SpotifyAuthProvider>
      <SpotifyPlayerProvider>
        <App />
      </SpotifyPlayerProvider>
    </SpotifyAuthProvider>
  </ThemeProvider>,
);
