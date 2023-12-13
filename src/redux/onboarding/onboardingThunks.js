import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGet,
  apiGetAuthenticated,
  apiPatchAuthenticated,
  apiPost,
  apiPostAuthenticated,
} from "../../services/api/apiService";

export const getQuestionnaire = createAsyncThunk(
  "onboarding/getQuestionnaire",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated("/api/questionnaire/");

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const submitAnswer = createAsyncThunk(
  "onboarding/submitAnswer",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/patient_onboarding/submit-answer/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getRecommendations = createAsyncThunk(
  "onboarding/getRecommendations",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated(
      "/api/patient_onboarding/recommendations/"
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const createPayment = createAsyncThunk(
  "onboarding/createPayment",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/patient_onboarding/create-payment/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const applyCoupon = createAsyncThunk(
  "onboarding/applyCoupon",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/patient_onboarding/apply-coupon/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getPaymentStatus = createAsyncThunk(
  "onboarding/getPaymentStatus",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/patient_onboarding/get-payment/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const patchOnboardingStatus = createAsyncThunk(
  "onboarding/patchOnboardingStatus",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchAuthenticated(
      `/patient/${payload.id}/`,
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const patchOnboardingStatusTherapist = createAsyncThunk(
  "onboarding/patchOnboardingStatusTherapist",
  async (payload, { rejectWithValue }) => {
    const response = await apiPatchAuthenticated(
      `/therapist/${payload.id}/`,
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getTherapistFromSlug = createAsyncThunk(
  "onboarding/getTherapistFromSlug",
  async (payload, { rejectWithValue }) => {
    const response = await apiGet(
      `/api/get_therapist_directory/${payload.slug}/`
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getTherapistPackageFromID = createAsyncThunk(
  "onboarding/getTherapistPackageFromID",
  async (payload, { rejectWithValue }) => {
    const response = await apiPost(
      `/api/patient_onboarding/list-package-of-therapist/`,
      { user_id: payload.therapistID }
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);
