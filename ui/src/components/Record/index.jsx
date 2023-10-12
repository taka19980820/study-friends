import React from 'react';
import Typography from '@mui/joy/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(...registerables, ChartDataLabels);
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import * as RestAccess from '../../utils/RestAccess';
import * as dateTimeHandler from '../../utils/dateTimeHandler'
import { useSnackbar } from '@/context/SnackbarContext';
import { useRouter } from 'next/router';

const initialEndDate = new Date();
const initialStartDate = new Date();
initialStartDate.setDate(initialEndDate.getDate() - 6); 

export default function Record({ userId }) {
    const { showSnackbar } = useSnackbar();
    const router = useRouter();
    const [ studyTime, setStudyTime ] = React.useState({});
    const [ dailyData, setDailyData ] = React.useState({
        labels:[],
        datasets:[]
    });
    const [ weeklyData, setWeeklyData ] = React.useState({
        labels:[],
        datasets:[]
    });
    const [ monthlyData, setMonthlyData ] = React.useState({
        labels:[],
        datasets:[]
    });
    const [ display, setDisplay ] = React.useState(false);
    const [fontSize, setFontSize] = React.useState(14);
    const [value, setValue] = React.useState('1');
    const [startDate, setStartDate] = React.useState(initialStartDate);
    const [endDate, setEndDate] = React.useState(initialEndDate);

    React.useEffect(() => {
        const getAllData = async () => {
            //勉強時間取得
            const studyTime = await RestAccess.get('/users/' + userId + '/study-hours');
            //日別勉強時間（グラフ用データ）
            const dailyData = await RestAccess.get('/users/' + userId + '/study-hours/daily');
            if(studyTime.status == 200 && dailyData.status == 200) {
                //グラフ用データ作成
                const newData = {};
                const lastWeekDates = getLastWeekDates(endDate);
                newData.datasets = [...dailyData.data];
                newData.labels = lastWeekDates;
                setStudyTime(studyTime.data);
                setDailyData(newData);
                setDisplay(true);
            } else {
                showSnackbar('データ取得に失敗しました', 'error');
                router.push('/');
                return null;

            }
        }
        //グラフ文字サイズ関連
        const updateFontSize = () => {
            const width = window.innerWidth;
            setFontSize(width < 480 ? 8 : 12);
        };
        // 初回レンダリング時にフォントサイズを更新
        updateFontSize();
        // ウィンドウのリサイズ時にフォントサイズを更新
        window.addEventListener('resize', updateFontSize);
        getAllData();

        // クリーンアップ関数
        return () => {
            window.removeEventListener('resize', updateFontSize);
        };
    }, []);

    //一週間分の日付取得
    function getLastWeekDates(date) {
        let dates = [];
        for (let i = 6; i >= 0; i--) {
            let tempDate = new Date(date);
            tempDate.setDate(date.getDate() - i);
            
            // 日付のみを取得するために、時、分、秒、ミリ秒を0にリセット
            tempDate.setHours(0, 0, 0, 0);
            
            dates.push(formatDate(tempDate, 'MMDD'));
        }
        return dates;
    }

    //過去7週を取得
    const getLastSevenWeekDates = (date) => {
        let dates = [];
        for(let i = 0; i < 7; i++) {
            let addDate = 7 * i;
            let tempDate = new Date(date);
            tempDate.setDate(date.getDate() + addDate);
            // 日付のみを取得するために、時、分、秒、ミリ秒を0にリセット
            tempDate.setHours(0, 0, 0, 0);
            dates.push(formatDate(tempDate, 'MMDD'));
        }

        return dates;
    }

    //過去半年の年月を取得
    const getLastHaflYearMonth = (date) => {
        let yearMonths = [];
        for(let i = 0; i < 7; i++) {
            let tempDate = new Date(date);
            tempDate.setMonth(tempDate.getMonth() + i)
            yearMonths.push(formatDate(tempDate, 'YYYYMM'));
        }
        return yearMonths;
    }

    // タブ切り替え
    const handleChange = async (event, newValue) => {
        const newStartDate = new Date();
        const newEndDate = new Date();
        const newData = {};
        switch(newValue) {
            case '1':
                //日別表示
                //日別勉強時間（グラフ用データ）
                newStartDate.setDate(newEndDate.getDate() - 6);
                const dailyData = await RestAccess.get('/users/' + userId + '/study-hours/daily', {params: {
                    start: dateTimeHandler.formatDate(newStartDate, 'YYYY-MM-DD'),
                    end: dateTimeHandler.formatDate(newEndDate, 'YYYY-MM-DD')
                }});
                if(dailyData.status == 200) {
                    newData.datasets = [...dailyData.data];
                    newData.labels = getLastWeekDates(newEndDate);
                    setDailyData(newData);
                    setStartDate(newStartDate)
                    setEndDate(newEndDate)
                } else {
                    //todo:エラーをstateで管理して、エラー表示する。
                    console.log('error')
                }
                break;
            case '2':
                //週別表示
                //週別勉強時間（グラフ用データ）
                const startOfWeek = getStartOfWeek(new Date());
                const endOfWeek = getEndOfWeek(new Date());
                const sd = new Date(startOfWeek);
                sd.setDate(startOfWeek.getDate() - 42);
                // newStartDate.setDate(startOfWeek.getDate() - 42);
                const weeklyData = await RestAccess.get('/users/' + userId + '/study-hours/weekly', {params: {
                    end: dateTimeHandler.formatDate(newEndDate,'YYYY-MM-DD')
                }});
                if(weeklyData.status === 200) {
                    newData.datasets = [...weeklyData.data];
                    newData.labels = getLastSevenWeekDates(sd);
                    setWeeklyData(newData);
                    setStartDate(sd);
                    setEndDate(endOfWeek);
                } else {
                    //todo:エラーをstateで管理して、エラー表示する。
                    console.log('error')
                }
                break;
            case '3':
                //月別表示
                //月別勉強時間（グラフ用データ）
                const startOfMonth = getStartOfMonth(newEndDate);
                const sixMonthAgo = new Date(startOfMonth);
                sixMonthAgo.setMonth(startOfMonth.getMonth() - 6);
                const monthlyData = await RestAccess.get('/users/' + userId + '/study-hours/monthly', {params: {
                    end: dateTimeHandler.formatDate(newEndDate,'YYYY-MM')
                }});
                if(monthlyData.status === 200) {
                    newData.datasets = [...monthlyData.data];
                    newData.labels = getLastHaflYearMonth(sixMonthAgo);
                    setMonthlyData(newData);
                    setStartDate(sixMonthAgo);
                    setEndDate(startOfMonth);
                } else {
                    console.log('error')
                }
                break;
        }
        setValue(newValue);
    };

    //日付のフォーマット
    const formatDate = (date, format = 'YYYYMMDD') => {
        const year = date.getFullYear();
        // getMonth() は 0 から始まるため、1 を加算
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const options = {};
        switch(format) {
            case 'MMDD':
                return `${month}/${day}`;
            case 'YYYYMM':
                return `${year}/${month}`;
            default:
                return `${year}/${month}/${day}`;
        }
    };

    //現在の日付から週の初めを取得する
    function getStartOfWeek(date) {
        let dayOfWeek = date.getDay(); 
        let offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
        let startDate = new Date(date);
        startDate.setDate(date.getDate() - offset);
        startDate.setHours(0, 0, 0, 0);
        return startDate;
    }

    function getEndOfWeek(date) {
        let dayOfWeek = date.getDay();
        let offset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        let endDate = new Date(date);
        endDate.setDate(date.getDate() + offset);
        endDate.setHours(23, 59, 59, 999);
        return endDate;
    }

    //現在の日付から 月初めを取得する
    function getStartOfMonth(date) {
        let newDate = new Date(date);
        newDate.setDate(1);
        return newDate;
    }

    //月切り替え
    const handlePrevMonth = async () => {
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        newStartDate.setMonth(startDate.getMonth() - 1);
        newEndDate.setMonth(endDate.getMonth() - 1);
        const newData = {};

        const monthlyData = await RestAccess.get('/users/' + userId + '/study-hours/monthly', {params: {
            end: dateTimeHandler.formatDate(newEndDate,'YYYY-MM')
        }});

        if(monthlyData.status === 200) {
            newData.datasets = [...monthlyData.data];
            newData.labels = getLastHaflYearMonth(newStartDate);
            setMonthlyData(newData);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
        } else {
            console.log('error')
        }

    }

    const handleNextMonth = async () => {
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        newStartDate.setMonth(startDate.getMonth() + 1);
        newEndDate.setMonth(endDate.getMonth() + 1);
        const newData = {};

        const monthlyData = await RestAccess.get('/users/' + userId + '/study-hours/monthly', {params: {
            end: dateTimeHandler.formatDate(newEndDate,'YYYY-MM')
        }});

        if(monthlyData.status === 200) {
            newData.datasets = [...monthlyData.data];
            newData.labels = getLastHaflYearMonth(newStartDate);
            setMonthlyData(newData);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
        } else {
            console.log('error')
        }
    }
    
    //週切り替え
    const handlePrevWeek = async () => {
        const newEndDate = new Date(endDate);
        newEndDate.setDate(endDate.getDate() - 7);
        const startOfWeek = getStartOfWeek(newEndDate);
        const newStartDate = new Date(startOfWeek);
        newStartDate.setDate(startOfWeek.getDate() - 7 * 6);
        const newData = {};

        const weeklyData = await RestAccess.get('/users/' + userId + '/study-hours/weekly', {params: {
            end: dateTimeHandler.formatDate(newEndDate,'YYYY-MM-DD')
        }});
        if(weeklyData.status === 200) {
            newData.datasets = [...weeklyData.data];
            newData.labels = getLastSevenWeekDates(newStartDate);
            setWeeklyData(newData);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
        } else {
            console.log('error')
        }
    }

    const handleNextWeek = async () => {
        const newEndDate = new Date(endDate);
        newEndDate.setDate(endDate.getDate() + 7);
        const startOfWeek = getStartOfWeek(newEndDate);
        const newStartDate = new Date(startOfWeek);
        newStartDate.setDate(startOfWeek.getDate() - 7 * 6);
        const newData = {};

        const weeklyData = await RestAccess.get('/users/' + userId + '/study-hours/weekly', {params: {
            end: dateTimeHandler.formatDate(newEndDate,'YYYY-MM-DD')
        }});
        if(weeklyData.status === 200) {
            newData.datasets = [...weeklyData.data];
            newData.labels = getLastSevenWeekDates(newStartDate);
            setWeeklyData(newData);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
        } else {
            console.log('error')
        }
    }

    //日切り替え
    const handlePrevDate = async () => {
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        newStartDate.setDate(startDate.getDate() - 1);
        newEndDate.setDate(endDate.getDate() - 1)
        const newData = {};

        const dailyData = await RestAccess.get('/users/' + userId + '/study-hours/daily', {params: {
            start: dateTimeHandler.formatDate(newStartDate, 'YYYY-MM-DD'),
            end: dateTimeHandler.formatDate(newEndDate, 'YYYY-MM-DD')
        }});
        if(dailyData.status == 200) {
            newData.datasets = [...dailyData.data];
            newData.labels = getLastWeekDates(newEndDate);
            setDailyData(newData);
            setStartDate(newStartDate)
            setEndDate(newEndDate)
        } else {
            console.log('error')
        }
    }

    const handleNextDate = async () => {
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        newStartDate.setDate(startDate.getDate() + 1);
        newEndDate.setDate(endDate.getDate() + 1)
        const newData = {};

        const dailyData = await RestAccess.get('/users/' + userId + '/study-hours/daily', {params: {
            start: dateTimeHandler.formatDate(newStartDate, 'YYYY-MM-DD'),
            end: dateTimeHandler.formatDate(newEndDate, 'YYYY-MM-DD')
        }});
        if(dailyData.status == 200) {
            newData.datasets = [...dailyData.data];
            newData.labels = getLastWeekDates(newEndDate);
            setDailyData(newData);
            setStartDate(newStartDate)
            setEndDate(newEndDate)
        } else {
            console.log('error')
        }
    }

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
                fontSize: fontSize
            }
          },
          y: {
            beginAtZero: true,
            stacked: true,
            ticks: {
              display: false,
            }
            // max: maxYValue + (0.1 * maxYValue)
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function() {
                return '';
              },
              label: function (context) {
                const label = context.dataset.label;
                if(label === 'Total') {
                    return '';
                }
                const value = context.raw;
                if (value < 60) {
                  return label + ': ' + value + '分';
                } else {
                  const hours = Math.floor(value / 60);
                  const minutes = value % 60;
                  return label + ': ' + hours + '時間' + minutes + '分';
                }
              },
            },
          },
          datalabels: {
            display: function(context) {
                return context.datasetIndex === context.chart.data.datasets.length - 1;
            },
            formatter: function(value, context) {
                let total = 0;
                for (let dataset of context.chart.data.datasets) {
                    total += dataset.data[context.dataIndex];
                }
                return total < 60 ? total + 'm' : Math.floor(total / 60) + 'h' + (total % 60) + 'm'; 
            },
            color: '#000',
            align: 'end',
            anchor: 'end',
            offset: -7,
            font: {
                size: fontSize
            }
          },
        },
    }

  return  (
    <>
        <h2 style={{ marginBottom: '10px'}}>勉強時間</h2>
        { display && 
            <React.Fragment>
                <Card>
                    <CardContent>
                        <Grid container sx={{ justifyContent: 'space-around' }}>
                            <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                <Box>
                                    <Typography>今日</Typography>
                                    <Typography>{dateTimeHandler.formatTime(studyTime.today_hours)}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                <Box>
                                    <Typography>今月</Typography>
                                    <Typography>{dateTimeHandler.formatTime(studyTime.month_hours)}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                <Box>
                                    <Typography>総合</Typography>
                                    <Typography>{dateTimeHandler.formatTime(studyTime.totalHours)}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                
                <Box sx={{ width: '100%', typography: 'body1', mt: 2 }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="日" value="1" />
                            <Tab label="週" value="2" />
                            <Tab label="月" value="3" />
                        </TabList>
                        </Box>

                        
                        {/* 日別 */}
                        <TabPanel value="1" sx={{ p: 0 }}>
                            <Card>
                                <CardContent>
                                    <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Button onClick={handlePrevDate}>
                                            <ChevronLeftIcon />
                                        </Button>
                                    <Typography>{formatDate(startDate) + ' 〜 ' + formatDate(endDate)}</Typography>
                                    <Button onClick={handleNextDate}>
                                            <ChevronRightIcon />
                                    </Button>
                                    </Stack>
                                        <Box sx={{ width: '100%', height: '300px'}}>
                                            <Bar data={dailyData} options={options} />
                                        </Box>
                                    
                                    {/* <Bar data={data} options={options} /> */}
                                </CardContent>
                            </Card>                       
                        </TabPanel>
                        {/* 週別 */}
                        <TabPanel value="2" sx={{ p: 0 }}>
                            <Card>
                                <CardContent>
                                    <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Button onClick={handlePrevWeek}>
                                            <ChevronLeftIcon />
                                        </Button>
                                    <Typography>{formatDate(startDate) + ' 〜 ' + formatDate(endDate)}</Typography>
                                    <Button onClick={handleNextWeek}>
                                            <ChevronRightIcon />
                                    </Button>
                                    </Stack>
                                        <Box sx={{ width: '100%', height: '300px'}}>
                                            <Bar data={weeklyData} options={options} />
                                        </Box>
                                    {/* <Bar data={data} options={options} /> */}
                                </CardContent>
                            </Card>
                        </TabPanel>
                        {/* 月別 */}
                        <TabPanel value="3" sx={{ p: 0 }}>
                            <Card>
                                <CardContent>
                                    <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Button onClick={handlePrevMonth}>
                                            <ChevronLeftIcon />
                                        </Button>
                                    <Typography>{formatDate(startDate, 'YYYYMM') + ' 〜 ' + formatDate(endDate, 'YYYYMM')}</Typography>
                                    <Button onClick={handleNextMonth}>
                                            <ChevronRightIcon />
                                    </Button>
                                    </Stack>
                                        <Box sx={{ width: '100%', height: '300px'}}>
                                            <Bar data={monthlyData} options={options} />
                                        </Box>
                                    {/* <Bar data={data} options={options} /> */}
                                </CardContent>
                            </Card>             
                        </TabPanel>
                        
                    </TabContext>
                </Box>
            </React.Fragment>
        }
    </>
    )
};