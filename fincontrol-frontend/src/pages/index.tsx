import React from 'react';
import {Container, Typography} from "@mui/material";

const Home: React.FC = () => (
    <Container>
        <Typography variant="h4" component="h1" gutterBottom>
            Welcome to FinControl
        </Typography>
        <Typography variant="body1">
            Your personal finance manager.
        </Typography>
    </Container>
);

export default Home;