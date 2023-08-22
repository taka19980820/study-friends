// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';
import Typography from '@mui/joy/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';

// import List from '@mui/material/List';
import List from '@mui/joy/List';
// import ListItem from '@mui/material/ListItem';
import ListItem from '@mui/joy/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '@mui/icons-material/Delete';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import IconButton from '@mui/joy/IconButton';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { Person, Circle } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import PersonIcon from '@mui/icons-material/Person';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import Link from 'next/link'

import SearchBar from '../../Search/KeyWordSearch';

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

//   const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
//   })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//       duration: theme.transitions.duration.shortest,
//     }),
//   }));


export default function Books({ open }) {
    const [roomDetailOpen, setRoomDetailOpen] = React.useState(false);
    const [roomDetailValues, setDetailValues] = React.useState({
        roomId: null,
        roomName: '',
        numMember: null,
        description: '',
        member: [],
        category: '',
        tags: [],
        modified: '',
        ageLimit: null,
        sexLimit: null,
        numLimit: null,
    });
    const handleRoomDetailOpen = (newValue) => {
        setDetailValues({...roomDetailValues, ...newValue})
        setRoomDetailOpen(true);
    };
    const handleRoomDetailClose = () => {
        // setDetailValues({

        // })
        setRoomDetailOpen(false);
    };
    //コメント欄開閉制御
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    //コメント欄開閉制御ここまで
    //タグ検索
    const [tagSelected, setTagSelected] = React.useState(null);
    const handleTagSelected = (tagId) => {
        setTagSelected(tagId);
    };
    const tags = {
        'プログラミング': [
            { tagId: 1, tagName: 'PHP'},
            { tagId: 2, tagName: 'Laravel'},
            { tagId: 3, tagName: 'Java'},
        ],
        'インフラ': [
            { tagId: 4, tagName: 'Linux'},
            { tagId: 5, tagName: 'CentOS'},

        ],
        '資格取得': [
            { tagId: 6, tagName: 'LPIC'},
            { tagId: 7, tagName: 'CCNA'},
        ],
    }
    const rooms = [
        {
            roomId: 1,
            roomName: 'PHP勉強部屋',
            numMember: 100,
            description: 'PHPの勉強部屋です。みんなでWeb開発のテクニシャンになりましょう。',
            member: [
                { 
                    userId: 1,
                    userName: '堀越大永',
                },
                { 
                    userId: 2,
                    userName: '佐々木',
                },
                { 
                    userId: 3,
                    userName: 'ブライアン',
                },
            ],
            category: 'プログラミング',
            tags: [
                {
                    tagId: 1,
                    tagName: 'PHP',
                    tagUrl: 'link'
                },
                {
                    tagId: 2,
                    tagName: 'Laravel',
                    tagUrl: 'link'
                },
            ],
            modified: '2023年8月31日 13時41分',
            ageLimit: null,
            sexLimit: null,
            numLimit: null,
        },
        {
            roomId: 2,
            roomName: 'LPIC勉強',
            numMember: 10,
            description: 'PHPの勉強部屋です。みんなでWeb開発のテクニシャンになりましょう。',
            member: [
                { 
                    userId: 2,
                    userName: '堀越大永',
                },
                { 
                    userId: 5,
                    userName: '神風',
                },
            ],
            category: '資格取得',
            tags: [
                {
                    tagId: 1,
                    tagName: 'Linux',
                    tagUrl: 'link'
                },
            ],
            modified: '2023年8月31日 13時41分',
            ageLimit: null,
            sexLimit: null,
            numLimit: null,
        },
        {
            roomId: 3,
            roomName: 'MySQLを学ぼうの会',
            numMember: 20,
            description: 'MySQLの勉強部屋です。',
            member: [
                { 
                    userId: 1,
                    userName: '堀越大永',
                },
                { 
                    userId: 2,
                    userName: '佐々木',
                },
                { 
                    userId: 3,
                    userName: 'ブライアン',
                },
            ],
            category: 'データベース',
            tags: [
                {
                    tagId: 11,
                    tagName: 'MySQL',
                    tagUrl: 'link'
                },
                {
                    tagId: 335,
                    tagName: 'PHP',
                    tagUrl: 'link'
                },
            ],
            modified: '2023年8月31日 13時41分',
            ageLimit: null,
            sexLimit: null,
            numLimit: null,
        },

    ];

    const searchData = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape', 'Honeydew', 'PHP', 'Laravel', 'Python'];

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <h2>教材一覧</h2>
        <Button onClick={handleExpandClick} variant="text" sx={{ fontSize: '1.2rem' }}>ルーム検索</Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>                
                <Box>
                    {/* <TextField sx={{mb: 2}} fullWidth={true} id="outlined-basic" label="キーワードで検索" variant="outlined" /> */}
                    <SearchBar data={searchData} />
                    {/* <List>
                    {Object.keys(tags).map((category) => {
                        return (
                            <ListItem sx={{ display: 'block' }} key={category}>
                                <Typography component="h1">{category}</Typography>
                                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                                {tags[category].map((value) => {
                                    return (
                                        <Chip key={value.tagId} label={value.tagName} onClick={() => handleTagSelected(value.tagId)} color={tagSelected === value.tagId ? 'primary' : 'default'} /> 
                                )})}
                                </Box>
                            </ListItem>
                        )
                    })}
                    </List> */}
                </Box>
            </CardContent>
        </Collapse>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {rooms.map((value) => {
                return (
                    <ListItem key={value.roomId} onClick={() => handleRoomDetailOpen(value)} sx={{ border: '1px solid', borderColor: '#C0C0C0', mb: 3, padding: 0 }}>
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    {value.roomName.slice(0,1)}
                                </Avatar>
                            </ListItemAvatar>     
                            <Box>
                                <Typography>{value.roomName}(参加中)</Typography>
                                <Stack direction="row">
                                    <PersonIcon fontSize="small"/>
                                    <span>{value.numMember}人</span> 
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
            <DialogTitle sx={{ mb: 2, textAlign: 'center', borderBottom: '1px solid', borderColor: '#C0C0C0', fontWeight: 'bold' }}>{roomDetailValues.roomName}</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>参加者 {roomDetailValues.numMember}人</Typography>
                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                    {roomDetailValues.member.map((value) => (
                        <ListItemAvatar key={value.userId}>
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {value.userName.slice(0, 1)}
                            </Avatar>
                        </ListItemAvatar>
                    ))}
                </Box>
                <Typography sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>ルーム説明</Typography>
                <Typography sx={{ color: 'red' }}>[{roomDetailValues.category}]</Typography>
                <DialogContentText sx={{ mb: 1 }}>
                    {roomDetailValues.description}
                </DialogContentText>
                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>タグ</Typography>
                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                    {roomDetailValues.tags.map((value) => (
                        <Chip key={value.tagId} label={value.tagName} color="primary" />
                    ))}
                </Box>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>最終更新</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{roomDetailValues.modified}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>年齢制限</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{roomDetailValues.ageLimit != null ? roomDetailValues.ageLimit + '以上' : '制限なし'}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>性別制限</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{roomDetailValues.sexLimit != null ? roomDetailValues.sexLimit + 'のみ': '制限なし'}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>人数制限</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{roomDetailValues.numList != null ? roomDetailValues.numLimit + 'まで' : '制限なし'}</Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
            <Button onClick={handleRoomDetailClose}>キャンセル</Button>
            <Button onClick={handleRoomDetailClose} autoFocus>
                このルームに参加する
            </Button>
            {/* 管理者の場合 */}
            <Button onClick={handleRoomDetailClose} autoFocus>
                ルーム管理
            </Button>
            </DialogActions>
        </Dialog>
        <Link href="/makeroom">
            <Fab 
                sx={{ 
                    position: 'absolute',
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

    </MainContainer>
    )
};