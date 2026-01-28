import { isAfter, isBefore, parseISO, startOfDay } from "date-fns";

export const isDateTodayOrFuture = (date: string) => {
    const today = startOfDay(new Date())
    const parsedDate = parseISO(date)
    return !isBefore(parsedDate, today)
}

export const isEndDateAfterStartDate = (startDate: string, endDate: string) => {
    const parsedStartDate = parseISO(startDate);
    const parsedEndDate = parseISO(endDate);
    return isAfter(parsedEndDate, parsedStartDate);
}