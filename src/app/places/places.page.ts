import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import {Geolocation} from '@ionic-native/geolocation/ngx';

// import { parse } from 'path';
declare var google;
@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit, AfterContentInit {
  map;
  cityCirlce;
  citymap;
  csvdata: any[] = [];
  headerRow: any[] = [];
  i: number = 0;
  @ViewChild('mapElement', { static: true }) mapElement; 
  constructor(private http: HttpClient, private papa: Papa,private geolocation: Geolocation) {
    this.loadCSV();
   }
   private loadCSV(){

     this.http.get('./assets/data_updated.csv', {responseType: 'text'}).subscribe(
       data => this.extractdata(data),
       err => console.log('error: ', err)
     )
   }
   extractdata(res){
     let csvdata = res || '';
     this.papa.parse(csvdata, {
       complete: parsedData => {
         
          this.headerRow = parsedData.data.splice(0,1)[0];
          this.csvdata = parsedData.data;
          console.log(this.csvdata[0][1]);
          console.log(this.csvdata[0][2]);
        }
     })
     this.geolocation.getCurrentPosition().then((position)=>{

      let latLng = new google.maps.LatLng(position.coords.latitude,
                                          position.coords.longitude);
    
      let mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    
      this.map = new google.maps.Map(this.mapElement.nativeElement, 
      mapOptions);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });
      for( this.i = 0; this.i < 374; this.i++) {
        const cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.map,
        
        center: {
          lat: parseFloat(this.csvdata[this.i][1]),
          lng: parseFloat(this.csvdata[this.i][2])
        },
        radius: 100
      
       });
      }
    
      }, (err) => {
      console.log(err);
      });
    }

  ngOnInit(): void{
  }
  ngAfterContentInit(): void {

  }
}