import 'moment-precise-range-plugin';
import moment from "moment";

const durationFormat = {
  "days": `D`,
  "hours": `H`,
  "minutes": `M`
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

export const getDuration = (endDate, startDate) => {
  const startDateEvent = moment(startDate);
  const endDateEvent = moment(endDate);
  const difference = moment.preciseDiff(endDateEvent, startDateEvent, true);
  const durations = Object.keys(difference).reduce((result, key) => {
    const value = difference[key];
    const unit = durationFormat[key];
    if (unit && (value > 0 || result.length)) {
      result.push(value.toString().padStart(2, `0`) + unit);
    }
    return result;
  }, []);

  return durations.join(` `);
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
  return `${hours > 0 ? `${hours}H` : ``} ${minutes > 0 ? `${minutes}M` : ``}`;
};
