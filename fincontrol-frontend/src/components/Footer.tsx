import React from 'react';
import { Box, Container, Typography } from "@mui/material";

const Footer: React.FC = () => {
    return (
        <Box sx={{ marginTop: 4, padding: 2, backgroundColor: 'background.paper'}}>
            <Container maxWidth="lg">
                <Typography variant="body1" align="center">
                    © FinControl - Your personal finance manager
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;