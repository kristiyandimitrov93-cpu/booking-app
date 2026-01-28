import z from "zod";
import type { Booking, BookingOverlap } from "../types/bookings";
import { isDateTodayOrFuture, isEndDateAfterStartDate } from "./utils";
import { isAfter, isBefore, parseISO } from "date-fns";

export const bookingSchema = z.object({
    guestName: z.string().trim().min(1, "Guest name is requred").max(100, 'Name must be less than 100 characters'),
    email: z.email("Invalid email"),
    propertyId: z.string().min(1, 'Property not selected'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    numberOfGuests: z.number().min(1, 'At least 1 guest is required').max(10, 'Max 10 guests per booking')
}).refine((data) => isDateTodayOrFuture(data.startDate), { message: 'Start date cannot be in the past', path: ['startDate'] })
    .refine(data => isEndDateAfterStartDate(data.startDate, data.endDate), { message: 'End date cannot be before start date', path: ['endDate'] })

export type BookingFormData = z.infer<typeof bookingSchema>;


export const checkDateOverlap = (
    startDate: string,
    endDate: string,
    propertyId: string,
    existingBookings: Booking[],
    excludeBookingId?: string
): BookingOverlap => {
    const newStart = parseISO(startDate);
    const newEnd = parseISO(endDate);

    const conflictingBooking = existingBookings.find(booking => {
        if (booking.propertyId !== propertyId) return false;
        if (excludeBookingId && booking.id === excludeBookingId) return false;
        const existingStart = parseISO(booking.startDate);
        const existingEnd = parseISO(booking.endDate);

        return !(isAfter(newStart, existingEnd) || isBefore(newEnd, existingStart));
    });

    return {
        hasOverlap: !!conflictingBooking,
        overlappingBooking: conflictingBooking,
    };
}