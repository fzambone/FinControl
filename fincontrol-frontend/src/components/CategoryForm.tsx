import {Category} from "@/src/types";
import {useEffect, useState} from "react";
import {Box, Button, TextField} from "@mui/material";

interface CategoryFormProps {
    category: Category | null;
    onSave: (category: Category) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave }) => {
    const [editedCategory, setEditedCategory] = useState<Category>({
        ID: 1,
        Name: '',
    });

    useEffect(() => {
        if (category) {
            setEditedCategory(category);
        } else {
            setEditedCategory({ID: 1, Name: ''});
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedCategory({ ...editedCategory, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(editedCategory);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            width: '400px',
            margin: 'auto'
        }}>
            <TextField
                label={"Category Name"}
                name={"Name"}
                value={editedCategory.Name}
                onChange={handleChange}
                fullWidth
                margin={"normal"}
            />
            <Button onClick={handleSave} color={"primary"} variant={"contained"} sx={{ mt: 2 }}>
                Save
            </Button>
        </Box>
    )
};

export default CategoryForm;