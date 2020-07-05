import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
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
  constructor(private http: HttpClient, private papa: Papa) {
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
     this.map = new google.maps.Map(
      this.mapElement.nativeElement,{
          center: {
           
            lat:18.530646,
            lng:73.844784 
          },
          zoom: 16
          
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

    }

  ngOnInit(): void{
  }
  ngAfterContentInit(): void {

  }
}