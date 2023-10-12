import React, { useEffect, useState } from 'react';
import Log from './Log';
import {  } from '../../context/Auth/AuthContext';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link'
import * as RestAccess from '../../utils/RestAccess'
import { useSnackbar } from '../../context/SnackbarContext';

export default function Logs() {
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
    <>
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
    </>
    )
};