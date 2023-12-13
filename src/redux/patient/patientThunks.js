import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGet,
  apiGetAuthenticated,
  apiPatchAuthenticated,
  apiPatchFileAuthenticated,
  apiPost,
  apiPostAuthenticated,
} from "../../services/api/apiService";

export const getPatientNotes = createAsyncThunk(
  "patient/getPatientNotes",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/notes/?patient=${payload.patient}`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const updatePatientProfile = createAsyncThunk(
  "patient/updatePatientProfile",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchAuthenticated(
      `/patient/${payload.id}/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const updatePatientPassword = createAsyncThunk(
  "patient/updatePatientPassword",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/change_password/change/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const saveSingleMessage = createAsyncThunk(
  "patient/saveSingleMessage",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(`/api/chat-history/`, payload);
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getMessageHistory = createAsyncThunk(
  "patient/getMessageHistory",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/chat-history-unread/filter-chat/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getUpcomingAppointments = createAsyncThunk(
  "patient/getUpcomingAppointments",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/upcoming_appointment/upcoming-appointment/`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getAppointmentSchedule = createAsyncThunk(
  "patient/getAppointmentSchedule",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/appointment_schedule/list-appointment-schedule/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const scheduleNewAppointment = createAsyncThunk(
  "patient/scheduleNewAppointment",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(`/api/appointment/`, payload);
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const patchAppointment = createAsyncThunk(
  "patient/patchAppointment",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchAuthenticated(
      `/api/appointment/${payload.id}/`,
      payload
    );
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const deleteAppointment = createAsyncThunk(
  "patient/deleteAppointment",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/cancel_appointment/cancel-appointment/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getTimeZoneOptions = createAsyncThunk(
  "patient/getTimeZoneOptions",
  async (payload, { rejectWithValue }) => {
    const response = await apiGet(`/timezone/options/`);
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const listAvailableSlots = createAsyncThunk(
  "patient/listAvailableSlots",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/appointment_schedule/list-available-slots/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);
export const listAvailableSlotsUnAuth = createAsyncThunk(
  "patient/listAvailableSlotsUnAuth",
  async (payload, { rejectWithValue }) => {
    const response = await apiPost(
      `/api/appointment_schedule/list-available-slots/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getCardDetails = createAsyncThunk(
  "patient/getCardDetails",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/payment/get-card-details/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getTherapistTierPackage = createAsyncThunk(
  "patient/getTherapistTierPackage",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/payment/get-therapist-tier-package/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const cancelSubscription = createAsyncThunk(
  "patient/cancelSubscription",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/payment/cancel-payment/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const oneTimeRecharge = createAsyncThunk(
  "patient/oneTimeRecharge",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/payment/create-onetime-payment-recharge/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const payOneTime = createAsyncThunk(
  "patient/payOneTime",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/payment/recharge-onetime-package/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);
export const getBillingRedirect = createAsyncThunk(
  "patient/getBillingRedirect",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/payment/get-stripe-billing/`
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getAllAppointmentsPatient = createAsyncThunk(
  "patient/getAllAppointmentsPatient",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/upcoming_appointment/past-appointment/`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const patchSingleMessage = createAsyncThunk(
  "patient/patchSingleMessage",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchAuthenticated(
      `/api/chat-history/${payload.id}/`,
      payload
    );
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const saveBillingDetails = createAsyncThunk(
  "patient/saveBillingDetails",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/set_billing_detail/store-details/`,
      payload
    );
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const updatePatientPicture = createAsyncThunk(
  "patient/updatePatientPicture",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchFileAuthenticated(
      `/patient/${payload.id}/`,
      payload.formdata
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const applyCouponOneTimeRecharge = createAsyncThunk(
  "patient/applyCouponOneTimeRecharge",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/patient_onboarding/apply-coupon/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const applyCouponUpgradeRecharge = createAsyncThunk(
  "patient/applyCouponUpgradeRecharge",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "api/patient_onboarding/apply-coupon-settings/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const upgradeRecharge = createAsyncThunk(
  "patient/upgradeRecharge",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/payment/create-subscription-payment/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const payUpgrade = createAsyncThunk(
  "patient/payUpgrade",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/payment/confirm-change-to-subscription/`,
      payload
    );
    if (response.status === 200 || response.status === 204)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getTherapistList = createAsyncThunk(
  "patient/getTherapistList",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/therapist-match/therapist-list/`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const switchPatientTherapist = createAsyncThunk(
  "patient/switchPatientTherapist",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/therapist-match/change-therapist/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getRandomSetupIntent = createAsyncThunk(
  "patient/getRandomSetupIntent",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/add-payment/add-payment/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const videoCallLog = createAsyncThunk(
  "patient/videoCallLog",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(`/api/video-log/`, payload);
    if (response.status === 200 || response.status === 201)
      return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const autoChangeSub = createAsyncThunk(
  "patient/auto-change-subscription",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/payment/change-auto-charge/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const subAutoCharge = createAsyncThunk(
  "patient/subscription-auto-charge",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      `/api/payment/subscription-auto-charge/`,
      payload
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getPatientTherapists = createAsyncThunk(
  "therapist/getPatientTherapists",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/patient-therapist/?patient=${payload.patient}`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const customPatientList = createAsyncThunk(
  "patient/customPatientList",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      `/api/custom-patient-list-view/`
    );
    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);
