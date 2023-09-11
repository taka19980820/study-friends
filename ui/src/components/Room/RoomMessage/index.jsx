// Main.js
import React from 'react';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar } from '../../../context/SnackbarContext';
import Cookies from 'js-cookie';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
// import echo from '../../../utils/EchoSetup';



export default function RoomMessage({ roomId, authUser, msg }) {
    const messageContainerRef = React.useRef(null);
    

    const { showSnackbar } = useSnackbar(); 
    const [ display, setDisplay ] = React.useState(false);
    const [ messages, setMessages ] = React.useState([...msg])

    React.useEffect(() => {
        const MESSAGE_EVENT = 'sent-message';
        const MESSAGE_EVENT_CHANNEL = 'private-room.' + roomId;
        const PUSHER_APP_KEY = "2d0958b5739e78badb9f";
        const PUSHER_APP_CLUSTER = "ap3";
        const csrfToken = Cookies.get('XSRF-TOKEN');
        const pusher = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_APP_CLUSTER,
            authEndpoint: '/api/broadcasting/auth',
            auth: {
                headers: {
                    "X-XSRF-TOKEN": decodeURIComponent(csrfToken),
                    "Accept": "application/json",
                }
            }
        });
    
        const channel = pusher.subscribe(MESSAGE_EVENT_CHANNEL);
        channel.bind(MESSAGE_EVENT, function(data) {
            setMessages(prevMessages => [...prevMessages, data.message]);  // 以前のメッセージに新しいメッセージを追加
        });
    
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages])

    // 日付と時刻のフォーマット
    const formatDate = (date) => {
        const currentDate = new Date();
        if (date.toDateString() === currentDate.toDateString()) {
        return '今日';
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ja-JP', options);
    };

    const formatTime = (date) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return date.toLocaleTimeString('ja-JP', options);
    };

    // 日付のフォーマットをチェックし、新しい日付の場合に日付要素を表示
    let prevDate = null;
    const messageElements = messages.map((message, index) => {
        const messageDate = new Date(message.created_at);
        let renderMessageDate = null;

        if (messageDate.toDateString() !== prevDate) {
        prevDate = messageDate.toDateString();
        renderMessageDate = 
            <div
                key={`date-${index}`}
                style={{
                    textAlign: 'center',
                    margin: '8px 0',
                    color: '#888',
                }}
                suppressHydrationWarning={true}
            >
                {formatDate(messageDate)}
            </div>
        }

    return (
        <React.Fragment key={index}>
            {renderMessageDate != null && renderMessageDate}
            <div
            style={{
                display: 'flex',
                justifyContent: message.user_id === authUser.id ? 'flex-end' : 'flex-start',
                alignItems: 'center',
            }}
            >
            {message.user_id !== authUser.id && (
                <Avatar sx={{ bgcolor: red[500], mr: 1 }} aria-label="recipe">
                    {message.user.name.slice(0,1)}
                </Avatar>
            )}
            <div
                style={{
                backgroundColor: message.user_id === authUser.id ? '#2196F3' : '#E0E0E0',
                color: message.user_id === authUser.id ? 'white' : 'black',
                padding: '8px 12px',
                borderRadius: '8px',
                maxWidth: '70%',
                alignSelf: message.user_id === authUser.id ? 'flex-end' : 'flex-start',
                marginLeft: message.user_id !== authUser.id ? '8px' : '0',
                }}
            >
                {message.user_id !== authUser.id && (
                    <div
                    style={{
                        fontSize: '10px',
                        marginBottom: '4px',
                        color: 'black',
                    }}
                    >
                    {message.user.name} {/* 名前を表示 */}
                    </div>
                )}
                <div>{message.message}</div>
                <div
                style={{
                    fontSize: '10px',
                    marginTop: '4px',
                    color: message.user_id === authUser.id ? 'white' : '#888'
                }}
                >
                {formatTime(messageDate)}
                </div>
            </div>
            </div>
        </React.Fragment>
      );
    });

    const [ newMessage, setNewMessage ] = React.useState('');
    const handleSend = async () => {
        if (newMessage.trim() !== '') {
            const response = await RestAccess.post('/rooms/' + roomId + '/messages', {message: newMessage});
            if(response.status === 200) {
                setNewMessage('');
            } else {
                showSnackbar('メッセージを送信できませんでした。', 'error');
            }
        }
    };

  return  (
    <>
        <Paper elevation={3} style={{ height: '400px', padding: 10, maxHeight: '400px', overflowY: 'auto' }} ref={messageContainerRef}>
            <Stack spacing={2}>
                {messageElements}
            </Stack>
        </Paper>
        <TextField
            label="メッセージ"
            variant="outlined"
            fullWidth
            id="newMessage"
            name="newMessage"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
            }}
            style={{ marginTop: 20 }}
        />
        <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            style={{ marginTop: 10 }}
        >
            送信
        </Button>
    
    </>
    )
};