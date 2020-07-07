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
  db: SQLiteObject;
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
        this.db = db;
        db.executeSql("create table IF NOT EXISTS travel_tracing(mac_address varchar(100), latitude varchar(100), longitude varchar(100), date varchar(100))").then(
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

  insert_travel_tracing(query_data){

    var query = "insert into travel_tracing VALUES(?,?,?,?)";
    this.db.executeSql(query,query_data ).then((data) => {
      console.log('added');
      console.log(data);
    }).catch((data)=>{
      console.log('not added');
      console.log(data);
    });
  }

  get_travel_tracing(){
   return this.db.executeSql('select * from travel_tracing', []).then((data) => {
     var rows = [];
     for (var i=0; i< data.rows.length; i++){
      rows.push({ name: data.rows.item(i).mac_address});
     }
      return rows;
    });
  }

  social_distance_notification() {
    this.Mask_notification();
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

  Mask_notification() {

    this.localNotifications.schedule({
      id: 3,
      title: 'Mask alert',
      text: 'Please wear a mask!',
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
              var query_data = [`${device.id}`, '21.1562136', '72.77748539', `${date}`];
              this.insert_travel_tracing(query_data);
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
