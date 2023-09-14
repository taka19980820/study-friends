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

import * as dateTimeHandler from '../../../utils/dateTimeHandler'
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar } from '../../../context/SnackbarContext';
import { AuthContext } from '../../../context/Auth/AuthContext';
import MaterialFavorite from '../../Favorite/MaterialFavorite';
import { useRouter } from 'next/router';
import CategorySelectDialog from '../../Category/CategorySelectDialog';

export default function MyMaterial({ removeMaterial, materialData, isLiked, categories }) {
    const { authUser } = React.useContext(AuthContext);
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    //削除確認ダイアログ
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

    //コメント投稿
    const [ materialComments, setMaterialComments ] = React.useState([...materialData.material.material_comments]);
    const [ comment, setComment ] = React.useState('');
    const postComment = async (e) => {
        e.preventDefault();

        const response = await RestAccess.post('/materials/' + materialData.material.id + '/comments', {comment: comment});
        if(response.status == 200) {
            setMaterialComments((prev) => [...prev, response.data]);
            setComment('');
            showSnackbar('コメントを投稿しました');

        } else {
            showSnackbar('コメントを投稿できませんでした', 'error');
        }
    }

    //コメント削除
    const deleteComment = async (comment) => {
        // console.log(comment)
        const response = await RestAccess.del('/materials/' + materialData.material.id + '/comments/' + comment.id);
        if(response.status == 200) {
            const newComments = materialComments.filter((item) => item.id !== comment.id)
            setMaterialComments(newComments);
            showSnackbar('コメントを削除しました');
        } else {
            showSnackbar('コメントを削除できませんでした', 'error');
        }
    }
    
    const [ categoryDialog, setCategoryDialog ] = React.useState(false);

    const editMaterial = async (categoryId) => {
        const response = await RestAccess.put('/users/' + authUser.id + '/myMaterials/' + materialData.id + '/edit', { category_id: categoryId}, {
            headers: {
            'Content-Type': 'application/json'
        }})
        if(response.status === 200) {
            setCategoryDialog(false);
            showSnackbar('カテゴリを変更しました');
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
        // console.log(categoryId);
    }

    const handleRemoveMaterial = () => {
        removeMaterial(materialData.material_id);
        setCategoryDialog(false);
    }

    const handleCategoryDialogClose = () => {
        setCategoryDialog(false);
    }

    const handleEditMaterial = () => {
        setCategoryDialog(true);
    }

    
    if(materialData.id == 1) {
        return null;
    }

  return  (
    <>
        <Card sx={{ mb: 5 }}>
            <CardContent>
                <Stack direction="row">
                <Box>
                    <CardMedia
                        component="img"
                        image={materialData.material.img != null ? process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + materialData.material.img : "/bookImg.jpeg"}
                        alt={materialData.material.material_name}
                        sx={{ width: '5em', mr: 1 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <MuiLink onClick={handleMaterialDetailOpen} underline="hover" color='black' component="button" sx={{ fontSize: fontSize, textAlign: 'left' }}>
                        <strong>{materialData.material.material_name}</strong>
                    </MuiLink>
                </Box>
                <div style={{ flexGrow: 1 }}></div>
                { authUser.id === materialData.user_id && 
                    <Button 
                        onClick={handleEditMaterial} 
                        color='primary'
                        sx={{ 
                            height: '40px', 
                            width: '150px', 
                            "@media screen and (max-width:480px)": {
                                fontSize: '12px'
                            }
                        }} 
                        variant="contained">
                            編集する
                    </Button>
                }
                </Stack>
            </CardContent>

            <CardActions disableSpacing>
                <MaterialFavorite isLiked={isLiked} favorites={materialData.material.material_favorites} materialId={materialData.material.id}/>
                <IconButton aria-label="share" onClick={handleExpandClick}>
                    <CommentIcon />
                </IconButton>
                <Typography variant="caption">
                    コメント{materialComments.length}件
                </Typography>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {/* コメント */}
                    <List sx={{ bgcolor: 'background.paper'}}>
                        {materialComments.length > 0 ?
                            materialComments.map((value) => {
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

        <Dialog
            open={materialDetailOpen}
            onClose={handleMaterialDetailClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            <DialogTitle sx={{ mb: 2, textAlign: 'center', borderBottom: '1px solid', borderColor: '#C0C0C0', fontWeight: 'bold' }}>{materialData.material.material_name}</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>教材説明</Typography>
                <DialogContentText sx={{ mb: 1 }}>
                    {materialData.material.description}
                </DialogContentText>
                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>タグ</Typography>
                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                    {materialData.material.tags.length > 0 && 
                        materialData.material.tags.map((value) => {
                            return <Chip key={value.id} label={value.tag_name} color="primary" />
                        })
                    }
                </Box>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>著者名</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{materialData.material.author != null && materialData.material.author}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>ページ数</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{materialData.material.pages != null && materialData.material.pages}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>出版社</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{materialData.material.publisher != null && materialData.material.publisher}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>URL</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{materialData.material.url != null && materialData.material.url}</Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
            <Button onClick={handleMaterialDetailClose}>閉じる</Button>
            { authUser.id === materialData.user_id &&
                <Button onClick={handleRemoveMaterial}>
                    My教材から削除する
                </Button>
            }
            </DialogActions>
        </Dialog>
        <CategorySelectDialog categories={categories} callback={editMaterial} open={categoryDialog} dialogClose={handleCategoryDialogClose}/>
        {renderDialog}
    </>
    )
};