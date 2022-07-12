import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { EChartOption } from 'echarts';
import { PieChartReport } from 'src/app/models/dashboard-report';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-pie-echart',
  templateUrl: './pie-echart.component.html',
  styleUrls: ['./pie-echart.component.scss']
})
export class PieEchartComponent implements OnDestroy, AfterViewInit, OnInit {
  options: EChartOption = {};
  themeSubscription: any;
  report : any[];
  loading: boolean = false;
  paid: string;
  unPaid: string;
  Draft: string;
  Sent: string;
  Overdue: string;

  constructor(private theme: NbThemeService,
    private dashboardService: DashboardService,
    private ref: ChangeDetectorRef,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.translate.get('genral.paid').subscribe(res => this.paid = res);
    this.translate.get('general.unPaid').subscribe(res => this.unPaid = res);
    this.translate.get('general.draft').subscribe(res => this.Draft = res);
    this.translate.get('general.sent').subscribe(res => this.Sent = res);
    this.translate.get('general.overdue').subscribe(res => this.Overdue = res);
    this.getReport();
  }

  ngAfterViewInit() {
  }

  getReport(){
    this.loading = true;
    this.dashboardService.getPieChartReport().subscribe(
      result =>{
        this.report = result;
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

          const colors = config.variables;
          const echarts: any = config.variables.echarts;

          if (result){
            this.options = {
              responsive: true,
              backgroundColor: echarts.bg,
              color: [colors.successLight, colors.warningLight, colors.infoLight, colors.primaryLight, colors.dangerLight],
              // color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)',
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: [this.paid, this.unPaid, this.Draft, this.Sent, this.Overdue],
                textStyle: {
                  color: echarts.textColor,
                },
              },
              series: [
                {
                  name: 'Invoice',
                  type: 'pie',
                  radius: '80%',
                  center: ['50%', '50%'],
                  data: result,
                  // data: [
                  //   { value: this.report[0]?.value, name: this.report[0]?.name },
                  //   { value: 10, name: 'Draft' },
                  //   { value: 16, name: 'Unpaid' },
                  //   { value: 108, name: 'Paid' }
                  // ],
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: echarts.itemHoverShadowColor,
                    },
                  },
                  label: {
                    normal: {
                      textStyle: {
                        color: echarts.textColor,
                      },
                    },
                  },
                  labelLine: {
                    normal: {
                      lineStyle: {
                        color: echarts.axisLineColor,
                      },
                    },
                  },
                },
              ],
            };

            this.loading = false;
          }
        });
      }, error => {
        console.log(error);
        this.loading = false;
      }
    )
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
