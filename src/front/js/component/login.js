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

  // Redirigir al usuario si ya tiene un token válido
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (token) {
      // Aquí podrías validar el token si fuera necesario (por ejemplo, comprobando su expiración)
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
    if (user.password === user.password_check && user.password !== "") {
      const createUser = await actions.createUser(user);
      if (createUser) {
        addAlert("User was created successfully", "success");
        setUser({
          username: "",
          email: "",
          password: "",
          password_check: "",
        });
        setIsSignIn(false); // Cambiar al formulario de login
      } else {
        addAlert("An unexpected error occurred", "danger");
      }
    } else {
      addAlert("Passwords don't match", "warning");
      setUser({ ...user, password: "", password_check: "" });
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (user.email === "" || user.password === "") {
      addAlert("El usuario o la contraseña no deben estar vacíos", "warning");
      return;
    } else {
      const login = await actions.login(user.email, user.password);

      if (login) {
        // Si el inicio de sesión es exitoso, navegar a la página deseada
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
              />
              <label htmlFor="passwordCheckInput">Confirm Password</label>
            </div>
          )}

          <div className="d-flex justify-content-center gap-3">
            {isSignIn ? (
              <button className="btn btn-secondary px-4" type="button" onClick={toggleForm}>
                Back to Login
              </button>
            ) : (
              <button className="btn btn-secondary px-4" type="button" onClick={toggleForm}>
                Sign up
              </button>
            )}

            <button className="btn btn-primary px-4" type="submit">
              {isSignIn ? "Register" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
