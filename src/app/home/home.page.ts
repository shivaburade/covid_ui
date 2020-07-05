import { Component } from '@angular/core';
import { BluetoothService } from '../bluetooth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  devices = [];
  errMsg: string;
  constructor(private bt: BluetoothService) {
   
    bt.findDevices();
  }                           

}
