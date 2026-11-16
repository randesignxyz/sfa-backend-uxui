import React,{useRef,useState} from 'react';
import {App,Button,Image,Space,Upload} from 'antd';
import {PlusOutlined,UploadOutlined,DeleteOutlined,PictureOutlined} from '@ant-design/icons';
const read=file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Read failed'));reader.readAsDataURL(file)});
/** Local prototype uploads. Data URLs allow saved drafts to retain files. */
export default function ProspectUpload({value,onChange,image=false}){
 const {message}=App.useApp();const [loading,setLoading]=useState(false);const busy=useRef(false);const current=useRef(value);current.current=value;
 async function upload(file){
  if(busy.current){message.info('Please wait for the current file to finish');return Upload.LIST_IGNORE}
  if(image&&!['image/jpeg','image/png','image/webp'].includes(file.type)){message.error('Choose a JPG, PNG or WebP image');return Upload.LIST_IGNORE}
  if(file.size>2*1024*1024){message.error('Each file must be 2 MB or smaller');return Upload.LIST_IGNORE}
  const files=image?[]:(current.current||[]);
  if(!image&&(files.length>=5||files.reduce((total,item)=>total+item.size,0)+file.size>3*1024*1024)){message.error('Use up to 5 attachments, 3 MB in total');return Upload.LIST_IGNORE}
  busy.current=true;setLoading(true);
  try{const url=await read(file);onChange?.(image?url:[...files,{uid:file.uid||String(Date.now()),name:file.name,type:file.type,size:file.size,url}])}catch{message.error('Could not read the file. Please try again.')}finally{busy.current=false;setLoading(false)}
  return Upload.LIST_IGNORE;
 }
 if(image)return <div className="prospect-photo-control">{value?<Image width={150} height={150} style={{objectFit:'cover',borderRadius:8}} src={value} alt="Prospect profile"/>:<div className="prospect-photo-empty" role="img" aria-label="No profile image"><PictureOutlined/></div>}<Space wrap className="prospect-photo-actions"><Upload accept="image/jpeg,image/png,image/webp" showUploadList={false} beforeUpload={upload}><Button loading={loading} icon={<PlusOutlined/>}>{value?'Change photo':'Upload photo'}</Button></Upload>{value&&<Button danger onClick={()=>onChange?.(undefined)}>Remove</Button>}</Space></div>;
 return <Upload beforeUpload={upload} fileList={(value||[]).map(file=>({...file,status:'done'}))} onRemove={file=>{onChange?.((current.current||[]).filter(item=>item.uid!==file.uid));return false}} showUploadList={{showPreviewIcon:false,showDownloadIcon:true}} onDownload={file=>{const link=document.createElement('a');link.href=file.url;link.download=file.name;link.click()}}><Button icon={<UploadOutlined/>} loading={loading}>Add attachments</Button></Upload>;
}
