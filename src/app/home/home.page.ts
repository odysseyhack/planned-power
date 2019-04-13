import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonRange, IonSelect, IonSlides } from '@ionic/angular';
import { PowerPromiseService } from '../core/blockchain/power-promise.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { flatMap } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { forkJoin, throwError } from 'rxjs';

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
    region: new FormControl(null, [Validators.required]),
    startday: new FormControl('01-01-2019'),
    starttime: new FormControl('11:30'),
    endday: new FormControl('02-02-2019'),
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
    if (this.promiseForm.valid) {
      this.wizardCompleted = true;

      const promise = this.promiseForm.value;

      const promises = [ '15-04-2019', '16-04-2019', '17-04-2019', '18-04-2019', '19-04-2019', '20-04-2019', '21-04-2019' ]
        .map(
          (date, index) => {
            if (
              index === 0 && !this.mondayStatus ||
              index === 1 && !this.tuesdayStatus ||
              index === 2 && !this.wednesdayStatus ||
              index === 3 && !this.thursdayStatus ||
              index === 4 && !this.fridayStatus ||
              index === 5 && !this.saturdayStatus ||
              index === 6 && !this.sundayStatus
            ) {
              return;
            }

            return this.powerPromiseService.promise({
              region: promise.region,
              startday: date,
              starttime: `${this.hourRange.value[ 'lower' ]}:00`,
              endday: date,
              endtime: `${this.hourRange.value[ 'upper' ]}:00`,
              fullcapicity: 100,
              minimalcapacity: 20,
              begincapacity: 80
            });
          }
        ).filter(Boolean);

      forkJoin(promises)
        .subscribe(() => this.getPowerPromises());
    }
  }

  private getPowerPromises() {
    this.powerPromiseService.length().pipe(
      flatMap(length => this.powerPromiseService.retrieve(length)),
      catchError(err => {
        console.error(err);
        return throwError(err);
      }),
    ).subscribe(console.table);
  }
}
