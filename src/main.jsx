import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <ScrollToTop />
      <ScrollToTopButton />
      <App />
    </Provider>
  </BrowserRouter>,
);
