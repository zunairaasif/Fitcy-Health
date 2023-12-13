import { configureStore } from "@reduxjs/toolkit";
import agoraSliceReducer from "./agora/agoraSlice";
import appSliceReducer from "./app/appSlice";
import onboardingSliceReducer from "./onboarding/onboardingSlice";
import patientSliceReducer from "./patient/patientSlice";
import therapistSliceReducer from "./therapist/therapistSlice";

export const store = configureStore({
  reducer: {
    app: appSliceReducer,
    agora: agoraSliceReducer,
    onboarding: onboardingSliceReducer,
    patient: patientSliceReducer,
    therapist: therapistSliceReducer,
  },
  devTools: process.env.REACT_APP_ENV === "development" ? true : false,
});
