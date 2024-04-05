import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css";

// directly defines root, recieves root id, and on conclusion, renders
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

// ## starting react app example

// # define parent element
// # create root based on element
// # use root to render child element
// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(
//   <App />
// );
