import 'moment-precise-range-plugin';
const moment = require(`moment`);
require(`moment/locale/cs`);

export const isSameDay = (firstDate, secondDate) => {
  return firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear();
};

export const getDayMillis = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

export const getDayToCounter = (events) => {
  const allDays = events.map((event) => getDayMillis(event._startDate));
  const uniqueSortedDays = Array.from(new Set(allDays)).sort();
  return uniqueSortedDays.reduce((result, day, idx) => {
    result[day] = idx;
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
  const timeDifference = moment.duration(endDateEvent.diff(startDateEvent)).asMinutes();
  return timeDifference;
};

const SHORT_MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export const getDayAndMonth = (date) => {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
};
