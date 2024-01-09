export interface Category {
    ID: number;
    name: string;
}

export interface Transaction {
    ID: number;
    Name: string;
    CategoryID: number;
    Type: string;
    Amount: number;
    PaymentDate: string;
}