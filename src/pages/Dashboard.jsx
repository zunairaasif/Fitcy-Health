import { Avatar, Box, Text } from "grommet";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { Labels } from "../components/common/Sidebar";
import noAvatar from "../assets/noAvatar.jpeg";
import { useSelector } from "react-redux";
// import BookSession from "../components/common/BookSession";
import { AddCircle } from "grommet-icons";
import { useMediaQuery } from "react-responsive";
// import { capitalizeWord } from "../services/globalFunctions";
import { capitalize } from "lodash";
import BookSessionNew from "../components/common/BookSessionNew";
import { AdminLabels } from "../components/common/AdminSidebar";
import { ThreeDots } from "react-loader-spinner";

const RightBar = () => {
  const user = useSelector((state) => state.app.user);
  const [showBookSession, setShowBookSession] = useState(false);

  const navigate = useNavigate();

  if (!user || !user.current_therapist)
    return (
      <Box
        style={{
          // boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.12)",
          flexShrink: "0",
          minWidth: "200px",
          maxWidth: "250px",
        }}
        pad="medium"
        align="center"
        // background="red"
      >
        <ThreeDots color="black" height={80} width={80} />
      </Box>
    );

  return (
    <>
      {showBookSession ? (
        <BookSessionNew
          therapistID={user.current_therapist.id}
          setShowLayer={(value) => setShowBookSession(value)}
        />
      ) : null}

      <Box
        gap="small"
        style={{
          // boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.12)",
          flexShrink: "0",
          minWidth: "200px",
          maxWidth: "250px",
        }}
        pad="medium"
      >
        <Box
          round="8px"
          background="rgba(239, 255, 254, 1)"
          style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}
          align="center"
          justify="between"
        >
          <Box pad="small" align="center" justify="center">
            <Avatar
              size="large"
              src={
                user.current_therapist.dp ? user.current_therapist.dp : noAvatar
              }
            />
            <Text weight="bold" size="small">
              {user.current_therapist.first_name}{" "}
              {user.current_therapist.last_name}
            </Text>
            <Text size="small">{user.current_therapist.designation}</Text>
          </Box>
          <Box
            background="#009688"
            style={{ borderRadius: "0px 0px 8px 8px" }}
            width="100%"
            align="center"
            justify="between"
            direction="row"
            pad="small"
          >
            <Box>
              <Text size="small" weight="bold">
                Book Appointment
              </Text>
              <Text size="small">
                <b>{user.credits}</b> Sessions Left
              </Text>
            </Box>
            <AddCircle
              style={{ cursor: "pointer" }}
              className="noOutline"
              onClick={() => setShowBookSession(true)}
              color="#fff"
            />
          </Box>

          {/* <img src={noAvatar} /> */}
        </Box>
        <Text color="rgba(117, 117, 117, 1)" size="small" textAlign="center">
          You can upgrade your package to book more sessions
        </Text>
        <Box
          round="20px"
          background="#EFFFFE"
          pad="small"
          align="center"
          className="noOutline"
          onClick={() => navigate("/dashboard/settings?package")}
        >
          <Text color="#009688" size="small" weight="bold" textAlign="center">
            Package:{" "}
            {user.package ? capitalize(user.package.tier) : "No Package"} Tier
          </Text>
        </Box>
        {/* Hello */}
      </Box>
    </>
  );
};

export default function Dashboard({ Page }) {
  const check = useLocation();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const user = useSelector((state) => state.app.user);

  return (
    <>
      <Box height="100vh" justify="start" style={{ overflowY: "hidden" }}>
        {!check.pathname.startsWith("/dashboard/session/") ? <Navbar /> : null}

        <Box
          direction={isTabletOrMobile ? "column" : "row"}
          justify="between"
          // justify={isTabletOrMobile:}
          // margin={{ bottom: isTabletOrMobile ? "100px" : null }}
        >
          {!check.pathname.startsWith("/dashboard/session/") &&
          !isTabletOrMobile &&
          user.role !== "SUPER_ADMIN" ? (
            <Labels />
          ) : null}
          {!check.pathname.startsWith("/dashboard/session/") &&
          !isTabletOrMobile &&
          user.role === "SUPER_ADMIN" ? (
            <AdminLabels />
          ) : null}

          <Box
            align="center"
            justify="center"
            width="100%"
            className={
              isTabletOrMobile
                ? !check.pathname.startsWith("/dashboard/session/")
                  ? "checkHeight"
                  : "fullHeightCheck"
                : !check.pathname.startsWith("/dashboard/session/")
                ? "checkHeighDesktop"
                : "fullHeightCheck"
            }
            background={isTabletOrMobile ? "#F5F5F5" : "#EFFFFE"}
            style={{ overflowY: "auto" }}
            // background="red"
          >
            <Page />
          </Box>
          {check.pathname === "/dashboard/patient-complete" ||
          check.pathname === "/dashboard/appointments" ? (
            isTabletOrMobile ? null : (
              <RightBar />
            )
          ) : null}
          {!check.pathname.startsWith("/dashboard/session/") &&
          isTabletOrMobile ? (
            <Labels />
          ) : null}
        </Box>
      </Box>
    </>
  );
}
