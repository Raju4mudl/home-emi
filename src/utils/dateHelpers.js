import { addMonths, differenceInMonths, format, parse } from 'date-fns';

export const addMonthsToDate = (date, months) => {
    return addMonths(date, months);
};

export const getMonthsDifference = (startDate, endDate) => {
    return differenceInMonths(endDate, startDate);
};

export const formatDateDisplay = (date) => {
    return format(date, 'MMM yyyy');
};

export const formatDateFull = (date) => {
    return format(date, 'dd MMM yyyy');
};

export const parseMonthYear = (monthYearString) => {
    return parse(monthYearString, 'yyyy-MM', new Date());
};

export const getMonthYearString = (date) => {
    return format(date, 'yyyy-MM');
};
