import TripController from "./components/controllers/trip-controller";
import {api} from "./components/api/api";

const tripPageMainSection = document.querySelector(`.page-body__page-main h2:nth-child(1)`);

api.getOffers().then((offerDict) => {
  api.getDestinations().then((destinationDict) => {
    api.getAllPoints().then((points) => {
      // eslint-disable-next-line no-new
      new TripController(tripPageMainSection, points, offerDict, destinationDict);
    });
  });
});

