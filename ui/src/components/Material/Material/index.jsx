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
import MuiLink from '@mui/material/Link';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import SearchBar from '../../Search/KeyWordSearch';
import TagManager from '../../Tag/TagManager';

export default function Material({ open }) {
    const [materialDetailOpen, setMaterialDetailOpen] = React.useState(false);
    const [materialDetaillValues, setMaterialDetailValues] = React.useState({
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
    const handleMaterialDetailOpen = (newValue) => {
        // setMaterialDetailValues({...roomDetailValues, ...newValue})
        setMaterialDetailOpen(true);
    };
    const handleMaterialDetailClose = () => {
        // setDetailValues({

        // })
        setMaterialDetailOpen(false);
    };

    //コメント欄開閉制御
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    //コメント欄開閉制御ここまで
    
    //いいね機能
    const [favorit, addFavorit] = React.useState(false);
    const handleFavorit = () => {
        //apiと通信していいね追加または、削除。
        //初期状態の時いいねしているならtrueにする。
        addFavorit(!favorit);
    };
    //いいね機能ここまで

    //My教材に登録
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogText, setDialogText] = React.useState('');
    const [registerd, setRegisterd] = React.useState(false);
    const handleDialogOpen = (text) => {
        setDialogText(text)
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const renderDialog = (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {dialogText}
            </DialogContentText>
            </DialogContent>
        </Dialog>
    );

    const handleRegisterMaterial = () => {
        if(registerd) {
            setRegisterd(false);
            handleDialogOpen('My教材から削除しました');
        } else {
            setRegisterd(true)
            handleDialogOpen('My教材に追加しました');
        }
    }

    
    //文字サイズ関連
    const [fontSize, setFontSize] = React.useState(14);
    React.useEffect(() => {
    //   const windowWidth = window.innerWidth;
    //   setFontSize(windowWidth < 480 ? 8 : 12);
        const updateFontSize = () => {
            const width = window.innerWidth;
            setFontSize(width < 480 ? 15 : 25);
        };

        // 初回レンダリング時にフォントサイズを更新
        updateFontSize();

        // ウィンドウのリサイズ時にフォントサイズを更新
        window.addEventListener('resize', updateFontSize);

        // クリーンアップ関数
        return () => {
            window.removeEventListener('resize', updateFontSize);
        };
    }, []);
    

  return  (
    <>
        <Card sx={{ mb: 5 }}>
            <CardContent>
                <Stack direction="row">
                <Box>
                    <CardMedia
                        component="img"
                        image="/bookImg.jpeg"
                        alt="Live from space album cover"
                        sx={{ width: '5em' }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <MuiLink onClick={handleMaterialDetailOpen} underline="hover" color='black' component="button" sx={{ fontSize: fontSize, textAlign: 'left' }}>
                        <strong>PHPの教科書PHPの教科書PHPの教科書</strong>
                    </MuiLink>
                </Box>
                <div style={{ flexGrow: 1 }}></div>
                <Button 
                    onClick={handleRegisterMaterial} 
                    color={registerd ? 'inherit': 'primary'} 
                    sx={{ 
                        height: '40px', 
                        width: '200px', 
                        "@media screen and (max-width:480px)": {
                            fontSize: '12px'
                        }
                    }} 
                    variant="contained">
                    {registerd ? 'My教材から削除': 'My教材に追加'}
                </Button>
                </Stack>
            </CardContent>

            <CardActions disableSpacing>
                <IconButton 
                    aria-label="add to favorites" 
                    sx={favorit ? { color: 'red'} : {color: 'text.secondary'}}
                    onClick={handleFavorit}
                >
                    <FavoriteIcon />
                </IconButton>
                <Typography variant="caption">
                    いいね2件
                </Typography>
                <IconButton aria-label="share" onClick={handleExpandClick}>
                    <CommentIcon />
                </IconButton>
                <Typography variant="caption">
                    コメント2件
                </Typography>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {/* コメント */}
                    <List sx={{ bgcolor: 'background.paper'}}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    R
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemContent　sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <div style={{ flex: 1 }}>
                                <Typography level="title-sm">乙骨由太郎太</Typography>
                                <Typography level="body-sm">
                                Wish I could come, but I&apos;m out of town this Friday.
                                </Typography>
                            </div>
                            </ListItemContent>
                            <IconButton>
                                <ListItemIcon sx={{ justifyContent: 'center' }}>
                                    <DeleteIcon />
                                </ListItemIcon>
                            </IconButton>
                        </ListItem>
                        <Divider variant="inset" component="li" sx={{ mb: 1 }}/>

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    R
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemContent sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <div style={{ flex: 1 }}>
                                <Typography level="title-sm">乙骨由太郎太</Typography>
                                <Typography level="body-sm">
                                ああ、なんて素敵な日だ、幸せと思える今日も、夢破れ挫ける今日も、ああ、あきらめずもがいている、せまいひろい世界で奇跡を歌う
                                </Typography>
                            </div>
                            </ListItemContent>
                            <IconButton>
                                <ListItemIcon sx={{ justifyContent: 'center' }}>
                                    <DeleteIcon />
                                </ListItemIcon>
                            </IconButton>
                        </ListItem>
                        <Divider variant="inset" component="li" sx={{ mb: 1 }}/>
        
                    
                        </List>                   
                    {/* コメントここまで */}

                    {/* コメント入力欄 */}
                    <Box sx={{ mt: 1 }}>
                        <TextField fullWidth={true} id="outlined-basic" label="コメント" variant="outlined" />
                        <Button sx={{
                            mt: 2,
                            width: 100,
                            "@media screen and (max-width:600px)": {
                                width: '100%',
                            },
                        }} variant="contained">
                            送信
                        </Button>
                    </Box>
                    {/* コメント入力欄ここまで */}
                </CardContent>
            </Collapse>
        </Card>

        <Dialog
            open={materialDetailOpen}
            onClose={handleMaterialDetailClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            <DialogTitle sx={{ mb: 2, textAlign: 'center', borderBottom: '1px solid', borderColor: '#C0C0C0', fontWeight: 'bold' }}>PHPの教科書</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>教材内容</Typography>
                <DialogContentText sx={{ mb: 1 }}>
                    PHPの教科書です。PHPの基礎から、実際に簡単なアプリ開発を通して勉強できるっさね。
                </DialogContentText>
                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>タグ</Typography>
                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                    {/* <Chip key={value.tagId} label={value.tagName} color="primary" /> */}
                    <Chip label='PHP' color="primary" />
                    <Chip label='プログラミング' color="primary" />
                </Box>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>著者名</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}></Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>ページ数</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}></Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>出版社</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}></Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>URL</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>100人</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>登録者数</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>100人</Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
            <Button onClick={handleMaterialDetailClose}>キャンセル</Button>
            <Button onClick={handleMaterialDetailClose}>
                My教材に追加
            </Button>
            </DialogActions>
        </Dialog>
        {renderDialog}
    </>
    )
};