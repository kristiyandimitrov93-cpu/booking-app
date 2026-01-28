import { useSelector } from "react-redux"
import { existingBookingSelector } from "../store/bookingsSlice"

export const BookingsView = () => {
    const bookings = useSelector(existingBookingSelector)
    return (<div></div>)
}