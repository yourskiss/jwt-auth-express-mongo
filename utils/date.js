export function isoDateToCustomFormat(dateStr) {
  const date = new Date(dateStr);
  const pad = (num) => String(num).padStart(2, '0');
  const day = pad(date.getUTCDate());
  const month = pad(date.getUTCMonth() + 1); // Months are zero-indexed
  const year = date.getUTCFullYear();
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${day}:${month}:${year}:${hours}:${minutes}:${seconds}`;
}

 
export function isoDateTo12HourFormat(dateStr) {
  const date = new Date(dateStr);
  const pad = (num) => String(num).padStart(2, '0');
  const day = pad(date.getUTCDate());
  const month = pad(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear();
  let hours = date.getUTCHours();
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  hours = pad(hours);
  return `${day}:${month}:${year}:${hours}:${minutes}:${seconds} ${ampm}`;
}

 