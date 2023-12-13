import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getGreetingTime } from "../../services/globalFunctions";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.app.user);
  useEffect(() => {
    if (!user.onboarding) navigate(`/dashboard/patient-onboarding`);
    else navigate(`/dashboard/patient-complete`);
  });

  return (
    <div className="box-column center-align container">
      <p>
        {getGreetingTime(moment())} {user.first_name} {user.last_name}
      </p>
    </div>
  );
}
