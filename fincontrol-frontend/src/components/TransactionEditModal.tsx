import {Category, Transaction} from "@/src/types";
import React, {useEffect, useState} from "react";
import {Box, Button, MenuItem, Modal, Select, SelectChangeEvent, TextField, useTheme} from "@mui/material";
import { toInputDateValue } from "@/src/utils/dateUtils";


interface TransactionEditModalProps {
    open: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onSave: (updatedTransaction: Transaction) => void;
    categories: Category[];
}

const TransactionEditModal: React.FC<TransactionEditModalProps> = ({
    open,
    onClose,
    transaction,
    onSave,
    categories,
}) => {
    const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if (transaction) {
            setEditedTransaction(transaction);
        } else {
            setEditedTransaction({
                ID: 0,
                Name: '',
                CategoryID: categories[0]?.ID || 0,
                Type: '',
                Amount: 0,
                PaymentDate: toInputDateValue(new Date().toISOString())
            });
        }
    }, [transaction]);

    const handleSave = () => {
        if (editedTransaction) {
            const payload = {
                ...editedTransaction,
                PaymentDate: toInputDateValue(editedTransaction.PaymentDate)
            };

            onSave(payload);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedTransaction(prev => {
            if (prev === null) return null;
            return {
                ...prev,
                [name]: name === 'Amount' ? parseFloat(value) : value
            };
        });
    };

    const handleCategoryChange = (event: SelectChangeEvent<number>) => {
        const newCategoryID = event.target.value as number;
        setEditedTransaction(prev => {
            if (prev !== null) {
                return {
                    ...prev,
                    CategoryID: newCategoryID
                };
            }
            return prev;
        });
    };

    if (!editedTransaction) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'auto',
                maxHeight: 'calc(100% - 96px)',
                overflowY: 'auto',
                boxShadow: theme.shadows[24],
                padding: theme.spacing(4),
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
            }}>
                <TextField
                    label={"Name"}
                    name={"Name"}
                    value={editedTransaction.Name}
                    onChange={handleChange}
                    fullWidth
                    margin={"normal"}
                />
                <Select
                    value={editedTransaction ? editedTransaction.CategoryID : ''}
                    onChange={handleCategoryChange}
                    name={"CategoryID"}
                >
                    {categories.map(category => (
                        <MenuItem key={category.ID} value={category.ID}>
                            {category.Name}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    label={"Type"}
                    name={"Type"}
                    value={editedTransaction.Type}
                    onChange={handleChange}
                    fullWidth
                    margin={"normal"}
                />
                <TextField
                    label={"Amount"}
                    name={"Amount"}
                    type={"number"}
                    value={editedTransaction.Amount}
                    onChange={handleChange}
                    fullWidth
                    margin={"normal"}
                />
                <TextField
                    label={"Payment Date"}
                    name={"PaymentDate"}
                    type={"date"}
                    value={toInputDateValue(editedTransaction.PaymentDate)}
                    onChange={handleChange}
                    fullWidth
                    margin={"normal"}
                    InputLabelProps={{ shrink: true }}
                />

                <Button onClick={handleSave} color={"primary"} variant={"contained"} sx={{ mt: 2 }}>Save</Button>
            </Box>
        </Modal>
    );
};

export default TransactionEditModal;