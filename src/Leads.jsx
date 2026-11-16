import RecordListEmpty from './components/RecordListEmpty';
import StatusFilterGroup from './components/StatusFilterGroup';
import {loadProspectDrafts,storeProspectDrafts} from './utils/prospectDrafts';
import {pendingCode} from './utils/prospectCode';
import CheckboxMultiSelect from './components/CheckboxMultiSelect';
import importedProspects from './data/prospects.json';
import ProspectAdvancedSearch from './components/ProspectAdvancedSearch';
import {matchesAdvanced} from './utils/prospectFilters';
import {createPortal} from 'react-dom';
import {formatPhone} from './utils/formatPhone';
import {findLeadDuplicates} from './utils/leadDuplicates';
import StatusBadge from './components/StatusBadge';
import React, {useEffect,useState} from 'react';
import LeadDetail from './LeadDetail';
import LeadCreate from './LeadCreate';
import dayjs from 'dayjs';
import {App,Avatar,Badge,Button,Card,Col,DatePicker,Descriptions,Empty,Form,Input,Modal,Row,Select,Space,Statistic,Table,Tag,Tooltip,Typography} from 'antd';
import {PlusOutlined,SearchOutlined,DownloadOutlined,ExportOutlined,ReloadOutlined,SwapOutlined,TeamOutlined,ClockCircleOutlined,CheckCircleOutlined,StopOutlined,ShopOutlined,ArrowRightOutlined,FilterOutlined} from '@ant-design/icons';
const {Text,Title}=Typography;
const initial=importedProspects.map(record=>record.status==='Pending'?{...record,code:pendingCode(record.code),customerId:null}:{...record});
export default function Leads({onDirtyChange,headerTarget,tabs,activeTab,onOpenTab,onCloseTab,onBack}){
const {message}=App.useApp();const [rows,setRows]=useState(()=>[...loadProspectDrafts(),...initial]),[query,setQuery]=useState(''),[status,setStatus]=useState('All'),[duplicate,setDuplicate]=useState(),[province,setProvince]=useState([]),[territory,setTerritory]=useState([]),[salesperson,setSalesperson]=useState([]),[selected,setSelected]=useState([]),[action,setAction]=useState(null);const [form]=Form.useForm();
const [createdDay,setCreatedDay]=useState(()=>dayjs(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Phnom_Penh'}).format(new Date())));
const [advancedOpen,setAdvancedOpen]=useState(false),[advanced,setAdvanced]=useState({});
const advancedCount=Object.values(advanced).filter(value=>value!==undefined&&value!==null&&value!==false&&value!=='').length+(advanced.hasPhoto===false?1:0);
const isDuplicate=record=>findLeadDuplicates(record,rows).length>0;
const hasFilters=!!(query.trim()||status!=='All'||duplicate!==undefined||province.length||territory.length||salesperson.length||advancedCount||createdDay);
const [page,setPage]=useState(1),[pageSize,setPageSize]=useState(20);
useEffect(()=>setPage(1),[query,status,duplicate,province,territory,salesperson,advanced,createdDay]);
const matchingRecords=rows.filter(r=>(!createdDay||(r.createdAt&&dayjs(r.createdAt).isSame(createdDay,'day')))&&matchesAdvanced(r,advanced)&&(duplicate===undefined||isDuplicate(r)===duplicate)&&(!province.length||province.includes(r.province))&&(!territory.length||territory.includes(r.territory))&&(!salesperson.length||salesperson.includes(r.assignedPic))&&[r.shop,r.shopKh,r.owner,r.ownerKh,r.code,r.customerId,r.phone,r.province,r.assignedPic,r.channel,r.territory].filter(Boolean).join(' ').toLowerCase().includes(query.trim().toLowerCase()));
const filtered=matchingRecords.filter(record=>status==='All'||record.status===status);
const reset=()=>{setQuery('');setStatus('All');setDuplicate(undefined);setProvince([]);setTerritory([]);setSalesperson([]);setSelected([]);setAdvanced({});setCreatedDay(null)};
const open=kind=>{form.resetFields();setAction(kind)};
const save=({recordIds,...values})=>{const at=new Date().toLocaleString('en-GB',{timeZone:'Asia/Phnom_Penh',dateStyle:'medium',timeStyle:'short'});setRows(old=>old.map(record=>recordIds.includes(record.id)?{...record,...values,modifiedAt:at,activity:[{event:action==='transfer'?'PIC reassigned':'PG code assigned',at,actor:'Admin Admin',description:action==='transfer'?`Assigned to ${values.assignedPic}.`:`PG code set to ${values.pgCode}.`},...(record.activity||[])]}:record));message.success(`${recordIds.length} ${recordIds.length===1?'prospect':'prospects'} updated`);setAction(null)};
const saveProspect=(tab,values,draft=false)=>{
 const previous=rows.find(record=>record.id===tab.id);
 const id=previous?.id||String(Math.max(...rows.map(record=>Number(record.id)||0))+1);
 const code=previous?.code||String(Math.max(...rows.map(record=>Number(String(record.code).replace(/\D/g,''))||0))+1).padStart(7,'0');
 const at=new Date().toISOString();
 const record={...previous,...values,id,code,status:draft?'Draft':'Pending',createdAt:previous?.createdAt||at,modifiedAt:at,activity:[{event:draft?'Draft saved':'Prospect created',at,actor:'Admin Admin',description:draft?'Incomplete prospect saved as a draft.':`${values.shop} was created.`},...(previous?.activity||[])]};
 const next=[record,...rows.filter(row=>row.id!==id)];
 try{storeProspectDrafts(next)}catch{message.error('Could not save the draft in this browser. Your form is still open.');return}
 setRows(next);onDirtyChange?.(false);onCloseTab(tab.key,true);
 if(draft){reset();setStatus('Draft');message.success('Draft saved in this browser')}else{onOpenTab({key:`lead:${id}`,label:record.shop,id});message.success('Prospect created')}
};
const exportCsv=()=>{const keys=['prospectCode','shop','owner','ownerKh','phone','phone2','province','region','channel','territory','assignedPic','createdAt','hasSaleInvoice','lastInvoiceDate','status','duplicate'];const blob=new Blob(['\uFEFF'+[keys,...filtered.map(r=>keys.map(k=>k==='prospectCode'?(r.customerId||r.code):k==='duplicate'?isDuplicate(r):r[k]||''))].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='prospects.csv';a.click();URL.revokeObjectURL(url);message.success('Prospects exported')};
const options=key=>[...new Set(rows.map(r=>r[key]).filter(Boolean))].map(value=>({value,label:value}));
const columns=[
{title:'ID',key:'prospectCode',width:120,fixed:'left',render:(_,r)=><Button type="link" className="lead-prospect-code" onClick={()=>onOpenTab({key:`lead:${r.id}`,label:r.shop||'Untitled prospect',id:r.id,draft:r.status==='Draft'})}>{r.customerId||r.code}</Button>},
{title:'Shop Name',dataIndex:'shop',width:200,render:(value,r)=><Button type="link" className="lead-name" onClick={()=>onOpenTab({key:`lead:${r.id}`,label:r.shop||'Untitled prospect',id:r.id,draft:r.status==='Draft'})}>{value||'Untitled prospect'}</Button>},
{title:'Channel',dataIndex:'channel',width:135,render:value=>value||<span className="empty-value">—</span>},
{title:'Phone',dataIndex:'phone',width:120,render:value=><Typography.Link className="lead-phone" href={`tel:${value}`}>{formatPhone(value)}</Typography.Link>},
{title:'Territory',dataIndex:'territory',width:130,render:value=>value||<span className="empty-value">—</span>},
{title:'Province',dataIndex:'province',className:'lead-secondary-cell',width:80,render:value=>({'Phnom Penh':'PNP','Kampong Speu':'KSP',Kandal:'KDL'}[value]||value||<span className="empty-value">—</span>)},
{title:'Assigned PIC',dataIndex:'assignedPic',width:150,render:value=>value?<span className="lead-staff-name">{value}</span>:<span className="empty-value">—</span>},
{title:'Status',dataIndex:'status',width:115,render:value=><StatusBadge status={value}/>},
];
return <><ProspectAdvancedSearch open={advancedOpen} value={{...advanced,duplicate}} records={rows} onClose={()=>setAdvancedOpen(false)} onApply={({duplicate:nextDuplicate,...values})=>{setAdvanced(values);setDuplicate(nextDuplicate);setCreatedDay(null);setAdvancedOpen(false)}}/>{headerTarget&&createPortal(<div className="prospect-list-heading"><Title level={3} className="prospect-list-title">Prospect</Title><div className="lead-tab-actions"><Space wrap><Button icon={<PlusOutlined/>} onClick={()=>open('pg')}>PG code</Button><Button icon={<SwapOutlined/>} onClick={()=>open('transfer')}>Transfer</Button><Button icon={<ExportOutlined/>} onClick={exportCsv}>Export</Button><Button type="text" icon={<ReloadOutlined/>} onClick={()=>{reset();setPage(1);message.success('Prospect list refreshed')}}>Reload</Button><Button type="primary" icon={<PlusOutlined/>} onClick={()=>onOpenTab({key:`lead:new-${Date.now()}`,label:'New prospect'})}>New Prospect</Button></Space></div></div>,headerTarget)}{tabs.map(tab=><div key={tab.key} hidden={activeTab!==tab.key}>{tab.id&&!tab.draft?<LeadDetail navigationVersion={tab.navigationVersion||0} onOpenLead={r=>onOpenTab({key:`lead:${r.id}:${Date.now()}`,label:r.shop||'Untitled prospect',id:r.id,draft:r.status==='Draft'})} shops={rows} lead={rows.find(r=>r.id===tab.id)} onBack={onBack} onUpdate={updated=>setRows(old=>old.map(r=>r.id===updated.id?updated:r))} salespeople={options('salesperson')} provinces={options('province')}/>:<LeadCreate initialValues={tab.id?rows.find(record=>record.id===tab.id):undefined} onDirtyChange={onDirtyChange} provinces={options('province')} salespeople={options('salesperson')} onCancel={()=>onCloseTab(tab.key)} onSave={values=>saveProspect(tab,values)} onSaveDraft={values=>saveProspect(tab,values,true)}/>}</div>)}<div hidden={activeTab!=='leads'} className="leads-page"><Card className="lead-list-card">

<div className="lead-filters"><div className="prospect-filter-field prospect-search"><Input.Search id="prospect-search" aria-label="Search prospects" allowClear onSearch={value=>{setQuery(value);setCreatedDay(null)}} placeholder="Shop, owner, code or phone" value={query} onChange={e=>{setQuery(e.target.value);setCreatedDay(null)}}/></div><div className="prospect-filter-field"><CheckboxMultiSelect     id="prospect-territory" aria-label="Territory"   placeholder="All Territory" value={territory} options={options('territory')} onChange={value=>{setTerritory(value);setCreatedDay(null)}} notFoundContent="No territories assigned"/></div><div className="prospect-filter-field"><CheckboxMultiSelect id="prospect-province" aria-label="Province"      placeholder="All Province" value={province} options={options('province')} onChange={value=>{setProvince(value);setCreatedDay(null)}} /></div><div className="prospect-filter-field"><CheckboxMultiSelect     id="prospect-salesperson" aria-label="Assigned PIC"   placeholder="All Assigned PIC" value={salesperson} options={options('assignedPic')}  onChange={value=>{setSalesperson(value);setCreatedDay(null)}}/></div><DatePicker aria-label="Created date" value={createdDay} onChange={setCreatedDay} allowClear format="DD MMM YYYY" placeholder="All dates" style={{width:160,flexShrink:0}}/><Tooltip title="Advanced Search"><Badge count={advancedCount} size="small" color="#B49A00"><Button aria-label={advancedCount?`Advanced Search, ${advancedCount} active filters`:'Advanced Search'} icon={<FilterOutlined/>} type={advancedCount?'primary':'default'} onClick={()=>setAdvancedOpen(true)}/></Badge></Tooltip></div>
<StatusFilterGroup value={status} onChange={setStatus} statuses={['Draft','Pending','Approved','Rejected','Inactive']} records={matchingRecords}/>
{selected.length>0&&<div className="lead-selection">{selected.length} prospects selected <Button type="link" size="small" onClick={()=>setSelected([])}>Clear selection</Button></div>}
<Table className="lead-reference-table" size="small" rowKey="id" columns={columns} dataSource={filtered} tableLayout="fixed" scroll={{x:1050}} locale={{emptyText:<RecordListEmpty date={createdDay} noun="prospects" onShowAllDates={()=>setCreatedDay(null)}/>}} pagination={{current:page,pageSize,onChange:(next,size)=>{setPage(size!==pageSize?1:next);setPageSize(size)},showSizeChanger:true,pageSizeOptions:[10,20,50],showTotal:(total,range)=>`${range[0]}–${range[1]} of ${total} prospects`}}/>
</Card>

<Modal title={action==='transfer'?'Transfer prospects':'Assign PG code'} open={!!action} onCancel={()=>setAction(null)} onOk={()=>form.submit()} okText={action==='transfer'?'Transfer':'Assign PG code'}><Form form={form} layout="vertical" onFinish={save} style={{marginTop:24}}><Form.Item name="recordIds" label="Prospects" rules={[{required:true,type:'array',min:1,message:'Select at least one prospect'}]}><Select mode="multiple" showSearch optionFilterProp="label" placeholder="Select prospects" options={rows.map(record=>({value:record.id,label:`${record.shop} · ${record.code}`}))}/></Form.Item>{action==='transfer'?<Form.Item name="assignedPic" label="Assign to PIC" rules={[{required:true}]}><Select showSearch placeholder="Select person in charge" options={[...new Set(rows.flatMap(record=>[record.assignedPic,record.salesperson?.slice(7)]).filter(Boolean))].map(value=>({value,label:value}))}/></Form.Item>:<Form.Item name="pgCode" label="PG code" rules={[{required:true,whitespace:true,message:'Enter a PG code'}]}><Input placeholder="Enter PG code"/></Form.Item>}</Form></Modal>
</div></>}
