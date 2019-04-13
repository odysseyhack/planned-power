import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { IonSlides, IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements AfterViewInit {
  ngAfterViewInit(): void {
    // this.slides.slideNext();
    // this.slides.slideNext();
  }

  onNextButtonClick = () =>
    this.slides.slideNext();

  onCarSelectButtonClick = () =>
    this.carSelector.open();

  @ViewChild('slides') slides : IonSlides;
  @ViewChild('carSelector') carSelector : IonSelect;

  slideOpts = {
    effect: 'flip'
  };
}
