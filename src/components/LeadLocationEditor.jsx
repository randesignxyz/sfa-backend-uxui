import React,{useEffect,useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {validLocation} from './LeadMap';

export default function LeadLocationEditor({latitude,longitude,onChange}){
 const element=useRef(null),mapRef=useRef(null),markerRef=useRef(null),changeRef=useRef(onChange);
 changeRef.current=onChange;
 useEffect(()=>{
  const map=L.map(element.current,{scrollWheelZoom:false}).setView([11.6032772,104.9006628],13);mapRef.current=map;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
  map.on('click',event=>changeRef.current({latitude:Number(event.latlng.lat.toFixed(7)),longitude:Number(event.latlng.lng.toFixed(7))}));
  const observer=new ResizeObserver(()=>map.invalidateSize());observer.observe(element.current);
  return ()=>{observer.disconnect();map.remove();mapRef.current=null;markerRef.current=null};
 },[]);
 useEffect(()=>{
  const map=mapRef.current;if(!map)return;
  if(!validLocation({latitude,longitude})){if(markerRef.current){map.removeLayer(markerRef.current);markerRef.current=null}return}
  const position=L.latLng(Number(latitude),Number(longitude));
  if(!markerRef.current){
   const icon=L.divIcon({className:'customer-map-pin-wrapper',html:'<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15 1C7.3 1 1 7.3 1 15c0 10 14 24 14 24s14-14 14-24C29 7.3 22.7 1 15 1Z" fill="#B49A00" stroke="white" stroke-width="2"/><circle cx="15" cy="14" r="5" fill="white"/></svg>',iconSize:[30,40],iconAnchor:[15,40]});
   markerRef.current=L.marker(position,{icon,draggable:true,alt:'Drag to set customer location',title:'Drag to update location'}).addTo(map);
   markerRef.current.on('dragend',()=>{const point=markerRef.current.getLatLng();changeRef.current({latitude:Number(point.lat.toFixed(7)),longitude:Number(point.lng.toFixed(7))})});
  }else markerRef.current.setLatLng(position);
  if(!map.getBounds().contains(position))map.panTo(position);else if(map.getZoom()<14)map.setView(position,15);
 },[latitude,longitude]);
 return <div ref={element} className="lead-edit-map" role="region" aria-label="Edit customer location map"/>;
}
