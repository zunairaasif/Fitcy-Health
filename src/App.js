import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/404";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { initializeApp } from "./redux/app/appSlice";
import { hotjar } from "react-hotjar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgoraDemo from "./pages/AgoraDemo";
import Loader from "./components/common/Loader";
import { getMe } from "./redux/app/appThunks";
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SignUp from "./pages/auth/SignUp";
import PatientOnboarding from "./pages/patient/PatientOnboarding";
import PatientDashboardComplete from "./pages/patient/PatientDashboardComplete";
import Messages from "./pages/patient/Messages/Messages";
import Notes from "./pages/patient/Notes";
import Appoinments from "./pages/patient/Appointments";
import Settings from "./pages/patient/Settings";
import TherapistOnboarding from "./pages/therapist/TherapistOnboarding";
import TherapistDashboardComplete from "./pages/therapist/TherapistDashboardComplete";
import TherapistAppoinments from "./pages/therapist/TherapistAppointments";
import TherapistMessages from "./pages/therapist/TherapistMessages/Messages";
import TherapistNotes from "./pages/therapist/TherapistNotes";
import TherapistSettings from "./pages/therapist/TherapistSettings";
// import useHubspotChat from "./components/common/HubspotChat";
import ChangeTherapist from "./pages/patient/ChangeTherapist";
import SetPassword from "./pages/auth/SetPassword";
import GuidedSignUp from "./pages/auth/GuidedSignUp";
import SelectPackageNewOnboarding from "./components/common/SelectPackageNewOnboarding";
import PackageConfirmation from "./pages/patient/PackageConfirmation";
import AgoraPublic from "./pages/AgoraPublic";
import JoinAutoSession from "./pages/JoinAutoSession";
import Table from "./pages/patient/Table";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const isLoading = useSelector((state) => state.app.isInitialized);
  useEffect(() => {
    hotjar.initialize(3015667, 6);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("fitcyAccessToken")) dispatch(getMe());
    else dispatch(initializeApp());
  }, []);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

  const PatientRoute = ({ children }) => {
    return user && user.role === "PATIENT" ? children : <Navigate to="/" />;
  };
  const SuperAdminRoute = ({ children }) => {
    return user && user.role === "SUPER_ADMIN" ? children : <Navigate to="/" />;
  };

  const TherapistRoute = ({ children }) => {
    return user && user.role === "THERAPIST" ? children : <Navigate to="/" />;
  };

  const PublicRoute = ({ children }) => {
    return user ? (
      <Navigate to={`/dashboard/${String(user.role).toLowerCase()}`} />
    ) : (
      children
    );
  };
  // useHubspotChat(20127715);

  if (!isLoading) return <Loader />;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/psychologist/calendar"
          element={
            // <PublicRoute>
            <GuidedSignUp />
            // </PublicRoute>
          }
        />
        <Route
          path="/psychologist"
          element={
            // <PublicRoute>
            <SelectPackageNewOnboarding />
            // </PublicRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/p/:callID"
          element={
            <PublicRoute>
              <AgoraPublic />
            </PublicRoute>
          }
        />
        <Route
          path="/t/:callID"
          element={
            <PublicRoute>
              <AgoraPublic />
            </PublicRoute>
          }
        />
        <Route path="/join/:app_id" element={<JoinAutoSession />} />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/resetPassword/confirm/"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/setPassword/confirm/"
          element={
            <PublicRoute>
              <SetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard/therapist"
          element={
            <TherapistRoute>
              <Dashboard Page={TherapistDashboard} />
            </TherapistRoute>
          }
        />
        <Route
          path="/dashboard/therapist-onboarding"
          element={
            <TherapistRoute>
              <TherapistOnboarding />
            </TherapistRoute>
          }
        />
        <Route
          path="/dashboard/patient"
          element={
            <PatientRoute>
              <Dashboard Page={PatientDashboard} />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/patient-complete"
          element={
            <PatientRoute>
              <Dashboard Page={PatientDashboardComplete} />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/therapist-complete"
          element={
            <TherapistRoute>
              <Dashboard Page={TherapistDashboardComplete} />
            </TherapistRoute>
          }
        />
        <Route
          path="/dashboard/patient-onboarding"
          element={
            <PatientRoute>
              <PatientOnboarding />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/table"
          element={
            <PatientRoute>
              <Table />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/package-confirmation"
          element={
            <PatientRoute>
              <PackageConfirmation />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <PatientRoute>
              <Dashboard Page={Messages} />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/notes"
          element={
            <PatientRoute>
              <Dashboard Page={Notes} />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/appointments"
          element={
            <PatientRoute>
              <Dashboard Page={Appoinments} />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/therapist-appointments"
          element={
            <TherapistRoute>
              <Dashboard Page={TherapistAppoinments} />
            </TherapistRoute>
          }
        />
        <Route
          path="/dashboard/change-therapist"
          element={
            <PatientRoute>
              <Dashboard Page={ChangeTherapist} />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/therapist-messages"
          element={
            <TherapistRoute>
              <Dashboard Page={TherapistMessages} />
            </TherapistRoute>
          }
        />
        <Route
          path="/dashboard/therapist-notes"
          element={
            <TherapistRoute>
              <Dashboard Page={TherapistNotes} />
            </TherapistRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <PatientRoute>
              <Dashboard Page={Settings} />
            </PatientRoute>
          }
        />
        <Route
          path="/dashboard/therapist-settings"
          element={
            <TherapistRoute>
              <Dashboard Page={TherapistSettings} />
            </TherapistRoute>
          }
        />
        <Route
          path="/dashboard/session/:app_id"
          element={
            <PrivateRoute>
              <Dashboard Page={AgoraDemo} />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/super_admin"
          element={
            <SuperAdminRoute>
              <Dashboard Page={ChangeTherapist} />
            </SuperAdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer style={{ marginTop: "60px" }} />
    </>
  );
}

export default App;
