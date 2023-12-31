import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '@/components/Header'
import SideMenu from '@/components/SideMenu';
import MainContainer from '@/components/MainContainer';
import useAuth from '@/hooks/useAuth';
import LoadingPage from '@/components/Loading';
import { useState } from "react";

export default function Layout({ redirectTo, children }) {
    const { authUser, loading } = useAuth(redirectTo);
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
        <MainContainer open={open}>
            {children}
        </MainContainer>
    </Box>
    )

}



