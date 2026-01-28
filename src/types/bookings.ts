export interface Booking {
    id: string
    guestName: string
    email: string
    propertyId: string
    startDate: string
    endDate: string
    numberOfGuests: number
}

export interface BookingOverlap {
    hasOverlap: boolean
    overlappingBooking?: Booking
}