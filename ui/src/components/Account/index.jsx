import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/Auth/AuthContext';
import { useSnackbar } from '@/context/SnackbarContext';
import { useState, useContext, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Password from './Password';
import EditAccount from './EditAccount';
import * as RestAccess from '@/utils/RestAccess';
import Link from 'next/link'

const drawerWidth = 240;

const MainContainer = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  })); 


export default function Account({ open }) {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar(); 
    const [ display, setDisplay ] = useState(false);
    const router = useRouter();

    useEffect(() => {
    }, []);
    const [accountData, setAccountData] = useState(authUser);
    const [ value, setValue ] = useState("1");

    const handleChange = (e, newValue) => {
        setValue(newValue);
    }

    const changeEmail = async (formData) => {
        const response = await RestAccess.post('/change-email', formData, {
            headers: {
              'Content-Type': 'application/json'
            }
        });
        if(response.status === 200) {
            setAccountData({
                ...accountData,
                email: formData.email
            });
            showSnackbar('メールアドレスを更新しました');
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <h2>アカウント情報</h2>
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
                <Tab label="アカウント情報" value='1' />
                <Tab label="パスワード" value='2' />
            </TabList>
            </Box>
            
            <TabPanel value='1' sx={{ p: 2 }}>
                <EditAccount accountData={accountData} changeEmail={changeEmail}/>
            </TabPanel>

            <TabPanel value='2' sx={{ p: 0 }}>
                <Password />
            </TabPanel>
        </TabContext>
       
    </MainContainer>
    )
};