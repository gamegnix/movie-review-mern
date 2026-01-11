import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      login(res.data.user);
      alert("Login successful");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
