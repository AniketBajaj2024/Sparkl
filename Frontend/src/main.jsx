import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import QuizAttempt from "./pages/QuizAttempt";
import Register from "./pages/Register";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quiz/:quizId" element={<QuizAttempt />} />
    </Routes>
  </Router>
);
