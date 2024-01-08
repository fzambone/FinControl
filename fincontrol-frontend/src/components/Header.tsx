import React from 'react';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from 'next/link'

const Header: React.FC = () => {

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
                    FinControl
                </Typography>
                <Link href="/" passHref>
                    <Button color="inherit">Home</Button>
                </Link>
                <Link href="/transactions" passHref>
                    <Button color="inherit">Transactions</Button>
                </Link>
                <Link href="/categories" passHref>
                    <Button color="inherit">Categories</Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Header;