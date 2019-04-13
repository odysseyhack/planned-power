import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { IonSlides, IonSelect, IonRange } from '@ionic/angular';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: [ 'home.page.scss' ],
})
export class HomePage implements AfterViewInit {
	ngAfterViewInit (): void {
    this.slides.length().then(x => this.sliderLength = x);

    this.slides.ionSlideWillChange.subscribe(() => {
      this.slides.getActiveIndex().then(beforeChangeIndex => {
        this.isSliderAtEnd = ++beforeChangeIndex === this.sliderLength;
      });
    })
  }

	onNextButtonClick = () => this.slides.slideNext();

  onCarSelectButtonClick = () => this.carSelector.open();

  completeWizard = () => this.wizardCompleted = true;

	onMondayClick = () => this.mondayStatus = !this.mondayStatus;
	onTuesdayClick = () => this.tuesdayStatus = !this.tuesdayStatus;
	onWednesdayClick = () => this.wednesdayStatus = !this.wednesdayStatus;
	onThursdayClick = () => this.thursdayStatus = !this.thursdayStatus;
	onFridayClick = () => this.fridayStatus = !this.fridayStatus;
	onSaturdayClick = () => this.saturdayStatus = !this.saturdayStatus;
  onSundayClick = () => this.sundayStatus = !this.sundayStatus;

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

  wizardCompleted = true;
  showDashboard = true;

  findChargers = () => this.showDashboard = !this.showDashboard;

	slideOpts = {
    effect: 'flip',
    touchRatio: 0
	};
}
