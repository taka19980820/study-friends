import React from 'react';
import Typography from '@mui/joy/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
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
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Link from 'next/link'
import MuiLink from '@mui/material/Link';
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar } from '../../../context/SnackbarContext';
import { AuthContext } from '../../../context/Auth/AuthContext';
import MaterialFavorite from '../../Favorite/MaterialFavorite';
import CategorySelectDialog from '../../Category/CategorySelectDialog';

export default function Material({ materialData, isLiked, isRegisterd, categories }) {
    const { authUser } = React.useContext(AuthContext);
    const { showSnackbar } = useSnackbar();
    const [materialDetailOpen, setMaterialDetailOpen] = React.useState(false);
    const handleMaterialDetailOpen = (newValue) => {
        setMaterialDetailOpen(true);
    };
    const handleMaterialDetailClose = () => {
        setMaterialDetailOpen(false);
    };
    //コメント欄開閉制御
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    //コメント欄開閉制御ここまで

    //My教材に登録
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogText, setDialogText] = React.useState('');
    const [registerd, setRegisterd] = React.useState(isRegisterd);
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
    const [ materialComments, setMaterialComments ] = React.useState([...materialData.material_comments]);
    const [ comment, setComment ] = React.useState('');
    const postComment = async (e) => {
        e.preventDefault();

        const response = await RestAccess.post('/materials/' + materialData.id + '/comments', {comment: comment});
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
        const response = await RestAccess.del('/materials/' + materialData.id + '/comments/' + comment.id);
        if(response.status == 200) {
            const newComments = materialComments.filter((item) => item.id !== comment.id)
            setMaterialComments(newComments);
            showSnackbar('コメントを削除しました');
        } else {
            showSnackbar('コメントを削除できませんでした', 'error');
        }
    }
    

    const [ categoryDialog, setCategoryDialog ] = React.useState(false);
    const handleRegisterMaterial = () => {
        if(!registerd) {
            setCategoryDialog(true);
        } else {
            removeMaterial();
        }
    }
    const addMaterial = async (categoryId) => {
        const response = await RestAccess.post('/materials/' + materialData.id + '/add', { category_id: categoryId}, {
            headers: {
            'Content-Type': 'application/json'
        }})
        if(response.status === 200) {
            setRegisterd(true);
            setCategoryDialog(false);
            showSnackbar('My教材に追加しました');
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }

    const removeMaterial = async () => {
        const response = await RestAccess.del('/users/' + authUser.id + '/materials/' + materialData.id + '/remove');
        if(response.status === 200) {
            setRegisterd(false);
            setCategoryDialog(false);
            showSnackbar('My教材から削除しました');
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }

    const handleCategoryDialogClose = () => {
        setCategoryDialog(false);
    }

    //教材なし
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
                        image={materialData.img != null ? process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + materialData.img : "/bookImg.jpeg"}
                        alt={materialData.material_name}
                        sx={{ width: '5em', mr: 1 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <MuiLink onClick={handleMaterialDetailOpen} underline="hover" color='black' component="button" sx={{ fontSize: fontSize, textAlign: 'left'   }}>
                        <strong>{materialData.material_name}</strong>
                    </MuiLink>
                </Box>
                {/* <Box sx={{ flexGrow: 1 }}></Box> */}
                <Button 
                    onClick={handleRegisterMaterial} 
                    color={registerd ? 'inherit': 'primary'} 
                    sx={{ 
                        height: '40px', 
                        width: '150px',
                        whiteSpace: 'nowrap',
                        "@media screen and (max-width:480px)": {
                            fontSize: '12px'
                        }
                    }} 
                    variant="contained">
                    {registerd ? '追加済み': 'My教材に追加'}
                </Button>
                </Stack>
            </CardContent>

            <CardActions disableSpacing>
                <MaterialFavorite isLiked={isLiked} favorites={materialData.material_favorites} materialId={materialData.id}/>
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
            <DialogTitle sx={{ mb: 2, textAlign: 'center', borderBottom: '1px solid', borderColor: '#C0C0C0', fontWeight: 'bold' }}>{materialData.material_name}</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>教材説明</Typography>
                <DialogContentText sx={{ mb: 1 }}>
                    {materialData.description}
                </DialogContentText>
                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>タグ</Typography>
                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                    {materialData.tags.length > 0 && 
                        materialData.tags.map((value) => {
                            return <Chip key={value.id} label={value.tag_name} color="primary" />
                        })
                    }
                </Box>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>著者名</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{materialData.author != null && materialData.author}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>ページ数</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{materialData.pages != null && materialData.pages}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>出版社</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{materialData.publisher != null && materialData.publisher}</Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px solid', borderColor: '#DDDDDD' }}>
                    <Grid item xs={4}>URL</Grid>
                    <Grid item xs={8} sx={{ textAlign: 'right' }}>{materialData.url != null && materialData.author}</Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
            <Button onClick={handleMaterialDetailClose}>キャンセル</Button>
            <Link href={'/materials/' + materialData.id + '/edit'}><Button>編集する</Button></Link>
            </DialogActions>
        </Dialog>
        <CategorySelectDialog categories={categories} callback={addMaterial} open={categoryDialog} dialogClose={handleCategoryDialogClose}/>
        {renderDialog}
    </>
    )
};