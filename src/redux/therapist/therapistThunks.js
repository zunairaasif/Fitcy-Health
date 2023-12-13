import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAuthenticated,
  apiPatchAuthenticated,
  apiPatchFileAuthenticated,
  apiPostAuthenticated,
} from "../../services/api/apiService";

export const addAppointmentSlot = createAsyncThunk(
  "therapist/addAppointmentSlot",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/appointment_schedule/add-appointment-slot/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getTherapistNotes = createAsyncThunk(
  "therapist/getTherapistNotes",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/notes/?therapist=${payload.appointment_therapist}&&patient=${payload.patient}`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getUpcomingAppointmentsTherapist = createAsyncThunk(
  "therapist/getUpcomingAppointmentsTherapist",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/upcoming_appointment/upcoming-appointment/`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getAllAppointmentsTherapist = createAsyncThunk(
  "therapist/getAllAppointmentsTherapist",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/upcoming_appointment/past-appointment/`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const updateTherapistProfile = createAsyncThunk(
  "therapist/updateTherapistProfile",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchAuthenticated(
      `/therapist/${payload.id}/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const updateTherapistPassword = createAsyncThunk(
  "therapist/updateTherapistPassword",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/change_password/change/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getTherapistPatients = createAsyncThunk(
  "therapist/getTherapistPatients",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/patient-therapist/?therapist=${payload.therapist}`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const addPatientNote = createAsyncThunk(
  "therapist/addPatientNote",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(`/api/notes/`, payload);
    if (response.status === 201) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const updateTherapistPicture = createAsyncThunk(
  "therapist/updateTherapistPicture",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchFileAuthenticated(
      `/therapist/${payload.id}/`,
      payload.formdata
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const patchPatientNote = createAsyncThunk(
  "therapist/patchPatientNote",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchAuthenticated(
      `/api/notes/${payload.id}/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);
