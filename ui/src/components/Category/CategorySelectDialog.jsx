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

import ListItem from '@mui/joy/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';

export default function CategorySelectDialog({ open, callback, dialogClose, categories }) {

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
                    <List>
                        {categories.length > 0 && 
                            categories.map((category) => {
                                return (
                                    <React.Fragment key={category.id}>
                                        <ListItem sx={{ p: 0 }}>
                                            <ListItemButton onClick={() => callback(category.id)}>
                                                <ListItemIcon sx={{color: category.category_color}}>
                                                    <SquareIcon />
                                                </ListItemIcon>
                                                <ListItemText>
                                                    {category.category_name}
                                                </ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider light/>
                                    </React.Fragment>
                                )}
                            )
                        }
                    </List>
            </DialogContent>
            <DialogActions>
            <Button onClick={dialogClose}>キャンセル</Button>
            {/* <Button onClick={handleMaterialDetailClose}>
                My教材に追加
            </Button> */}
            </DialogActions>
        </Dialog>
    </>
    )
};