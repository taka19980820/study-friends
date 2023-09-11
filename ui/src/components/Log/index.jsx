import React, { useEffect, useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import Log from './Log';
import { AuthContext } from '../../context/Auth/AuthContext';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link'
import * as RestAccess from '../../utils/RestAccess'
import { useSnackbar } from '../../context/SnackbarContext';


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


export default function Logs({ open }) {
  const { user, setUser } = useContext(AuthContext);
  const [ studyLogs, setStudyLogs ] = useState([]);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await RestAccess.get('/study-logs'); 
      if(response.status === 200) {
          setStudyLogs(response.data);
      } else {
          setStudyLogs([]);
      }
    }
    fetchLogs();
  }, []);

    //勉強ログ削除コールバック
    const deleteLog = async (logId) => {
      const response = await RestAccess.del('study-logs/' + logId);
      if(response.status == 200) {
          showSnackbar('削除しました。')
          const newLogs = await RestAccess.get('/study-logs'); 
          setStudyLogs(newLogs.data);
      }  else {
          showSnackbar('削除できませんでした', 'error');
      }
    }

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <h2 style={{ marginBottom: '10px' }}>タイムライン</h2>
        {studyLogs ? 
          studyLogs.map((value) => {
            return <Log key={value.id} logData={value} isLiked={value.is_liked} callback={deleteLog}/>
          })
          :
          <h3>勉強記録が投稿されていません</h3>
        }

          <Link href="/logs/post">
            <Fab 
                sx={{ 
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    p: 3,
                }}
                variant="extended" 
                size="small" 
                color="primary"
            >
                <AddIcon sx={{ mr: 1 }} />
                勉強記録をつける
            </Fab>       
        </Link>
    </MainContainer>
    )
};