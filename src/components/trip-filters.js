import {timelineFilters} from "./trip-filters-data";

export const getTripFilters = () => {
  return `
    <form class="trip-filters" action="#" method="get">
        ${Object.values(timelineFilters).map(getTripFilter).join(``)}
        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

const getTripFilter = (timeline) => {
  return `
  <div class="trip-filters__filter">
      <input 
          id="filter-${timeline.toLowerCase()}" 
          class="trip-filters__filter-input  visually-hidden" 
          type="radio" 
          name="trip-filter" 
          value="${timeline.toLowerCase()}" 
          checked="">
      <label 
          class="trip-filters__filter-label" 
          for="filter-${timeline.toLowerCase()}">
          ${timeline}
      </label>
  </div>
  `;
};
