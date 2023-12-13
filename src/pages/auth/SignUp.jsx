import React from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../../redux/app/appThunks";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
// import GoogleButton from "../../components/common/GoogleButton";
// import OrDivider from "../../components/common/OrDivider";
import promo from "../../assets/auth/promo.png";
import { split } from "lodash";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { FormPreviousLink } from "grommet-icons";
import { Box, Text } from "grommet";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { stopLoading } from "../../redux/app/appSlice";
export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useLocation();
  const [loading, setLoading] = useState(false);

  const stopLoader = useSelector((state) => state.app.stop_loading);

  useEffect(() => {
    if (stopLoader) {
      setLoading(false);
      dispatch(stopLoading());
    }
  }, [stopLoader]);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(`/`);
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(
      signupUser({
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        cell_number: e.target.cell_number.value,

        therapist_slug: split(split(params.search, "?t=")[1], "&")[0]
          ? split(split(params.search, "?t=")[1], "&")[0]
          : null,
        timezone: window.localStorage.getItem("onboarding-timezone")
          ? JSON.parse(window.localStorage.getItem("onboarding-timezone"))[0]
          : null,
      })
    );
  };

  return (
    <div className="h-100">
      <Header />

      <div className="box-row w-100" style={{ height: "92vh" }}>
        <div className="leftAuth">
          {window.localStorage.getItem("from-guided-journey") && (
            <Box
              className="noOutline"
              onClick={() =>
                window.location.replace(
                  `/psychologist/calendar?t=${
                    JSON.parse(
                      window.localStorage.getItem("guided-selected-therapist")
                    ).slug
                  }`
                )
              }
              style={{
                // marginTop: "5px",
                cursor: "pointer",
                marginBottom: "5px",
              }}
              // background="red"
              width="100%"
              pad="small"
              direction="row"
              align="center"
              gap="small"
            >
              <Box
                className="primary-btn"
                gap="small"
                direction="row"
                pad="small"
                align="center"
                round="8px"
              >
                {" "}
                <FormPreviousLink color="white" size="small" />
                <Text size="small">Back</Text>
              </Box>
            </Box>
          )}
          <div className="authForm">
            <span
              style={{
                fontFamily: "PT Serif",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Sign up for our affordable therapy
            </span>
            {/* <GoogleButton /> */}
            {/* <OrDivider /> */}
            <form
              method="POST"
              onSubmit={handleSignUp}
              className="w-100 box-column center-align"
            >
              <div className="labelInputSet">
                <label className="defaultLabel">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Your first name"
                  className="defaultInput"
                />
              </div>

              <div className="labelInputSet">
                <label className="defaultLabel">Last Name</label>

                <input
                  type="text"
                  name="last_name"
                  placeholder="Your last name"
                  className="defaultInput"
                />
              </div>
              <div className="labelInputSet">
                <label className="defaultLabel">Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="defaultInput"
                />
              </div>
              <div className="labelInputSet">
                <label className="defaultLabel">Phone Number</label>

                <input
                  name="cell_number"
                  placeholder="Your Phone Number"
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
              <button
                type="submit"
                className="primary-btn w-100"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                {loading ? (
                  <TailSpin height="20px" color="white" />
                ) : (
                  "Create Account"
                )}
              </button>
              <p className="disclaimer">
                By continuing, you agree to the{" "}
                <a
                  href="https://fitcyhealth.com/terms-and-conditions/"
                  rel="noreferrer"
                  target="_blank"
                  style={{ color: "#000" }}
                >
                  Terms of use
                </a>{" "}
                and
                <a
                  href="https://fitcyhealth.com/privacy-policy/"
                  rel="noreferrer"
                  target="_blank"
                  style={{ color: "#000" }}
                >
                  {" "}
                  Privacy Policy
                </a>{" "}
                of Fitcy Health.{" "}
              </p>
            </form>
          </div>
          <div className="loginBottomBar">
            Already have an account? &nbsp;
            <div onClick={handleLogin} className="greenLink">
              Log in
            </div>
          </div>
        </div>
        <div className="rightAuth">
          <img src={promo} className="promoimage" alt="auth-promo" />
        </div>
      </div>
    </div>
  );
}
