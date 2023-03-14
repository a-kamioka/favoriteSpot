import { Marker, Popup, useMapEvents } from 'react-leaflet';
import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// type propType = {
//  location: LatLngLiteral;
//  setLocation: React.Dispatch<React.SetStateAction<LatLngLiteral>;
// };

/**
* 位置表示アイコン
* ・クリックした位置にアイコン表示する
*   ・クリックした位置を、親コンポーネント(App)へ通知する(state)し、その位置にMarkerを表示する
*/
const LocationMarker = ({ position, setPosition, onSelectedSpot, setStart }) => {

  const redIcon = Leaflet.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: iconShadow,
    iconAnchor: [12, 41], // アイコンのとがった位置をクリックした場所に合わせるためのオフセット
    popupAnchor: [0, -32], // ポップアップの位置も合わせて調整
  });

  useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
      setStart(e.latlng);
    },
  });

  return !position ? null : (
    <Marker position={position} icon={redIcon} eventHandlers={{click: (e) => {onSelectedSpot({"location": position})}}}>
      {/* <Popup><div>{location}</div></Popup> */}
    </Marker>
  );
};

export default LocationMarker;
