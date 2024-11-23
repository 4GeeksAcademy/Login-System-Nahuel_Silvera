import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/index.css";

const Login = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [isShow, setIsShown] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_check: "",
  });


  const registerUser = async (e) => {
    e.preventDefault(); 
    if (user.password === user.password_check && user.password !== "") {
      const createUser = await actions.createUser(user);
      if (createUser) {
        alert("User was created");
        setUser({
          name: "",
          email: "",
          password: "",
          password_check: "",
        });
        setIsShown(!isShow);
      } else alert("An expected error occurred");
    } else {
      alert("Passwords don't match");
      setUser({ ...user, password: "", password_check: "" });
    }
  };

  const [isSignIn, setIsSignIn] = useState(false);

  const toggleForm = () => {
    setIsSignIn((prev) => !prev);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card rounded-5 shadow p-4" style={{ width: "350px" }}>
        <form onSubmit={registerUser}> {/* Enviar datos al backend al hacer submit */}
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
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
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
