import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {GenericListProps} from "@/src/types";
import {useState} from "react";
import React from "react";

export const GenericList = <T extends { ID: number; [key: string]: any }>({ data, columns, onEdit, onDelete }: GenericListProps<T>) => {
    interface SortConfig {
        field: string;
        direction: 'asc' | 'desc' | undefined;
    }

    const [sortConfig, setSortConfig] = useState<SortConfig>({ field: '', direction: 'asc'});

    const handleSort = (field: string) => {
        const isAsc = sortConfig.field === field && sortConfig.direction === 'asc';
        setSortConfig({ field, direction: isAsc ? 'desc' : 'asc'});
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig.field) return data;

        return [...data].sort((a, b) => {
            if (a[sortConfig.field] < b[sortConfig.field]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.field] > b[sortConfig.field]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }

            return 0;
        });
    }, [data, sortConfig]);

    return (
        <TableContainer component={Paper}>
            <Table aria-label={"generic table"}>
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell key={column.title} sx={{ fontWeight: 'bold' }}>
                                {column.sortable ? (
                                    <TableSortLabel
                                        active={sortConfig.field === column.field}
                                        direction={sortConfig.field === column.field ? sortConfig.direction : 'asc'}
                                        onClick={() => handleSort(column.field)}
                                    >{column.title}</TableSortLabel>
                                ) : (
                                    column.title
                                )}
                            </TableCell>
                        ))}
                        <TableCell sx={{ fontWeight: 'bold' }} align={"right"}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map(item => (
                        <TableRow key={item.ID}>
                            {columns.map(column => (
                                <TableCell key={column.title}>{column.render(item)}</TableCell>
                            ))}
                            <TableCell align={"right"}>
                                <IconButton aria-label={"edit"} color={"primary"} onClick={() => onEdit(item)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label={"delete"} color={"secondary"} onClick={() => onDelete(item.ID)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};