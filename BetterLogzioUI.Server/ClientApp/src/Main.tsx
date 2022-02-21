import React from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LogsPage from "./pages/LogsPage";
import { useLoggedIn } from "./services/auth";

function Main() {
  const loggedIn = useLoggedIn();

  if (!loggedIn) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/logs/:timeRange" element={<LogsPage />} />
        <Route path="*" element={<Navigate replace to="/logs/now-15m" />} />
      </Routes>
    </BrowserRouter>
  );
}

// function RedirectHandler() {
//   const savedProjects = useSavedProjects();

//   if (savedProjects.length > 0) {
//     return <Redirect from="*" to={`/project/${savedProjects[0]}`} />;
//   } else {
//     return <Redirect from="*" to="/add" />;
//   }
// }

export default Main;
