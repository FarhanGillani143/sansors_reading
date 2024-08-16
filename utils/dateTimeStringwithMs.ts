/**
 * Enhances the output of toLocaleString() by appending milliseconds to the time in the string.
 * This function formats the date and time to include the localized string representation along with
 * the milliseconds, resulting in a format such as "28/05/1999, 12:25:19.123 PM".
 *
 * @param {Date} [date=new Date()] - The date object to be formatted. Defaults to the current date and time if not provided.
 * @returns {string} The formatted date and time string with milliseconds appended.
 * 
 * @example
 * // Returns "28/05/1999, 12:25:19.123 PM"
 */

export default function dateTimeStringWithMilliseconds(date?: Date) {
  const moment = date || new Date();
  const dateTimeString = moment.toLocaleString();
  const milliseconds = moment.getMilliseconds();

  const insertPosition = dateTimeString.length - 3;
  const beforeInsert = dateTimeString.slice(0, insertPosition);
  const afterInsert = dateTimeString.slice(insertPosition);

  const timestamp = beforeInsert + `.${milliseconds}` + afterInsert;
  return timestamp;
}
