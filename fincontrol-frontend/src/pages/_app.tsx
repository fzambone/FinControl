import React from 'react';
import { AppProps } from "next/app";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/theme';
import Layout from '../components/Layout';
import '@fontsource/lato';
import {CssBaseline} from "@mui/material";


const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
    <ThemeProvider theme={theme}>
        <Layout>
            <Component {...pageProps} />
        </Layout>
    </ThemeProvider>
);

export default MyApp;