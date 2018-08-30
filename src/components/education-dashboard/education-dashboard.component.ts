import { Component, OnInit } from "@angular/core";


@Component({
    selector: "education-dashboard",
    templateUrl: "./education-dashboard.component.html",
    styleUrls: ["./education-dashboard.component.css"]
})
export class EducationDashboardComponent {

    title: string = "Dashboard";

    constructor(

    ) {

    }

    ngOnInit() {

    }


    /** The section below has code for the resizing of pods */
    edDisplayPod1: Boolean = true;
    edDisplayPod2: Boolean = true;
    edDisplayPod3: Boolean = true;
    edDisplayPod4: Boolean = true;

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