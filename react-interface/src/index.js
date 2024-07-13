import React from 'react';
import App from './App';
import store from "./store";
import { Provider } from "react-redux";
import { createRoot } from 'react-dom/client';

import './style/global.css';
import 'react-dropdown/style.css';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
      <App />
  </Provider>
);

