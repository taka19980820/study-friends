import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, TextField, Button, FormControl, FormHelperText } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar  } from '../../../context/SnackbarContext';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';


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

export default function EditLog({ open, logId }) {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
      mode: "onChange",
      defaultValues: {
        study_date: "",
        study_hour: 0,
        hour: 0,
        minuite: 0,
        memo: '',
      },
    });

    const [ material, setMaterial ] = React.useState({});

    React.useEffect(() => {
        const fetchLogData = async () => {
            const response = await RestAccess.get('/study-logs/' + logId);
            if(response.status == 200) {
                const logData = response.data;
                setMaterial(logData.my_material.material);
                setValue('hour', Math.floor(logData.study_hour / 60));
                setValue('minuite', logData.study_hour % 60);
                setValue('study_hour', logData.study_hour);
                setValue('study_date', logData.study_date);
                setValue('memo', logData.memo == null ? '' : logData.memo);
            } else {
                showSnackbar('エラーが発生しました');
            }
        }
        fetchLogData();
    }, []);

    const onSubmit = async (data) => {
      const studyTime = Number(data.hour) * 60 + Number(data.minuite);
      const requestData = {
        study_date: data.study_date, 
        study_hour: studyTime,
        memo: data.memo
      };
      const response = await RestAccess.put('/study-logs/' + logId + '/edit',  requestData, {
        headers: {
        'Content-Type': 'application/json'
      }})
      if(response.status === 200) {
        showSnackbar('勉強記録を更新しました', 'success');
        // router.push('/');
        router.back();
      } else {
        showSnackbar(response.data.message, 'error');
      }
  
    }


  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="勉強記録編集" />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                            <Typography>教材選択</Typography>
                            <TextField
                                id="select-textbook"
                                name="material"
                                value={material.material_name}
                                fullWidth
                                sx={{ mb: 3}}
                                disabled
                            />
                            <Typography>
                                日付
                            </Typography>
                            <TextField
                                sx={{ mb: 2, width: '200px' }}
                                variant="outlined"
                                type="date"
                                {...register("study_date")}
                            />
                            <Typography>勉強時間</Typography>
                            <FormControl variant="outlined">
                              <OutlinedInput
                                  endAdornment={<InputAdornment position="end">時間</InputAdornment>}
                                  sx={{ mr: 3 }}
                                  {...register("hour", {
                                    pattern: {
                                      value: /^(?:[1-9]?[0-9])$/,
                                      message: '数値を入力してください'
                                    }
                                  })}
                                  error={Boolean(errors.hour)}
                              />
                              {errors.hour && (
                                  <FormHelperText error id="study-hour">
                                    {errors.hour.message}
                                  </FormHelperText>
                              )}
                            </FormControl>
                            <FormControl variant="outlined">
                              <OutlinedInput
                                  endAdornment={<InputAdornment position="end">分</InputAdornment>}
                                  {...register("minuite", {
                                    pattern: {
                                      value: /^(?:[1-5]?[0-9])$/,
                                      message: '0から59の数値を入力してください'
                                    }
                                  })}
                                  error={Boolean(errors.minuite)}
                              />
                              {errors.minuite && (
                                <FormHelperText error id="study-minuite">
                                  {errors.minuite.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                            <Typography sx={{ mt: 3 }}>メモ</Typography>
                            <TextField
                                multiline
                                rows={2}
                                variant="outlined"
                                fullWidth
                                {...register("memo")}
                            />
                            <Button sx={{
                                mt: 2,
                                width: 100,
                                "@media screen and (max-width:600px)": {
                                    width: '100%',
                                },
                            }} variant="contained" type="submit">
                                投稿
                            </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    </MainContainer>
    )
};