import {TripController} from "./components/controllers/trip-controller";
import {api} from "./components/api/api";

// const pointMock = getEvents();

const tripPageMainSection = document.querySelector(`.page-body__page-main h2:nth-child(1)`);
// eslint-disable-next-line no-new
// new TripController(tripPageMainSection, pointMock);
// const tripController = new TripController(tripPageMainSection, pointMock);

// const AUTHORIZATION = `Basic ABCDEFG`;
// const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
//
// const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
// const onDataChange = () => {};
// const tripController2 = new TripController(tripPageMainSection, onDataChange);
// const onDataChange = (actionType, update) => {
//   switch(actionType) {
//     case `update`:
//       api.updatePoint({
//         id: update.id,
//         data: update.toRAW()
//       }).then((points) => tripController.show(point));
//       break;
//     case `delete`:
//       api.updatePoint({
//         id: update.id
//       })
//         .then(() => api.getAllPoints())
//         .then((points) => tripController.show(points));
//       break;
//   }
// };

// const offersPromise = api.getOffers();
// const pointsPromise = api.getAllPoints();
api.getOffers().then((offerDict) => {
  api.getDestinations().then((destinationDict) => {
    api.getAllPoints().then((points) => {
      // eslint-disable-next-line no-new
      new TripController(tripPageMainSection, points, offerDict, destinationDict);
    });
  });
});

