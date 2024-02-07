import "./LoginAndRegister.css";

import { HiOutlineMail } from "react-icons/hi";
import { BiLock } from "react-icons/bi";
import { Link } from "react-router-dom";

const Login = () => {
  
  const login = async (e) => {
    e.preventDefault();
  };

  return (
    <section className="auth">
      <div className="formBox">
        <form className="auth__form" onSubmit={login}>
          <h2>Login</h2>
          <div className="inputBox">
            <HiOutlineMail className="auth__icon" />
            <input type="text" name="email" required />
            <label htmlFor="email">Email</label>
          </div>
          <div className="inputBox">
            <BiLock className="auth__icon" />
            <input type="password" name="password" required />
            <label htmlFor="password">Password</label>
          </div>
          <div className="forget">
            <Link to="/forgot" className="link">
              Forgot Password?
            </Link>
          </div>
          <button className="auth__button">Log in</button>
          <div className="auth__links">
            <Link to="/" className="link">
              Home
            </Link>
            Don't have an account?
            <Link to="/register" className="link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
