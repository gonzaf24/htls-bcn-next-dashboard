const months: { [key: string]: string } = {
  'ene': '01',
  'feb': '02',
  'mar': '03',
  'abr': '04',
  'may': '05',
  'jun': '06',
  'jul': '07',
  'ago': '08',
  'sep': '09',
  'oct': '10',
  'nov': '11',
  'dic': '12'
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'es-ES',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatDateHourseMinutesToLocal = (
  dateStr: string,
  locale: string = 'es-ES',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatInputDate = (dateStr: string, locale: string = 'es-ES'): string => {
  const datePart = formatDateToLocal(dateStr, locale);
  const hourPart = formatDateHourseMinutesToLocal(dateStr, locale);
  // Convert datePart from '13 jun 2024' to '2024-06-13'
  const [day, monthName, year] = datePart.split(' ');

  const month = months[monthName.toLowerCase()];
  // Ensure hourPart has a leading zero if needed
  const [hours, minutes] = hourPart.split(':').map(part => part.padStart(2, '0'));
  const formattedDate = `${year}-${month}-${day.padStart(2, '0')}T${hours}:${minutes}`;
  return formattedDate;
};

export const formatDatesss = (
  dateStr: string,
  locale: string = 'es-ES',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};


export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
