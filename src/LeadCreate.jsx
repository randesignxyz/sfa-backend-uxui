import React from 'react';
import {App,Button,Form,Space,Typography} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import ProspectForm from './components/ProspectForm';
export default function LeadCreate({onSave,onSaveDraft,onDeleteDraft,onCancel,provinces,salespeople,onDirtyChange,initialValues={}}){
 const [form]=Form.useForm();const {modal}=App.useApp();
 const deleteDraft=()=>modal.confirm({title:'Delete this draft?',content:`${initialValues.shop||'Untitled prospect'} will be permanently removed from this browser.`,okText:'Delete draft',cancelText:'Keep draft',okButtonProps:{danger:true},onOk:onDeleteDraft});
 const changed=(_,values)=>onDirtyChange?.(Object.keys(values).some(key=>String(values[key]??'')!==String(initialValues[key]??'')));
 return <div className="prospect-create-page"><div className="prospect-edit-heading prospect-create-heading"><Button type="text" icon={<ArrowLeftOutlined/>} onClick={onCancel}>Back</Button><Typography.Title level={3}>{initialValues.id?'Edit Draft':'New Prospect'}</Typography.Title></div><Typography.Paragraph type="secondary">Save a draft at any time. Complete the required fields to create the prospect.</Typography.Paragraph><ProspectForm form={form} initialValues={initialValues} provinces={provinces} salespeople={salespeople} onValuesChange={changed} onFinish={onSave}><div className="prospect-create-footer">{initialValues.status==='Draft'&&<Button danger onClick={deleteDraft} style={{marginRight:'auto'}}>Delete draft</Button>}<Space><Button onClick={onCancel}>Cancel</Button><Button onClick={()=>onSaveDraft(form.getFieldsValue())}>Save draft</Button><Button type="primary" htmlType="submit">Create prospect</Button></Space></div></ProspectForm></div>;
}
