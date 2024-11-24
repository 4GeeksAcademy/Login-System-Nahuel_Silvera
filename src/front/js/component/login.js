import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/index.css";

const Login = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [alerts, setAlerts] = useState([]); // Estado para las alertas flotantes
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    password_check: "",
  });

  const [isSignIn, setIsSignIn] = useState(false); // Estado para alternar entre login y sign up
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar spinner y deshabilitar formulario

  // Redirigir al usuario si ya tiene un token válido
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (token) {
      navigate("/private");
    }
  }, [navigate]);

  // Agregar una nueva alerta
  const addAlert = (message, type = "success") => {
    const id = new Date().getTime();
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }]);

    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 3000); // Eliminar alerta después de 3 segundos
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activar el estado de carga

    if (
      user.username === "" ||
      user.email === "" ||
      user.password === "" ||
      user.password_check === ""
    ) {
      addAlert("Debe rellenar todos los campos para continuar", "warning");
      setIsLoading(false);
      return;
    }

    if (user.password === user.password_check) {
      const createUser = await actions.createUser(user);
      setIsLoading(false); // Desactivar carga
      if (createUser) {
        addAlert("Usuario creado exitosamente", "success");
        setUser({
          username: "",
          email: "",
          password: "",
          password_check: "",
        });
        setIsSignIn(false); // Cambiar al formulario de inicio de sesión
      } else {
        addAlert("Ocurrió un error inesperado", "danger");
      }
    } else {
      addAlert("Las contraseñas no coinciden", "warning");
      setUser({ ...user, password: "", password_check: "" });
      setIsLoading(false);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activar el estado de carga

    if (user.email === "" || user.password === "") {
      addAlert("Debes rellenar ambos campos para continuar", "warning");
      setIsLoading(false);
      return;
    } else {
      const login = await actions.login(user.email, user.password);
      setIsLoading(false); // Desactivar carga

      if (login) {
        navigate("/private");
      } else {
        addAlert("Inicio de sesión fallido. Verifica tus credenciales.", "danger");
      }
    }
  };

  const toggleForm = () => {
    setIsSignIn((prev) => !prev);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 1050 }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert alert-${alert.type} alert-dismissible fade show`}
            role="alert"
          >
            {alert.message}
            <button
              type="button"
              className="btn-close"
              onClick={() =>
                setAlerts((prevAlerts) =>
                  prevAlerts.filter((currentAlert) => currentAlert.id !== alert.id)
                )
              }
              aria-label="Close"
            ></button>
          </div>
        ))}
      </div>

      <div className="card rounded-5 shadow p-4" style={{ width: "350px" }}>
        <form onSubmit={isSignIn ? registerUser : loginUser}>
          <h1 className="h3 mb-3 fw-normal text-center">
            {isSignIn ? "Sign up" : "Login"}
          </h1>

          {isSignIn && (
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="usernameInput"
                placeholder="Username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                disabled={isLoading}
              />
              <label htmlFor="usernameInput">Username</label>
            </div>
          )}

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="name@example.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled={isLoading}
            />
            <label htmlFor="emailInput">Email</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="passwordInput"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              disabled={isLoading}
            />
            <label htmlFor="passwordInput">Password</label>
          </div>

          {isSignIn && (
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="passwordCheckInput"
                placeholder="Confirm Password"
                value={user.password_check}
                onChange={(e) => setUser({ ...user, password_check: e.target.value })}
                disabled={isLoading}
              />
              <label htmlFor="passwordCheckInput">Confirm Password</label>
            </div>
          )}

          <div className="d-flex justify-content-center gap-3">
            {isSignIn ? (
              <button className="btn btn-secondary px-4" type="button" onClick={toggleForm} disabled={isLoading}>
                Back to Login
              </button>
            ) : (
              <button className="btn btn-secondary px-4" type="button" onClick={toggleForm} disabled={isLoading}>
                Sign up
              </button>
            )}

            <button className="btn btn-primary px-4 d-flex align-items-center" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </>
              ) : isSignIn ? (
                "Register"
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
