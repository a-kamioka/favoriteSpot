import Leaflet from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

/**
 * ルート表示用のコントール
 */
const createRoutineMachineLayer = props => {
  console.log(props);
  const instance = Leaflet.Routing.control({
    waypoints: [
      props.start, props.end
    ],
    lineOptions: {
      styles: [
        {
          color: "blue",
          opacity: 0.6,
          weight: 4
        },
      ],
      extendToWaypoints: true,
      missingRouteTolerance: 1,
    }
  });
  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
