import React, {useEffect, useState} from 'react';
import {Category, ColumnDefinition} from "@/src/types";
import API from '../services/api';
import {Button} from "@mui/material";
import {GenericList} from "@/src/components/GenericList";
import {GenericEditModal} from "@/src/components/GenericEditModal";
import DeleteConfirmationDialog from "@/src/components/DeleteConfirmationDialog";
import CategoryForm from "@/src/components/CategoryForm";

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get<Category[]>('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const categoryColumns: ColumnDefinition<Category>[] = [
        { title: 'Name', field: 'Name', render: (category) => category.Name },
    ];

    const handleOpenModal = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleOpenModalForNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSaveCategory = async (updatedCategory: Category) => {
        try {
            if (editingCategory) {
                const response = await API.put(`/categories/${updatedCategory.ID}`, updatedCategory);
                const updatedCategories = categories.map(cat => cat.ID === updatedCategory.ID ? response.data : cat);
                setCategories(updatedCategories)
            } else {
                const { ID, ...categoryData } = updatedCategory;
                const response = await API.post('/categories', categoryData);
                setCategories([...categories, response.data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const openDeleteDialog = (categoryId: number) => {
        setDeleteCategoryId(categoryId);
        setIsDeleteDialogOpen(true);
    }

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    }

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            await API.delete(`/categories/${categoryId}`);
            const updatedCategories = categories.filter(cat => cat.ID !== categoryId);
            setCategories(updatedCategories);
            closeDeleteDialog();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '10px'}}>
                <Button onClick={handleOpenModalForNew} variant={"contained"} color={"primary"}>
                    Add New Category
                </Button>
            </div>
            <GenericList data={categories} columns={categoryColumns} onEdit={handleOpenModal} onDelete={openDeleteDialog} />
            <GenericEditModal open={isModalOpen} onClose={handleCloseModal}>
                <CategoryForm category={editingCategory} onSave={handleSaveCategory} />
            </GenericEditModal>
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={() => {
                    if (deleteCategoryId !== null) {
                        handleDeleteCategory(deleteCategoryId);
                    }
                    closeDeleteDialog();
                }}
            />
        </>
    )
};

export default Categories;