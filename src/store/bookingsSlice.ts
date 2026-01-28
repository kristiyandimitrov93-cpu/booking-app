import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store";
import type { Booking } from "../types/bookings";
import { nanoid } from "@reduxjs/toolkit";


export interface BookingsState {
    bookings: Booking[]
    selectedBookingId: string | null
}

const initialState: BookingsState = {
    bookings: [],
    selectedBookingId: null
}
const bookingsSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        createNewBooking: (state, action: PayloadAction<Omit<Booking, "id">>) => {
            const booking = { id: nanoid(), ...action.payload }

            state.bookings.push(booking)
        },
        updateBooking: (state, action: PayloadAction<Booking>) => {
            const index = state.bookings.findIndex(b => b.id === action.payload.id);
            if (index !== -1) {
                state.bookings[index] = action.payload;
            }
            state.selectedBookingId = null;
        },

        deleteBooking: (state, action: PayloadAction<string>) => {
            state.bookings = state.bookings.filter(b => b.id !== action.payload);
        },

        setSelectedBookingId: (state, action: PayloadAction<string>) => {
            state.selectedBookingId = action.payload
        },

        clearSelectedBookingId: (state) => {
            state.selectedBookingId = null
        }

    }

})

export const { createNewBooking, updateBooking, deleteBooking, setSelectedBookingId, clearSelectedBookingId } = bookingsSlice.actions

export const bookingStateSelector = (state: RootState) => state.bookings;

export const existingBookingSelector = createSelector(bookingStateSelector, state => state.bookings)
export const selectedBookingIdSelector = createSelector(bookingStateSelector, state => state.selectedBookingId)
export const selectedBookingSelector = createSelector(existingBookingSelector, selectedBookingIdSelector, (existingBookings, selectedBookingId) =>
    existingBookings.find(booking => booking.id === selectedBookingId))
export default bookingsSlice.reducer