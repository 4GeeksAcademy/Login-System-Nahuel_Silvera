import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Private = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem("idToken");
    if (!isLogged) {
      navigate("/login"); // Redirige al login si no está logueado
    }
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "75vh" }}>
        <div className="card rounded-5 shadow p-4 text-center" style={{ width: "400px" }}>
        <h1 className="h3 mb-3 fw-normal">🎉 ¡Estás logueado! 🎉</h1>
        <p className="text-muted">
          Ahora deberias poder ver ésto
        </p>
      </div>
    </div>
  );
};

export default Private;
