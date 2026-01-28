import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Booking } from "../types/bookings";

import {
    existingBookingSelector,
    selectedBookingSelector,
    createNewBooking,
    clearSelectedBookingId,
    updateBooking,
} from "../store/bookingsSlice";

import { bookingSchema, checkDateOverlap, type BookingFormData } from "../utils/bookings";
import { PROPERTIES } from "../constants/properties";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { Alert, Button, Card, CardBody, CardHeader, Form, FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfDay } from "date-fns";
import { DEFAULT_FORM } from "../constants/bookingForm";

export const BookingForm = () => {
    const dispatch = useDispatch();
    const bookings = useSelector(existingBookingSelector);
    const selectedBooking = useSelector(selectedBookingSelector);
    const [overlapError, setOverlapError] = useState<string | null>(null)
    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: DEFAULT_FORM,
        mode: "onBlur",
        reValidateMode: "onChange",
    })


    const { register, control, reset, formState: { errors, isValid } } = form;
    const startDate = useWatch({ control, name: "startDate" });
    const endDate = useWatch({ control, name: "endDate" });
    const canSubmit = !!startDate && !!endDate && isValid;
    const todayForDateInput = format(startOfDay(new Date()), "yyyy-MM-dd");


    const isEditing = Boolean(selectedBooking)
    useEffect(() => {
        if (selectedBooking) {
            reset({
                guestName: selectedBooking.guestName,
                email: selectedBooking.email,
                propertyId: selectedBooking.propertyId,
                startDate: selectedBooking.startDate,
                endDate: selectedBooking.endDate,
                numberOfGuests: selectedBooking.numberOfGuests,
            });
        } else {
            reset(DEFAULT_FORM)
        }
    }, [selectedBooking, reset]);



    const onSubmit: SubmitHandler<BookingFormData> = (data: BookingFormData) => {
        const overlapResult = checkDateOverlap(
            data.startDate,
            data.endDate,
            data.propertyId,
            bookings,
            selectedBooking?.id ?? undefined
        );

        if (overlapResult.hasOverlap && overlapResult.overlappingBooking) {
            const property = PROPERTIES.find((p) => p.id === data.propertyId);
            const { startDate, endDate } = overlapResult.overlappingBooking
            setOverlapError(
                `${property?.name} is already booked from ${format(new Date(startDate), 'MMM d, yyyy')} to ${format(new Date(endDate), 'MMM d, yyyy')}`
            );
            return;
        }



        const booking: Omit<Booking, 'id'> = {
            guestName: data.guestName,
            email: data.email,
            propertyId: data.propertyId,
            startDate: data.startDate,
            endDate: data.endDate,
            numberOfGuests: data.numberOfGuests
        };

        if (isEditing) {
            dispatch(updateBooking({ ...booking, id: selectedBooking!.id }))
        } else {
            dispatch(createNewBooking(booking));
        }
        reset()
        setOverlapError(null)
    };

    const handleCancel = () => {
        dispatch(clearSelectedBookingId())
        reset()
        setOverlapError(null)

    }

    return (
        <Card className="card shadow-sm position-sticky" style={{ top: 16 }}>
            <CardHeader className="card-body">
                <h5 className="mb-0">{isEditing ? "Edit booking" : "New booking"}</h5>
            </CardHeader>

            <CardBody>
                {overlapError && (
                    <Alert variant="danger" onClose={() => setOverlapError(null)} dismissible>
                        {overlapError}
                    </Alert>
                )}
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormGroup className="mb-3">
                        <FormLabel>Guest name</FormLabel>
                        <FormControl type='text' placeholder="Enter guest name"
                            isInvalid={!!errors.guestName}
                            {...register('guestName')} />
                        <Form.Control.Feedback type="invalid">
                            {errors.guestName?.message}
                        </Form.Control.Feedback>

                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FormLabel>Email</FormLabel>
                        <FormControl
                            type="email"
                            placeholder="Enter email"
                            isInvalid={!!errors.email}
                            {...register('email')}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                        </Form.Control.Feedback>
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FormLabel>Property </FormLabel>
                        <FormSelect isInvalid={!!errors.propertyId} {...register('propertyId')}>
                            <option value="">Select a property</option>
                            {PROPERTIES.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.name}
                                </option>
                            ))}
                        </FormSelect>
                        <Form.Control.Feedback type="invalid">
                            {errors.propertyId?.message}
                        </Form.Control.Feedback >
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FormLabel>Start Date</FormLabel>
                        <FormControl
                            type="date"
                            min={todayForDateInput}
                            isInvalid={!!errors.startDate}
                            {...register('startDate')}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.startDate?.message}
                        </Form.Control.Feedback >
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FormLabel>End Date</FormLabel>
                        <FormControl
                            type="date"
                            disabled={!startDate}
                            min={startDate || undefined}
                            isInvalid={!!errors.endDate}
                            {...register('endDate')
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.endDate?.message}
                        </Form.Control.Feedback >
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl
                            type="number"
                            min={1}
                            max={10}
                            isInvalid={!!errors.numberOfGuests}
                            {...register('numberOfGuests', { valueAsNumber: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.numberOfGuests?.message}
                        </Form.Control.Feedback>
                    </FormGroup>
                    <div className="d-flex gap-2">
                        {isEditing && (
                            <Button type="button" variant="outline-secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button className="ms-auto" type="submit" disabled={!canSubmit}>
                            {isEditing ? "Update booking" : "Create booking"}
                        </Button>
                    </div>
                </Form>
            </CardBody>
        </Card>
    );
};
