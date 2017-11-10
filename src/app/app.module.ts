import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AgmCoreModule } from '@agm/core';
import { CalendarModule } from 'angular-calendar';

import { AppRoutes } from './app.routing';
import { AppSettings } from './app.settings';

import { AppComponent } from './app.component';

import { AppService } from './app.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    }),
    CalendarModule.forRoot(),
    AppRoutes
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppSettings,
    { provide: 'appService', useClass: AppService }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
