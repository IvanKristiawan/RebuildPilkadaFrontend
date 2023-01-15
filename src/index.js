import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import { ProSidebarProvider } from "react-pro-sidebar";
import { ContextProvider } from "./contexts/ContextProvider";
import { AuthContextProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ContextProvider>
        <ProSidebarProvider>
          <App />
        </ProSidebarProvider>
      </ContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { ProSidebarProvider } from "react-pro-sidebar";
// import { ContextProvider } from "./contexts/ContextProvider";
// import { AuthContextProvider } from "./contexts/AuthContext";

// import App from "./App";

// const rootElement = document.getElementById("root");
// const root = createRoot(rootElement);

// root.render(
//   <StrictMode>
//     <AuthContextProvider>
//       <ContextProvider>
//         <ProSidebarProvider>
//           <App />
//         </ProSidebarProvider>
//       </ContextProvider>
//     </AuthContextProvider>
//   </StrictMode>
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
