import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from './bookingsSlice'


export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
    reducer: {
        bookings: bookingReducer
    }
})