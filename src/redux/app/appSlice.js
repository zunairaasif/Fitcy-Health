import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getErrorDetailsforNotif } from "../../services/globalFunctions";
import { patchOnboardingStatus } from "../onboarding/onboardingThunks";
import { updatePatientPicture } from "../patient/patientThunks";
import { updateTherapistPicture } from "../therapist/therapistThunks";
import {
  addTransactionHistory,
  changeTherapist,
  forgotPassword,
  getAppointment,
  getLatestMessagesTime,
  getMe,
  getMeEasy,
  getPackagesList,
  getPatientList,
  getSinglePatient,
  getTherapistListAdmin,
  getUnreadMessagesCount,
  resetPassword,
  scheduleNewAppointmentAdmin,
  sendOnboardingEmail,
  sendSetPasswordLink,
  setNewPassword,
  signinUser,
  signupUser,
  signupUserAdmin,
  verifyToken,
} from "./appThunks";

const initialState = {
  isInitialized: false,
  user: null,
  patient_list: null,
  current_password_link: null,
  packages_list: null,
  current_patient: null,
  therapist_list: null,
  stop_loading: false,
  latest_times: null,
  token_validation: null,
  this_appointment: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initializeApp: (state) => {
      state.isInitialized = true;
    },
    stopLoading: (state) => {
      state.stop_loading = false;
    },
    logOutUser: (state) => {
      state.user = null;
      localStorage.removeItem("fitcyAccessToken");
      localStorage.removeItem("fitcyRefreshToken");
    },
    clearPasswordLink: (state) => {
      state.current_password_link = null;
    },
    clearCurrentPatient: (state) => {
      state.current_patient = null;
    },
  },
  extraReducers: {
    [signinUser.fulfilled]: (state, { payload }) => {
      localStorage.setItem("fitcyAccessToken", payload.token.access);
      localStorage.setItem("fitcyRefreshToken", payload.token.refresh);
      state.user = payload.user;
    },
    [signinUser.rejected]: () => {
      toast.error("The username or password you entered is incorrect");
      toast(
        "If you are an existing customer/specialist accessing the Fitcy Health 2.0 platform, please click on Forgot Password, and enter your email address. This will allow you to log in for the first time & set a new password."
      );
    },
    [signupUser.rejected]: (state, action) => {
      state.stop_loading = true;
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [signupUser.fulfilled]: async (state, { payload }) => {
      const result = await payload.json();

      localStorage.setItem("fitcyAccessToken", result.token.access);
      localStorage.setItem("fitcyRefreshToken", result.token.refresh);

      if (payload.status === 200) window.location.replace("/");

      if (payload.status === 201)
        window.location.replace("/dashboard/patient-onboarding?skip_questions");
    },
    [setNewPassword.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [setNewPassword.fulfilled]: async (state, { payload }) => {
      localStorage.setItem("fitcyAccessToken", payload.token.access);
      localStorage.setItem("fitcyRefreshToken", payload.token.refresh);

      window.location.replace("/");
    },

    [signupUserAdmin.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [signupUserAdmin.fulfilled]: () => {
      toast.success("Patient added");
    },
    [getMe.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.isInitialized = true;
    },
    [getMe.rejected]: (state) => {
      state.user = null;
      localStorage.removeItem("fitcyAccessToken");
      localStorage.removeItem("fitcyRefreshToken");
      state.isInitialized = true;
    },
    [getMeEasy.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.isInitialized = true;
    },
    [getMeEasy.rejected]: (state) => {
      state.isInitialized = true;
    },
    [forgotPassword.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [forgotPassword.fulfilled]: () => {
      toast.success(
        "Please check your email for reset link. Redirecting to login page",
        {
          onClose: () => window.location.replace("/"),
        }
      );
    },
    [resetPassword.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [resetPassword.fulfilled]: () => {
      toast.success("Password reset succesfully. Redirecting to login page", {
        onClose: () => window.location.replace("/"),
      });
    },
    [patchOnboardingStatus.fulfilled]: (state, action) => {
      state.user = action.payload;
    },

    [updateTherapistPicture.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [updateTherapistPicture.fulfilled]: (state, action) => {
      state.user = action.payload;
    },
    [updatePatientPicture.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [updatePatientPicture.fulfilled]: (state, action) => {
      state.user = action.payload;
    },
    [getUnreadMessagesCount.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getUnreadMessagesCount.fulfilled]: (state, action) => {
      state.unread_count = action.payload;
    },
    [getLatestMessagesTime.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getLatestMessagesTime.fulfilled]: (state, action) => {
      state.latest_times = action.payload;
    },
    [getPatientList.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getPatientList.fulfilled]: (state, action) => {
      state.patient_list = action.payload;
    },
    [sendSetPasswordLink.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [sendSetPasswordLink.fulfilled]: (state, action) => {
      state.current_password_link = action.payload;
    },
    [sendOnboardingEmail.rejected]: () => {
      toast.error("Appointment does not exist");
    },
    [sendOnboardingEmail.fulfilled]: () => {
      toast.success("Onboarding email sent");
    },
    [scheduleNewAppointmentAdmin.rejected]: (state, action) => {
      toast.error(action.payload);
    },
    [scheduleNewAppointmentAdmin.fulfilled]: () => {
      toast.success("Appointment set");
    },
    [getPackagesList.rejected]: (state, action) => {
      toast.error(action.payload);
    },
    [getPackagesList.fulfilled]: (state, action) => {
      state.packages_list = action.payload;
    },

    [addTransactionHistory.rejected]: (state, action) => {
      toast.error(action.payload);
    },
    [addTransactionHistory.fulfilled]: () => {
      toast.success("Transaction added");
    },
    [getSinglePatient.rejected]: (state, action) => {
      toast.error(action.payload);
    },
    [getSinglePatient.fulfilled]: (state, action) => {
      state.current_patient = action.payload;
    },
    [getTherapistListAdmin.rejected]: (state, action) => {
      toast.error(action.payload);
    },
    [getTherapistListAdmin.fulfilled]: (state, action) => {
      state.therapist_list = action.payload;
    },
    [changeTherapist.rejected]: (state, action) => {
      toast.error(action.payload);
    },
    [changeTherapist.fulfilled]: () => {
      toast.success("therapist changed");
    },
    [verifyToken.rejected]: (state) => {
      state.token_validation = false;
    },
    [verifyToken.fulfilled]: (state) => {
      state.token_validation = true;
    },
    [getAppointment.fulfilled]: (state, action) => {
      state.this_appointment = action.payload;
    },
    [getAppointment.rejected]: (state) => {
      state.this_appointment = "invalid";
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initializeApp,
  logOutUser,
  clearPasswordLink,
  clearCurrentPatient,
  stopLoading,
} = appSlice.actions;

export default appSlice.reducer;
