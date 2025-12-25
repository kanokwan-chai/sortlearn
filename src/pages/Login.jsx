import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { saveResult } from "../utils/api";

import "../styles/login.css";
import logo from "../assets/logo.png";

const clientId =
  "90040383649-suig5o3go93vlafkh965fbbhl62qppmh.apps.googleusercontent.com";

function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (res) => {
    const decoded = jwtDecode(res.credential);
    const user = {
      firstname: decoded.given_name || "",
      lastname: decoded.family_name || "",
      email: decoded.email || "",
    };

    localStorage.setItem("user", JSON.stringify(user));

    await saveResult({ activity: "STUDENTS", ...user });

    navigate("/home");
  };

  const handleError = () =>
    alert("ไม่สามารถเข้าสู่ระบบด้วยบัญชี Google ได้");

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">

        <div className="login-card">

          {/* โลโก้ลอย */}
          <div className="logo-wrapper">
            <div className="logo-circle">
              <img src={logo} alt="logo" className="logo-img" />
            </div>
          </div>

          <h1 className="login-title">เข้าสู่ระบบ</h1>
          <p className="login-subtitle">เข้าสู่ระบบด้วยบัญชี Google ของคุณ</p>

          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              shape="pill"
              size="large"
              text="continue_with"
            />
          </div>

          <p className="login-footer">
            © 2025 SortLearn Online | KMUTNB Computer Education
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
