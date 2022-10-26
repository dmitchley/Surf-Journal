import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");

  // if no jwt generated reverts back to /signin

  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoutes;
