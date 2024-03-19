import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {createHashRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import TicTacToe from "./games/TicTacToe";
import TicTacToeMove from "./games/TicTacToeMove";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const router = createHashRouter([
    {
        path: "/", element: <App/>, children: [
            { path: "/", element: <Home /> },
            { path: "/tic-tac-toe-normal", element: <TicTacToe /> },
            { path: "/tic-tac-toe-move", element: <TicTacToeMove /> },
        ],
    }
])

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
