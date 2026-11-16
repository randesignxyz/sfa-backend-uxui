import React from 'react';
import {Button,Empty,Typography} from 'antd';
import {TeamOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
const {Text,Title}=Typography;
export default function RecordListEmpty({date,noun='prospects',onShowAllDates}){
 const today=dayjs(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Phnom_Penh'}).format(new Date()));
 return <Empty className="prospect-empty-state" image={<TeamOutlined className="prospect-empty-icon"/>} description={<div><Text className="prospect-empty-eyebrow">{date?`No ${noun} on`:`No matching ${noun}`}</Text>{date&&<Title level={3} className="prospect-empty-date">{date.isSame(today,'day')?'Today, ':''}{date.format('DD MMM YYYY')}</Title>}<Text type="secondary" className="prospect-empty-description">{date?'Try another date, or show records from all dates.':'Try a different search or clear your filters.'}</Text></div>}>{date&&<Button type="primary" onClick={onShowAllDates}>Show all dates</Button>}</Empty>;
}
