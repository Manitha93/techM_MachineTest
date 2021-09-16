import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddEventPage} from '../add-event/add-event'
import { ViewEventPage} from '../view-event/view-event'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

expenses: any = [];
totalIncome = 0;
totalExpense = 0;
balance = 0;
showdata : boolean = false;
constructor(public navCtrl: NavController,
  private sqlite: SQLite) {}

ionViewDidLoad() {
  this.getData();
}

ionViewWillEnter() {
  this.getData();
}

getData() {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('CREATE TABLE IF NOT EXISTS expense(rowid INTEGER PRIMARY KEY, title TEXT, description TEXT, date TEXT, location INT)', [])
    .then(res => console.log('Executed SQL'))
    .catch(e => console.log(e));
    db.executeSql('SELECT * FROM expense ORDER BY rowid DESC', [])
    .then(res => {
      this.expenses = [];
      for(var i=0; i<res.rows.length; i++) {
        this.expenses.push({rowid:res.rows.item(i).rowid,title:res.rows.item(i).title,description:res.rows.item(i).description,date:res.rows.item(i).date,location:res.rows.item(i).location})
      }
    })
    .catch(e => console.log(e));
    db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Location"', [])
    .then(res => {
      if(res.rows.length>0) {
        this.totalIncome = parseInt(res.rows.item(0).totalIncome);
        this.balance = this.totalIncome-this.totalExpense;
      }
    })
    .catch(e => console.log(e));
    db.executeSql('SELECT SUM(amount) AS totalExpense FROM expense WHERE type="Expense"', [])
    .then(res => {
      if(res.rows.length>0) {
        this.totalExpense = parseInt(res.rows.item(0).totalExpense);
        this.balance = this.totalIncome-this.totalExpense;
      }
    })
  }).catch(e => console.log(e));
}

addEvent() {
  this.navCtrl.push(AddEventPage);
}

viewEvent() {
    //     console.log("viewEvent clicked")
this.showdata = true;
  
}

editData(rowid) {
  this.navCtrl.push(ViewEventPage, {
    rowid:rowid
  });
}

deleteData(rowid) {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DELETE FROM expense WHERE rowid=?', [rowid])
    .then(res => {
      console.log(res);
      this.getData();
    })
    .catch(e => console.log(e));
  }).catch(e => console.log(e));
}

}
