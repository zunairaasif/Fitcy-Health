import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getErrorDetailsforNotif } from "../../services/globalFunctions";
import {
  applyCouponOneTimeRecharge,
  applyCouponUpgradeRecharge,
  deleteAppointment,
  getAllAppointmentsPatient,
  getAppointmentSchedule,
  getBillingRedirect,
  getCardDetails,
  getMessageHistory,
  getPatientNotes,
  getPatientTherapists,
  getRandomSetupIntent,
  getTherapistList,
  getTherapistTierPackage,
  getTimeZoneOptions,
  getUpcomingAppointments,
  listAvailableSlots,
  listAvailableSlotsUnAuth,
  oneTimeRecharge,
  patchAppointment,
  payOneTime,
  payUpgrade,
  scheduleNewAppointment,
  switchPatientTherapist,
  updatePatientPassword,
  updatePatientProfile,
  upgradeRecharge,
  customPatientList,
} from "./patientThunks";

const initialState = {
  notes: [],
  messageHistory: null,
  upcomingAppointments: null,
  timezoneOptions: null,
  therapistSchedule: { appointment_slot: null },
  availableSlots: [],
  setup_intent: null,
};

export const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearNotes: (state) => {
      state.notes = [];
    },
    clearSetupIntent: (state) => {
      state.setup_intent = null;
    },
  },
  extraReducers: {
    [getPatientNotes.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getPatientNotes.fulfilled]: (state, action) => {
      state.notes = action.payload;
    },
    [updatePatientPassword.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [updatePatientPassword.fulfilled]: () => {
      toast("Password updated");
    },
    [getMessageHistory.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getMessageHistory.fulfilled]: (state, action) => {
      state.messageHistory = action.payload;
    },
    [getUpcomingAppointments.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getUpcomingAppointments.fulfilled]: (state, action) => {
      state.upcomingAppointments = action.payload;
    },
    [getAppointmentSchedule.rejected]: () => {
      toast.error("Therapist does not have a schedule setup yet");
    },
    [getAppointmentSchedule.fulfilled]: (state, action) => {
      state.therapistSchedule = action.payload;
    },
    [scheduleNewAppointment.rejected]: (state, action) => {
      toast.error(action.payload);
    },
    [scheduleNewAppointment.fulfilled]: () => {
      window.location.reload();
    },
    [patchAppointment.rejected]: (state, action) => {
      toast.error(action.payload);
    },
    [patchAppointment.fulfilled]: () => {
      window.location.reload();
    },
    [deleteAppointment.rejected]: () => {
      toast.error(
        "Cannot cancel appointment when there is less than 24 hours left"
      );
    },
    // [deleteAppointment.fulfilled]: () => {
    //     window.location.reload();
    // },
    [getTimeZoneOptions.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getTimeZoneOptions.fulfilled]: (state, action) => {
      state.timezoneOptions = action.payload;
    },
    [listAvailableSlots.rejected]: (state) => {
      state.availableSlots = [];

      toast.error("No schedule for this therapist");
    },
    [listAvailableSlots.fulfilled]: (state, action) => {
      state.availableSlots = action.payload.bookable;
    },
    [listAvailableSlotsUnAuth.rejected]: (state) => {
      state.availableSlots = [];

      toast.error("No schedule for this therapist");
    },
    [listAvailableSlotsUnAuth.fulfilled]: (state, action) => {
      state.availableSlots = action.payload.bookable;
    },
    [getCardDetails.rejected]: (state) => {
      state.patient_payment = "none";
    },
    [getCardDetails.fulfilled]: (state, action) => {
      state.patient_payment = action.payload;
    },
    [getTherapistTierPackage.rejected]: (state, action) => {
      state.therapist_tier = action.payload;
    },
    [getTherapistTierPackage.fulfilled]: (state, action) => {
      state.therapist_tier = action.payload;
    },
    [updatePatientProfile.fulfilled]: () => {
      toast.success("Profile updated");
    },
    [oneTimeRecharge.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [oneTimeRecharge.fulfilled]: (state, action) => {
      state.onetime_recharge = action.payload;
    },
    [payOneTime.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [payOneTime.fulfilled]: () => {
      toast.success("Credit added");
    },
    [getBillingRedirect.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getBillingRedirect.fulfilled]: (state, action) => {
      state.billing_redirect = action.payload;
    },
    [getAllAppointmentsPatient.fulfilled]: (state, action) => {
      state.all_appointments = action.payload;
    },
    [getAllAppointmentsPatient.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [applyCouponOneTimeRecharge.fulfilled]: (state, { payload }) => {
      state.onetime_recharge = payload;
    },
    [applyCouponOneTimeRecharge.rejected]: () => {
      toast.error("Invalid Coupon");
    },

    [upgradeRecharge.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [upgradeRecharge.fulfilled]: (state, action) => {
      state.upgrade_recharge = action.payload;
    },
    [applyCouponUpgradeRecharge.fulfilled]: (state, { payload }) => {
      state.upgrade_recharge = payload;
    },
    [applyCouponUpgradeRecharge.rejected]: () => {
      toast.error("Invalid Coupon");
    },
    [payUpgrade.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [payUpgrade.fulfilled]: () => {
      toast.success("Package upgraded");
    },
    [getTherapistList.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getTherapistList.fulfilled]: (state, action) => {
      state.therapist_list = action.payload;
    },
    [getRandomSetupIntent.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getRandomSetupIntent.fulfilled]: (state, action) => {
      state.setup_intent = action.payload;
    },
    [switchPatientTherapist.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [switchPatientTherapist.fulfilled]: () => {
      toast.success("Therapist changed");
    },
    [getPatientTherapists.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getPatientTherapists.fulfilled]: (state, action) => {
      state.patientTherapists = action.payload;
    },
    [customPatientList.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [customPatientList.fulfilled]: (state, action) => {
      state.custom_patient_list = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearNotes, clearSetupIntent } = patientSlice.actions;

export default patientSlice.reducer;
