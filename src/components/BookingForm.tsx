import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Booking } from "../types/bookings";

import {
    existingBookingSelector,
    selectedBookingSelector,
    createNewBooking,
    clearSelectedBookingId,
} from "../store/bookingsSlice";

import { bookingSchema, checkDateOverlap, type BookingFormData } from "../utils/bookings";
import { PROPERTIES } from "../constants/properties";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Alert, Button, Card, CardBody, CardHeader, Form, FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

export const DEFAULT_FORM: BookingFormData = {
    guestName: '',
    email: '',
    propertyId: '',
    startDate: '',
    endDate: '',
    numberOfGuests: 1
}

export const BookingForm = () => {
    const dispatch = useDispatch();
    const bookings = useSelector(existingBookingSelector);
    const selectedBooking = useSelector(selectedBookingSelector);
    const [overlapError, setOverlapError] = useState<string | null>(null)
    const form = useForm<BookingFormData, any, BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: DEFAULT_FORM,
        mode: "onBlur",
        reValidateMode: "onChange",
    })


    const { register, reset, trigger, formState: { errors, isValid } } = form;
    console.log(errors)

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
    }, [selectedBooking]);



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


        dispatch(createNewBooking(booking));
        reset()
        setOverlapError(null)
    };

    const handleCancel = () => {
        dispatch(clearSelectedBookingId())
        reset()
        setOverlapError(null)

    }

    return (
        <Card className="card shadow-sm">
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
                            isInvalid={!!errors.startDate}
                            {...register('startDate', {
                                onChange: () => {
                                    trigger(["startDate", "endDate"]);
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.startDate?.message}
                        </Form.Control.Feedback >
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FormLabel>End Date</FormLabel>
                        <FormControl
                            type="date"
                            isInvalid={!!errors.endDate}
                            {...register('endDate', {
                                onChange: () => {
                                    trigger(["startDate", "endDate"]);
                                }
                            })}
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
                    <Button type="submit" disabled={!isValid}>{isEditing ? 'Update booking' : 'Save'}</Button>
                    {isEditing && <Button onClick={handleCancel}>Cancel</Button>}
                </Form>
            </CardBody>
        </Card>
    );
};
