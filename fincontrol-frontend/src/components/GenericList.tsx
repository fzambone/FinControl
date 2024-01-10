import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {GenericListProps} from "@/src/types";

export const GenericList = <T extends { ID: number }>({ data, columns, onEdit, onDelete }: GenericListProps<T>) => (
    <TableContainer component={Paper}>
        <Table aria-label={"generic table"}>
            <TableHead>
                <TableRow>
                    {columns.map(column => (
                        <TableCell key={column.title} sx={{ fontWeight: 'bold' }}>{column.title}</TableCell>
                    ))}
                    <TableCell sx={{ fontWeight: 'bold' }} align={"right"}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(item => (
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