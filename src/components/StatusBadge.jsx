import React from 'react';
import './StatusBadge.css';

const colors = {
  Active: '#52c41a',
  Inactive: '#bfbfbf',
  Approved: '#52c41a',
  Pending: '#1677ff',
  Rejected: '#ff4d4f',
  Deactivated: '#bfbfbf',
};

export default function StatusBadge({ status, className = '' }) {
  if(!status)return <span className="empty-value">—</span>;
  return (
    <span className={`status-badge ${className}`}>
      <span className="status-badge__dot" style={{backgroundColor: colors[status] || colors.Deactivated}} aria-hidden="true" />
      <span>{status || 'Unknown'}</span>
    </span>
  );
}
