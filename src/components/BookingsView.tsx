import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBooking, existingBookingSelector, setSelectedBookingId } from '../store/bookingsSlice';
import type { Booking } from '../types/bookings';
import { Alert, Col, Row } from 'react-bootstrap';
import { BookingCard } from './BookingCard';
import DeleteConfirmationModal from './DeleteConfirmModal';

export const BookingsView = () => {
    const dispatch = useDispatch();
    const bookings = useSelector(existingBookingSelector)
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

    const handleEdit = (id: string) => {
        dispatch(setSelectedBookingId(id));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id: string) => {
        const booking = bookings.find((b) => b.id === id);
        if (booking) {
            setBookingToDelete(booking);
            setDeleteModalShow(true);
        }
    };

    const handleDeleteConfirm = () => {
        if (bookingToDelete) {
            dispatch(deleteBooking(bookingToDelete.id));
            setDeleteModalShow(false);
            setBookingToDelete(null);
        }
    };

    return (
        <>
            {bookings.length === 0 ? (
                <Alert variant="info">
                    No bookings yet. Create your first booking using the form.
                </Alert>
            ) : (
                <Row xs={1} md={2} xl={3} className="g-4">
                    {bookings.map((booking) => (
                        <Col key={booking.id}>
                            <BookingCard
                                booking={booking}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                            />
                        </Col>

                    ))}
                </Row>
            )}

            <DeleteConfirmationModal
                show={deleteModalShow}
                onHide={() => setDeleteModalShow(false)}
                onConfirm={handleDeleteConfirm}
                guestName={bookingToDelete?.guestName || ''}
            />
        </>
    );
};
