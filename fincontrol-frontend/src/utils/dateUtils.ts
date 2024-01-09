export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    return adjustedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const toInputDateValue = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

/**
 * Formats a data to an ISO string with a default time if the time is not present.
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date-time string.
 */
export const toISODateString = (dateString: string): string => {
    if (dateString.length <= 10) {
        return `${dateString}T00:00:00Z`;
    }

    return dateString;
}