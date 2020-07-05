import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { Subscription } from '../../../node_modules/rxjs';
import { BluetoothService } from '../bluetooth.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  // News Obj
  articles: any[];
  result;
  newsSubscription: Subscription;
  statisticsSubscription: Subscription;

  constructor(private appService: AppService) { 
    

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.newsSubscription = this.appService.getNewsFeed().subscribe((data) => {
      this.articles = data['articles'];
    });

    this.statisticsSubscription = this.appService.getCovidStatistics().subscribe((data) => {
      console.log(data);
      this.result = data;
    });

    
    
  }

  ngOnDestroy() {
    this.newsSubscription.unsubscribe();
    this.statisticsSubscription.unsubscribe();
  }

}
