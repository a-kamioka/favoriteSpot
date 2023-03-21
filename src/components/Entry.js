import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, IconButton } from '@mui/material';
import { axiosClient } from '../hooks/axiosClient';
import axios from 'axios';
import { useAuth } from '../hooks/use-auth';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';

const Entry = ({spot, position, setIsLoading, getData, setEndSpot, setIsMessageOpen, closeModal}) => {

  const { username, owner, accessToken } = useAuth();
  axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }
  })

  const [entryMode, setEntryMode] = useState(spot.id ? "update" : "create");
  const [dataId, setDataId] = useState(spot.id ? spot.id : 0);
  const [user, setUser] = useState(spot.id ? spot.user : username);
  const [store, setStore] = useState(spot.id ? spot.store : []);
  const [category, setCategory] = useState(spot.id ? spot.category : []);
  const [comment, setComment] = useState(spot.id ? spot.comment : []);
  const [msgCount, setMsgCount] = useState(spot.id ? spot.msgCount : 0);
  const [imgPath, setImgPath] = useState(spot.id ? `/images/${spot.id}.png` : "#");

  const [selectedFile, setSelectedFile] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onFileInputChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setIsSelected(true);
    await convertBase64(file)
    .then(data => setImgPath(data))
    .then(document.getElementById("photo").style.display = "block");
  }

  useEffect(() => {
    if (owner === spot.owner) {
      setIsModify(true);
      setIsDelete(true);
    } else if (!dataId) {
      setIsModify(true);
      setIsDelete(false);
    }
  }, [])

  const onButtonClick = async () => {
    if (user.length > 0 && store.length > 0 && category.length > 0) {
      if (user.length < 21 && store.length <= 20 && category.length <= 20 && comment.length <= 50 ) {
        setIsLoading(true);
        await axiosClient.post("/entry", {"mode": entryMode, "data": {"id":dataId, "owner":owner, "user":user, "store":store, "category":category, "comment":comment, "location":position, "msgCount":msgCount}})
        .then(res => {
          if (isSelected) { axios.put(res.data.url, selectedFile) };
          alert("登録しました");
          getData();
        })
        .catch((e) => {
          setIsLoading(false);
          alert("登録に失敗しました");
        })
      } else {
        alert("文字数が多すぎます")
      }
    } else {
      alert("値が入力されていません")
    };
  }

  const onDeleteButtonClick = async () => {
    let checkDeleteFlag = window.confirm("削除しますか？")
    if (checkDeleteFlag) {
      setIsLoading(true);
      await axiosClient.post("/entry", {"mode": "delete", "data": {"id":spot.id}})
      .then(res => {
        alert("削除しました");
        getData();
      })
      .catch(e => {
        alert("削除に失敗しました");
      });
      setIsLoading(false);
    }
  }

  const onRoutingButtonClick = () => {
    setEndSpot(spot);
  }

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexGrow: 1,
      }}
    >
      <Container>
        <Box sx={{ float: 'right' }}>
          <IconButton onClick={closeModal} >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          size="small"
          label="登録者"
          margin="normal"
          name="user"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          variant="outlined"
          InputProps={{
            readOnly: true
          }}
          inputProps={{
            maxLength: 20
          }}
        />
        <TextField
          fullWidth
          size="small"
          label="店舗名"
          margin="normal"
          name="store"
          onChange={(e) => setStore(e.target.value)}
          value={store}
          variant="outlined"
          InputProps={{
            readOnly: (!isModify)
          }}
          inputProps={{
            maxLength: 20
          }}
        />
        <TextField
          fullWidth
          size="small"
          label="カテゴリ"
          margin="normal"
          name="store"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          variant="outlined"
          InputProps={{
            readOnly: (!isModify)
          }}
          inputProps={{
            maxLength: 20
          }}
        />
        <TextField
          fullWidth
          size="small"
          label="コメント"
          margin="normal"
          name="comment"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          variant="outlined"
          InputProps={{
            readOnly: (!isModify)
          }}
          inputProps={{
            maxLength: 50
          }}
          multiline
        />
        <TextField
          fullWidth
          size="small"
          label="写真"
          margin="normal"
          name="image"
          onChange={onFileInputChange}
          type="file"
          InputLabelProps={{
            shrink: true
          }}
          disabled={(!isModify)}
          accept="image"
          variant="outlined"
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img id="photo" className="photo" src={imgPath} onError={e => e.target.style.display = 'none'} />
          {/* <img className="photo" src={imgPath} /> */}
        </Box>
        {(dataId) ?
        <Box sx={{ float: 'right' }}>
          {msgCount}
          <IconButton onClick={() => setIsMessageOpen(true)} >
            <CommentIcon fontSize="small" />
          </IconButton>
        </Box>
        : <></> }
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px'}}
          >
          <Button
            sx={{ width: '45%' }}
            disabled={!(isModify)}
            type="submit"
            variant="contained"
            onClick={onButtonClick}
          >
            登録
          </Button>
          <Box sx={{ width: '10%' }}></Box>
          <Button
            sx={{ width: '45%' }}
            color="error"
            disabled={!(isDelete)}
            type="submit"
            variant="contained"
            onClick={onDeleteButtonClick}
          >
            削除
          </Button>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px'}}
          >
          <Button
            sx={{ width: '45%' }}
            color="warning"
            type="submit"
            variant="contained"
            onClick={onRoutingButtonClick}
          >
            経路
          </Button>
          <Box sx={{ width: '10%' }}></Box>
          <Button
            sx={{ width: '45%' }}
            color="warning"
            type="submit"
            variant="contained"
            onClick={() => {window.location.replace(`https://www.google.co.jp/maps?q=${position.lat},${position.lng}`)}}
          >
            外部MAP
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Entry;