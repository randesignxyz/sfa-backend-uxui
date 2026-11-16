import React,{useEffect} from 'react';
import {Button,Checkbox,Col,DatePicker,Divider,Drawer,Form,Row,Select,Space} from 'antd';
export default function ProspectAdvancedSearch({open,value,records,onClose,onApply}){
 const [form]=Form.useForm();
 useEffect(()=>{if(open){form.resetFields();form.setFieldsValue(value)}},[open,value,form]);
 const options=key=>[...new Set(records.map(record=>record[key]).filter(Boolean))].map(value=>({value,label:key==='salesperson'?`${value.slice(0,6)} · ${value.slice(7)}`:value}));
 return <Drawer title="Advanced Search" open={open} onClose={onClose} width={480} className="prospect-advanced-search" footer={<Space style={{display:'flex',justifyContent:'flex-end'}}><Button onClick={()=>form.resetFields()}>Clear</Button><Button type="primary" onClick={()=>form.submit()}>Apply Filter</Button></Space>}><Form layout="vertical" form={form} onFinish={onApply}>
 {[["salesperson","Salesperson Code"],["region","Region"],["channel","Channel"],["subChannel","Sub Channel"],["outlet","Outlet Type"]].map(([key,label])=><Form.Item key={key} name={key} label={label}><Select allowClear showSearch optionFilterProp="label" placeholder="Please select" options={options(key)}/></Form.Item>)}
 <Form.Item name="hasPhoto" label="Has Photo"><Select allowClear placeholder="All" options={[{value:true,label:'With photo'},{value:false,label:'Without photo'}]}/></Form.Item>
 <Form.Item name="duplicate" label="Duplicate"><Select allowClear placeholder="All" options={[{value:true,label:'With duplicates'},{value:false,label:'Without duplicates'}]}/></Form.Item>
 <Form.Item name="prospectOnly" valuePropName="checked"><Checkbox>Prospect Customer</Checkbox></Form.Item>
 <Divider titlePlacement="start">Created Date</Divider><Row gutter={16}><Col span={12}><Form.Item name="from" label="From"><DatePicker style={{width:'100%'}} format="DD MMM YYYY" placeholder="Start date"/></Form.Item></Col><Col span={12}><Form.Item name="to" label="To" dependencies={['from']} rules={[({getFieldValue})=>({validator:(_,date)=>!date||!getFieldValue('from')||!date.isBefore(getFieldValue('from'),'day')?Promise.resolve():Promise.reject(new Error('End date must follow start date'))})]}><DatePicker style={{width:'100%'}} format="DD MMM YYYY" placeholder="End date"/></Form.Item></Col></Row>
 </Form></Drawer>;
}
