// Main.js
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { useRegisterInput } from '../../../context/RegisterInputContext';


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

//タグ選択用スタイル
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }


export default function Register({ open }) {
    //登録ボタン押下
    const router = useRouter();
    const { registerInput, setRegisterInput } = useRegisterInput();
    const handleSubmit = (event) => {
      (console.log(event))
      event.preventDefault();
      setRegisterInput({
          name: event.target.name.value,
          email: event.target.email.value,
          password: event.target.password.value,
      })
      router.push('/confirm');
    }

    //タグ選択
    const theme = useTheme();
    const [tags, setTags] = React.useState([]);
  
    const handleSetTags = (event) => {
      const {
        target: { value },
      } = event;
      setTags(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };
    const tagSet = [
        { tagId: 1, tagName: 'PHP'},
        { tagId: 2, tagName: 'Laravel'},
        { tagId: 3, tagName: 'Java'},
        { tagId: 4, tagName: 'Linux'},
        { tagId: 5, tagName: 'CentOS'},
        { tagId: 6, tagName: 'LPIC'},
        { tagId: 7, tagName: 'CCNA'},
    ]

    React.useEffect(() => {
        setTags([...tagSet])
    }, [])

    //生年月日
    const currentDate = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(currentDate);

    //職業選択
    const [job, setJob] = useState('');

    //性別選択
    const [gender, setGender] = useState('');
    

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="ユーザー登録" />
            <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Typography>名前</Typography>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          id="name"
                          name="name"
                          autoComplete="name"
                          autoFocus
                        />
                        <Typography>メールアドレス</Typography>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          name="email"
                          autoComplete="email"
                        />
                        <Typography>パスワード</Typography>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                        />
                        <Button 
                            type='submit'
                            sx={{
                            mt: 2,
                            width: '100%',
                            "@media screen and (max-width:600px)": {
                                width: '100%',
                            },
                        }} variant="contained"
                        >
                          登録する
                        </Button>
                    </form>
            </CardContent>
        </Card>
    </MainContainer>
    )
};