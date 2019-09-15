import {getEvents} from "./components/event-data";
import {TripController} from "./components/controllers/trip-controller";

const pointMock = getEvents();

const tripPageMainSection = document.querySelector(`.page-body__page-main h2:nth-child(1)`);
const tripController = new TripController(tripPageMainSection, pointMock);
tripController.init();
