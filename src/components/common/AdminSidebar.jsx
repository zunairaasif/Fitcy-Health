import React, { useState } from "react";
import { Button, Box, Nav, Grommet, Sidebar, Text } from "grommet";

import {
  Edit,
  // Help,
  // ThreeDffects,
} from "grommet-icons";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUnreadMessagesCount } from "../../redux/app/appThunks";

// import { Sidebar } from '../Sidebar';

// const src = '//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80';

const SidebarHeader = () => (
  <Box
    // pad={{ horizontal: "small" }}
    align="center"
    gap="small"
    direction="row"
    // margin={{ bottom: "small" }}
  >
    {/* <Stack alignSelf="start" align="center" anchor="top-right"> */}

    {/* <Avatar src={src} /> */}
    {/* <Box pad="xsmall" background="orange" round responsive={false} /> */}
    {/* </Stack> */}
    {/* <Text>Shimrit Yacobi</Text> */}
  </Box>
);

const SidebarButton = ({ icon, label, route, ...rest }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const messageCount = useSelector((state) => state.app.unread_count);

  return (
    <Box
      pad="small"
      direction="column"
      background={
        !isTabletOrMobile && window.location.pathname === route
          ? "#10111216"
          : null
      }
      style={{
        borderTop:
          isTabletOrMobile && window.location.pathname === route
            ? "2px solid #009688"
            : null,
      }}
      round={isTabletOrMobile ? null : "8px"}
      // justify={isTabletOrMobile ? "center" : null}
      justify="center"
      align="center"
    >
      <Button
        gap="medium"
        className="noOutline"
        alignSelf={isTabletOrMobile ? null : "start"}
        plain
        style={{
          display: "flex",
          flexDirection: isTabletOrMobile ? "column" : "row",
        }}
        icon={icon}
        label={
          !isTabletOrMobile ? (
            label === "Messages" ? (
              <Box direction="row" align="center">
                {" "}
                {label}{" "}
                <Box
                  pad="4px"
                  height="20px"
                  width="20px"
                  round="full"
                  margin={{ left: "small" }}
                  background={messageCount > 0 ? "#009688" : null}
                  align="center"
                  justify="center"
                  style={{
                    border: messageCount > 0 ? "1px solid #ffffff80" : null,
                  }}
                >
                  {messageCount > 0 ? (
                    <Text size="xsmall">{messageCount} </Text>
                  ) : null}
                </Box>
              </Box>
            ) : (
              label
            )
          ) : null
        }
        {...rest}
        onClick={() => window.location.replace(route)}
      />
      {isTabletOrMobile ? (
        <Text
          style={{ cursor: "pointer" }}
          textAlign="center"
          size="xsmall"
          color={window.location.pathname === route ? "#009688" : null}
        >
          {label}
        </Text>
      ) : null}
    </Box>
  );
};

const SidebarFooter = () => (
  <Nav>{/* <SidebarButton icon={<Help />} label="Support" /> */}</Nav>
);

const MainNavigation = () => {
  const check = useLocation();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const user = useSelector((state) => state.app.user);

  const [showLabels] = useState(
    !check.pathname.startsWith("/dashboard/session/") ? true : false
  );

  return (
    <Nav
      gap="xsmall"
      pad="small"
      responsive={false}
      direction={isTabletOrMobile ? "row" : "column"}
      align={isTabletOrMobile ? "center" : null}
      style={{
        width: isTabletOrMobile ? "100%" : null,
        // height: "100%",
        justifyContent: isTabletOrMobile ? "space-between" : null,
      }}
    >
      {user.role === "SUPER_ADMIN" && (
        <SidebarButton
          icon={
            <Edit
              color={
                window.location.pathname === "/dashboard/super_admin" &&
                isTabletOrMobile
                  ? "#009688"
                  : null
              }
            />
          }
          label={showLabels ? "Home" : null}
          route={"/dashboard/super_admin"}
        />
      )}
    </Nav>
  );
};

export const AdminLabels = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUnreadMessagesCount());
  }, []);

  return (
    <Grommet>
      <Box
        direction="row"
        height={{ min: !isTabletOrMobile ? "100%" : null }}
        // width={{ min: isTabletOrMobile ? "100%" : null }}
        // style={{ boxShadow: "1px 0px 0px 10px red" }}
        background={isTabletOrMobile ? "#FFFFFF" : "#009688"}
        className={isTabletOrMobile ? "bottom-nav" : null}
      >
        <Sidebar
          // responsive={true}
          // background="neutral-2"
          width={isTabletOrMobile ? "100%" : null}
          header={<SidebarHeader />}
          footer={<SidebarFooter />}
          pad={{ left: "medium", right: "medium", vertical: "small" }}
        >
          <MainNavigation />
        </Sidebar>
      </Box>
    </Grommet>
  );
};
