import AbstractComponent from "./abstract-component";
import {getDayMillis, getDayToCounter} from "./utils/date-utils";
import moment from "moment";

export default class Trip extends AbstractComponent {
  constructor(pointsData, unfilteredPointsData) {
    super();
    this._dayToCounter = getDayToCounter(unfilteredPointsData);
    this._groupedPoints = unfilteredPointsData.reduce((allGroups, event) => {
      if (pointsData.every(({id}) => id !== event.id)) {
        return allGroups;
      }
      const lastGroup = allGroups[allGroups.length - 1];
      const lastEvent = lastGroup && lastGroup[lastGroup.length - 1];
      if (lastEvent && moment(lastEvent.startDate).isSame(event.startDate, `day`)) {
        lastGroup.push(event);
      } else {
        const newGroup = [event];
        allGroups.push(newGroup);
      }
      return allGroups;
    }, []);
  }

  getPointPosition(point) {
    for (let groupIdx = 0; groupIdx < this._groupedPoints.length; ++groupIdx) {
      for (let eventIdx = 0; eventIdx < this._groupedPoints[groupIdx].length; ++eventIdx) {
        const event = this._groupedPoints[groupIdx][eventIdx];
        if (event.id === point.id) {
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

  getTemplate() {
    return `
      <ul class="trip-days">
        ${this._groupedPoints.map((eventGroup) => `<li class="trip-days__item  day">
            <div class="day__info">
              <span class="day__counter">${this._dayToCounter[getDayMillis(eventGroup[0].startDate)]}</span>
              <time 
                class="day__date" 
                datetime="${eventGroup[0].startDate}">
                ${moment(eventGroup[0].startDate).format(`MMM D`)}
              </time>
            </div>
            <ul class="trip-events__list">
              ${eventGroup.map(() => `
                <li class="trip-events__item"></li>
              `).join(``)}
            </ul>
        </li>
        `).join(``)}
      </ul>
    `;
  }
}
