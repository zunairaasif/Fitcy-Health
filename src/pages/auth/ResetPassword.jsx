import React from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../redux/app/appThunks";
import promo from "../../assets/auth/promo.png";
import { toast } from "react-toastify";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);
  let token = urlParams.get("token");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(`/`);
  };
  const handleConfirmPassword = (e) => {
    e.preventDefault();

    if (e.target.password.value !== e.target.confirm_password.value) {
      toast.error("Passwords do no match");
      return;
    }

    dispatch(
      resetPassword({
        password: e.target.password.value,
        token,
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
              Please reset your password
            </span>
            <form
              method="POST"
              onSubmit={handleConfirmPassword}
              className="w-100 box-column center-align"
            >
              <div className="labelInputSet">
                <label className="defaultLabel">New Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  className="defaultInput"
                />
              </div>

              <div className="labelInputSet">
                <label className="defaultLabel">Confirm Password</label>

                <input
                  type="password"
                  name="confirm_password"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  className="defaultInput"
                />
              </div>
              <button type="submit" className="primary-btn w-100">
                Submit{" "}
              </button>
              <button
                onClick={handleLogin}
                className="primary-btn w-100 icon-btn"
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
