import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../components/Header'
import SideMenu from '../components/SideMenu';
import Container from '@mui/material/Container';
import LoadingPage from '../components/Loading';
import useAuth from '../hooks/useAuth';
import Logs from '../components/Log'


const Index = () => {
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
        <Logs open={open} />
      </Container>
    </Box>
  )
}

export default Index;
