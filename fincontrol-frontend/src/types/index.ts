export interface Category {
    ID: number;
    Name: string;
}

export interface Transaction {
    ID: number;
    Name: string;
    CategoryID: number;
    Type: string;
    Amount: number;
    PaymentDate: string;
}