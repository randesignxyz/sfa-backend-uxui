import React from 'react';
import {Button,Form,Space,Typography} from 'antd';
import ProspectForm from './components/ProspectForm';
export default function LeadCreate({onSave,onSaveDraft,onCancel,provinces,salespeople,onDirtyChange,initialValues={}}){
 const [form]=Form.useForm();
 const changed=(_,values)=>onDirtyChange?.(Object.keys(values).some(key=>String(values[key]??'')!==String(initialValues[key]??'')));
 return <div className="prospect-create-page"><Typography.Title level={3}>{initialValues.id?'Edit Draft':'New Prospect'}</Typography.Title><Typography.Paragraph type="secondary">Save a draft at any time. Complete the required fields to create the prospect.</Typography.Paragraph><ProspectForm form={form} initialValues={initialValues} provinces={provinces} salespeople={salespeople} onValuesChange={changed} onFinish={onSave}><div className="prospect-create-footer"><Space><Button onClick={onCancel}>Cancel</Button><Button onClick={()=>onSaveDraft(form.getFieldsValue())}>Save draft</Button><Button type="primary" htmlType="submit">Create prospect</Button></Space></div></ProspectForm></div>;
}
