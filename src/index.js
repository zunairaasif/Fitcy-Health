import React from "react";
import "./index.css";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Wrapper from "./components/common/Wrapper";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
const rootElement = document.getElementById("root");
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Wrapper>
          <App />
        </Wrapper>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  rootElement
);
