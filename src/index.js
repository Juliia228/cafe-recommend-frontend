import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
import App from './App';
import {Login} from './pages/SignIn/Login'
import reportWebVitals from './reportWebVitals';

import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";

import {
  BaseProvider,
  styled,
  DarkTheme,
} from "baseui";

const engine = new Styletron();

const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
alignContent: 'center',
  height: "100%",
  width: "100%",
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
    <StyletronProvider value={engine}>
      <BaseProvider
        theme={DarkTheme}
        overrides={{
          AppContainer: { style: { width: "100%", height: "100%" } },
        }}
      >
          <Centered>
          <Routes>
      <Route path="/" element={<App />} />
      <Route path="signIn" element={<Login />} />
    </Routes>
          </Centered>
      
      </BaseProvider>
    </StyletronProvider>
    </React.StrictMode>  
  </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
