import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Stack, Typography, Button, Grid } from '@mui/material';


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


export default function About({ open }) {
 
  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <h2>スタ友でできること</h2>
        <Card sx={{ mt: 3 }}>
            <CardHeader title="勉強記録をつける" />
            <CardContent>
            <Stack 
                direction="row"
                sx={{ width: '100%'}}
            >
                <img
                    src="/RecordStudy.png"
                    alt="勉強記録をつける"
                    style={{ width: '40%'}}
                />
                <Typography 
                    sx={{ 
                        width: '60%', 
                        "@media screen and (max-width:600px)": {
                            fontSize: "10px",
                        },

                    }}
                >勉強後に時間、教材、コメント等を入力し、記録することができます。勉強記録はタイムライン上で表示され、過去の勉強記録を見返すことができます。</Typography>
            </Stack>
            </CardContent>
        </Card>


        <Card sx={{ mt: 3 }}>
            <CardHeader title="勉強時間を確認" />
            <CardContent>
            <Stack 
                direction="row"
                sx={{ width: '100%'}}
            >
                <img
                    src="/StudyTime.png"
                    alt="勉強時間を確認"
                    style={{ width: '40%'}}
                />
                <Typography 
                    sx={{ 
                        width: '60%', 
                        "@media screen and (max-width:600px)": {
                            fontSize: "11px",
                        },

                    }}
                >勉強時間をグラフで確認することができます。グラフは日、週、月別で表示されます。
                またカテゴリごとに勉強時間を確認することができます。</Typography>
            </Stack>
            </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
            <CardHeader title="教材管理" />
            <CardContent>
            <Stack 
                direction="row"
                sx={{ width: '100%'}}
            >
                <img
                    src="/AboutMaterial.png"
                    alt="教材管理"
                    style={{ width: '40%'}}
                />
                <Typography 
                    sx={{ 
                        width: '60%', 
                        "@media screen and (max-width:600px)": {
                            fontSize: "10px",
                        },

                    }}
                >勉強で使用する教材は「MY教材」で管理することができます。独自のカテゴリを作成し、教材を管理できます。
また他のユーザーが登録した教材も閲覧することができ、気になる教材があれば「MY教材」に追加することができます。</Typography>
            </Stack>
            </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
            <CardHeader title="勉強ルーム" />
            <CardContent>
            <Stack 
                direction="row"
                sx={{ width: '100%'}}
            >
                <img
                    src="/StudyRoom.png"
                    alt="勉強ルーム"
                    style={{ width: '40%'}}
                />
                <Typography 
                    sx={{ 
                        width: '60%', 
                        "@media screen and (max-width:600px)": {
                            fontSize: "10px",
                        },

                    }}
                >スタ友では「勉強ルーム」を作成することができます。ルームを通じて同じ目標を持ったユーザーと繋がることができます。
                ルーム内にはチャット機能があるため、勉強の質問などが行えます。一緒に切磋琢磨できる仲間を見つけ、勉強のモチベーションを向上させましょう。</Typography>
            </Stack>
            </CardContent>
        </Card>
        
    </MainContainer>
    )
};