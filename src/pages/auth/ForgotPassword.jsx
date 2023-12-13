import React from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/app/appThunks";
import { useNavigate } from "react-router-dom";
import promo from "../../assets/auth/promo.png";
import Header from "../../components/common/Header";
import { IoIosArrowBack } from "react-icons/io";
import { useState } from "react";
export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    navigate(`/`);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(
      forgotPassword({
        email: e.target.email.value,
      })
    );
  };

  return (
    <div className="h-100">
      <Header />
      <div className="box-row w-100 h-100">
        <div className="leftAuth">
          <div className="authForm">
            <span
              style={{
                fontFamily: "PT Serif",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Please enter your email to reset your password
            </span>
            <form
              method="POST"
              onSubmit={handlePasswordReset}
              className="w-100 box-column center-align"
            >
              <div className="labelInputSet">
                <label className="defaultLabel">Email Address</label>

                <input
                  type="email"
                  name="email"
                  onChangeCapture={() => {
                    setLoading(false);
                  }}
                  placeholder="Your email address"
                  className="defaultInput"
                />
              </div>
              <button
                disabled={loading}
                style={{ background: loading ? "grey" : null }}
                type="submit"
                className="primary-btn w-100"
              >
                Submit{" "}
              </button>
              <button
                onClick={handleLogin}
                className="primary-btn icon-btn w-100"
              >
                {" "}
                <IoIosArrowBack /> Back to log in
              </button>
            </form>
          </div>
        </div>
        <div className="rightAuth">
          <img src={promo} className="promoimage" alt="auth-promo" />
        </div>
      </div>
    </div>
  );
}
