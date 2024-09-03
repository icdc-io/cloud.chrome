import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import i18nInstance from "./i18n";
import { store } from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
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
