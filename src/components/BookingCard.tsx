
import { Card, Button, CardHeader, CardBody, CardFooter } from 'react-bootstrap';
import { format } from 'date-fns';
import { Pencil, Trash2, Users, Calendar, Mail } from 'lucide-react';
import { PROPERTIES } from '../constants/properties';
import type { Booking } from '../types/bookings';

interface BookingCardProps {
    booking: Booking;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const BookingCard = ({ booking, onEdit, onDelete }: BookingCardProps) => {
    const { id, startDate, endDate, guestName, email, numberOfGuests, propertyId } = booking
    const property = PROPERTIES.find((p) => p.id === propertyId);

    return (
        <Card className="h-100 shadow-sm">
            <CardHeader className="bg-white">
                <div className="fw-semibold text-truncate" title={property?.name}>
                    {property?.name}
                </div>
            </CardHeader>
            <CardBody>
                <h6 className="mb-2">{guestName}</h6>
                <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                    <Mail size={14} />
                    {email}
                </div>
                <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(startDate), 'MMM d, yyyy')} - {format(new Date(endDate), 'MMM d, yyyy')}
                </div>
                <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                    <Users size={14} />
                    {numberOfGuests} guest{numberOfGuests > 1 ? 's' : ''}
                </div>
            </CardBody>
            <CardFooter className="bg-transparent">
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" className="flex-fill" onClick={() => onEdit(id)}>
                        <span className="d-inline-flex align-items-center gap-1">
                            <Pencil size={14} />
                            Edit
                        </span>
                    </Button>

                    <Button variant="outline-danger" size="sm" className="flex-fill" onClick={() => onDelete(id)}>
                        <span className="d-inline-flex align-items-center gap-1">
                            <Trash2 size={14} />
                            Delete
                        </span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

