// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// import Typography from '@mui/material/Typography';
import Typography from '@mui/joy/Typography';

import CardMedia from '@mui/material/CardMedia';
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


import Menu from '@mui/material/Menu';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import {FormContainer,  TextFieldElement, DateTimePickerElement} from 'react-hook-form-mui'


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


export default function EditLog({ open }) {
    const {
        control,
        handleSubmit,
      } = useForm();
    
      const onSubmit = (data) => {
        console.log(data);
    };
    //勉強日時
    const [studyDateTime, setStudyDateTime] = React.useState(null);
    //教材選択
    const [textBook, setTextBook] = React.useState('');
    const handleSetTextBook = (event) => {
      setTextBook(event.target.value);
    };
  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="勉強記録編集" />
            <CardContent>
                {/* <FormControl fullWidth> */}
                    <Box component="form">
                        {/* <FormControl fullWidth> */}
                            <Typography>教材選択</Typography>
                            <Select
                                labelId="select-textbook-label"
                                id="select-textbook"
                                value={textBook}
                                onChange={handleSetTextBook}
                                fullWidth
                                sx={{ mb: 3} }
                            >
                                <MenuItem value={10}>教材なし</MenuItem>
                                <MenuItem value={20}>PHPの教科書</MenuItem>
                                <MenuItem value={30}>Larabelリファレンス</MenuItem>
                            </Select>
                            <Typography>開始日時</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker sx={{ mb: 3} } value={studyDateTime} onChange={(newValue) => setStudyDateTime(newValue)} />
                            </LocalizationProvider>
                            <Typography>勉強時間</Typography>
                            <OutlinedInput
                                endAdornment={<InputAdornment position="end">時間</InputAdornment>}
                                sx={{ mr: 3 }}
                            />
                            <OutlinedInput
                                endAdornment={<InputAdornment position="end">分</InputAdornment>}
                            />
                            {/* <Typography sx={{ mt: 3 }}>タイトル</Typography>
                            <TextField fullWidth={true} variant="outlined" /> */}
                            <Typography sx={{ mt: 3 }}>メモ</Typography>
                            <TextField
                                multiline
                                rows={2}
                                variant="outlined"
                                fullWidth
                            />
                            <Button sx={{
                                mt: 2,
                                width: 100,
                                "@media screen and (max-width:600px)": {
                                    width: '100%',
                                },
                            }} variant="contained">
                                投稿
                            </Button>
                        {/* </FormControl> */}
                    </Box>
                {/* </FormControl>   */}
            </CardContent>
        </Card>
    </MainContainer>
    )
};