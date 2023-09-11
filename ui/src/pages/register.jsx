import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import NoLoginHeader from '../components/Header/NoLoginHeader'
import NoLoginSideMenu from '../components/SideMenu/NoLoginSideMenu';
import Register from '../components/User/Register';
import Container from '@mui/material/Container';
import useAuth from '../hooks/useAuth';
import LoadingPage from '../components/Loading';
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Router from 'next/router';

// const inter = Inter({ subsets: ['latin'] })

const drawerWidth = 240;

export default function Home() {
  const router = useRouter();
  const { authUser, loading } = useAuth(null);
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
      <Container maxWidth="sm">
        <Register open={open} />
      </Container>
      
    </Box>
  )
}
