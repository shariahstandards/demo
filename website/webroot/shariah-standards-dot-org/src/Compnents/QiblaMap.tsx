import React, { useEffect, useMemo, useState } from 'react'
import { GoogleMap } from '@react-google-maps/api';
import { MapLocation } from '../Services/PrayerTimesProperies';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: "100%"
};


export const QiblaMap = (props: {
  mapLocation: MapLocation,
  onNewLocationFound: (response: MapLocation) => void
}) => {

  const [map, setMap] = React.useState<google.maps.Map | null>(null)
  const [mapCentre, setMapCenter] = useState<google.maps.LatLng | undefined>()
 // const [qibla,setQibla] = useState<google.maps.Polyline |undefined>();
  
  const onLoad = React.useCallback((mapLoaded: google.maps.Map) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(mapCentre);
    // map.fitBounds(bounds);

    setMap(mapLoaded)
   
  }, [])
  var qiblaLine =  useMemo(()=>{return new google.maps.Polyline({
    strokeColor: '#ff0000',
    strokeWeight: 2,
    strokeOpacity: 1,
    geodesic: true
  })},[]);
  if(map){
    var newQiblaPath = [
      { lat:props.mapLocation.latitude, lng:props.mapLocation.longitude},
      { lat:21.422441833015604, lng:39.82616901397705}
    ];
    qiblaLine.setPath(newQiblaPath);
    qiblaLine.setMap(map);
  }
  const onUnmount = React.useCallback((map: google.maps.Map) => {
    setMap(null)
  }, [])
  useEffect(() => {
    if (props.mapLocation) {
      setMapCenter(
        new google.maps.LatLng(props.mapLocation.latitude, props.mapLocation.longitude));
    }
  }, [props.mapLocation])
  
  const onClick = React.useCallback(async (mousemapEvent: google.maps.MapMouseEvent) => {
    qiblaLine.setMap(null);
    var geocoder = new google.maps.Geocoder();
    var response = await geocoder.geocode({ 'location': mousemapEvent.latLng });
    if (response.results.length > 0) {
      var topResult = response.results[0];
      var newMapLocation = {
        latitude: topResult.geometry.location.lat(),
        longitude: topResult.geometry.location.lng(),
        locationName: topResult.formatted_address
      };
      props.onNewLocationFound(newMapLocation);
    }
  }, [props,qiblaLine]);


  return (
    <>
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={{ width: "80%", height: "500px" }}
          center={mapCentre}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onClick}
        >
        </GoogleMap>
      </div>

    </>
  );
} 
