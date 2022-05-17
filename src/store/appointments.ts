import { Appointment } from '@prisma/client';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import config from 'config';
import { parseIds } from 'store/utils';

const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');
const headers = { 'Content-Type': 'application/json' };

export const getAppointments = createAsyncThunk('getAppointments', async () => {
  const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`);
  const parsedResponse = await response.json();

  return parseIds(parsedResponse) as Appointment[];
});
export const addAppointments = createAsyncThunk(
  'addAppointments',
  async (data) => {
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    };
    const response = await fetch(
      `${SERVER_API_ENDPOINT}/appointments`,
      requestOptions,
    );
    const parsedResponse = await response.json();

    return parseIds(parsedResponse) as Appointment;
  },
);
export const updateAppointments = createAsyncThunk(
  'updateAppointments',
  async (data) => {
    const requestOptions = {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    };
    const response = await fetch(
      `${SERVER_API_ENDPOINT}/appointments`,
      requestOptions,
    );
    const parsedResponse = await response.json();

    return parseIds(parsedResponse) as Appointment;
  },
);
export const deleteAppointments = createAsyncThunk(
  'deleteAppointments',
  async (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    };
    const response = await fetch(
      `${SERVER_API_ENDPOINT}/appointments`,
      requestOptions,
    );
    const parsedResponse = await response.json();

    return parseIds(parsedResponse);
  },
);

const appointmentsAdapter = createEntityAdapter<Appointment>({
  selectId: (appointments) => appointments.id,
});

export const appointmentsSelectors = appointmentsAdapter.getSelectors();

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: appointmentsAdapter.getInitialState({
    loading: false,
    error: null,
    searchedList: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    // get reducers
    builder.addCase(getAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAppointments.fulfilled, (state, action) => {
      appointmentsAdapter.setAll(state, action.payload);
      state.error = null;
      state.loading = false;
    });
    builder.addCase(getAppointments.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    //add reducers
    builder.addCase(addAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addAppointments.fulfilled, (state, action) => {
      appointmentsAdapter.addOne(state, action.payload);
      state.error = null;
      state.loading = false;
    });
    builder.addCase(addAppointments.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    //update reducers
    builder.addCase(updateAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAppointments.fulfilled, (state, action) => {
      appointmentsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
      state.error = null;
      state.loading = false;
    });
    builder.addCase(updateAppointments.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    // delete reducers
    builder.addCase(deleteAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAppointments.fulfilled, (state, action) => {
      appointmentsAdapter.removeOne(state, action.payload.id);
      state.error = null;
      state.loading = false;
    });
    builder.addCase(deleteAppointments.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default appointmentsSlice;
