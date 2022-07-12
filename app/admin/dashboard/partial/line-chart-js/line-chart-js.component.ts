import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

@Component({
  selector: 'app-line-chart-js',
  templateUrl: './line-chart-js.component.html',
  styleUrls: ['./line-chart-js.component.scss']
})
export class LineChartJsComponent implements OnDestroy {

  data: any;
  options: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            data: [350, 380, 300, 400, 370, 380,],
            label: 'Total',
            backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
            borderColor: colors.primary,
          },
          {
            data: [200, 300, 250, 270, 250, 250],
            label: 'Cancelled',
            backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
            borderColor: colors.danger,
          }, {
            data: [300, 350, 280, 300, 340, 350],
            label: 'Paid',
            backgroundColor: NbColorHelper.hexToRgbA(colors.success, 0.3),
            borderColor: colors.success,
          },
          {
            data: [270, 300, 280, 300, 290, 310],
            label: 'Refund',
            backgroundColor: NbColorHelper.hexToRgbA(colors.warning, 0.3),
            borderColor: colors.warning,
          },
        ],
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                // color: chartjs.axisLineColor,
              },
              ticks: {
                // fontColor: chartjs.textColor,
                min: 0,
                //labelOffset: 10
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
                // color: chartjs.axisLineColor,
              },
              ticks: {
                // fontColor: chartjs.textColor,
              },
            },
          ],
        },
        legend: {
          labels: {
            // fontColor: chartjs.textColor,
            padding: 30
          },
          position: 'bottom'
        },
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

}
