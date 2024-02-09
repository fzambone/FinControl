export interface Category {
    ID: number;
    Name: string;
}
export interface PaymentMethod {
    ID: number;
    Name: string;
}
export interface Transaction {
    ID: number;
    Name: string;
    CategoryID: number;
    PaymentMethodID: number;
    Type: string;
    Amount: number;
    PaymentDate: string;
    ReferenceDate: string;
}
export interface ColumnDefinition<T> {
    title: string;
    field: string;
    sortable?: boolean;
    render: (item: T) => React.ReactNode;
}
export interface GenericListProps<T> {
    data: T[];
    columns: ColumnDefinition<T>[];
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
}

export interface GenericEditModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}