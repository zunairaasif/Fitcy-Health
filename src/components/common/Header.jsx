import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import { logOutUser } from "../../redux/app/appSlice";

export default function Header() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.app.user);

  const handleLogout = () => {
    dispatch(logOutUser());
  };
  return (
    <div className="header_main">
      <div className="header_content">
        <img src={logo} height={30} />
        {user ? (
          <button className="logoutButton" onClick={handleLogout}>
            Log out
          </button>
        ) : null}
      </div>
    </div>
  );
}
