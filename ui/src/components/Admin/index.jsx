import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import * as RestAccess from '../../utils/RestAccess'
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { useRouter } from 'next/router';
import Accounts from './Accounts';

export default function Admin() {
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
        <>
            { display && 
                <>
                    <h2>管理者ページ</h2>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="ユーザー一覧" value='1' />
                        </TabList>
                        </Box>
                        
                        <TabPanel value='1' sx={{ p: 2 }}>
                            <Accounts deleteAccounts={deleteAccounts} accounts={accounts} />
                        </TabPanel>
                    </TabContext>
                </>
            }
        </>
        )
};