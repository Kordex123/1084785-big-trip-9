import {getTripInfo} from "./components/trip-info";
import {getTripTabs} from "./components/trip-tabs";
import {getTripFilters} from "./components/trip-filters";
import {getTripSort} from "./components/trip-sort";
import {getTripDays} from "./components/trip-days";

const tripInfoSection = document.querySelector(`.trip-main__trip-info`);
const tripControlsSection = document.querySelector(`.trip-main__trip-controls h2:nth-child(2)`);
const tripPageMainSection = document.querySelector(`.page-body__page-main h2:nth-child(1)`);

const renderComponent = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

renderComponent(tripInfoSection, getTripInfo(), `afterbegin`);
renderComponent(tripControlsSection, getTripTabs(), `beforebegin`);
renderComponent(tripControlsSection, getTripFilters(), `afterend`);
renderComponent(tripPageMainSection, getTripDays(), `afterend`);
renderComponent(tripPageMainSection, getTripSort(), `afterend`);
