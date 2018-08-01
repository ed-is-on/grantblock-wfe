import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular 6';
  
  
  firstName = 'Bryan'
  lastName = 'Strong'

  myName(){
    alert(`${this.firstName} ${this.lastName}`);
  }
}
