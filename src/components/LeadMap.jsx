import {findLeadDuplicates} from '../utils/leadDuplicates';
import React,{useEffect,useRef,useState} from 'react';
import {Slider,Space,Switch,Typography} from 'antd';
import {EnvironmentOutlined} from '@ant-design/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export const validLocation=shop=>[shop.latitude,shop.longitude].every(value=>value!==null&&value!==undefined&&String(value).trim()!==''&&Number.isFinite(Number(value)))&&Math.abs(Number(shop.latitude))<=90&&Math.abs(Number(shop.longitude))<=180;
export function nearbyShops(lead,shops,radius=5000){
 if(!validLocation(lead))return [];
 const origin=L.latLng(Number(lead.latitude),Number(lead.longitude));
 return shops.filter(shop=>shop.id!==lead.id&&validLocation(shop)).map(shop=>({...shop,distance:origin.distanceTo(L.latLng(Number(shop.latitude),Number(shop.longitude)))})).filter(shop=>shop.distance<=radius).sort((a,b)=>a.distance-b.distance);
}
export default function LeadMap({lead,shops=[]}){
 const [nearby,setNearby]=useState(false);const [radiusKm,setRadiusKm]=useState(5);const node=useRef(null);const matches=nearbyShops(lead,shops,radiusKm*1000);
 const duplicateIds=new Set(findLeadDuplicates(lead,shops).map(shop=>shop.id));
 const isDuplicate=shop=>shop.id===lead.id?duplicateIds.size>0:duplicateIds.has(shop.id);
 const duplicateCount=matches.filter(isDuplicate).length;
 useEffect(()=>{
  const center=[Number(lead.latitude),Number(lead.longitude)];
  const map=L.map(node.current,{scrollWheelZoom:false}).setView(center,14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
  L.control.scale({imperial:false,position:'bottomleft'}).addTo(map);
  const popup=(shop,current=false)=>{
   const box=document.createElement('div');box.className='customer-map-card';
   const eyebrow=document.createElement('div');eyebrow.className='customer-map-card__eyebrow';eyebrow.textContent=current?'Current customer':`${Math.round(shop.distance).toLocaleString()} m away`;box.append(eyebrow);
   const name=document.createElement('h4');name.textContent=shop.shop;box.append(name);
   const code=document.createElement('div');code.className='customer-map-card__code';code.textContent=`Prospect ${shop.customerId||shop.code}`;box.append(code);
   const status=document.createElement('span');status.className='customer-map-card__status';status.textContent=shop.status;const palette={Approved:['#23764A','#EAF7EF'],Pending:['#8A6016','#FFF5DE'],Rejected:['#B33A3A','#FDEDEC'],Deactivated:['#626975','#F0F1F3']}[shop.status]||['#626975','#F0F1F3'];status.style.color=palette[0];status.style.background=palette[1];box.append(status);
   const contact=document.createElement('div');contact.className='customer-map-card__contact';const label=document.createElement('span');label.textContent='Phone';contact.append(label);const phone=document.createElement(shop.phone?'a':'span');phone.textContent=shop.phone||'Not provided';if(shop.phone)phone.href=`tel:${shop.phone.replace(/[^+0-9]/g,'')}`;contact.append(phone);box.append(contact);
   if(isDuplicate(shop)){const warning=document.createElement('div');warning.className='customer-map-card__warning';const title=document.createElement('strong');title.textContent='Possible duplicate';const reason=document.createElement('span');reason.textContent=current?'Name and phone match another lead.':'Name and phone match the current lead.';warning.append(title,reason);box.append(warning)}
   return box;
  };
  const pinIcon=(current,duplicate=false)=>L.divIcon({className:'customer-map-pin-wrapper',html:`<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15 1C7.3 1 1 7.3 1 15c0 10 14 24 14 24s14-14 14-24C29 7.3 22.7 1 15 1Z" fill="${current?'#B49A00':duplicate?'#B33A3A':'#1677ff'}" stroke="white" stroke-width="2"/><circle cx="15" cy="14" r="5" fill="white"/></svg>`,iconSize:[30,40],iconAnchor:[15,40],popupAnchor:[0,-36]});
  const current=L.marker(center,{icon:pinIcon(true),title:lead.shop,alt:`Current customer: ${lead.shop}`}).addTo(map).bindPopup(popup(lead,true),{className:'customer-map-popup',minWidth:240,maxWidth:280});
  if(nearby){const area=L.circle(center,{radius:radiusKm*1000,color:'#B49A00',weight:1,fillOpacity:.04}).addTo(map);matches.forEach(shop=>L.marker([Number(shop.latitude),Number(shop.longitude)],{icon:pinIcon(false,isDuplicate(shop)),title:`${shop.shop}${isDuplicate(shop)?' · Possible duplicate':''}`,alt:`${isDuplicate(shop)?'Duplicate':'Nearby'} customer: ${shop.shop}`}).addTo(map).bindPopup(popup(shop),{className:'customer-map-popup',minWidth:240,maxWidth:280}));map.fitBounds(area.getBounds(),{padding:[24,24]})}
  const observer=new ResizeObserver(()=>map.invalidateSize());observer.observe(node.current);
  return ()=>{observer.disconnect();map.remove()};
 },[lead,shops,nearby,radiusKm]);
 return <><div className={`lead-nearby-control ${nearby?'is-active':''}`}><div className="lead-nearby-label"><EnvironmentOutlined/><div><label htmlFor={`nearby-${lead.id}`}>Nearby customers {nearby&&<span className="lead-nearby-count">{matches.length}</span>}</label><Typography.Text type="secondary">Within {radiusKm} km of this location</Typography.Text></div></div><Switch id={`nearby-${lead.id}`} checked={nearby} onChange={setNearby} aria-label={`Show nearby customers within ${radiusKm} km`}/></div><div className="lead-radius-control"><div className="lead-radius-heading"><Typography.Text>Scale Distance</Typography.Text><Typography.Text strong>{radiusKm} km</Typography.Text></div><Slider aria-label="Nearby customer distance in kilometers" min={1} max={20} step={1} value={radiusKm} onChange={setRadiusKm} marks={{1:'1 km',5:'5 km',10:'10 km',20:'20 km'}} tooltip={{formatter:value=>`${value} km`}}/></div>{nearby&&!matches.length&&<Typography.Paragraph className="lead-nearby-empty" type="secondary" role="status">No other customers with recorded coordinates within {radiusKm} km.</Typography.Paragraph>}<div ref={node} className="lead-interactive-map" aria-label={`Location map for ${lead.shop}`}/>{nearby&&<Space className="lead-map-legend" wrap><span><i className="map-dot current"/> Current customer</span><span><i className="map-dot nearby"/> Nearby customers</span><span><i className="map-dot duplicate"/> Matches to this lead ({duplicateCount})</span></Space>}</>;
}
