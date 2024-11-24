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
        <img src="https://25.media.tumblr.com/a7458a7a22689a0865132823aca81fa6/tumblr_mgxrc8TdJa1s3k0rzo1_400.gif"></img>
      </div>
    </div>
  );
};

export default Private;
