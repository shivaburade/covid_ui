import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  devices = [];
  errMsg : string;
  constructor(private ble: BLE, private localNotifications: LocalNotifications, private sqlite:SQLite) { 
    
  }

  initialize(){
    this.findDevices();
    this.db_create();
  }

  db_create(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'}).then((db: SQLiteObject) => {
        
        db.executeSql("create table IF NOT EXISTS travel_tracing(mac_address varchar(100), latitude double, longitude double, date varchar(100))").then(
          () => {
            console.log('table created');
          }
        )

        db.executeSql("create table IF NOT EXISTS profile(mac_address varchar(100), username varchar(100), firstname varchar(100), lastname varchar(100), phoneno varchar(100), age int, status varchar(100), date_detected varchar(100), consent int)").then(
          () => {
            console.log('table created');
          }
        )

        db.executeSql("create table IF NOT EXISTS containment_zone(SR_NUMBER varchar(100),CONTAINMENT_ZONE_NAME varchar(100),LATITUDE double,LONGITUDE double,RADIUS int,PINCODE int,STREET varchar(100),CITY varchar(100),STATE varchar(100),COUNTRY varchar(100))").then(
          () => {
            console.log('table created');
          }
        )

    });
  }


  insert_profile(query){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'}).then((db: SQLiteObject) =>{
        db.executeSql(query).then(()=>{
          console.log('added');
        });
    });
  }

  insert_containment_zone(query){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'}).then((db: SQLiteObject) =>{
        db.executeSql(query).then(()=>{
          console.log('added');
        });
    });
  }

  insert_travel_tracing(query){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'}).then((db: SQLiteObject) =>{
        db.executeSql(query).then(()=>{
          console.log('added');
        });
    });
  }

  social_distance_notification() {

    this.localNotifications.schedule({

      id: 1,
      title: 'Social distance alert',
      text: 'Please maintain social distance',
      data: { secret: 'secret' },
      vibrate: true,
      lockscreen: true,
      foreground:true

    });
  }

  contact_tracting_notification() {

    this.localNotifications.schedule({

      id: 2,
      title: 'Contact alert',
      text: 'You recently came in cotact with covid positive patient, take care and maintain hygiene',
      data: { secret: 'secret' },
      vibrate: true,
      lockscreen: true,
      foreground:true

    });
  }

  findDevices(){
    
    //this.db_create();
    this.ble.isEnabled().then((status) => {
      setInterval(() => {
        this.ble.scan([], 2).subscribe(device => {
          
         var dev = this.devices.findIndex(d => d.id == device.id);
         
         

         if(dev == -1 || this.devices.length == 0)
          {
            this.devices.push(device);

            if(device.rssi > -80){
              this.social_distance_notification();
              var date = new Date().getTime().toString()
              var query = `insert into travel_tracing values(#{device.id}, 21.1562136, 72.77748539, #{date})`
              this.insert_travel_tracing(query);
             }
          }else{
            this.devices[dev] = device;
          }
        });
      }, 3000);
        

      
    }).catch((status) => {
      this.errMsg = "Enable Bluetooth to continue";
      this.ble.enable();
      //this.findDevices();
    })
  }

  getDevices(){
    return this.devices;
  }
}
