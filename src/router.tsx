import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import CaloriesCounter from "./views/CaloriesCounter";
import AuthPage from "./views/AuthPages";
import { AuthProvider } from "./context/AuthContext";
import React from "react";

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
          path="/login" 
          element={<AuthPage />} 
        />
        <Route
          path="/"
          element={ <CaloriesCounter /> }
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


