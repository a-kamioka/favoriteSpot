import { useState, useEffect, useRef } from 'react';
import { Box, Container, List, TextField, IconButton } from '@mui/material';
import MessageItem from './MessageItem';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import UpdateIcon from '@mui/icons-material/Update';
import { axiosClient } from '../hooks/axiosClient';
import { useAuth } from '../hooks/use-auth';

export default function MessageList({id, setIsLoading, closeModal}) {

  const [messages, setMessages] = useState([]);
  // const [messageText, setMessageText] = useState('');
  const messageText = useRef(null);

  const { username, owner, accessToken } = useAuth();
  axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }
  })

  const getData = async () => {
    setIsLoading(true);
    // データ取得
    const Params = {id:id}
    const queryParams = new URLSearchParams(Params).toString();
    await axiosClient.get(`/message?${queryParams}`)
    .then(res => setMessages(res.data))
    .catch(e => {
      alert("データの取得に失敗しました");
    })
    .finally(() => {
      setIsLoading(false);
    })
  }
  useEffect(() => {
    getData();
  }, [])

  // const onSendButtonClick = async () => {
  //   if (messageText !== '') {
  //     setIsLoading(true);
  //     await axiosClient.post("/message", {"id":id,"message":messageText,"user":username,"owner":owner,"type":"text"})
  //     .then(res => {
  //       getData();
  //       setMessageText('');
  //     })
  //     .catch(e => {
  //       alert("送信に失敗しました");
  //     });
  //     setIsLoading(false);
  //   } else {
  //     alert("メッセージが入力されていません")
  //   }
  // }

  const ws = useRef(null);
  const [status, setStatus] = useState("closed");
  useEffect(() => {
    // WebSocketと接続
    const Params = {idToken:accessToken, id:id}
    const queryParams = new URLSearchParams(Params).toString();
    ws.current = new WebSocket(
      `wss://faa8skz8c7.execute-api.ap-northeast-1.amazonaws.com/Prod?${queryParams}`
    );
    // 接続時の処理
    ws.current.onopen = () => {
      console.log("connected");
      setStatus("connected");
    };
    // 切断時の処理
    ws.current.onclose = () => {
      console.log("closed");
      setStatus("closed");
    };
    ws.current.onerror = () => {
      alert("通信エラー");
    };
    // WebSocketからメッセージ受信時処理
    ws.current.onmessage = (event) => {
      setMessages((current) => [...current, JSON.parse(event.data)]);
    };
    return () => {
      // アンマウント時に接続を切断
      if (ws.current !== null) ws.current.close();
    };
  }, []);

  const onSendButtonClick = () => {
    if (status === "connected") {
      if (messageText.current.value !== '') {
        ws.current.send(JSON.stringify({
          action: "sendMessage",
          data: JSON.stringify({id:id, message:messageText.current.value, user:username, owner:owner, type:"text"})
        }));
        // setMessageText('');
        messageText.current.value = '';
      } else {
        alert("メッセージが入力されていません")
      }
    } else {
      alert("サーバに接続されていません");
    }
  }

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexGrow: 1,
        height: '100%'
      }}
    >
      <Container>
        <Box sx={{ float: 'right' }}>
          <IconButton onClick={closeModal} >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <List sx={{ width: '100%', height: '80%', overflow: 'auto', bgcolor: 'background.paper' }}>
          {
            messages.map((item) => {
              return(<MessageItem item={item} />)
            })
          }
        </List>
        <Box id='searchBox' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '5px' }}>
          <TextField
            sx={{ width: '80%' }}
            size="small"
            label="メッセージを入力"
            margin="normal"
            name="address"
            // onChange={(e) => setMessageText(e.target.value)}
            // value={messageText}
            inputRef={messageText}
            variant="outlined"
            multiline
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSendButtonClick();
              }
            }}
          />
          <Box>
            <IconButton onClick={onSendButtonClick} >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}