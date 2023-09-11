import * as React from 'react';
import { useState } from 'react';   
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu';
import EditAccount from '../components/Account/EditAccount';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import LoadingPage from '../../components/Loading';
import useAuth from '../../hooks/useAuth';

export default function Home() {
    const router = useRouter();
    const { id } = router.query;
    const { authUser, loading } = useAuth('/login');
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
            <EditAccount open={open} />
        </Container>
        
        </Box>
    )
}
