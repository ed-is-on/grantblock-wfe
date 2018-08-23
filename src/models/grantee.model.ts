export class Grantee{
    Name: string;
    Amount: number;
    Id: string;
    Email: string;

    constructor(
        _name:string,
        _amount:number,
        _id?:string,
        _email?:string,
    ){
        this.Name = _name;
        this.Amount = _amount;
        // This ID would be generated from a server
        this.Id = _id;
        this.Email = _email;
    }
    
}