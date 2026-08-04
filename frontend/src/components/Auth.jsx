import { useState } from "react";
import { signup, login } from "../api";

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "signup") {
        await signup(name, email, password);
        setMode("login");
        setError("Signup successful. Please log in.");
        return;
      }
      const data = await login(email, password);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-container">
      <h1>Notes</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{mode === "login" ? "Log In" : "Sign Up"}</h2>
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{mode === "login" ? "Log In" : "Sign Up"}</button>
        {error && <p className="error">{error}</p>}
      </form>
      <button
        className="link-button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError("");
        }}
      >
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default Auth;
