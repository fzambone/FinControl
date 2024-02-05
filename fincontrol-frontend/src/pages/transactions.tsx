import React, {useEffect, useState} from 'react';
import { Button } from "@mui/material";
import API from '../services/api';
import {Category, ColumnDefinition, PaymentMethod, Transaction} from '../types';
import {formatDate, toISODateString} from "@/src/utils/dateUtils";
import DeleteConfirmationDialog from "@/src/components/DeleteConfirmationDialog";
import {GenericList} from "@/src/components/GenericList";
import {GenericEditModal} from "@/src/components/GenericEditModal";
import TransactionForm from "@/src/components/TransactionForm";
import formatCurrency from "@/src/utils/currencyUtils";
import {FileUploadForm} from "@/src/components/FileUploadForm";

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(null);
    const [openUploadModal, setOpenUploadModal] = useState(false);

    const transactionColumns: ColumnDefinition<Transaction>[] = [
        { title: 'Name', field: 'Name', sortable: true, render: (transaction) => transaction.Name },
        { title: 'Category', field: 'Category', render: (transaction) => getCategoryNameById(transaction.CategoryID) },
        { title: 'Type', field: 'Type', sortable: true, render: (transaction) => transaction.Type },
        { title: 'Amount (R$)', field: 'Amount', render: (transaction) => formatCurrency(transaction.Amount) },
        { title: 'Payment Method', field: 'PaymentMethod', render:(transaction) => getPaymentMethodNameById(transaction.PaymentMethodID) },
        { title: 'Date', field: 'PaymentDate', sortable: true, render: (transaction) => formatDate(transaction.PaymentDate) },
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get<Category[]>('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchPaymentMethods = async ()=> {
            try {
                const response = await API.get<PaymentMethod[]>('/paymentMethods');
                setPaymentMethods(response.data);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await API.get<Transaction[]>('/transactions');
                const sortedTransactions = response.data.sort((a, b) => {
                    return new Date(b.PaymentDate).getTime() - new Date(a.PaymentDate).getTime();
                })
                setTransactions(sortedTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchCategories();
        fetchPaymentMethods();
        fetchTransactions();
    }, []);
    const handleOpenModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };
    const handleOpenModalForNew = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };
    const handleSaveTransaction = (updatedTransaction: Transaction) => {
        const payload = {
            ...updatedTransaction,
            PaymentDate: toISODateString(updatedTransaction.PaymentDate)
        }

        if (editingTransaction) {
            API.put(`/transactions/${updatedTransaction.ID}`, payload)
                .then(response => {
                    const updatedTransactions = transactions.map(t =>
                        t.ID === updatedTransaction.ID ? response.data : t
                    );
                    setTransactions(updatedTransactions);
                })
                .catch(error => {
                    console.error("Error saving transaction:", error);
                });
        } else {
            API.post('/transactions', payload)
                .then(response => {
                    setTransactions([...transactions, response.data])
                })
                .catch(error => {
                    console.error("Error creating transaction:", error);
                });
        }
        handleCloseModal();
    };
    const getCategoryNameById = (categoryId: number) => {
        const category = categories.find(cat => cat.ID === categoryId);
        return category ? category.Name : 'Unknown';
    };
    const getPaymentMethodNameById = (paymentMethodID: number) => {
        const paymentMethod = paymentMethods.find(met => met.ID === paymentMethodID);
        return paymentMethod ? paymentMethod.Name : 'Unknown';
    }
    const handleDeleteTransaction = (transactionID: number) => {
        API.delete(`/transactions/${transactionID}`)
            .then(() => {
                const updatedTransactions = transactions.filter(t => t.ID !== transactionID);
                setTransactions(updatedTransactions);
                closeDeleteDialog();
            })
            .catch(error => {
                console.error("Error deleting transaction:", error);
            });
    };
    const openDeleteDialog = (transactionId: number) => {
        setDeleteTransactionId(transactionId);
        setIsDeleteDialogOpen(true);
    }
    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    }
    const handleAddCategory = async (newCategory: Category) => {
        try {
            const { ID, ...categoryData } = newCategory;
            const response = await API.post('/categories', categoryData);
            setCategories(prevCategories => [...prevCategories, response.data]);
        } catch (error) {
            console.error("Error saving new category:", error)
        }
    }
    const handleFileUpload = (file: File) => {
        console.log("File to upload:", file.name);
        //TODO: Upload file API call
        setOpenUploadModal(false);
    };

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '10px'}}>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => setOpenUploadModal(true)}
                    sx={{ mr: 2 }}
                >
                    Upload Statement
                </Button>
                <Button onClick={() => handleOpenModalForNew()} variant="contained" color="primary">
                    Add New Transaction
                </Button>
            </div>
            <GenericList
                data={transactions}
                columns={transactionColumns}
                onEdit={handleOpenModal}
                onDelete={(transactionId) => openDeleteDialog(transactionId)}
            />
            <GenericEditModal open={isModalOpen} onClose={handleCloseModal}>
                <TransactionForm transaction={editingTransaction} onSave={handleSaveTransaction} categories={categories} onAddCategory={handleAddCategory} paymentMethods={paymentMethods} />
            </GenericEditModal>
            <GenericEditModal open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
                <FileUploadForm onFileUpload={handleFileUpload} />
            </GenericEditModal>
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={() => {
                    if (deleteTransactionId !== null) {
                        handleDeleteTransaction(deleteTransactionId);
                    }
                    closeDeleteDialog();
                }}
            ></DeleteConfirmationDialog>
        </>
    );
};

export default Transactions;