import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../../../components/Header'
import SideMenu from '../../../components/SideMenu';
import Room from '../../../components/Room';
import Container from '@mui/material/Container';
import LoadingPage from '../../../components/Loading';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';


export default function Home() {
    const { authUser, loading } = useAuth('/login');
    const router = useRouter();
    const { id } = router.query;
    const [open, setOpen] = useState(false);
    
    if(loading) {
        return <LoadingPage />
    }
    
    if(!authUser) {
        return null;
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header open={open} handleDrawerOpen={handleDrawerOpen} />
        <SideMenu open={open} handleDrawerClose={handleDrawerClose} />
        <Container maxWidth="sm">
            <Room open={open} roomId={id}/>
        </Container>
        </Box>
    )
    }
