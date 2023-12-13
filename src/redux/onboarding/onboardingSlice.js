import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getErrorDetailsforNotif } from "../../services/globalFunctions";
import {
  applyCoupon,
  createPayment,
  getPaymentStatus,
  getQuestionnaire,
  getRecommendations,
  getTherapistFromSlug,
  getTherapistPackageFromID,
  patchOnboardingStatus,
  patchOnboardingStatusTherapist,
  submitAnswer,
} from "./onboardingThunks";

const initialState = {
  questionnaire_dict: null,
  questionnaire_done: [],
  recommendations: null,
  payment: null,
  selected_therapist: null,
  payment_status: null,
  onboarding_therapist: null,
  onboarding_therapist_package: null,
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    clearDict: (state) => {
      state.questionnaire_dict = null;
    },
    setTherapist: (state, action) => {
      state.selected_therapist = action.payload;
    },
  },
  extraReducers: {
    [getQuestionnaire.fulfilled]: (state, { payload }) => {
      state.questionnaire_dict = payload;
    },
    [getQuestionnaire.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [submitAnswer.fulfilled]: (state, { payload }) => {
      state.questionnaire_done.push(payload);
    },
    [submitAnswer.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getRecommendations.fulfilled]: (state, { payload }) => {
      state.recommendations = payload;
    },
    [submitAnswer.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [createPayment.fulfilled]: (state, { payload }) => {
      state.payment = payload;
      localStorage.setItem("fitcy_onboarding_payment_id", payload.payment.id);
      localStorage.setItem(
        "fitcy_onboarding_client_secret",
        payload.setup_intent.client_secret
      );
    },
    [createPayment.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [applyCoupon.fulfilled]: (state, { payload }) => {
      state.payment.payment = payload;
    },
    [applyCoupon.rejected]: () => {
      toast.error("Invalid Coupon");
    },
    [getPaymentStatus.fulfilled]: (state, { payload }) => {
      state.payment_status = payload;
    },
    [getPaymentStatus.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },

    [patchOnboardingStatus.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [patchOnboardingStatusTherapist.fulfilled]: () => {
      window.location.replace("/dashboard/therapist-complete");
    },
    [patchOnboardingStatusTherapist.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getTherapistFromSlug.fulfilled]: (state, action) => {
      state.onboarding_therapist = action.payload;
    },
    [getTherapistFromSlug.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getTherapistPackageFromID.fulfilled]: (state, action) => {
      state.onboarding_therapist_package = action.payload;
    },
    [getTherapistPackageFromID.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearDict, setTherapist } = onboardingSlice.actions;

export default onboardingSlice.reducer;
