import React from 'react';
import './StatusBadge.css';

const colors = {
  Draft: '#8c8c8c',
  Active: '#52c41a',
  Approved: '#52c41a',
  Pending: '#1677ff',
  Rejected: '#ff4d4f',
  Inactive: '#bfbfbf',
};

export default function StatusBadge({ status, className = '' }) {
  if(!status)return <span className="empty-value">—</span>;
  return (
    <span className={`status-badge ${className}`}>
      <span className="status-badge__dot" style={{backgroundColor: colors[status] || colors.Inactive}} aria-hidden="true" />
      <span>{status || 'Unknown'}</span>
    </span>
  );
}
