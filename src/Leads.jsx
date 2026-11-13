import {formatPhone} from './utils/formatPhone';
import {findLeadDuplicates} from './utils/leadDuplicates';
import StatusBadge from './components/StatusBadge';
import React, {useEffect,useState} from 'react';
import LeadDetail from './LeadDetail';
import LeadCreate from './LeadCreate';
import dayjs from 'dayjs';
import {App,Avatar,Button,Card,Col,Descriptions,Empty,Form,Input,Modal,Row,Select,Space,Statistic,Table,Tag,Typography} from 'antd';
import {PlusOutlined,SearchOutlined,DownloadOutlined,ReloadOutlined,SwapOutlined,TeamOutlined,ClockCircleOutlined,CheckCircleOutlined,StopOutlined,ShopOutlined,ArrowRightOutlined} from '@ant-design/icons';
const {Text,Title}=Typography;
const initial=[
['61002','P0052372','5725973','Chamroeurn Heng','Chamroeurn Heng','ហេង ចំរើន','069854550','Phnom Penh','000729 Neang Vuthy','Approved'],
['61001',null,'5725972','Lead with attachment','Seyha Ke','seyha ke','069884323','Phnom Penh','000366 Horn Kakada','Pending'],
['61000',null,'5725971','ABC Shop','ABC','abc','098172361','Phnom Penh','003577 Duch Siden','Pending'],
['60999',null,'5725970','AA Mart','AA','aa','091231241','Phnom Penh','000257 Prom Leakna','Pending'],
['60998',null,'5725969','1231','3','12','082244445','Phnom Penh','000257 Prom Leakna','Pending'],
['60997',null,'5725968','Seyha 2','Seyha Phat','សីហា','070984770',null,'004374 Suos Savuth','Pending'],
['60996',null,'5725967','Che Chan','Che Chan','ចេ ចាន់','012369369','Phnom Penh','000257 Prom Leakna','Pending'],
['60995',null,'5725966','Che Hong','Che Hong','ចេ ហុង','085147369','Phnom Penh','000257 Prom Leakna','Pending'],
['60994',null,'5725965','Mak Yada','Mak Yada','ម៉ាក់ យ៉ាដា','096369258','Phnom Penh','000257 Prom Leakna','Rejected'],
['60993','P0052371','5725964','Seyha Shop','Seyha','Seyha','0707984770','Phnom Penh','000366 Horn Kakada','Approved'],
['60992','P0052370','5725963','Shop Sale','Seavmey','សាវមី','0978432206','Phnom Penh','000729 Neang Vuthy','Approved'],
['60991',null,'5725962','Seyha Shop','Seyha','សីហា','070984770','Kandal','000729 Neang Vuthy','Deactivated'],
['60984','P0052367','5725955','Che Da (Samkei Munichay)','Che Da','ចេ ដា','016343418','Kampong Speu','003577 Duch Siden','Approved'],
].map(r=>Object.fromEntries(['id','customerId','code','shop','owner','ownerKh','phone','province','salesperson','status'].map((k,i)=>[k,r[i]])));
Object.assign(initial[0],{verified:true,house:'4',streetNo:'1999',street:'Mongrithy',district:'Russey Keo',commune:'Tuol Sangkae 2',village:'Tuol Thgan',channel:'General Trade',subChannel:'Retailer',outlet:'Retailer',priceCode:'RPL',latitude:11.6032772,longitude:104.9006628,createdAt:'12 Nov 2026, 11:42 AM',modifiedAt:'12 Nov 2026, 3:04 PM',activity:[{event:'Prospect approved',at:'12 Nov 2026, 3:04 PM',actor:'Admin Admin',description:'Prospect was approved. Remark: test.'},{event:'Prospect updated',at:'12 Nov 2026, 3:03 PM',actor:'Admin Admin',description:'Profile image was updated.'},{event:'Prospect created',at:'12 Nov 2026, 11:42 AM',actor:'Neang Vuthy',description:'Prospect 5725973 (Chamroeurn Heng) was created.'}]});
const additionalShops=['Sokha Mini Mart','Bopha Grocery','Dara Drinks','Srey Mom Shop','Vanna Market','Sophea Store','Rithy Retail','Chantha Grocery','Pisey Mart','Sovann Shop','Nita Minimart','Vuthy Drinks','Kosal Store','Sreypov Grocery','Borey Mart','Rachana Shop','Sambath Retail','Malis Store','Chenda Market','Panha Grocery'];
const additionalOwners=['Sok Sokha','Lim Bopha','Chea Dara','Srey Mom','Heng Vanna','Ly Sophea','Chhim Rithy','Chan Chantha','Sok Pisey','Keo Sovann','Ly Nita','Neang Vuthy','Kim Kosal','Srey Pov','Heng Borey','Sok Rachana','Chea Sambath','Lim Malis','Keo Chenda','Un Panha'];
const additionalOwnersKh=['សុខ សុខា','លឹម បុប្ផា','ជា ដារ៉ា','ស្រី មុំ','ហេង វណ្ណា','លី សុភា','ឈឹម រិទ្ធី','ចាន់ ចន្ធា','សុខ ពិសី','កែវ សុវណ្ណ','លី នីតា','នាង វុទ្ធី','គឹម កុសល','ស្រី ពៅ','ហេង បុរី','សុខ រចនា','ជា សម្បត្តិ','លឹម ម្លិះ','កែវ ចិន្តា','អ៊ុន បញ្ញា'];
const sampleSalespeople=[...new Set(initial.map(r=>r.salesperson))];
additionalShops.forEach((shop,index)=>{
 const status=['Pending','Approved','Approved','Pending','Rejected','Deactivated'][index%6];
 const createdAt=`${String(11-Math.floor(index/4)).padStart(2,'0')} Nov 2026, 9:${String(10+index).padStart(2,'0')} AM`;
 const salesperson=sampleSalespeople[index%sampleSalespeople.length];
 // Demo locations around the main lead, all within the 5 km nearby radius.
 const angle=index*2.399963229728653;
 const distanceKm=0.35+(index/19)*3.85;
 const latitude=11.6032772+(distanceKm/111.32)*Math.cos(angle);
 const longitude=104.9006628+(distanceKm/(111.32*Math.cos(11.6032772*Math.PI/180)))*Math.sin(angle);
 initial.push({latitude,longitude,id:String(60983-index),code:String(5725954-index),customerId:status==='Approved'?`P${String(52365-index).padStart(7,'0')}`:null,shop,owner:additionalOwners[index],ownerKh:additionalOwnersKh[index],phone:`0${['12','69','98','85'][index%4]}${String(410200+index)}`,province:['Phnom Penh','Kandal','Kampong Speu'][index%3],salesperson,status,createdAt,activity:[{event:'Prospect created',at:createdAt,actor:salesperson.slice(7),description:`${shop} was created.`}]});
});
// Five nearby demo records match the main lead's name and phone.
[13,15,16,17,18].forEach(index=>{
 const record=initial[index];
 Object.assign(record,{shop:initial[0].shop,owner:initial[0].owner,ownerKh:initial[0].ownerKh,phone:initial[0].phone});
 record.activity[0].description=`${record.shop} was created.`;
});
// A separate duplicate example for the second lead.
Object.assign(initial[14],{shop:initial[1].shop,owner:initial[1].owner,ownerKh:initial[1].ownerKh,phone:initial[1].phone});
initial[14].activity[0].description=`${initial[14].shop} was created.`;
// Additional demo customers appear as the nearby radius expands.
Array.from({length:30},(_,index)=>{
 const outerRing=index>=10;
 const ringIndex=outerRing?index-10:index;
 const distanceKm=outerRing?11+ringIndex*(8/19):5.5+ringIndex*(4/9);
 const angle=index*2.399963229728653;
 const shop=`${outerRing?'Regional':'District'} Customer ${String(ringIndex+1).padStart(2,'0')}`;
 initial.push({id:String(60963-index),code:String(5725934-index),shop,owner:`Demo Owner ${index+1}`,ownerKh:'',phone:`069${String(520100+index)}`,province:'Phnom Penh',salesperson:sampleSalespeople[index%sampleSalespeople.length],status:index%3===0?'Pending':'Approved',createdAt:'10 Nov 2026, 10:00 AM',latitude:11.6032772+(distanceKm/111.32)*Math.cos(angle),longitude:104.9006628+(distanceKm/(111.32*Math.cos(11.6032772*Math.PI/180)))*Math.sin(angle),activity:[{event:'Prospect created',at:'10 Nov 2026, 10:00 AM',actor:'Admin Admin',description:`${shop} was created.`}]});
});
initial[0].shopKh='ហាង ហេង ចំរើន';
[13,15,16,17,18].forEach(index=>{initial[index].shopKh=initial[0].shopKh});
export default function Leads({tabs,activeTab,onOpenTab,onCloseTab,onBack}){
const {message}=App.useApp();const [rows,setRows]=useState(initial),[query,setQuery]=useState(''),[status,setStatus]=useState('All'),[duplicate,setDuplicate]=useState(),[province,setProvince]=useState(),[salesperson,setSalesperson]=useState(),[selected,setSelected]=useState([]),[action,setAction]=useState(null);const [form]=Form.useForm();
const isDuplicate=record=>findLeadDuplicates(record,rows).length>0;
const hasFilters=!!(query.trim()||status!=='All'||duplicate!==undefined||province||salesperson);
const [page,setPage]=useState(1),[pageSize,setPageSize]=useState(20);
useEffect(()=>setPage(1),[query,status,duplicate,province,salesperson]);
const filtered=rows.filter(r=>(status==='All'||r.status===status)&&(duplicate===undefined||isDuplicate(r)===duplicate)&&(!province||r.province===province)&&(!salesperson||r.salesperson===salesperson)&&[r.shop,r.shopKh,r.owner,r.ownerKh,r.code,r.customerId,r.phone,r.province,r.salesperson].filter(Boolean).join(' ').toLowerCase().includes(query.trim().toLowerCase()));
const reset=()=>{setQuery('');setStatus('All');setDuplicate(undefined);setProvince(undefined);setSalesperson(undefined);setSelected([])};
const open=kind=>{form.resetFields();setAction(kind)};
const save=values=>{if(action==='new'){setRows(old=>[{...values,id:String(Math.max(...old.map(r=>+r.id))+1),code:String(Math.max(...old.map(r=>+r.code))+1),status:'Pending'},...old]);message.success('Prospect created')}else{setRows(old=>old.map(r=>selected.includes(r.id)?{...r,...values}:r));message.success(action==='transfer'?'Leads transferred':'PG code assigned');setSelected([])}setAction(null)};
const exportCsv=()=>{const keys=['prospectCode','shop','owner','ownerKh','phone','province','salesperson','createdAt','status','duplicate'];const blob=new Blob(['\uFEFF'+[keys,...filtered.map(r=>keys.map(k=>k==='prospectCode'?(r.customerId||r.code):k==='duplicate'?isDuplicate(r):r[k]||''))].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='prospects.csv';a.click();URL.revokeObjectURL(url);message.success('Prospects exported')};
const options=key=>[...new Set(rows.map(r=>r[key]).filter(Boolean))].map(value=>({value,label:value}));
const columns=[
{title:'ID',key:'prospectCode',width:120,fixed:'left',render:(_,r)=><Button type="link" className="lead-prospect-code" onClick={()=>onOpenTab({key:`lead:${r.id}`,label:r.shop,id:r.id})}>{r.customerId||r.code}</Button>},
{title:'Shop Name',dataIndex:'shop',width:200,render:(value,r)=><Button type="link" className="lead-name" onClick={()=>onOpenTab({key:`lead:${r.id}`,label:r.shop,id:r.id})}>{value}</Button>},
{title:'Phone',dataIndex:'phone',width:120,render:value=><Typography.Link className="lead-phone" href={`tel:${value}`}>{formatPhone(value)}</Typography.Link>},
{title:'Province',dataIndex:'province',className:'lead-secondary-cell',width:80,render:value=>({'Phnom Penh':'PNP','Kampong Speu':'KSP',Kandal:'KDL'}[value]||value||<span className="empty-value">—</span>)},
{title:'Creator',dataIndex:'salesperson',width:145,render:value=>value?<span className="lead-staff-name">{value.slice(7)}</span>:<span className="empty-value">—</span>},
{title:'Status',dataIndex:'status',width:115,render:value=><StatusBadge status={value}/>},
{title:'Duplicate',key:'duplicate',width:85,align:'center',render:(_,r)=>{const count=findLeadDuplicates(r,rows).length;return count?<button type="button" onClick={()=>onOpenTab({key:`lead:${r.id}`,label:r.shop,id:r.id})} className="lead-duplicate-count" aria-label={`${count} matching prospects`} title={`${count} prospects match this name and phone`}>{count}</button>:<span className="empty-value">—</span>}}
];
return <>{tabs.map(tab=><div key={tab.key} hidden={activeTab!==tab.key}>{tab.id?<LeadDetail navigationVersion={tab.navigationVersion||0} onOpenLead={r=>onOpenTab({key:`lead:${r.id}:${Date.now()}`,label:r.shop,id:r.id})} shops={rows} lead={rows.find(r=>r.id===tab.id)} onBack={onBack} onUpdate={updated=>setRows(old=>old.map(r=>r.id===updated.id?updated:r))} salespeople={options('salesperson')} provinces={options('province')}/>:<LeadCreate provinces={options('province')} salespeople={options('salesperson')} onCancel={()=>onCloseTab(tab.key)} onSave={values=>{const id=String(Math.max(...rows.map(r=>+r.id))+1);const code=String(Math.max(...rows.map(r=>+r.code))+1);const createdAt=new Date().toLocaleString('en-GB',{timeZone:'Asia/Phnom_Penh',dateStyle:'medium',timeStyle:'short'});setRows(old=>[{...values,id,code,status:'Pending',createdAt,activity:[{event:'Prospect created',at:createdAt,actor:'Admin Admin',description:`${values.shop} was created.`}]},...old]);onCloseTab(tab.key);onOpenTab({key:`lead:${id}`,label:values.shop,id});message.success('Prospect created')}}/>}</div>)}<div hidden={activeTab!=='leads'} className="leads-page"><div className="prospect-list-heading"><Title level={3} className="prospect-list-title">Prospect</Title><div className="lead-tab-actions"><Space wrap><Button icon={<PlusOutlined/>} disabled={!selected.length} onClick={()=>open('pg')}>PG code</Button><Button icon={<SwapOutlined/>} disabled={!selected.length} onClick={()=>open('transfer')}>Transfer</Button><Button icon={<DownloadOutlined/>} disabled={!filtered.length} onClick={exportCsv}>Export</Button><Button type="text" disabled={!hasFilters} icon={<ReloadOutlined/>} onClick={reset}>Reset</Button></Space></div></div><Card className="lead-list-card">

<div className="lead-filters"><div className="prospect-filter-field prospect-search"><label htmlFor="prospect-search">Search prospects</label><Input id="prospect-search" allowClear prefix={<SearchOutlined/>} placeholder="Shop, owner, code or phone" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="prospect-filter-field"><label htmlFor="prospect-duplicates">Duplicates</label><Select id="prospect-duplicates" allowClear placeholder="All records" value={duplicate} options={[{value:true,label:'With duplicates'},{value:false,label:'Without duplicates'}]} onChange={setDuplicate}/></div><div className="prospect-filter-field"><label htmlFor="prospect-province">Province</label><Select id="prospect-province" allowClear showSearch placeholder="All provinces" value={province} options={options('province')} onChange={setProvince}/></div><div className="prospect-filter-field"><label htmlFor="prospect-salesperson">Creator</label><Select id="prospect-salesperson" allowClear showSearch placeholder="All creators" value={salesperson} options={options('salesperson').map(item=>({...item,label:item.value.slice(7)}))} optionFilterProp="label" onChange={setSalesperson}/></div></div>
{(query.trim()||duplicate!==undefined||province||salesperson)&&<div className="prospect-filter-summary"><Text type="secondary" role="status">{filtered.length} of {rows.length} prospects</Text><Space wrap size={[6,6]}>{query.trim()&&<Tag closable onClose={()=>setQuery('')}>Search: {query.trim()}</Tag>}{duplicate!==undefined&&<Tag closable onClose={()=>setDuplicate(undefined)}>{duplicate?'With duplicates':'Without duplicates'}</Tag>}{province&&<Tag closable onClose={()=>setProvince(undefined)}>{province}</Tag>}{salesperson&&<Tag closable onClose={()=>setSalesperson(undefined)}>{salesperson.slice(7)}</Tag>}</Space></div>}
<div className="lead-tabs-toolbar"><div className="lead-status-tabs" role="tablist">{['All','Pending','Approved','Rejected','Deactivated'].map(s=><button role="tab" aria-selected={status===s} className={`${status===s?'active':''} ${s==='Pending'?'pending-status-tab':''}`} key={s} onClick={()=>setStatus(s)}>{s}<span>{s==='All'?rows.length:rows.filter(r=>r.status===s).length}</span></button>)}</div></div>
{selected.length>0&&<div className="lead-selection">{selected.length} prospects selected <Button type="link" size="small" onClick={()=>setSelected([])}>Clear selection</Button></div>}
<Table className="lead-reference-table" size="small" rowKey="id" columns={columns} dataSource={filtered} tableLayout="fixed" scroll={{x:865}} locale={{emptyText:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No prospects match your filters"><Button onClick={reset}>Clear filters</Button></Empty>}} pagination={{current:page,pageSize,onChange:(next,size)=>{setPage(size!==pageSize?1:next);setPageSize(size)},showSizeChanger:true,pageSizeOptions:[10,20,50],showTotal:(total,range)=>`${range[0]}–${range[1]} of ${total} prospects`}}/>
</Card>

<Modal title={action==='new'?'Create new prospect':action==='transfer'?'Transfer selected prospects':'Assign PG code'} open={!!action} onCancel={()=>setAction(null)} onOk={()=>form.submit()} okText={action==='new'?'Create prospect':'Save changes'}><Form form={form} layout="vertical" onFinish={save} style={{marginTop:24}}>{action==='new'?<><Form.Item name="shop" label="Shop name" rules={[{required:true,whitespace:true}]}><Input placeholder="Enter shop name"/></Form.Item><Row gutter={16}><Col span={12}><Form.Item name="owner" label="Owner name (EN)" rules={[{required:true,whitespace:true}]}><Input/></Form.Item></Col><Col span={12}><Form.Item name="ownerKh" label="Owner name (KH)"><Input/></Form.Item></Col></Row><Form.Item name="phone" label="Phone number" rules={[{required:true},{pattern:/^\+?[\d\s]{8,15}$/,message:'Enter a valid phone number'}]}><Input/></Form.Item><Form.Item name="province" label="Province" rules={[{required:true}]}><Select options={options('province')}/></Form.Item><Form.Item name="salesperson" label="Creator" rules={[{required:true}]}><Select showSearch options={options('salesperson')}/></Form.Item></>:action==='transfer'?<><Typography.Paragraph type="secondary">Assign {selected.length} selected prospects to a creator.</Typography.Paragraph><Form.Item name="salesperson" label="Transfer to" rules={[{required:true}]}><Select showSearch options={options('salesperson')}/></Form.Item></>:<Form.Item name="pgCode" label="PG code" rules={[{required:true,whitespace:true}]}><Input placeholder="Enter PG code"/></Form.Item>}</Form></Modal>
</div></>}
