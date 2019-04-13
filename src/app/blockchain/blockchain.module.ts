import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';
import { OverviewComponent } from './overview/overview.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ OverviewComponent ],
  imports: [
    CommonModule,
    MatTableModule,
    IonicModule,
    MatProgressSpinnerModule,
    RouterModule.forChild([
      { path: '', component: OverviewComponent }
    ]),
    MatButtonModule
  ]
})
export class BlockchainModule {
}
