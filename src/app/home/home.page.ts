import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonRange, IonSelect, IonSlides } from '@ionic/angular';
import { flatMap } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { PowerPromiseService } from '../core/blockchain/power-promise.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [ 'home.page.scss' ],
})
export class HomePage implements AfterViewInit {

  @ViewChild('slides') slides: IonSlides;
  @ViewChild('carSelector') carSelector: IonSelect;
  @ViewChild('paintRange') paintRange: IonRange;
  @ViewChild('hourRange') hourRange: IonRange;

  mondayStatus = true;
  tuesdayStatus = true;
  wednesdayStatus = true;
  thursdayStatus = true;
  fridayStatus = true;
  saturdayStatus = false;
  sundayStatus = false;

  isSliderAtEnd = false;
  sliderLength = 0;

  wizardCompleted = false;
  showDashboard = true;
  back = false;

  slideOpts = {
    effect: 'flip',
    touchRatio: 0
  };

  promiseForm = new FormGroup({
    region: new FormControl('Beijum'),
    startday: new FormControl('01-01-1010'),
    starttime: new FormControl('11:30'),
    endday: new FormControl('02-02-2020'),
    endtime: new FormControl('23:34'),
    fullcapicity: new FormControl(100),
    minimalcapacity: new FormControl(20),
    begincapacity: new FormControl(80)
  });

  constructor(private powerPromiseService: PowerPromiseService) {
  }


  ngAfterViewInit(): void {
    this.slides.length().then(x => this.sliderLength = x);

    this.slides.ionSlideWillChange.subscribe(() => {
      this.slides.getActiveIndex().then(beforeChangeIndex => {
        this.isSliderAtEnd = ++beforeChangeIndex === this.sliderLength;
      });
    });
  }

  onNextButtonClick = () => this.slides.slideNext();
  onCarSelectButtonClick = () => this.carSelector.open();

  onMondayClick = () => this.mondayStatus = !this.mondayStatus;
  onTuesdayClick = () => this.tuesdayStatus = !this.tuesdayStatus;
  onWednesdayClick = () => this.wednesdayStatus = !this.wednesdayStatus;
  onThursdayClick = () => this.thursdayStatus = !this.thursdayStatus;
  onFridayClick = () => this.fridayStatus = !this.fridayStatus;
  onSaturdayClick = () => this.saturdayStatus = !this.saturdayStatus;
  onSundayClick = () => this.sundayStatus = !this.sundayStatus;

  findChargers = () => this.showDashboard = false;
  toDashboard = () => this.showDashboard = true;


  completeWizard() {
    this.wizardCompleted = true;

    this.powerPromiseService.promise({
      region: 'Beijum',
      startday: '01-01-1010',
      starttime: '11:30, ',
      endday: '02-02-2020',
      endtime: '23:34',
      fullcapicity: 100,
      minimalcapacity: 20,
      begincapacity: 80
    }).pipe(
      flatMap(() => this.powerPromiseService.length()),
      flatMap(length => this.powerPromiseService.retrieve(length)),
      catchError(err => {
        console.error(err);
        return throwError(err);
      }),
    ).subscribe(console.table);
  }
}
