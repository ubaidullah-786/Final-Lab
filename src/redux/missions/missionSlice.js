import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  missions: [],
  isLoading: true,
  error: null,
};

const missionsURL = 'https://api.spacexdata.com/v3/missions';

export const fetchMissions = createAsyncThunk(
  'missions/fetchMissions',
  async () => {
    try {
      const response = await axios.get(missionsURL);
      return [...response.data];
    } catch (err) {
      return err.message;
    }
  },
);

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    reserveMission: (state, action) => {
      const missionId = action.payload;
      const missionToReserve = state.missions.find((mission) => mission.id === missionId);
      if (missionToReserve) {
        missionToReserve.reserved = !missionToReserve.reserved;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.missions = action.payload.map(({ mission_id, mission_name, description }) => ({
          id: mission_id,
          name: mission_name,
          description,
          reserved: false,
        }));
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const AllMissions = (state) => state.missions.missions;
export const getLoading = (state) => state.missions.isLoading;
export const getError = (state) => state.missions.error;

export const { reserveMission } = missionsSlice.actions;

export default missionsSlice.reducer;