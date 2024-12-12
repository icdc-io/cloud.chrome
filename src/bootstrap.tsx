import * as React from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "@/App";
import { store } from "@/redux/store";
import { i18nInstance } from "@/i18n";
const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <I18nextProvider i18n={i18nInstance}>
          <App />
        </I18nextProvider>
      </Router>
    </Provider>,
    // </React.StrictMode>,
  );
}
