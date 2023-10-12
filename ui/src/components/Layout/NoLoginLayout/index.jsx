import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import NoLoginHeader from '@/components/Header/NoLoginHeader'
import NoLoginSideMenu from '@/components/SideMenu/NoLoginSideMenu';
import MainContainer from '@/components/MainContainer';
// import Login from '@/components/User/Login';
import Container from '@mui/material/Container';
import useAuth from '@/hooks/useAuth';
import LoadingPage from '@/components/Loading';
import { useState } from "react";
import { useRouter } from 'next/router';

export default function NoLoginLayout({ redirectTo, children }) {
    const router = useRouter();
    const { authUser, loading } = useAuth(redirectTo);
    const [open, setOpen] = useState(false);
  
    if(loading) {
        return <LoadingPage />
    }
  
    if(authUser) {
        router.push('/');
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
        <NoLoginHeader open={open} handleDrawerOpen={handleDrawerOpen} />
        <NoLoginSideMenu open={open} handleDrawerClose={handleDrawerClose} />
        <MainContainer open={open}>
            {children}
        </MainContainer>
    </Box>
    )

}



