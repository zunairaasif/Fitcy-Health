import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getErrorDetailsforNotif } from "../../services/globalFunctions";
import { getAllUsersForAgora, getRTCToken, getRTMToken } from "./agoraThunks";

const initialState = {
  rtcToken: null,
  rtmToken: null,
  all_users: null,
};

export const agoraSlice = createSlice({
  name: "agora",
  initialState,
  reducers: {
    removeRTCToken: (state) => {
      state.rtcToken = null;
    },
  },
  extraReducers: {
    [getRTCToken.fulfilled]: (state, { payload }) => {
      state.rtcToken = payload.rtc_token;
    },
    [getRTCToken.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getRTMToken.fulfilled]: (state, { payload }) => {
      state.rtmToken = payload.rtm_token;
    },
    [getRTMToken.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
    [getAllUsersForAgora.fulfilled]: (state, { payload }) => {
      state.all_users = payload;
    },
    [getAllUsersForAgora.rejected]: (state, action) => {
      toast.error(getErrorDetailsforNotif(action.payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { removeRTCToken } = agoraSlice.actions;

export default agoraSlice.reducer;
