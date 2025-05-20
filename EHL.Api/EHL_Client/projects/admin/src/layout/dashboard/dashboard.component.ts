import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../../../shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'projects/shared/src/service/api.service';
import {
  Category,
  Eqpt,
  SubCategory,
  Wing,
} from 'projects/shared/src/models/attribute.model';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [SharedLibraryModule],
})
export class DashboardComponent implements AfterViewInit {
  wing$: Observable<string | null>;
  // totalInputs = 27;
  // todayInputs = 0;
  // last7DaysInputs = 1;
  totalEmer: string=''
  totalWingEmer:string=''
  lastSixMAddedEmer:string=''
  wingId :string=''
  wing:Wing[]=[]
  categoryList: Category[] = [];
  subCategoryList: SubCategory[] = [];
  eqptList: Eqpt[] = [];
  categoryId: number;
  subCategoryId: number;

  constructor(private authService: AuthService, private apiService: ApiService,) {
    this.wing$ = this.authService.wing$;
    this.wingId= this.authService.getWingId()
    this.getEmerCount()
    this.getCategory(this.wingId)
  }
  getEmerCount() {
    this.apiService.getWithHeaders('Dashboard/emerCount/'+this.wingId).subscribe((res) => {
      if (res) {
        this.totalEmer=res.totalEmerCount,
        this.totalWingEmer=res.wingEmerCount,
        this.lastSixMAddedEmer=res.sixMonthWingEmerCount

      }
    });
  }
  getCategory(wingId) {
    this.apiService
      .getWithHeaders('attribute/category' + wingId)
      .subscribe((res) => {
        if (res) {
          this.categoryList = res;
          this.categoryId = this.categoryList[0].id;
          // this.getSubCategory(this.categoryId);
        }
      });
  }
  getSubCategory(categoryId) {
    if (this.categoryList.length > 0 && categoryId == undefined) {
      categoryId = this.categoryList[0].id;
    }
    this.apiService
      .getWithHeaders('attribute/subcategory' + categoryId)
      .subscribe((res) => {
        if (res) {
          this.subCategoryList = res;
          this.subCategoryId = this.subCategoryList[0].id;
          this.getEqpt();
        }
      });
  }
  getEqpt() {
    this.apiService
      .getWithHeaders(
        'attribute/eqpt' + this.categoryId + '/' + this.subCategoryId
      )
      .subscribe((res) => {
        if (res) {
          this.eqptList = res;
        }
      });
  }

  ngAfterViewInit(): void {

    const labels = this.categoryList.map(c => c.name);
    const data = this.categoryList.map(c => c.id);
    const backgroundColor = ['#1A237E', '#3C4C3A', '#B2BEB5', '#FF6F00']; // or generate dynamically

    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: [10, 5, 7, 3],
            backgroundColor: backgroundColor,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          animateScale: true,
        },
      },
    });

    // new Chart('pieChart', {
    //   type: 'pie',
    //   data: {
    //     labels: [
    //       'Auto Wing',
    //       'Electronic wing',
    //       'Mechnery wing',
    //       'Aviation wing',
    //     ],
    //     datasets: [
    //       {
    //         data: [10, 5, 7, 3],
    //         backgroundColor: ['#1A237E', '#3C4C3A', '#B2BEB5', '#FF6F00'],
    //         borderWidth: 2,
    //       },
    //     ],
    //   },
    //   options: {
    //     responsive: true,
    //     animation: {
    //       animateScale: true,
    //     },
    //   },
    // });

    new Chart('doughnutChart', {
      type: 'doughnut',
      data: {
        labels: ['Sector A', 'Sector B', 'Sector C'],
        datasets: [
          {
            data: [6, 8, 10],
            backgroundColor: ['#6366F1', '#EC4899', '#22D3EE'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      },
    });

    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Monthly Data',
            data: [12, 19, 3, 5, 2, 3, 23, 4, 15, 6, 7, 18, 9],
            backgroundColor: '#3B82F6',
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: 'Monthly Data Overview',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    //  2nd chart
    new Chart('pieChart2', {
      type: 'pie',
      data: {
        labels: [
          'Auto Wing',
          'Electronic wing',
          'Mechnery wing',
          'Aviation wing',
        ],
        datasets: [
          {
            data: [10, 5, 7, 4, 12, 6, 24, 8],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          animateScale: true,
        },
      },
    });

    new Chart('doughnutChart2', {
      type: 'doughnut',
      data: {
        labels: ['Sector A', 'Sector B', 'Sector C'],
        datasets: [
          {
            data: [6, 8, 10],
            backgroundColor: ['#6366F1', '#EC4899', '#22D3EE'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      },
    });

    new Chart('barChart2', {
      type: 'bar',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Monthly Data',
            data: [3, 5, 8, 10],
            backgroundColor: '#3B82F6',
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: 'Monthly Data Overview',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
