import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Provider } from "react-redux";
import { store } from "./store/index";
import "./index.css";
import App from "./App";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error("Missing REACT_APP_GOOGLE_API_KEY in environment");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <APIProvider apiKey={GOOGLE_API_KEY}>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </APIProvider>
);
