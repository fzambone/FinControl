import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";


interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Box>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby={"alert-dialog-title"}
                aria-describedby={"alert-dialog-description"}
            >
                <DialogTitle id={"alert-dialog-title"}>{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id={"alert-dialog-description"}>
                        Are you sure you want to delete this transaction?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
};

export default DeleteConfirmationDialog;