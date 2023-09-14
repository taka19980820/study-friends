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

import * as dateTimeHandler from '../../../utils/dateTimeHandler'
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar } from '../../../context/SnackbarContext';
import { AuthContext } from '../../../context/Auth/AuthContext';
import Favorite from '../../Favorite';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Log({ logData, isLiked, callback }) {
    const { authUser } = React.useContext(AuthContext);
    const router = useRouter();
    //削除確認ダイアログ
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogOpen = () => {
        setAnchorEl(null);
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    //勉強ログ削除
    const deleteLog = async () => {
        setDialogOpen(false);
        await callback(logData.id)
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
                本当に削除しますか？
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDialogClose}>キャンセル</Button>
            <Button onClick={deleteLog} autoFocus>
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
            <MenuItem><Link href={{pathname: "/logs/edit/" , query: { logId: logData.id}}} as="/logs/edit/">編集</Link></MenuItem>
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
    

    const { showSnackbar } = useSnackbar();
    //コメント投稿
    const [ logComments, setLogComments ] = React.useState([...logData.comments]);
    const [ comment, setComment ] = React.useState('');
    const postComment = async (e) => {
        e.preventDefault();

        const response = await RestAccess.post('study-logs/' + logData.id + '/comments', {comment: comment});
        if(response.status == 200) {
            setLogComments([...logComments, response.data]);
            setComment('');
            showSnackbar('コメントを投稿しました');

        } else {
            showSnackbar('コメントを投稿できませんでした', 'error');
        }
    }
    //コメント削除
    const deleteComment = async (comment) => {
        // console.log(comment)
        const response = await RestAccess.del('study-logs/' + logData.id + '/comments/' + comment.id);
        if(response.status == 200) {
            const newComments = logComments.filter((item) => item.id !== comment.id)
            setLogComments(newComments);
            showSnackbar('コメントを削除しました');
        } else {
            showSnackbar('コメントを削除できませんでした', 'error');
        }
    }
  return  (
    <>
    <Card sx={{ mb: 5 }}>
        <CardHeader
            avatar={
                logData.user.profileimg != null ? 
                    <Avatar
                        alt={logData.user.name.slice(0, 1)}
                        src={process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + logData.user.profileimg}
                        aria-label="recipe"
                    />
                    :
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {logData.user.name.slice(0, 1)}
                    </Avatar>
            }
            action={ logData.user_id === authUser.id &&
                <IconButton 
                    aria-label="settings"
                    onClick={handleToolbarOpen}
                >
                    <MoreVertIcon />
                </IconButton>
            }
            title={logData.user.name}
            subheader={dateTimeHandler.formatDate(logData.study_date)}
        />

        <CardContent>
            <Typography variant="body2" sx={{ mb: 2}}>
                {logData.memo}
            </Typography>

            <Paper sx={{ 
                display: 'flex',
                p: 2
            }}>
                <Box>
                    <CardMedia
                        component="img"
                        image={logData.my_material.material.img != null ? process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + logData.my_material.material.img : "/bookImg.jpeg"}
                        alt={logData.my_material.material.material_name}
                        sx={{ width: '5em', mr: 1 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography component="div" sx={{ typography: { sm: 'h6', xs: 'body2'}}}>
                        <strong>{logData.my_material.material.material_name}</strong>
                    </Typography>
                    <Typography component="div" variant="h5">
                        <strong>{dateTimeHandler.formatTime(logData.study_hour)}</strong>
                    </Typography>
                </Box>
            </Paper>
        </CardContent>

        <CardActions disableSpacing>
            <Favorite isLiked={isLiked} favorites={logData.favorites} logId={logData.id}/>
            <IconButton aria-label="share" onClick={handleExpandClick}>
                <CommentIcon />
            </IconButton>
            <Typography variant="caption">
                コメント{logComments.length}件
            </Typography>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                {/* コメント */}
                <List sx={{ bgcolor: 'background.paper'}}>
                    {logComments.length > 0 ?
                        logComments.map((value) => {
                            return (
                                <React.Fragment key={value.id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            {value.user.profileimg != null ?
                                                <Avatar
                                                    alt={value.user.name.slice(0, 1)}
                                                    src={process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + value.user.profileimg}
                                                    aria-label="recipe"
                                                />
                                                :
                                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                    {value.user.name.slice(0, 1)}
                                                </Avatar>
                                            }
                                        </ListItemAvatar>
                                        <ListItemContent sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <div style={{ flex: 1 }}>
                                            <Typography level="title-sm">{value.user.name}</Typography>
                                            <Typography level="body-sm">
                                                {value.comment}
                                            </Typography>
                                        </div>
                                        </ListItemContent>
                                        {authUser.id == value.user.id &&
                                            <IconButton onClick={() => deleteComment(value)}>
                                                <ListItemIcon sx={{ justifyContent: 'center' }}>
                                                    <DeleteIcon />
                                                </ListItemIcon>
                                            </IconButton>
                                        }
                                    </ListItem>
                                    <Divider variant="inset" component="li" sx={{ mb: 1 }}/>
                                </React.Fragment>
                            )
                        })
                        :
                        <Typography>コメントはありません</Typography>
                    }
                
                 </List>                   
                {/* コメントここまで */}

                {/* コメント入力欄 */}
                <form onSubmit={postComment}>
                    <Box sx={{ mt: 1 }}>
                        <TextField 
                            fullWidth={true} 
                            id="outlined-basic" 
                            label="コメント" 
                            variant="outlined" 
                            name="comment"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <Button
                            type='submit'
                            disabled={comment.length == 0}
                            sx={{
                            mt: 2,
                            width: 100,
                            "@media screen and (max-width:600px)": {
                                width: '100%',
                            },
                            }} 
                            variant="contained"
                        >
                            送信
                        </Button>
                    </Box>
                </form>
                {/* コメント入力欄ここまで */}
            </CardContent>
            </Collapse>
        </Card>
        {renderCardMenu}
        {renderDialog}
    </>
    )
};