// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Link from 'next/link'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import List from '@mui/joy/List';
import Log from '../Log/Log'
import MyMaterial from '../Material/MyMaterial';
import { Bar } from 'react-chartjs-2';
import * as RestAccess from '../../utils/RestAccess'
import * as dateTimeHandler from '../../utils/dateTimeHandler'
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { useRouter } from 'next/router';
import Accounts from './Accounts';


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


export default function Admin({ open, userId }) {
    const router = useRouter();
    const { authUser } = useContext(AuthContext);
    const [ display, setDisplay ] = useState(false);
    const { showSnackbar } = useSnackbar();
    const [ value, setValue ] = useState("1");
    const [ accounts, setAccounts ] = useState([]);

    useEffect(() => {
        if(!authUser.is_admin) {
            showSnackbar('権限がありません');
            router.push('/');
        }
        const getData = async () => {
            const response = await RestAccess.get('/accounts');
            if(response.status == 200) {
                setAccounts(response.data);
                setDisplay(true);
            } else {
                showSnackbar('アカウントの取得に失敗しました', 'error');
            }
        }
        getData();
    }, [])

    const handleChange = (e, newValue) => {
        setValue(newValue)
    }

    const deleteAccounts = async (selectedIds) => {
        const response = await RestAccess.del('/admin/delete-account', {
            data: { ids: selectedIds }
        });
        if(response.status === 200) {
            setAccounts((prevRows) => prevRows.filter((row) => !selectedIds.includes(row.id)));
            showSnackbar('削除しました')
        } else {
            showSnackbar('削除できませんでした', 'error');
        }
    }
    
    return  (
        <MainContainer open={open}>
            <DrawerHeader />
            { display && 
                <>
                    <h2>管理者ページ</h2>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="ユーザー一覧" value='1' />
                            {/* <Tab label="教材一覧" value='2' /> */}
                        </TabList>
                        </Box>
                        
                        <TabPanel value='1' sx={{ p: 2 }}>
                            <Accounts deleteAccounts={deleteAccounts} accounts={accounts} />
                        </TabPanel>

                        {/* <TabPanel value='2' sx={{ p: 0 }}>
                            教材一覧
                        </TabPanel> */}
                    </TabContext>
                </>
            }
        </MainContainer>
        )
};