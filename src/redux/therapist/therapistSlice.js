import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getErrorDetailsforNotif } from "../../services/globalFunctions";
import {
  addAppointmentSlot,
  addPatientNote,
  getAllAppointmentsTherapist,
  getTherapistNotes,
  getTherapistPatients,
  getUpcomingAppointmentsTherapist,
  patchPatientNote,
  updateTherapistPassword,
  updateTherapistProfile,
} from "./therapistThunks";

const initialState = {
  notes: [],
  messageHistory: null,
  upcomingAppointments: null,
  timezoneOptions: null,
  therapistSchedule: { appointment_slot: null },
  therapistPatients: null,
};

export const patientSlice = createSlice({
  name: "therapist",
  initialState,
  reducers: {
    clearNotes: (state) => {
      state.notes = [];
    },
  },
  extraReducers: {
    [addAppointmentSlot.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [addAppointmentSlot.fulfilled]: () => {
      toast("Schedule updated");
    },
    [getTherapistNotes.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getTherapistNotes.fulfilled]: (state, action) => {
      state.notes = action.payload;
    },
    [getUpcomingAppointmentsTherapist.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getAllAppointmentsTherapist.fulfilled]: (state, action) => {
      state.all_appointments = action.payload;
    },
    [getAllAppointmentsTherapist.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getUpcomingAppointmentsTherapist.fulfilled]: (state, action) => {
      state.upcomingAppointments = action.payload;
    },
    [updateTherapistPassword.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [updateTherapistPassword.fulfilled]: () => {
      toast("Password updated");
    },

    [getTherapistPatients.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getTherapistPatients.fulfilled]: (state, action) => {
      state.therapistPatients = action.payload;
    },
    [addPatientNote.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [updateTherapistProfile.fulfilled]: () => {
      toast.success("Profile updated");
    },
    [patchPatientNote.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [patchPatientNote.fulfilled]: () => {
      toast.success("Note updated");
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearNotes } = patientSlice.actions;

export default patientSlice.reducer;
