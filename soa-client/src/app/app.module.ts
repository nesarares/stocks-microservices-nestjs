import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LandingComponent } from './pages/landing/landing.component';
import { StockChartComponent } from './pages/dashboard/stock-chart/stock-chart.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { StockSelectComponent } from './pages/dashboard/stock-select/stock-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent,
    DashboardComponent,
    LandingComponent,
    StockChartComponent,
    SpinnerComponent,
    StockSelectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgSelectModule,
    AuthModule.forRoot({
      clientId: environment.auth0.clientId,
      domain: environment.auth0.domain,
      httpInterceptor: {
        allowedList: ['/api/*'],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
