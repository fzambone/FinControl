import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50',
            dark: '#388e3c',
        },
        secondary: {
            main: '#ff9800',
        },
        background: {
            default: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Lato, Arial, sans-serif',
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: 'white',
                    backgroundColor: '#4caf50',
                    '&:hover': {
                        backgroundColor: '#388e3c',
                    },
                },
            },
        },
    },
});

export default theme;