import React from 'react';
import {Card, Col, Descriptions, Row, Typography} from 'antd';
import dayjs from 'dayjs';
import {CopyOutlined} from '@ant-design/icons';
import LocationLink from '../LocationLink';
const {Text}=Typography;
const displayDate=value=>value&&dayjs(value).isValid()?dayjs(value).format('DD MMM YYYY'):'—';
const value=text=><Text strong>{text||'—'}</Text>;
function InformationGroup({title,items}) {
  return <section className="inquiry-info-group"><Typography.Title level={5}>{title}</Typography.Title><Descriptions column={1} colon items={items}/></section>;
}
export default function InquiryInformation({request, status, createdAt}) {
  const order=request.salesOrder;
  return <div className="detail-information inquiry-reference-layout">
    <Card title="General" className="inquiry-general-card">
      <Row gutter={[32,24]}>
        <Col xs={24} md={12} xl={8}><InformationGroup title="Inquiry Information" items={[
          {key:'id',label:'PI Number',children:value(request.id)},
          {key:'so',label:'SO Number',children:value(order?.id)},
          {key:'status',label:'Status',children:status},
        ]}/></Col>
        <Col xs={24} md={12} xl={8}><InformationGroup title="Customer Information" items={[
          {key:'buyer',label:'Buyer',children:value(request.buyer)},
          {key:'phone',label:'Phone Number',children:request.phone?<Text copyable={{text:request.phone,icon:<CopyOutlined/>,tooltips:['Copy phone','Copied']}}><a href={`tel:${request.phone.replaceAll(' ','')}`}>{request.phone}</a></Text>:'—'},
        ]}/></Col>
        <Col xs={24} md={12} xl={8}><InformationGroup title="Submitter Information" items={[
          {key:'staff',label:'Submitted By',children:value([request.staffId,request.staff].filter(Boolean).join(' · '))},
          {key:'submitted',label:'Submitted On',children:value(`${displayDate(request.date)} ${request.time||''}`.trim())},
          {key:'source',label:'Source',children:value('OML App')},
          {key:'remarks',label:'Remarks',children:request.remarks||request.remark||'—'},
          ...(createdAt?[{key:'created',label:'PO Created On',children:value(createdAt)}]:[]),
        ]}/></Col>
      </Row>
    </Card>
    <Card title="Delivery" className="inquiry-delivery-card">
      <Descriptions column={{xs:1,md:2}} colon items={[
        {key:'date',label:'Delivery Date',children:value(displayDate(request.deliveryDate||order?.values?.deliveryDate))},
        {key:'address',label:'Shipping Address',children:<LocationLink location={order?.values?.address||request.location}/>},
      ]}/>
    </Card>
  </div>;
}
