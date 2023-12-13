import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAuthenticated,
  apiPost,
  apiPostAuthenticated,
} from "../../services/api/apiService";

export const signupUser = createAsyncThunk(
  "app/signupUser",
  async (payload, { rejectWithValue }) => {
    const response = await apiPost(
      "/api/patient_register/register-patient/",
      payload
    );
    if (response.status === 200) return response;
    else if (response.status === 201) return response;
    else return rejectWithValue(await response.json());
  }
);

export const signupUserAdmin = createAsyncThunk(
  "app/signupUserAdmin",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/admin-add-patient/add-patient/",
      payload
    );
    if (response.status === 200) return response.json();
    else return rejectWithValue(await response.json());
  }
);
export const signinUser = createAsyncThunk(
  "app/signinUser",
  async (payload, { rejectWithValue }) => {
    const response = await apiPost("/api/token/", payload);

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);
export const getMe = createAsyncThunk(
  "app/getMe",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated("/me/");

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getMeEasy = createAsyncThunk(
  "app/getMeEasy",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated("/me/");

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const forgotPassword = createAsyncThunk(
  "app/forgotPassword",
  async (payload, { rejectWithValue }) => {
    const response = await apiPost("/auth/password-reset/", payload);

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const resetPassword = createAsyncThunk(
  "app/resetPassword",
  async (payload, { rejectWithValue }) => {
    const response = await apiPost("/auth/password-reset/confirm/", payload);

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);
export const setNewPassword = createAsyncThunk(
  "app/setNewPassword",
  async (payload, { rejectWithValue }) => {
    const response = await apiPost("/auth/set-password-confirm", payload);

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getUnreadMessagesCount = createAsyncThunk(
  "app/getUnreadMessagesCount",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      "/api/chat-history-unread/get-unread-messages-count/"
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getLatestMessagesTime = createAsyncThunk(
  "app/getLatestMessagesTime",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      "/api/chat-history-unread/get-latest-messages-time/"
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getPatientList = createAsyncThunk(
  "app/getPatientList",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      "/api/patient-list/?search=" + payload.search
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const sendSetPasswordLink = createAsyncThunk(
  "app/sendSetPasswordLink",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated("/auth/set-password", payload);

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const sendOnboardingEmail = createAsyncThunk(
  "app/sendOnboardingEmail",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/welcome-email/send-email/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const scheduleNewAppointmentAdmin = createAsyncThunk(
  "app/scheduleNewAppointmentAdmin",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(`/api/appointment/`, payload);
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getPackagesList = createAsyncThunk(
  "app/getPackagesList",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated("/api/package/?type=ONETIME");

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const addTransactionHistory = createAsyncThunk(
  "app/addTransactionHistory",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/get-transaction-history/patient-transaction-history/`,
      payload
    );
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getSinglePatient = createAsyncThunk(
  "app/getSinglePatient",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(`/patient/` + payload.patientID);
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getTherapistListAdmin = createAsyncThunk(
  "app/getTherapistListAdmin",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/list-therapist/?tier=` + payload.tier
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const changeTherapist = createAsyncThunk(
  "app/changeTherapist",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/therapist-match/change-therapist/`,
      payload
    );
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const verifyToken = createAsyncThunk(
  "app/verifyToken",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(`/api/token/verify/`, payload);
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getAppointment = createAsyncThunk(
  "app/getAppointment",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/appointment/${payload.id}/`
    );
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);
