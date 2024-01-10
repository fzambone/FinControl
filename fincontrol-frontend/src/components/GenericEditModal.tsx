import {Box, Modal, useTheme} from "@mui/material";
import {GenericEditModalProps} from "@/src/types";

export const GenericEditModal: React.FC<GenericEditModalProps> = ({ open, onClose, children }) => {
    const theme = useTheme();

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'auto',
                mexHeight: 'calc(100% - 96px)',
                overflowY: 'auto',
                boxShadow: theme.shadows[24],
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
            }}>
                {children}
            </Box>
        </Modal>
    );
};