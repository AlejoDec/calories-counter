import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AuthPage from "./views/AuthPages";
import CaloriesCounter from "./views/CaloriesCounter";
import Presentation from "./views/Presentation";
// import Client from "./views/ClientView";

// PrivateRoute como componente de Route
// const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
//   const token = localStorage.getItem("jwt");
//   const location = useLocation();
//   if (token) {
//     return element;
//   }
//   return <Navigate to="/" replace state={{ from: location }} />;
// };

const Router: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={<AuthPage />} 
        />
        <Route
          path="/"
          element={ <CaloriesCounter /> }
        />
        <Route
          path="/app"
          element={<CaloriesCounter />}
        />
        <Route
          path="/presentation"
          element={<Presentation />}
        />
        <Route 
          path='*'
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default Router;


