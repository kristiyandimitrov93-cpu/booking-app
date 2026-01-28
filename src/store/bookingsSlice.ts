import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store";
import type { Booking } from "../types/bookings";
import { nanoid } from "@reduxjs/toolkit";


export interface BookingsState {
    existingBookings: Booking[]
    selectedBookingId?: string
}

const initialState: BookingsState = {
    existingBookings: []
}
const bookingsSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        createNewBooking: (state, action: PayloadAction<Omit<Booking, "id">>) => {
            const booking = { id: nanoid(), ...action.payload }

            state.existingBookings.push(booking)
        },
        updateBooking: (state, action: PayloadAction<Booking>) => {

        },
        setSelectedBookingId: (state, action: PayloadAction<string>) => {
            state.selectedBookingId = action.payload
        }

    }

})

export const { createNewBooking } = bookingsSlice.actions

export const bookingStateSelector = (state: RootState) => state.bookings;

export const existingBookingSelector = createSelector(bookingStateSelector, state => state.existingBookings)
export const selectedBookingIdSelector = createSelector(bookingStateSelector, state => state.selectedBookingId)
export const selectedBookingSelector = createSelector(existingBookingSelector, selectedBookingIdSelector, (existingBookings, selectedBookingId) =>
    existingBookings.find(booking => booking.id === selectedBookingId))
export default bookingsSlice.reducer