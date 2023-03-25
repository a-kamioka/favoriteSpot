import Control from 'react-leaflet-custom-control';
import { BiCurrentLocation } from 'react-icons/bi';
import { Box, IconButton } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

const GPS = ({ setPosition }) => {
    const iconSize = '30px';

    // 現在位置を取得してマップを移動する
    const onclick = () => {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setPosition({ lat: lat, lng: lng });
      });
    };
  
    return (
    //   <Control
    //     position="topleft"
    //     style={{ backgroundColor: '#FFF', height: iconSize }}
    //   >
    //     <BiCurrentLocation size={iconSize} onClick={() => onclick()} />
    //   </Control>
      <Control
        position="topleft"
        style={{ backgroundColor: '#FFF', height: iconSize }}
      >
        <Box sx={{ zIndex: '900', backgroundColor: '#fff' }}>
          <BiCurrentLocation size={iconSize} onClick={() => onclick()} />
          {/* <IconButton onClick={() => onclick()} >
            <GpsFixedIcon fontSize="small" />
          </IconButton> */}
        </Box>
      </Control>
    );
  };
  
  export default GPS;