import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getCovidStatistics() {
    let url = 'https://api.covidindiatracker.com/total.json';
    return this.http.get(url);
  }

  getNewsFeed() {
    let url = 'http://newsapi.org/v2/top-headlines?' +
      'country=in&' + 'q=covid&' + 'sortBy=popularity&' +
      'apiKey=c64088cc3ae54c8ab633c1b4b25e6871';
    return this.http.get(url);
  }

  getHelplineNumbers() {
    let url='https://covid-19india-api.herokuapp.com/v2.0/helpline_numbers';
    return this.http.get(url);
  }
}
