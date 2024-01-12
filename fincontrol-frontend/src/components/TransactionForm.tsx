import {Category, Transaction} from "@/src/types";
import {useEffect, useState} from "react";
import {toInputDateValue} from "@/src/utils/dateUtils";
import {MenuItem, TextField, Select, Button, Box, Typography} from "@mui/material";
import formatCurrency from "@/src/utils/currencyUtils";
import {GenericEditModal} from "@/src/components/GenericEditModal";
import CategoryForm from "@/src/components/CategoryForm";
import API from "@/src/services/api";

interface TransactionFormProps {
    transaction: Transaction | null;
    onSave: (transaction: Transaction) => void;
    categories: Category[];
    onAddCategory: (newCategory: Category) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSave, categories, onAddCategory }) => {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editedTransaction, setEditedTransaction] = useState<Transaction>({
        ID: 0,
        Name: '',
        CategoryID: 1,
        Type: '',
        Amount: 0,
        PaymentDate: toInputDateValue(new Date().toISOString()),
    });

    useEffect(() => {
        if (transaction) {
            setEditedTransaction(transaction);
        } else {
            setEditedTransaction({
                ID: 0,
                Name: '',
                CategoryID: categories.length > 0 ? categories[0].ID : 1,
                Type: '',
                Amount: 0,
                PaymentDate: toInputDateValue(new Date().toISOString()),
            });
        }
    }, [transaction, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "CategoryID" && e.target.value === "new") {
            openNewCategoryModal();
            return;
        } 
        setEditedTransaction({ ...editedTransaction, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const payload = {
            ...editedTransaction,
            Amount: parseFloat(String(editedTransaction.Amount))
        };
        onSave(payload);
    };
    
    const openNewCategoryModal = () => {
        setIsCategoryModalOpen(true);
    };

    const handleSaveNewCategory = async (newCategory: Category) => {
        onAddCategory(newCategory);
        setIsCategoryModalOpen(false);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            width: '800px',
            margin: 'auto'
        }}>
            <Typography variant={"h6"} sx={{ mb: 2 }}>Edit Transaction</Typography>
            <TextField
                label={"Name"}
                name={"Name"}
                value={editedTransaction.Name}
                onChange={handleChange}
                fullWidth
                margin={"normal"}
            />
            <Select
                label={"Category"}
                name={"CategoryID"}
                value={editedTransaction.CategoryID}
                onChange={(e) => {
                    if (e.target.value === "new") {
                        openNewCategoryModal();
                        setEditedTransaction({
                            ...editedTransaction,
                            CategoryID: categories.length > 0 ? categories[0].ID : 1
                        });
                    } else {
                        setEditedTransaction({...editedTransaction, CategoryID: Number(e.target.value)});
                    }
                }}
                fullWidth
            >
                <MenuItem value={"new"}>-- Add New Category --</MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.ID} value={category.ID}>{category.Name}</MenuItem>
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
                value={editedTransaction.Amount}
                onChange={handleChange}
                fullWidth
                margin={"normal"}
            />
            <TextField
                label={"Payment Date"}
                type={"date"}
                name={"PaymentDate"}
                value={toInputDateValue(editedTransaction.PaymentDate)}
                onChange={handleChange}
                fullWidth
                margin={"normal"}
                InputLabelProps={{ shrink: true }}
            />
            <Button onClick={handleSave} color={"primary"} variant={"contained"} sx={{ mt: 2 }}>
                Save
            </Button>
            <GenericEditModal open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
                <CategoryForm category={null} onSave={handleSaveNewCategory} />
            </GenericEditModal>
        </Box>
    );
};

export default TransactionForm;