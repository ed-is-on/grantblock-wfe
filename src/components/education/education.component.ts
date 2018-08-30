import { Component } from "@angular/core";


@Component({
    selector: "education-component",
    templateUrl: "./education.component.html",
    styleUrls: ["./education.component.css"],
})
export class EducationComponent {

    edDisplayPod1: Boolean = true;
    edDisplayPod2: Boolean = true;
    edDisplayPod3: Boolean = true;
    edDisplayPod4: Boolean = true;
    constructor () { }

    onMobileViewEd() {
        let _onMobileViewEd: Boolean = true;
        if (window.innerWidth <= 768) {
          _onMobileViewEd = false;
        }
        // console.log(window.innerWidth);
        return _onMobileViewEd;
    
      }
    
      togglePodEd(_EDpodNumber: number) {
    
        switch (_EDpodNumber) {
          case 1:
            this.edDisplayPod1 = !this.edDisplayPod1;
            break;
          case 2:
            this.edDisplayPod2 = !this.edDisplayPod2;
            break;
          case 3:
            this.edDisplayPod3 = !this.edDisplayPod3;
            break;
          case 4:
            this.edDisplayPod4 = !this.edDisplayPod4;
            break;
          default:
            break;
        }
    
      }
}