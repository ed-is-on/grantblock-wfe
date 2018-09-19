export class Award{
    requestId:string;
    status:string;
    createdDate:Date;
    requestValue:number;
    owner:string;
    private assignedValidators:any[];
    private approvedValidators:any[];
    private rejectValidators:any[];
    private treasuryValidator:Boolean;
    type:string;
    availableBalance?:number;
    name?:string;

    constructor(){
        
    }
}