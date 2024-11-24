import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  // Definir qué mostrar según la ruta actual
  if (location.pathname === "/login") {
    return null; // No renderizar el navbar en /login
  }

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand mb-0 h1">
          React Boilerplate
        </Link>
        <div className="ms-auto">
          {location.pathname === "/private" ? (
            <button
              className="btn btn-danger"
              onClick={() => {
                // Lógica para cerrar sesión
                localStorage.removeItem("idToken"); // Eliminar token
                window.location.href = "/login"; 
              }}
            >
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
