import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Box from '@mui/material/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Link from 'next/link'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import RoomMessage from './RoomMessage';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { useRouter } from 'next/router';
import * as RestAccess from '../../utils/RestAccess';
import * as dateTimeHandler from '../../utils/dateTimeHandler';
import Log from '../Log/Log';

export default function Room({ roomId }) {
    const { authUser } = useContext(AuthContext);
    const [value, setValue] = React.useState('1');
    const [ display, setDisplay ] = React.useState(false);
    const { showSnackbar } = useSnackbar(); 
    const router = useRouter();

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const [ roomData, setRoomData ] = React.useState({});
    const [ roomUsers, setRoomUsers ] = React.useState([]);
    const [ messages, setMessages ] = React.useState([]);
    const [ roomStudyLogs, setRoomStudyLogs ] = React.useState([])

    useEffect(() => {
        const getRoomData = async () => {
            const room = await RestAccess.get('/rooms/' + roomId);
            const messages = await RestAccess.get('/rooms/' + roomId + '/messages');
            if(room.status === 200 && messages.status === 200) {
                const roomDataSet = room.data.room;
                const logSet = room.data.studyLogs;
                const users = [...roomDataSet.users];
                setRoomData({
                    id: roomDataSet.id,
                    room_name: roomDataSet.room_name,
                    description: roomDataSet.description,
                    tags: roomDataSet.tags,
                    updated_at: roomDataSet.updated_at,
                    user_id: roomDataSet.user_id,
                    admin_user: roomDataSet.admin_user,
                })
                setRoomUsers(roomDataSet.users);
                setRoomStudyLogs(logSet);
                setMessages(messages.data);
                setDisplay(true);
            } else {
                showSnackbar('ルーム情報の取得に失敗しました', 'error');
                router.push('/rooms');
            }
        }
        getRoomData();
    }, [value])

    //削除確認ダイアログ
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    //勉強ルーム退出
    const exitRoom = async () => {
        setDialogOpen(false);
        const response = await RestAccess.del('/rooms/' + roomId + '/exit');
        if(response.status === 200) {
            showSnackbar('退出しました');
            router.push('/rooms');
        } else {
            showSnackbar('エラーが発生しました。', 'error');
        }
    }
    
    const renderDialog = (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                本当に退出しますか？
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDialogClose}>キャンセル</Button>
            <Button onClick={exitRoom}>
                退出する
            </Button>
            </DialogActions>
        </Dialog>
    );

    //勉強ログ削除コールバック
    const deleteLog = async (logId) => {
        const response = await RestAccess.del('study-logs/' + logId);
        if(response.status == 200) {
            showSnackbar('削除しました。')
            const response = await RestAccess.get('/rooms/' + roomId);
            setRoomStudyLogs(response.data.studyLogs);
        }  else {
            showSnackbar('削除できませんでした', 'error');
        }
    }


  return  (
    <>
        {display && 
            <>
                <h2>{roomData.room_name}</h2>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="チャット" value="1" />
                            <Tab label="参加者" value="2" />
                            <Tab label="タイムライン" value="3" />
                            <Tab label="ルーム詳細" value="4" />
                        </TabList>
                        </Box>

                        <TabPanel value="1" sx={{ p: 0 }}>
                            <RoomMessage authUser={authUser} msg={messages} roomId={roomId} />
                        </TabPanel>

                        <TabPanel value="2" sx={{ p: 0 }}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }} >
                                {roomUsers.map((user) => {
                                    return (
                                        <ListItem key={user.id}>
                                            <Link style={{width: '100%'}} href={{ pathname: '/users/' + user.id, query: { id:  user.id } }} as={'/users/' + user.id}>
                                                <ListItemButton>
                                                        <ListItemAvatar>
                                                            {user.profileimg != null ? 
                                                                <Avatar
                                                                    alt={user.name.slice(0, 1)}
                                                                    src={process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + user.profileimg}
                                                                    aria-label="recipe"
                                                                />
                                                                :
                                                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                                    {user.name.slice(0, 1)}
                                                                </Avatar>
                                                            }
                                                        </ListItemAvatar>
                                                        <ListItemText primary={user.name} />
                                                </ListItemButton>
                                            </Link>
                                        </ListItem>
                                    )
                                })}

                            </List>
                        </TabPanel>

                        <TabPanel value="3" sx={{ p: 0 }}>
                            {roomStudyLogs ?
                                roomStudyLogs.map((value) => {
                                    return <Log 
                                                key={value.id} 
                                                logData={value} 
                                                isLiked={value.is_liked} 
                                                callback={deleteLog} 
                                            />
                                })
                                :
                                <h3>勉強記録が投稿されていません</h3>
                            }
                        </TabPanel>

                        <TabPanel value="4" sx={{ p: 2 }}>
                            {/* <Card sw={{ p: 0 }}> */}
                                {/* <CardContent> */}
                                <Typography sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold'}}>ルーム説明</Typography>
                                <Typography>
                                    {roomData.description}
                                </Typography>
                                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold', mt:2 }}>タグ</Typography>
                                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                                    {roomData.tags.map((tag) => (
                                        <Chip key={tag.id} label={tag.tag_name} color="primary" />
                                    ))}
                                </Box>
                                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                                    <Grid item xs={4}>最終更新</Grid>
                                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{dateTimeHandler.formatDate(roomData.updated_at, 'YYYY年MM月DD日 HH時MM分SS秒')}</Grid>
                                </Grid>
                                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                                    <Grid item xs={4}>管理者</Grid>
                                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{roomData.admin_user}</Grid>
                                </Grid>
                                
                                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                    {roomData.user_id != authUser.id &&
                                        <Button onClick={() => setDialogOpen(true)} variant="contained" color="error">
                                            退出する
                                        </Button>
                                    }
                                    {/* 管理者の場合 */}
                                    {roomData.user_id == authUser.id &&
                                    
                                    <Button variant="contained">
                                        <Link href={{pathname: "/rooms/manage", query: {id: roomData.id}}} as="/rooms/manage">
                                            ルーム管理
                                        </Link>
                                    </Button>
                                    }
                                </Stack>
                        </TabPanel>
                    </TabContext>
                </Box>
                {renderDialog}
            </>
        }
    </>
    )
};