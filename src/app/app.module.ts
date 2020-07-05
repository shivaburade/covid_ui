import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule }    from '@angular/common/http';
import { AppService } from './shared/services/app.service';
import { SharedModule } from './shared/shared.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BluetoothService } from './bluetooth.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { PapaParseModule } from 'ngx-papaparse';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, SharedModule, PapaParseModule],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    InAppBrowser,
    BluetoothService,
    LocalNotifications,
    BLE,
    File,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
