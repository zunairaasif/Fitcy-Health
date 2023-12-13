import React from "react";
import { useDispatch } from "react-redux";
import { signinUser } from "../../redux/app/appThunks";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
// import GoogleButton from "../../components/common/GoogleButton";
// import OrDivider from "../../components/common/OrDivider";
import promo from "../../assets/auth/promo.png";
import { Box } from "grommet";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate(`/forgot-password`);
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    navigate(`/sign-up`);
  };
  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(
      signinUser({
        username: String(e.target.username.value).toLowerCase(),
        password: e.target.password.value,
      })
    );
  };

  return (
    <div className="h-100">
      <Header />
      <div className="box-row w-100" style={{ height: "92vh" }}>
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
              Login
            </span>
            {/* <GoogleButton /> */}
            {/* <OrDivider /> */}
            <form
              method="POST"
              onSubmit={handleLogin}
              className="w-100 box-column center-align"
            >
              <div className="labelInputSet">
                <label className="defaultLabel">Email Address</label>

                <input
                  type="email"
                  name="username"
                  placeholder="Your email address"
                  className="defaultInput"
                />
              </div>
              <div className="labelInputSet">
                <label className="defaultLabel">Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  className="defaultInput"
                />
              </div>
              <Box align="end" justify="end" width="100%">
                <Box
                  style={{
                    background: "none",
                    color: "#009688",
                    boxShadow: "none",
                    fontSize: "small",
                  }}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Box>
              </Box>
              <button type="submit" className="primary-btn w-100">
                Log in
              </button>
              <div className="loginBottomBar">
                Don&apos;t have an account?&nbsp;
                <div onClick={handleSignUp} className="greenLink">
                  Sign up
                </div>
              </div>
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
