import {getTripInfo} from "./components/trip-info";
import {getTripTabs} from "./components/trip-tabs";
import {getTripFilters} from "./components/trip-filters";
import {getTripSort} from "./components/trip-sort";
import {getTripDays} from "./components/trip-days";
import {getEvents} from "./components/event-data";
import {getTotalCost} from "./components/event-data";

const allEvents = getEvents();

const tripInfoSection = document.querySelector(`.trip-main__trip-info`);
const tripControlsSection = document.querySelector(`.trip-main__trip-controls h2:nth-child(2)`);
const tripPageMainSection = document.querySelector(`.page-body__page-main h2:nth-child(1)`);
const totalCost = document.querySelector(`.trip-info__cost-value`);

const renderComponent = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

renderComponent(tripInfoSection, getTripInfo(), `afterbegin`);
renderComponent(tripControlsSection, getTripTabs(), `beforebegin`);
renderComponent(tripControlsSection, getTripFilters(), `afterend`);
renderComponent(tripPageMainSection, getTripDays(allEvents), `afterend`);
renderComponent(tripPageMainSection, getTripSort(), `afterend`);
totalCost.textContent = getTotalCost(allEvents);


