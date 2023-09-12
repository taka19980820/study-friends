// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, TextField, Button, FormControl, FormHelperText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import * as RestAccess from '../../../utils/RestAccess';
import * as dateTimeHandler from '../../../utils/dateTimeHandler';
import { useSnackbar  } from '../../../context/SnackbarContext';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../context/Auth/AuthContext';
import { useForm, Controller } from 'react-hook-form';



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

export default function PostLog({ open }) {
    const router = useRouter();
    const { authUser } = React.useContext(AuthContext);
    const { showSnackbar } = useSnackbar();   
    const [ materials, setMaterials ] = React.useState([]);
    const [ display, setDisplay ] = React.useState(false);

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm({
      mode: "onChange",
      defaultValues: {
        study_date: dateTimeHandler.formatDate(new Date(), 'YYYY-MM-DD'),
        my_material_id: 1,
        study_hour: 0,
        hour: 0,
        minuite: 0,
        memo: '',
      },
    });

    React.useEffect(() => {
      const fetchData = async () => {
        const response = await RestAccess.get('/users/' + authUser.id + '/materials');
        if(response.status == 200) {
          setMaterials(response.data);
          setDisplay(true);
        } else {
          showSnackbar('エラーが発生しました');
        }
      }
      fetchData();
    }, []);

    const onSubmit = async (data) => {
      const studyTime = Number(data.hour) * 60 + Number(data.minuite);
      const requestData = {
        my_material_id : data.my_material_id,
        study_date: data.study_date,
        study_hour: studyTime,
        memo: data.memo
      };
      const response = await RestAccess.post('/study-logs', requestData, {
        headers: {
        'Content-Type': 'application/json'
      }})
      if(response.status === 200) {
        showSnackbar('勉強記録を投稿しました', 'success');
        router.push('/');
      } else {
        showSnackbar(response.data.message, 'error');
      }

    }

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        { display && 
            <>
              <Card>
                  <CardHeader title="勉強記録投稿" />
                  <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Box>
                                  <Typography>教材選択</Typography>
                                  <FormControl fullWidth variant="outlined">
                                    <Controller
                                      name="my_material_id"
                                      control={control}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                        >
                                          {materials.map((material) => {
                                              return (<MenuItem key={material.id} value={material.id}>{material.material.material_name}</MenuItem>);
                                          })}
                                        </Select>
                                      )}
                                    />
                                  </FormControl>
                                  <Typography sx={{ mt: 2}}>
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
                                  <Button 
                                      type="submit"
                                      sx={{
                                        mt: 2,
                                        width: 100,
                                        "@media screen and (max-width:600px)": {
                                            width: '100%',
                                        },
                                      }} 
                                      variant="contained">
                                      投稿
                                  </Button>
                              {/* </FormControl> */}
                          </Box>
                        </form>
                  </CardContent>
              </Card>
            </>
        }
    </MainContainer>
    )
};