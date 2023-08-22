import React from 'react';
import Typography from '@mui/joy/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemContent from '@mui/joy/ListItemContent';
import IconButton from '@mui/joy/IconButton';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


export default function Log() {
    //削除確認ダイアログ
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogOpen = () => {
        setAnchorEl(null);
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
                本当に削除しますか？
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDialogClose}>キャンセル</Button>
            <Button onClick={handleDialogClose} autoFocus>
                削除
            </Button>
            </DialogActions>
        </Dialog>
    );
    //メニュー開閉制御
    const [anchorEl, setAnchorEl] = React.useState(null);
    const toolBarOpen = Boolean(anchorEl);
    const handleToolbarOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleToolbarClose = () => {
      setAnchorEl(null);
    };
    const renderCardMenu = (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={toolBarOpen}
            onClose={handleToolbarClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleToolbarClose}>編集</MenuItem>
            <MenuItem onClick={handleDialogOpen}>削除</MenuItem>
        </Menu>
    );
    //メニュー開閉制御ここまで

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

  return  (
    <>
    <Card sx={{ mb: 5 }}>
        <CardHeader
            avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
            </Avatar>
            }
            action={
            <IconButton 
                aria-label="settings"
                onClick={handleToolbarOpen}
            >
                <MoreVertIcon />
            </IconButton>
            }
            title="堀越栄花"
            subheader="2023年8月11日"
        />

        <CardContent>
            <Typography variant="body2" sx={{ mb: 2}}>
                データベースの勉強をしました。
                疲れました。
            </Typography>
            <Paper sx={{ 
                display: 'flex',
                p: 2
            }}>
                <Box>
                    <CardMedia
                        component="img"
                        image="/bookImg.jpeg"
                        alt="Live from space album cover"
                        sx={{ width: '5em' }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography component="div" sx={{ typography: { sm: 'h6', xs: 'body2'}}}>
                        <strong>データベース勉強</strong>
                    </Typography>
                    <Typography component="div" variant="h5">
                        <strong>1時間30分</strong>
                    </Typography>
                </Box>
            </Paper>
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
                        <ListItemContent　sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
        {renderCardMenu}
        {renderDialog}
    </>
    )
};