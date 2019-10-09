import AbstractComponent from "./abstract-component";
import {TimelineFilter} from "./dict";

export default class Filters extends AbstractComponent {

  getTemplate() {
    return `
    <form class="trip-filters" action="#" method="get">
        ${Object.values(TimelineFilter).map((filter) => `
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
