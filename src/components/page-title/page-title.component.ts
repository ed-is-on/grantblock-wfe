import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: 'page-title',
    templateUrl:'./page-title.component.html',
    styleUrls:['./page-title.component.css']
})
export class PageTitleComponent implements OnInit{
    
    @Input() pageInfo:{Title:string,Description:string};
    
    ngOnInit(){
        this.pageInfo = this.pageInfo || {Title:'Demo Title', Description:'Demo Description'}
    }
    
    constructor(){
    }

}