// Main.js
import React from 'react';
import Typography from '@mui/joy/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import List from '@mui/joy/List';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as RestAccess from '../../utils/RestAccess';
import { useSnackbar } from '../../context/SnackbarContext';
import { AuthContext } from '../../context/Auth/AuthContext';
import { useRouter } from 'next/router';
import { GithubPicker } from 'react-color';
import SquareIcon from '@mui/icons-material/Square';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from '@mui/material';

export default function CategoryEditDialog({ open, categories, categoryDialogClose, addCategory, editCategory, deleteCategory }) {
    const [ newCategory, setNewCategory ] = React.useState({
        category_name: '',
        category_color: ''
    });

    const handleCategoryColor = (color) => {
        setNewCategory((prev) => ({...prev, category_color: color.hex}));
    }

    const HandleAddCategory = (e) => {
        e.preventDefault();
        addCategory(newCategory);
    }



    const dialogClose = () => {
        setNewCategory(prev => ({
            category_name: '',
            category_color: ''
        }))
        categoryDialogClose();
    }

    //カテゴリ編集
    const [ editCategoryValues, setEditCategoryValues ] = React.useState({
        category_name : "",
        category_color : "#"
    });
    
    const handleEditCategory = async (e, categoryId) => {
        e.preventDefault();
        editCategory(categoryId, editCategoryValues);
        setEditCategoryValues({category_name: '', category_color: ''});
    }

    const handleEditCategoryColor = (color) => {
        setEditCategoryValues((prev) => ({...prev, category_color: color.hex}));
    }

    const  handleDeleteCategory = (e, categoryId) => {
        e.preventDefault();
        deleteCategory(categoryId);
    }
    

  return  (
    <>
        <Dialog
            open={open}
            onClose={dialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            <DialogTitle sx={{ mb: 2, textAlign: 'center', borderBottom: '1px solid', borderColor: '#C0C0C0', fontWeight: 'bold' }}>カテゴリ選択</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>カテゴリ一覧</Typography>
                    
                    {/* <List> */}
                        {categories.length > 1 ? 
                            categories.map((category) => {
                                if(category.id == 1) {
                                    return null;
                                }
                                return (
                                    
                                    <Accordion key={category.id} onChange={e => setEditCategoryValues({...editCategoryValues, category_name: category.category_name, category_color: category.category_color})} >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box display="flex" alignItems="center">
                                            <SquareIcon sx={{color: category.category_color, marginRight: '8px'}}/>
                                            <Typography>{category.category_name}</Typography>
                                        </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>カテゴリ編集</Typography>
                                            <form onSubmit={e => handleEditCategory(e, category.id)}>
                                                <Typography>カテゴリ名</Typography>
                                                <TextField
                                                    sx={{ mb: 2 }}
                                                    id="category_name"
                                                    name="category_name"
                                                    fullWidth
                                                    size="small"
                                                    value={editCategoryValues.category_name}
                                                    onChange={e => setEditCategoryValues(prev => ({...prev, category_name: e.target.value}))}
                                                />
                                                <Typography>カテゴリーカラー</Typography>
                                                <GithubPicker width="100%" onChange={handleEditCategoryColor}/>
                                                <Button 
                                                    variant="contained"
                                                    disabled={editCategoryValues.category_name === '' || editCategoryValues.category_color === '' ? true : false}
                                                    sx={{ mt: 2}} 
                                                    type="submit">
                                                    更新する
                                                </Button>
                                                <Button 
                                                    variant="contained"
                                                    sx={{ mt: 2, ml: 2}} 
                                                    color="error"
                                                    onClick={(e) => handleDeleteCategory(e, category.id)}
                                                >
                                                    削除する
                                                </Button>
                                            </form>
                                        </AccordionDetails>
                                    </Accordion>
                                )}
                            )
                            :
                            <Typography>カテゴリがありません</Typography>

                        }
                    {/* </List> */}
                <Typography sx={{ mb: 1, color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>カテゴリ新規作成</Typography>
                <form onSubmit={HandleAddCategory}>
                    <Typography>カテゴリ名</Typography>
                    <TextField
                        sx={{ mb: 2 }}
                        id="category_name"
                        name="category_name"
                        fullWidth
                        size="small"
                        value={newCategory.category_name}
                        onChange={e => setNewCategory(prev => ({...prev, category_name: e.target.value}))}
                    />
                    <Typography>カテゴリーカラー</Typography>
                    <GithubPicker width="100%" onChange={handleCategoryColor}/>
                    <Button 
                        variant="contained"
                        disabled={newCategory.category_name === '' || newCategory.category_color === '' ? true : false}
                        sx={{ mt: 2}} 
                        type="submit">
                        カテゴリ作成
                    </Button>
                </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={dialogClose}>閉じる</Button>
            {/* <Button onClick={handleMaterialDetailClose}>
                My教材に追加
            </Button> */}
            </DialogActions>
        </Dialog>
    </>
    )
};