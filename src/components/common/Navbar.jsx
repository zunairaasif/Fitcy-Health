import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/app/appSlice";
import logo from "../../assets/logo.png";
// import { AiOutlineLogout } from "react-icons/ai";
import { Menu, Text } from "grommet";
import { FormDown, Logout } from "grommet-icons";

export default function Navbar() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.app.user);

  const handleLogout = () => {
    dispatch(logOutUser());
  };

  return (
    <div className="nav_main">
      <div className="nav_content">
        <img src={logo} height={30} />
        <Menu
          style={{
            background: "#EFFFFE",
            border: "1px solid rgba(16, 17, 18, 0.12)",
            borderRadius: "8px",
            minWidth: "100px",
          }}
          className="noOutlineWithBorder"
          icon={<FormDown color="#757575" />}
          label={
            <Text pad="small" size="small">
              {user.first_name}
            </Text>
          }
          items={[
            {
              label: <Text size="small">Log out</Text>,
              onClick: () => {
                handleLogout();
              },
              plain: true,
              icon: <Logout size="20px" />,
              gap: "small",
              size: "small",
            },
            // { label: 'Second Action', onClick: () => { } },
          ]}
          dropProps={{
            round: "8px",
            justify: "center",
            style: {
              backgroundColor: "rgba(239, 255, 254, 1)",
              zIndex: "10000000",
              border: "1px solid rgba(16, 17, 18, 0.12)",
              alignItems: "center",
            },
          }}
          // dropAlign={{ top: "bottom", }}
          // dropBackground={{ color: "red", opacity: false }}
        />
        {/* <button onClick={handleLogout}>
          {" "}
          <AiOutlineLogout />{" "}
        </button> */}
      </div>
    </div>
  );
}
