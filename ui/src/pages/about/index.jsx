import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import NoLoginHeader from '../../components/Header/NoLoginHeader'
import NoLoginSideMenu from '../../components/SideMenu/NoLoginSideMenu';
import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu';
import About from '../../components/About';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import LoadingPage from '../../components/Loading';
import useAuth from '../../hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { authUser, loading } = useAuth(null);
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if(loading) {
      return <LoadingPage />
  }

  if(authUser) {
    return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header open={open} handleDrawerOpen={handleDrawerOpen} />
        <SideMenu open={open} handleDrawerClose={handleDrawerClose} />
        <Container maxWidth="sm">
            <About open={open} />
        </Container>
        </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <NoLoginHeader open={open} handleDrawerOpen={handleDrawerOpen} />
      <NoLoginSideMenu open={open} handleDrawerClose={handleDrawerClose} />
      <Container maxWidth="sm">
        <About open={open} />
      </Container>
    </Box>
  )
}
