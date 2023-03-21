import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { Box, Container, Button, TextField, Typography, Backdrop, CircularProgress, Switch, IconButton } from '@mui/material';
import { axiosClient } from '../hooks/axiosClient';
import { useAuth } from '../hooks/use-auth';
import Leaflet from 'leaflet'
import { useMap, LayerGroup, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import LayeredMap from './LayeredMap'
import LocationMarker from './LocationMarker';
import Entry from './Entry';
import MessageList from './MessageList';
import RoutingMachine from './RoutingMachine';
import CloseIcon from '@mui/icons-material/Close';

//マーカーのデフォルトアイコンを設定
let defaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41], // アイコンのとがった位置をクリックした場所に合わせるためのオフセット
  popupAnchor: [0, -32], // ポップアップの位置も合わせて調整
});
Leaflet.Marker.prototype.options.icon = defaultIcon;

function MapViewControl(prop) {
  const map = useMap()
  map.panTo(prop.position)
}

function View() {

  const { owner, accessToken } = useAuth();
  axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }
  })
  const location = useLocation();

  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  
  const [position, setPosition] = useState(location.state ? JSON.parse(location.state.position) :
  {
    lat: 35.13267449594266,
    lng: 137.11121003745856,
  });
  const [address, setAddress] = useState("")
  
  // Start-End points for the routing machine:
  const [endSpot, setEndSpot] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isRouting, setIsRouting] = useState(false);

  //住所検索
  const onSearch = async () => {
    //「国土地理院API」でキーワードから緯度・経度を含む住所情報を取得
    const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(address)}`
    const response = await fetch(url);
    const results = await response.json();

    if (Array.isArray(results) && results.length > 0) {
      //見つかった住所（施設）の位置を表示
      const coordinates = results[0].geometry.coordinates
      const answerPosition = {
          lat: coordinates[1],
          lng: coordinates[0]
        }
      // MapViewControl(position=answerPosition)
      setPosition(answerPosition)
    } else {
      alert("Not Found")
    }
  }

  // Mapの初期表示時、現在位置を表示する
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((e) => {
      const { latitude: lat, longitude: lng } = e.coords;
      setPosition({ lat: lat, lng: lng });
    });
  }, []);

  const getData = async () => {
    setIsLoading(true);
    // 初期化
    setIsRouting(false);
    document.getElementById("routingMenu").style.display = "none";
    // データ取得
    await axiosClient.get("/view")
    .then(res => setSpots(res.data))
    .catch(e => {
      alert("データの取得に失敗しました");
    })
    .finally(() => {
      setIsLoading(false);
      setIsModalOpen(false);
    })
  }
  useEffect(() => {
    getData();
  }, [])

  const onSelectedSpot = (spot) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setIsMessageOpen(false);
    setSelectedSpot([]);
  }

  const onRouteSearch = () => {
    if (start !== null && end !== null) {
      setIsRouting(true);
    } else {
      alert("地点設定が不正です");
    }
  }

  useEffect(() => {
    if (endSpot !== null) {
      setSpots([endSpot]);
      setEnd(JSON.parse(endSpot.location));
      setIsModalOpen(false);
      document.getElementById("routingMenu").style.display = "flex";
    }
  }, [endSpot])

  // 高さ調整
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Box id='searchBox' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '5px' }}>
        <TextField
          sx={{ width: '80%' }}
          size="small"
          label="住所"
          margin="normal"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          variant="outlined"
        />
        <Box>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            onClick={onSearch}
          >
            検索
          </Button>
        </Box>
        <Box id="routingMenu" sx={{ py: 1, display: 'none', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }} >
          <Typography>出発点にマーカーをセット</Typography>
          <Button
            size="small"
            type="submit"
            variant="contained"
            onClick={onRouteSearch}
          >
            ルート
          </Button>
          <Button
            size="small"
            type="submit"
            variant="contained"
            onClick={() => getData()}
          >
            解除
          </Button>
        </Box>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{ position: 'absolute', top: '10px', left: '50px', zIndex: '900', backgroundColor: '#fff' }}
        >
          <Switch
            checked={isOpen}
            onChange={() => setIsOpen(!isOpen)}
          />
        </Box>
        <LayeredMap center={position}>
          <LocationMarker position={position} setPosition={setPosition} onSelectedSpot={onSelectedSpot} setStart={setStart} />
          <MapViewControl position={position} />
          {isRouting && <RoutingMachine start={start} end={end} />}
          <LayerGroup>
            {
              spots.map((spot) => {
                return (
                  <Marker
                    position={JSON.parse(spot.location)}
                    key={spot.id} 
                    eventHandlers={{
                      click: (e) => {
                        setPosition(JSON.parse(spot.location));
                        onSelectedSpot(spot);
                      }
                    }}>
                    {isOpen ?
                    <Tooltip direction="top" offset={[1, -35]} opacity={1} permanent>{spot.store}</Tooltip>
                    : 
                    <Popup>
                      <div>
                        <p>{spot.store}</p>
                      </div>
                    </Popup>
                    }
                  </Marker>
                )
              })
            }
          </LayerGroup>
        </LayeredMap>
      </Box>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{ overlay: { zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }, content: { inset: 'auto', width: '90%', height: '90%', maxWidth: '500px', padding: '10px' } }}
      >
          {(!isMessageOpen) ?
            <Entry spot={selectedSpot} position={position} setIsLoading={setIsLoading} getData={getData} setEndSpot={setEndSpot} setIsMessageOpen={setIsMessageOpen} closeModal={closeModal} />
          :
            <MessageList id={selectedSpot.id} setIsLoading={setIsLoading} closeModal={closeModal} />
          }
      </Modal>
      <Backdrop
        sx={{ color: '#fff', zIndex: 1100 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default View;