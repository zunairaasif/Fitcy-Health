import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAuthenticated,
  apiPostAuthenticated,
} from "../../services/api/apiService";

export const getRTCToken = createAsyncThunk(
  "agora/getRTCToken",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/agora/get-rtc-token/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);
export const getRTMToken = createAsyncThunk(
  "agora/getRTMToken",
  async (payload, { rejectWithValue }) => {
    const response = await apiPostAuthenticated(
      "/api/agora/get-rtm-token/",
      payload
    );

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);

export const getAllUsersForAgora = createAsyncThunk(
  "agora/getAllUsersForAgora",
  async (payload, { rejectWithValue }) => {
    const response = await apiGetAuthenticated("/api/get_user/");

    if (response.status === 200) return await response.json();
    else return rejectWithValue(await response.json());
  }
);
