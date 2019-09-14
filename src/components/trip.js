import {getDayAndMonth, getDayMillis, getDayToCounter, isSameDay} from "./utils/date-utils";
import {createElement} from "./utils/render-utils";

export class Trip {
  constructor(points) {
    this._points = points;
    this._element = null;
    this._dayToCounter = getDayToCounter(this._points);
    this._groupedEvents = this._points.reduce((allGroups, event) => {
      const lastGroup = allGroups[allGroups.length - 1];
      const lastEvent = lastGroup && lastGroup[lastGroup.length - 1];
      if (lastEvent && isSameDay(lastEvent._startDate, event._startDate)) {
        lastGroup.push(event);
      } else {
        const newGroup = [event];
        allGroups.push(newGroup);
      }
      return allGroups;
    }, []);
  }

  getPointPosition(point) {
    for (let groupIdx = 0; groupIdx < this._groupedEvents.length; ++groupIdx) {
      for (let eventIdx = 0; eventIdx < this._groupedEvents[groupIdx].length; ++eventIdx) {
        const event = this._groupedEvents[groupIdx][eventIdx];
        if (event === point) {
          return {
            dayNo: groupIdx,
            itemNo: eventIdx
          };
        }
      }
    }
    return {
      dayNo: 0,
      itemNo: 0
    };
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `
      <ul class="trip-days">
        ${this._groupedEvents.map((eventGroup) =>`<li class="trip-days__item  day">
            <div class="day__info">
              <span class="day__counter">${this._dayToCounter[getDayMillis(eventGroup[0]._startDate)] + 1}</span>
              <time 
                class="day__date" 
                datetime="${eventGroup[0]._startDate}">
                ${getDayAndMonth(eventGroup[0]._startDate)}
              </time>
            </div>
            <ul class="trip-events__list">
              ${eventGroup.map(() =>`
                <li class="trip-events__item"></li>
              `).join(``)}
            </ul>
          </li>
        `).join(``)}
      </ul>
    `;
  }
}
