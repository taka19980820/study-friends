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

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


// import MainContent from './MainContent'; // Create a separate component for Main content

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



 


export default function Room({ open }) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    //チャット
    const [messages, setMessages] = React.useState([
        {
            sender: 'user',
            text: 'こんにちは',
            timestamp: new Date('2023-08-16 21:00'),
        },
        {
            sender: '田中',
            text: 'うるせえばか',
            timestamp: new Date('2023-08-16 21:30'),
        },
        {
            sender: 'user',
            text: 'あんだとこら',
            timestamp: new Date('2023-08-16 22:51'),
        },
        {
            sender: 'user',
            text: 'やってやるぞてめえ、住所教えろやこのかす。今からいってやるからよ',
            timestamp: new Date('2023-08-16 23:15'),
        },
        {
            sender: '田中',
            text: '教えるかばーか',
            timestamp: new Date('2023-08-16 23:45'),
        },
        {
            sender: 'user',
            text: 'ふざけんじゃねえ。絶対ぶっ殺してやる。いいから教えろや。今日がお前の命日だ。お母さんにお礼でも言っておくんだな。',
            timestamp: new Date('2023-08-17 0:03'),
        },
        {
            sender: '田中',
            text: 'ふざけんじゃねえ。絶対ぶっ殺してやる。いいから教えろや。今日がお前の命日だ。お母さんにお礼でも言っておくんだな。',
            timestamp: new Date('2023-08-17 0:05'),
        },
        {
            sender: 'user',
            text: 'ふざけんじゃねえ。絶対ぶっ殺してやる。いいから教えろや。今日がお前の命日だ。お母さんにお礼でも言っておくんだな。',
            timestamp: new Date('2023-08-17 1:45'),
        },
    ]);
    const [inputText, setInputText] = React.useState('');
    const messageContainerRef = React.useRef(null);
  
    const handleSend = () => {
      if (inputText.trim() !== '') {
        const now = new Date();
        setMessages([...messages, { text: inputText, sender: 'user', timestamp: now }]);
        setInputText('');
      }
    };

    React.useEffect(() => {
        // メッセージが追加された際にスクロール位置を下に移動する
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      }, [messages]);

    // 日付と時刻のフォーマット
    const formatDate = (date) => {
        const currentDate = new Date();
        if (date.toDateString() === currentDate.toDateString()) {
        return '今日';
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ja-JP', options);
    };

    const formatTime = (date) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return date.toLocaleTimeString('ja-JP', options);
    };

    // 日付のフォーマットをチェックし、新しい日付の場合に日付要素を表示
    let prevDate = null;
    const messageElements = messages.map((message, index) => {
        const currentDate = message.timestamp.toDateString();

        if (currentDate !== prevDate) {
        prevDate = currentDate;
        return (
            <div
                key={`date-${index}`}
                style={{
                    textAlign: 'center',
                    margin: '8px 0',
                    color: '#888',
                }}
                suppressHydrationWarning={true}
            >
                {formatDate(message.timestamp)}
            </div>
        );
    }

    return (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'center', // 垂直方向の中央揃え
          }}
        >
          {message.sender !== 'user' && (
            <Avatar sx={{ bgcolor: red[500], mr: 1 }} aria-label="recipe">
                {message.sender.slice(0,1)}
            </Avatar>
          )}
          <div
            style={{
              backgroundColor: message.sender === 'user' ? '#2196F3' : '#E0E0E0',
              color: message.sender === 'user' ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: '8px',
              maxWidth: '70%',
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginLeft: message.sender !== 'user' ? '8px' : '0', // アバターとの間隔
            }}
          >
            {message.sender !== 'user' && (
                <div
                style={{
                    fontSize: '10px',
                    marginBottom: '4px',
                    color: 'black',
                }}
                >
                {message.sender} {/* 名前を表示 */}
                </div>
            )}
            <div>{message.text}</div>
            <div
              style={{
                fontSize: '10px',
                marginTop: '4px',
                color: message.sender === 'user' ? 'white' : '#888'
              }}
            >
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      );
    });

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <h2>PHPの勉強部屋</h2>
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="チャット" value="1" />
                    <Tab label="参加者" value="2" />
                    <Tab label="ルーム詳細" value="3" />
                </TabList>
                </Box>

                <TabPanel value="1" sx={{ p: 0 }}>
                    <Paper elevation={3} style={{ height: '400px', padding: 10, maxHeight: '400px', overflowY: 'auto' }} ref={messageContainerRef}>
                        <Stack spacing={2}>
                            {messageElements}
                        {/* {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    alignItems: 'center',
                                }}
                            >
                                {message.sender !== 'user' && (
                                    <Avatar sx={{ bgcolor: red[500], mr: 1 }} aria-label="recipe">
                                        {message.sender.slice(0,1)}
                                    </Avatar>
                                )}
                                <div
                                    style={{
                                    backgroundColor: message.sender === 'user' ? '#2196F3' : '#E0E0E0',
                                    color: message.sender === 'user' ? 'white' : 'black',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    maxWidth: '70%',
                                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))} */}
                        </Stack>
                    </Paper>
                    <TextField
                        label="メッセージ"
                        variant="outlined"
                        fullWidth
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                        }}
                        style={{ marginTop: 20 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                        style={{ marginTop: 10 }}
                    >
                        送信
                    </Button>
                </TabPanel>

                <TabPanel value="2" sx={{ p: 0 }}>
                <List dense sx={{ width: '100%', bgcolor: 'background.paper' }} >
                    {/* {[0, 1, 2, 3].map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;
                        return (
                        <ListItem
                            key={value}
                            disablePadding
                        >
                            <ListItemButton>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    {value.userName.slice(0, 1)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                            </ListItemButton>
                        </ListItem>
                        );
                    })} */}
                        <ListItem disablePadding>
                            <ListItemButton>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    堀
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={'堀越鷹y'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    横
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={'横尾渉'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    街
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={'街意図'} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </TabPanel>

                <TabPanel value="3" sx={{ p: 2 }}>
                    {/* <Card sw={{ p: 0 }}> */}
                        {/* <CardContent> */}
                        <Typography sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold'}}>ルーム説明</Typography>
                        <Typography sx={{ color: 'red' }}>[プログラミング]</Typography>
                        <Typography>
                            PHPの勉強部屋です。みんなでWeb開発のテクニシャンになりましょう。
                        </Typography>
                        <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold', mt:2 }}>タグ</Typography>
                        <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                            {/* {roomDetailValues.tags.map((value) => (
                                <Chip key={value.tagId} label={value.tagName} color="primary" />
                            ))} */}
                            <Chip label="PHP" color="primary" />
                            <Chip label="Laravel" color="primary" />
                        </Box>
                        <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                            <Grid item xs={4}>最終更新</Grid>
                            <Grid item xs={8} sx={{ textAlign: 'right' }}>2023年8月11日 23時41分</Grid>
                        </Grid>
                        <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                            <Grid item xs={4}>年齢制限</Grid>
                            <Grid item xs={8} sx={{ textAlign: 'right' }}>制限なし</Grid>
                        </Grid>
                        <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                            <Grid item xs={4}>人数制限</Grid>
                            <Grid item xs={8} sx={{ textAlign: 'right' }}>制限なし</Grid>
                        </Grid>
                        {/* </CardContent> */}
                        {/* <CardActions> */}
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button variant="contained" color="error">退出する</Button>
                            {/* 管理者の場合 */}
                            <Button variant="contained">
                                ルーム管理
                            </Button>
                        </Stack>
                            
                        {/* </CardActions> */}
                    {/* </Card> */}
                </TabPanel>

                
            </TabContext>
        </Box>

    </MainContainer>
    )
};