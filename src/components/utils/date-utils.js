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

const SHORT_MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export const getDayAndMonth = (date) => {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
};
