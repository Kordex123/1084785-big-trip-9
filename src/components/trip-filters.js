import {tripFiltersTimeline} from "./trip-filters-data";

export const getTripFilters = () => {
  return `
    <form class="trip-filters" action="#" method="get">
        ${tripFiltersTimeline.map(getTripFilter).join(``)}
        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

const getTripFilter = (timeline) => {
  return `
  <div class="trip-filters__filter">
      <input 
          id="filter-${timeline.title.toLowerCase()}" 
          class="trip-filters__filter-input  visually-hidden" 
          type="radio" 
          name="trip-filter" 
          value="${timeline.title.toLowerCase()}" 
          checked="">
      <label 
          class="trip-filters__filter-label" 
          for="filter-${timeline.title.toLowerCase()}">
          ${timeline.title}
      </label>
  </div>
  `;
};
