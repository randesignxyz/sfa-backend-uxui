import React,{useEffect} from 'react';
import {Button,Checkbox,DatePicker,Divider,Drawer,Form,Select,Space} from 'antd';
export default function ProspectAdvancedSearch({open,value,records,onClose,onApply}){
 const [form]=Form.useForm();
 const selectedValues=Form.useWatch([],form)||{};
 const hasSelection=Object.entries(selectedValues).some(([key,value])=>!['from','to'].includes(key)&&(Array.isArray(value)?value.some(Boolean):value!==undefined&&value!==null&&value!==''&&value!==false||value===false&&['hasPhoto','duplicate'].includes(key)));
 useEffect(()=>{if(open){form.resetFields();form.setFieldsValue({...value,dateRange:value.from||value.to?[value.from||null,value.to||null]:undefined})}},[open,value,form]);
 const options=key=>[...new Set(records.map(record=>record[key]).filter(Boolean))].map(value=>({value,label:key==='salesperson'?`${value.slice(0,6)} · ${value.slice(7)}`:value}));
 return <Drawer title="Advanced Search" open={open} onClose={onClose} width={480} className="prospect-advanced-search" footer={<Space style={{display:'flex',justifyContent:'flex-end'}}><Button danger={hasSelection} onClick={()=>form.resetFields()}>Reset filters</Button><Button type="primary" onClick={()=>form.submit()}>Apply filters</Button></Space>}><Form layout="vertical" form={form} onFinish={({dateRange,from,to,...values})=>onApply({...values,from:dateRange?.[0]||undefined,to:dateRange?.[1]||undefined})}>
 {[["assignedPic","Assigned PIC"],["region","Region"],["channel","Channel"],["subChannel","Sub Channel"],["outlet","Outlet Type"]].map(([key,label])=><Form.Item key={key} name={key} label={label}><Select allowClear showSearch optionFilterProp="label" placeholder="Please select" options={options(key)}/></Form.Item>)}
 <Form.Item name="hasPhoto" label="Has Photo"><Select allowClear placeholder="All" options={[{value:true,label:'With photo'},{value:false,label:'Without photo'}]}/></Form.Item>
 <Form.Item name="duplicate" label="Duplicate"><Select allowClear placeholder="All" options={[{value:true,label:'With duplicates'},{value:false,label:'Without duplicates'}]}/></Form.Item>
 <Form.Item name="prospectOnly" valuePropName="checked"><Checkbox>Prospect Customer</Checkbox></Form.Item>
 <Divider titlePlacement="start">Created Date</Divider><Form.Item name="dateRange"><DatePicker.RangePicker aria-label="Created date range" style={{width:'100%'}} format="DD MMM YYYY" placeholder={['Start date','End date']} allowEmpty={[true,true]}/></Form.Item>
 </Form></Drawer>;
}
