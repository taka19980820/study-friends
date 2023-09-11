import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import NoLoginHeader from '../components/Header/NoLoginHeader'
import NoLoginSideMenu from '../components/SideMenu/NoLoginSideMenu';
import Login from '../components/User/Login';
import Container from '@mui/material/Container';
import useAuth from '../hooks/useAuth';
import LoadingPage from '../components/Loading';
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Router from 'next/router';
import { AuthContext } from '../context/Auth/AuthContext';

export default function Home() {
  const router = useRouter();
  const { authUser, loading } = useAuth(null);
  const [open, setOpen] = useState(false);

  if(loading) {
      return <LoadingPage />
  }

  if(authUser) {
      Router.push('/');
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
        <Login open={open} />
      </Container>
    </Box>
  )
}
