import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

@IonicPage()
@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})

export class ConfigurationPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public afAuth: AngularFireAuth,
              public platform: Platform,
              public loading: LoadingController,
              public toast: ToastController,
              private contacts: Contacts,
              private angularFireDatabaseModule: AngularFireDatabase) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigurationPage');
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
