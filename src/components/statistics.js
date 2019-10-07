import {AbstractComponent} from "./abstract-component";
import {Transfers} from "./event-data";
import {getDurationInHours, getDurationInHoursAndMinutes} from "./utils/date-utils";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";


export class Statistics extends AbstractComponent {
  constructor(pointsData) {
    super();
    this._pointsData = pointsData;
    this.init();
  }

  getTemplate() {
    return `
      <section class="statistics" style="display: none">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
      </section>
    `;
  }

  init() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const durationCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const typeToPriceMap = this._pointsData.reduce((result, pointData) => {
      if (!result[pointData.type]) {
        result[pointData.type] = 0;
      }
      result[pointData.type] += pointData.price;
      return result;
    }, {});

    const transportCountMap = this._pointsData
      .filter((pointData) => Object.values(Transfers).some((type) => type.toLowerCase() === pointData.type))
      .reduce((result, pointData) => {
        if (!result[pointData.type]) {
          result[pointData.type] = 0;
        }
        result[pointData.type] += 1;
        return result;
      }, {});

    const placeToDurationMap = this._pointsData.reduce((result, pointData) => {
      if (!result[pointData.destination.name]) {
        result[pointData.destination.name] = 0;
      }
      result[pointData.destination.name] += getDurationInHours(pointData.endDate, pointData.startDate);
      return result;
    }, {});

    const moneyOptions = {
      container: moneyCtx,
      title: `MONEY`,
      labelToDataMap: typeToPriceMap,
      formatter: (price) => `€ ${price}`,
    };

    const transportOptions = {
      container: transportCtx,
      title: `TRANSPORT`,
      labelToDataMap: transportCountMap,
      formatter: (count) => `${count}x`,
    };

    const timeSpentOptions = {
      container: durationCtx,
      title: `TIME SPENT`,
      labelToDataMap: placeToDurationMap,
      formatter: (time) => getDurationInHoursAndMinutes(time),
    };


    this._drawChart(moneyOptions);
    this._drawChart(transportOptions);
    this._drawChart(timeSpentOptions);
  }

  _drawChart(customOptions) {
    // eslint-disable-next-line no-new
    new Chart(customOptions.container, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(customOptions.labelToDataMap),
        datasets: [{
          label: ``,
          data: Object.values(customOptions.labelToDataMap),
          backgroundColor: `#ffffff`

        }]
      },
      options: {
        plugins: {
          datalabels: {
            anchor: `end`,
            align: `start`,
            formatter: customOptions.formatter,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: true,
              fontStyle: `bold`,
              fontColor: `#000000`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },

        title: {
          display: true,
          text: customOptions.title,
          position: `left`,
          fontStyle: `bold`,
          fontSize: 20,
          fontColor: `#000000`
        },
        legend: {
          display: false,
          position: `left`,
          labels: {
            boxWidth: 45,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }
}
