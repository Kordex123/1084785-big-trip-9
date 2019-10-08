import 'moment-precise-range-plugin';
import moment from "moment";

export const isSameDay = (firstDate, secondDate) => {
  return firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear();
};

export const getDayMillis = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

export const getDayToCounter = (events) => {
  const allDays = events.map((event) => getDayMillis(event.startDate));
  const uniqueSortedDays = Array.from(new Set(allDays)).sort();
  return uniqueSortedDays.reduce((result, day, idx) => {
    result[day] = idx + 1;
    return result;
  }, {});
};

const durationFormat = {
  "days": `D`,
  "hours": `H`,
  "minutes": `M`
};

export const getDuration = (endDate, startDate) => {
  const startDateEvent = moment(startDate);
  const endDateEvent = moment(endDate);
  const difference = moment.preciseDiff(endDateEvent, startDateEvent, true);
  const durationAsArray = Object.keys(difference).reduce((result, key) => {
    const value = difference[key];
    const unit = durationFormat[key];
    if (unit && (value > 0 || result.length)) {
      result.push(value.toString().padStart(2, `0`) + unit);
    }
    return result;
  }, []);

  return durationAsArray.join(` `);
};

export const getDurationInMinutes = (endDate, startDate) => {
  const startDateEvent = moment(startDate);
  const endDateEvent = moment(endDate);
  const duration = moment.duration(endDateEvent.diff(startDateEvent)).asMinutes();
  return Math.abs(duration);
};

export const getDurationInHours = (endDate, startDate) => {

  const startDateEvent = moment(startDate);
  const endDateEvent = moment(endDate);
  const duration = moment.duration(endDateEvent.diff(startDateEvent)).asHours();
  return Math.abs(duration);
};

export const getDurationInHoursAndMinutes = (duration) => {
  const hours = Math.trunc(duration);
  const minutes = Math.round((duration - hours) * 60);
  let durationPresentation = ``;
  if (hours > 0) {
    durationPresentation = `${hours}H `;
  }
  if (minutes > 0) {
    durationPresentation += `${minutes}M`;
  }
  return durationPresentation;
};

const SHORT_MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export const getDayAndMonth = (date) => {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
};
