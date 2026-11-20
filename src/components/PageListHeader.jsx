import React from 'react';
import {Typography} from 'antd';

export default function PageListHeader({title, children}) {
  return <div className="prospect-list-heading"><Typography.Title level={3} className="prospect-list-title">{title}</Typography.Title><div className="lead-tab-actions">{children}</div></div>;
}
