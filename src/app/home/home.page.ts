import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonRange, IonSelect, IonSlides } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from './home.service';

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
    region: new FormControl(null, [ Validators.required ]),
    startday: new FormControl('01-01-2019'),
    starttime: new FormControl('11:30'),
    endday: new FormControl('02-02-2019'),
    endtime: new FormControl('23:34'),
    fullcapicity: new FormControl(100),
    minimalcapacity: new FormControl(20),
    begincapacity: new FormControl(80)
  });

  constructor(private homeService: HomeService) {
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
      this.homeService.send(
        this.promiseForm.value,
        this.hourRange.value,
        {
          monday: this.mondayStatus,
          tuesday: this.tuesdayStatus,
          wednesday: this.wednesdayStatus,
          thursday: this.thursdayStatus,
          friday: this.fridayStatus,
          saturday: this.saturdayStatus,
          sunday: this.sundayStatus
        }
      );
    }
  }
}
