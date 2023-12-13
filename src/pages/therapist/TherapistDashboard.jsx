import moment from "moment";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getGreetingTime } from "../../services/globalFunctions";
export default function TherapistDashboard() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.app.user);

  useEffect(() => {
    if (!user.onboarding) navigate(`/dashboard/therapist-onboarding`);
    else navigate(`/dashboard/therapist-complete`);
  });

  return (
    <div className="box-column center-align container">
      <p>
        {getGreetingTime(moment())}, {user.first_name} {user.last_name}
      </p>
    </div>
  );
}
