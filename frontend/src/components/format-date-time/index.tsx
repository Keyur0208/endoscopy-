export function FormatDateString(isoString: string) {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-IN', options);
}

export function FormatDateToInput(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return ''; // handle invalid date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-based
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function FormatTimeString(timeStr: string) {
  if (!timeStr) return '';

  const [hourStr, minuteStr] = timeStr.split(':');
  const hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return '';

  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minuteStr.padStart(2, '0')} ${period}`;
}

export const getCurrentTime12Hour = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hoursStr = hours.toString().padStart(2, '0');

  return `${hoursStr}:${minutes} ${ampm}`; // e.g., "09:34 PM"
};

export const FormatDateTimeIST = (date: string | null | undefined) => {
  if (!date) return 'N/A';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-IN', options).format(new Date(date));
};

export function getLocalDateString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset(); // in minutes
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0]; // formatted as YYYY-MM-DD
}

export function toUTCISOStringFromISTLocal(input: string): string {
  // input = "2025-08-01T17:30" (assumed Asia/Kolkata time)
  const [datePart, timePart] = input.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  // Create a Date object in IST by manually subtracting the timezone offset
  const istDate = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));

  // Return ISO string (which is in UTC)
  return istDate.toISOString();
}

export function formatDateTimeIST(dateStr: string | null | undefined) {
  if (!dateStr) return 'N/A';

  const date = new Date(dateStr);

  // Format using Indian time zone
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export const IndiaDateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

export function FormatDateTime(dateString: string): string {
  if (!dateString) return '-';

  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12 || 12;

  return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
}
