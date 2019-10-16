import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NavController } from '@ionic/angular';
import { Http } from '@angular/http';
import { Uid } from '@ionic-native/uid/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public NavController: NavController, public  sim: Sim, public geolocation: Geolocation, public emailComposer: EmailComposer,  public androidPermissions: AndroidPermissions, public http: Http, private uid: Uid) { }
  
  public simInfo: any;
  public cards: any;
  mensagem: string;
  subject='Denuncia';
  body='';
  to='tsuiya.hachiman@gmail.com';
  public lat: number;
  public long: number;
  public IMEI: string;
  public url: string;

  local(){
     let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
        this.lat = data.coords.latitude;
        this.long = data.coords.longitude;
});
    };

    catar(){
      this.url = 'http://google.com/maps/bylatlng?lat=' + this.lat + '&lng=' + this.long;
      this.mensagem = this.body + '<br> <br>' + this.lat + '<br>' + this.long + '<br>' + this.uid.IMEI + '<br>' + '<br>' + this.url ;
    }

 

  async getSimData() {
    try {
      let simPermission = await this.sim.requestReadPermission();
      if (simPermission == "OK") {
        let simData = await this.sim.getSimInfo();
        this.simInfo = simData;
        this.cards = simData.cards;
        console.log(simData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getImei() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
   
    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
   
      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }
      return;
    }
   
     return this.IMEI = this.uid.IMEI;

   }

   enviar(){
    let email = {
      to: this.to,
      subject: this.subject,
      body: this.mensagem,
      isHtml: true
    }
    this.emailComposer.open(email);
  }

}
  