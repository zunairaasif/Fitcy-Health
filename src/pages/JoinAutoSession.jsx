import { Box, Text } from "grommet";
import { Alert } from "grommet-icons";
import { split } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/common/Loader";
import { initializeApp } from "../redux/app/appSlice";
import { getMe, verifyToken } from "../redux/app/appThunks";

const JoinAutoSession = () => {
  const params = useParams();
  const { search } = useLocation();
  const user = useSelector((state) => state.app.user);
  const validation = useSelector((state) => state.app.token_validation);

  const dispatch = useDispatch();
  const token = split(search, "?token=")[1];
  const navigate = useNavigate();
  useEffect(() => {
    if (token) dispatch(verifyToken({ token }));
  }, []);

  if (validation === null) return <Loader />;

  if (validation === false)
    return (
      <Box height="100vh" justify="center" align="center" gap="small">
        <Alert size="large" color="red" />
        <Box align="center" gap="small">
          <Text size="small" weight="bold">
            Token not valid
          </Text>
          <Box
            onClick={() => {
              navigate(`/`);
            }}
            className="primary-btn"
            round="100px"
            pad={{ vertical: "small", horizontal: "medium" }}
            responsive
          >
            <Text size="small" textAlign="center">
              Back to dashboard
            </Text>
          </Box>
        </Box>
      </Box>
    );

  localStorage.setItem("fitcyAccessToken", token);

  if (!user) {
    dispatch(getMe());
    dispatch(initializeApp());
  }

  if (!user) return <Loader />;

  window.location.replace(`/dashboard/session/${params.app_id}`);
  return <Loader />;
};

export default JoinAutoSession;
