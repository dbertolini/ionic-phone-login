import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, Events } from 'ionic-angular';
import firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { TabsPage } from '../tabs/tabs';
import { PhoneVerifyPage } from '../phone-verify/phone-verify';

import { User } from '../../models/user';

interface Window {
  FirebasePlugin: any;
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user = {} as User;
  verificationId: any;
  recaptchaVerifier: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public platform: Platform,
    public loading: LoadingController,
    public toast: ToastController,
    public events: Events
  ) {
    // By defaults selects Argentina
    this.user.phoneCountryCode="+54";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  isEmpty(obj):boolean {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  }

  phoneLogin(user: User) {

    if(!this.isEmpty(user.phone))
    {
      // If it is a browser, gets the common login
      if(this.platform.is('core') || this.platform.is('mobileweb')) {

        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

        this.afAuth.auth.signInWithPhoneNumber(this.user.phoneCountryCode + this.user.phone, this.recaptchaVerifier)
        .then(data => {
          // Toast message about event
          let toaster = this.toast.create({
            message: 'Por favor, introduzca el código enviado por mensaje SMS a su teléfono.',
            duration: 4000
          });
          toaster.present();
          console.log(data);

          this.navCtrl.push(PhoneVerifyPage, {'verificationId': data.verificationId});
        }).catch(err => {
          // Toast message about event
          let toaster = this.toast.create({
            message: 'Error al verificar número telefónico. Por favor, compruebe el mismo (Ej: 1133863747).',
            duration: 4000
          });
          toaster.present();
          console.error(err);
        });

      }
      else {

        // Loading spinner
        let loader = this.loading.create({
          content: "Por favor, espere..."
        });
        loader.present();

        (<any>window).FirebasePlugin.verifyPhoneNumber(this.user.phoneCountryCode + this.user.phone, 60, (credential) => {
          // Toast message about event
          let toaster = this.toast.create({
            message: 'Por favor, introduzca el código enviado por mensaje SMS a su teléfono.',
            duration: 4000
          });
          toaster.present();

          console.log(credential);

          this.verificationId = credential.verificationId;

          loader.dismiss();

          this.navCtrl.push(PhoneVerifyPage, {'verificationId': this.verificationId});

        },(error) => {
          loader.dismiss();

          // Toast message about event
          let toaster = this.toast.create({
            message: 'Error al verificar número telefónico. Por favor, compruebe el mismo (Ej: 1133863747).',
            duration: 4000
          });
          toaster.present();

          console.error(error);
        });
      }
    }
    else {
      // Toast message about event
      let toaster = this.toast.create({
        message: 'Error al verificar número telefónico. Por favor, compruebe el mismo (Ej: 1133863747).',
        duration: 4000
      });
      toaster.present();
    }
  }
}
