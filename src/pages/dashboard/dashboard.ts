/*
* Created By Lenz Petion
* CKL Group Inc.
* Last update October 3 2017
*
*
* */
import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import {  FormGroup, FormControl } from '@angular/forms';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: 'dashboard.html'
})
export class DashboardComponent {

   firstName: string;
   lastName: string;
   ticketConfirmation: any;
   standByDeleteValue: string;
   lastPosition: any;
   userPosition: any;
   hiddenPublicity = false;
   idsTicket = [];
   firstNamesTicket = [];
   lastNamesTicket = [];
   idsTicketStandby = [];
   firstNamesTicketStandby = [];
   lastNamesTicketStandby = [];

   idsReservation = [];
   dateReservation = [];
   timeReservation = [];
   firstNamesReservation = [];
   lastNamesReservation = [];
   numberClientWaitingTicketList = 0;
   numberClientWaitingReservation = 0;
   adForm: FormGroup;
   dataSnapshot: Array<any> = [];
   dataSnapshotStandBy:Array<any> = [];




constructor(private routerLink: Router) {
    this.TicketListTable();
    this.StandByListTable();
    this.ReservationTable();
    this.ClientWaiting();
    this.TotalReservation();
    this.getLastClient();
    this.updateDataSnapshot();
    this.adForm = new FormGroup({
      live: new FormControl()
    });

  }


  ngOnInit() {
  //this.showTicketDiv();
  }

  TicketListTable() {
     const listOfUsers = firebase.database().ref('TicketList/Users/');
     listOfUsers.limitToFirst(5).on('value', function(snapshot) {
       const ids = [];
       const firstNames = [];
       const lastNames = [];
       snapshot.forEach(function(childSnapshot) {

         const id = childSnapshot.key;
         const firstName = childSnapshot.val().firstName.toUpperCase();
         const lastName = childSnapshot.val().lastName.toUpperCase();
         ids.push(id);
         firstNames.push(firstName);
         lastNames.push(lastName);
       }.bind(this));

         this.idsTicket = ids,
         this.firstNamesTicket = firstNames,
         this.lastNamesTicket =  lastNames


     }.bind(this));
   }

  StandByListTable() {
    const listOfUsers = firebase.database().ref('StandByList/Users/');
    listOfUsers.limitToFirst(5).on('value', function(snapshot) {
      const ids = [];
      const firstNames = [];
      const lastNames = [];
      snapshot.forEach(function(childSnapshot) {

        const id = childSnapshot.key;
        const firstName = childSnapshot.val().firstName.toUpperCase();
        const lastName = childSnapshot.val().lastName.toUpperCase();
        ids.push(id);
        firstNames.push(firstName);
        lastNames.push(lastName);
      }.bind(this));

        this.idsTicketStandby = ids,
        this.firstNamesTicketStandby = firstNames,
        this.lastNamesTicketStandby =  lastNames


    }.bind(this));
  }

  ReservationTable() {
    const listOfUsers = firebase.database().ref('Appointments/Users/');
    listOfUsers.limitToFirst(2).on('value', function(snapshot) {
      const ids = [];
      const dates = [];
      const times = [];
      const firstNames = [];
      const lastNames = [];
      snapshot.forEach(function(childSnapshot) {
        const id = childSnapshot.key;
        const date = childSnapshot.val().Date.toUpperCase();
        const time = childSnapshot.val().Hour.toUpperCase();
        const firstName = childSnapshot.val().firstName.toUpperCase();
        const lastName = childSnapshot.val().lastName.toUpperCase();
        ids.push(id);
        dates.push(date);
        times.push(time);
        firstNames.push(firstName);
        lastNames.push(lastName);
      }.bind(this));


        this.idsReservation = ids,
        this.dateReservation = dates,
        this.timeReservation = times,
        this.firstNamesReservation = firstNames,
        this.lastNamesReservation =  lastNames


    }.bind(this));
  }

  ClientWaiting() {
    const listOfUsers = firebase.database().ref('TicketList/Users/');
    listOfUsers.on('value', function(snapshot) {
      var numberClientWaitingTicketList = 0;
      snapshot.forEach(function(childSnapshot) {
        numberClientWaitingTicketList++;
      }.bind(this));
      this.numberClientWaitingTicketList = numberClientWaitingTicketList;
    }.bind(this));
  }

  TotalReservation() {
    const listOfUsers = firebase.database().ref('Appointments/Users/');
    listOfUsers.on('value', function(snapshot) {
      var numberClientWaitingReservation = 0;
      snapshot.forEach(function(childSnapshot) {
        numberClientWaitingReservation++;
      }.bind(this));
      this.numberClientWaitingReservation = numberClientWaitingReservation
    }.bind(this));
  }

  logout() {
    // this.routerLink.navigate(['/dashboard']);

  }

  liveMesssage() {
    let model = this;
    const liveMessages = firebase.database().ref('Messages/');
    var temp = model;
    console.log(temp);
    liveMessages.update({
      "live" : temp,
    });
  }

  saveAdChanges() {
    const liveMessages = firebase.database().ref('Messages');
    const data = this.adForm.value;
    liveMessages.set(data);
  }

  nextClient() {
    const firstUser = firebase.database().ref('TicketList/Users/').child(this.idsTicket[0]);
    firstUser.set(null);
  }
  nextAppointments() {
    const firstUser = firebase.database().ref('Appointments/Users/').child(this.idsReservation[0]);
    firstUser.set(null);
  }
  removeFromStandByList() {
    const x =   parseInt(this.standByDeleteValue) -1;
    const firstUser = firebase.database().ref('StandByList/Users/').child(this.idsTicketStandby[x.toString()]);
    firstUser.set(null);

  }

   moveToStandBy() {
     if (this.idsTicket[0] != null) {
       var toAdd = (this.idsTicketStandby.length + 1).toString();
     const oldRef = firebase.database().ref('TicketList/Users/' + this.idsTicket[0]);
     const newRef = firebase.database().ref('StandByList/Users/'+ toAdd);

     oldRef.once('value', function (snap) {
       newRef.set(snap.val(), function (error) {
         if (!error) {
           oldRef.remove();
         }
         else if (typeof(console) !== 'undefined' && console.error) {
           console.error(error);
         }
       });
     });
   }
  }

  public getLastClient() {
    const dbRefObject = firebase.database().ref('TicketList/Users/');
    dbRefObject.on('value', function(snapshot) {
      const ids = [];
      snapshot.forEach(function(childSnapshot) {
        const id = childSnapshot.key
        ids.pop();
        ids.push(id);
      }.bind(this));
      this.lastPosition = ids;
    }.bind(this));
  }

  takeANumber() {
  if (this.isAvailable) {
      const dbRefObject = firebase.database().ref().child('TicketList/Users/');
      this.userPosition = Number(this.lastPosition) + 1;
      const uPosition = this.userPosition;
      this.ticketConfirmation = uPosition;
      dbRefObject.child(uPosition).set(
        {
          'firstName': this.firstName,
          'lastName': this.lastName,
          'email': 'notAvailable',
          'phoneNumber': 'notAvailable',
          'uid': 'notAvailable'
        }
      );
      alert('Your Name as been added to the list. Thank you for using BarberMe!');
      this.firstName = null;
      this.lastName = null;
    }

  }

  updateDataSnapshot() {
    let model = this;
    firebase.database().ref('TicketList/Users/')
      .on('value', function(snapshot) {
        let tickets = snapshot.val();
        model.dataSnapshot = [];
        for (const property in tickets) {
          if (tickets.hasOwnProperty(property)) {
            model.dataSnapshot.push(tickets[property]);
          }
        }
      });

    firebase.database().ref('StandByList/Users/')
      .on('value', function(snapshot) {
        let tickets = snapshot.val();
        model.dataSnapshot = [];
        for (const property in tickets) {
          if (tickets.hasOwnProperty(property)) {
            model.dataSnapshotStandBy.push(tickets[property]);
          }
        }
      });
  }

  isAvailable(): Boolean {
    return (this.dataSnapshot.find(item => item.firstName === this.firstName) === undefined);
  }
  showTicketDiv() {
    var i;
    var counter = 0,
      divs = $('#mainDiv, #seconDiv');

    function showDiv () {
      divs.hide(2000)
        .filter(function (index) { return index === counter % 2; })
        .show('fast'); // and show it
      alert(divs[0].getElementsByClassName('name'));
      counter++;
    }
    showDiv();

    setInterval(function () {
      showDiv();
    }, 2 * 1000);

  }







}
