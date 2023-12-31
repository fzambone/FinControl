import React, {useEffect, useState} from 'react';
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../services/api';
import {Category, Transaction} from '../types';
import {formatDate, toISODateString} from "@/src/utils/dateUtils";
import TransactionEditModal from "@/src/components/TransactionEditModal";
import DeleteConfirmationDialog from "@/src/components/DeleteConfirmationDialog";
import formatCurrency from "@/src/utils/currencyUtils"

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get<Category[]>('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
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

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '10px'}}>
                <Button onClick={() => handleOpenModalForNew()} variant="contained" color="primary">
                    Add New Transaction
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold'}}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold'}} align="right">Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold'}} align="right">Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold'}} align="right">Amount (R$)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold'}} align="right">Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold'}} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.ID}>
                                <TableCell component={"th"} scope={"row"}>{transaction.Name}</TableCell>
                                <TableCell align={"right"}>{getCategoryNameById(transaction.CategoryID)}</TableCell>
                                <TableCell align={"right"}>{transaction.Type}</TableCell>
                                <TableCell align={"right"}>{formatCurrency(transaction.Amount)}</TableCell>
                                <TableCell align={"right"}>{formatDate(transaction.PaymentDate)}</TableCell>
                                <TableCell align={"right"}>
                                    <IconButton
                                        aria-label={"edit"}
                                        color={"primary"}
                                        onClick={() => handleOpenModal(transaction)}
                                    ><EditIcon/></IconButton>
                                    <IconButton
                                        aria-label={"delete"}
                                        color={"secondary"}
                                        onClick={() => openDeleteDialog(transaction.ID)}
                                    ><DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TransactionEditModal open={isModalOpen} onClose={handleCloseModal} transaction={editingTransaction}
                                  onSave={handleSaveTransaction} categories={categories}/>
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