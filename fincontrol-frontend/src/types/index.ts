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
export interface ColumnDefinition<T> {
    title: string;
    render: (item: T) => React.ReactNode;
}
export interface GenericListProps<T> {
    data: T[];
    columns: ColumnDefinition<T>[];
    onEdit: (item: T) => void;
    onDelete: (itemId: number) => void;
}

export interface GenericEditModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}