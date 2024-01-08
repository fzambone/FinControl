import React from 'react';
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const transactionsData = [
    { id: 1, name: 'Compra semanal', category: 'Mercado', type: 'Expense', amount: 50, date: '2021-08-01'},
    { id: 2, name: 'Aniversário Elaine', category: 'Presentes',type: 'Expense', amount: 250.60, date: '2021-08-01'},
    { id: 3, name: 'Conta mensal de Luz', category: 'Energia',type: 'Expense', amount: 450.60, date: '2021-08-01'},
];

const Transactions: React.FC = () => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Category</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Amount (R$)</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactionsData.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell component={"th"} scope={"row"}>{transaction.name}</TableCell>
                            <TableCell align={"right"}>{transaction.category}</TableCell>
                            <TableCell align={"right"}>{transaction.type}</TableCell>
                            <TableCell align={"right"}>{transaction.amount}</TableCell>
                            <TableCell align={"right"}>{transaction.date}</TableCell>
                            <TableCell align={"right"}>
                                <IconButton aria-label={"edit"} color={"primary"}><EditIcon /></IconButton>
                                <IconButton aria-label={"delete"} color={"secondary"}><DeleteIcon /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Transactions;