export class Grantee{
    Name: string;
    Amount: number;
    Id: string;

    constructor(
        _name:string,
        _amount:number,
        _id?:string
    ){
        this.Name = _name;
        this.Amount = _amount;
        // This ID would be generated from a server
        this.Id = _id;
    }
    
}