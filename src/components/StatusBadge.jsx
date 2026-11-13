import React from 'react';
import './StatusBadge.css';

const colors = {
  Approved: '#52c41a',
  Pending: '#1677ff',
  Rejected: '#ff4d4f',
  Deactivated: '#bfbfbf',
};

export default function StatusBadge({ status, className = '' }) {
  return (
    <span className={`status-badge ${className}`}>
      <span className="status-badge__dot" style={{backgroundColor: colors[status] || colors.Deactivated}} aria-hidden="true" />
      <span>{status || 'Unknown'}</span>
    </span>
  );
}
