import {TimelineFilters} from "./dict";
import {AbstractComponent} from "./abstract-component";

export class TripFilters extends AbstractComponent {

  getTemplate() {
    return `
    <form class="trip-filters" action="#" method="get">
        ${Object.values(TimelineFilters).map((filter) => `
          <div class="trip-filters__filter">
              <input 
                  id="filter-${filter.id}" 
                  class="trip-filters__filter-input  visually-hidden" 
                  type="radio" 
                  name="trip-filter" 
                  value="${filter.id}"
                  ${filter.id === `everything` ? `checked` : ``}>
              <label 
                  class="trip-filters__filter-label" 
                  for="filter-${filter.id}">
                  ${filter.name}
              </label>
          </div>
        `).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
  }
}
