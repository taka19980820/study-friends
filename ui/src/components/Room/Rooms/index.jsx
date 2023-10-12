import React from 'react';
import Typography from '@mui/joy/Typography';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PersonIcon from '@mui/icons-material/Person';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link'
import { useEffect, useState, useContext } from 'react';
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar  } from '../../../context/SnackbarContext';
import { AuthContext } from '../../../context/Auth/AuthContext';
import * as dateTimeHandler from '../../../utils/dateTimeHandler';
import { useRouter } from 'next/router';
import TagManager from '../../Tag/TagManager';

export default function Rooms() {
    const [roomDetailOpen, setRoomDetailOpen] = React.useState(false);
    const router = useRouter();
    const [roomDetailValues, setDetailValues] = React.useState({
        id: null,
        user_id: null,
        room_name: '',
        description: '',
        users: [],
        tags: [],
        updated_at: "",
    });
    const handleRoomDetailOpen = (newValue) => {
        setDetailValues({...roomDetailValues, ...newValue})
        setRoomDetailOpen(true);
    };
    const handleRoomDetailClose = () => {
        setRoomDetailOpen(false);
    };
    //コメント欄開閉制御
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    //コメント欄開閉制御ここまで

    const { authUser } = useContext(AuthContext);
    const [ rooms, setRooms ] = useState([]);
    const { showSnackbar } = useSnackbar();
    useEffect(() => {
        const getRooms = async () => {
            const response = await RestAccess.get('/rooms');
            if(response.status == 200) {
                setRooms([...response.data]);
            } else {
                showSnackbar('勉強ルームの取得に失敗しました', 'error')
            }
        }
        getRooms();
    }, [])

    const joinRoom = async (roomId) => {
        const response = await RestAccess.post('/rooms/' + roomId + '/join');
        if(response.status == 200) {
            showSnackbar('ルームに参加しました')
            // router.push('/rooms/' + roomId);
            router.push({ pathname: "/rooms/" + roomId, query: { id: roomId } }, "/rooms/" + roomId);
        } else {
            showSnackbar('ルームに参加できませんでした', 'error');
        }
    }

    const searchRoom = async (tags) => {
        let response = null;
        if(tags.length > 0) {
            response = await RestAccess.get('/rooms', {
                params: {
                    tags: tags.join(",")
                }
            })
        } else {
            response = await RestAccess.get('/rooms')
        }
        
        if(response.status == 200) {
            setRooms(response.data);
        } else {
            showSnackbar('勉強ルームの取得に失敗しました', 'error')
        }
    }

    

  return  (
    <>
        <h2>ルーム一覧</h2>
        <Button onClick={handleExpandClick} variant="text" sx={{ fontSize: '1.2rem' }}>ルーム検索</Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>                
                <Box>
                    <TagManager callBack={searchRoom}/>
                </Box>
            </CardContent>
        </Collapse>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {rooms.map((value) => {
                return (
                    <ListItem key={value.id} onClick={() => handleRoomDetailOpen(value)} sx={{ border: '1px solid', borderColor: '#C0C0C0', mb: 3, padding: 0 }}>
                        <ListItemButton>
                            <ListItemAvatar>
                                {value.room_icon != null ? 
                                <Avatar
                                    alt={value.room_name.slice(0, 1)}
                                    src={process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + value.room_icon}
                                    aria-label="recipe"
                                />
                                :
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    {value.room_name.slice(0,1)}
                                </Avatar>
                            }
                            </ListItemAvatar>     
                            <Box>
                                <Typography>{value.is_join ? value.room_name + '(参加中)' : value.room_name}</Typography>
                                <Stack direction="row">
                                    <PersonIcon fontSize="small"/>
                                    <span>{value.users.length}人</span> 
                                </Stack>
                            </Box>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
        {/* チーム詳細ダイアログ */}
        <Dialog
            open={roomDetailOpen}
            onClose={handleRoomDetailClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            <DialogTitle sx={{ mb: 2, textAlign: 'center', borderBottom: '1px solid', borderColor: '#C0C0C0', fontWeight: 'bold' }}>{roomDetailValues.room_name}</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>参加者 {roomDetailValues.users.length}人</Typography>
                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                    {roomDetailValues.users.map((user) => (
                        <ListItemAvatar key={user.id}>
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
                    ))}
                </Box>
                <Typography sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>ルーム説明</Typography>
                <DialogContentText sx={{ mb: 1 }}>
                    {roomDetailValues.description}
                </DialogContentText>
                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>タグ</Typography>
                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                    {roomDetailValues.tags.map((tag) => (
                        <Chip key={tag.id} label={tag.tag_name} color="primary" />
                    ))}
                </Box>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>最終更新</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{dateTimeHandler.formatDate(roomDetailValues.updated_at, 'YYYY年MM月DD日 HH時MM分SS秒')}</Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
            <Button onClick={handleRoomDetailClose}>キャンセル</Button>
            {roomDetailValues.is_join ? 
                <Button>
                    <Link href={{pathname: "/rooms/" + roomDetailValues.id, query: {id: roomDetailValues.id, isJoin: roomDetailValues.is_join}}} as={"/rooms/" + roomDetailValues.id}>
                        入室する
                    </Link>
                </Button>
                :
                <Button onClick={() => joinRoom(roomDetailValues.id)}>
                    このルームに参加する
                </Button>
            }
            {/* 管理者の場合 */}
            {roomDetailValues.user_id == authUser.id && 
                    <Button onClick={handleRoomDetailClose} autoFocus>
                        <Link href={{pathname: "/rooms/manage", query: {id: roomDetailValues.id}}} as="/rooms/manage">
                            ルーム管理
                        </Link>
                    </Button>
            }
            </DialogActions>
        </Dialog>
        <Link href="/rooms/register">
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
                ルーム作成
            </Fab>       
        </Link>
    </>
    )
};