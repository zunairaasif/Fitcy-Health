import React from "react";
import logo from "../../assets/logo.png";
import { ThreeDots } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loader">
      <img alt="Logo" width="250px" src={logo} />
      <ThreeDots color="black" height={80} width={80} />
    </div>
  );
};
export default Loader;
