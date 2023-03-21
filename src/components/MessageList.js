import { useState, useEffect } from 'react';
import { Box, Container, Drawer, List, TextField, IconButton, Backdrop, CircularProgress } from '@mui/material';
import MessageItem from './MessageItem';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import UpdateIcon from '@mui/icons-material/Update';
import { axiosClient } from '../hooks/axiosClient';
import { useAuth } from '../hooks/use-auth';

export default function MessageList({id, setIsLoading, closeModal}) {

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

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

  const onSendButtonClick = async () => {
    if (messageText !== '') {
      setIsLoading(true);
      await axiosClient.post("/message", {"id":id,"message":messageText,"user":username,"owner":owner,"type":"text"})
      .then(res => {
        getData();
        setMessageText('');
      })
      .catch(e => {
        alert("送信に失敗しました");
      });
      setIsLoading(false);
    } else {
      alert("メッセージが入力されていません")
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={getData} >
            <UpdateIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={closeModal} >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <List sx={{ width: '100%', height: '80%', overflow: 'scroll', bgcolor: 'background.paper' }}>
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
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
            variant="outlined"
            multiline
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