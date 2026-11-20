import React from 'react';
import {Tooltip} from 'antd';

export default function LocationLink({location}) {
  if (!location) return '—';
  return <span>{location} <Tooltip title="Open in Google Maps"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${location} in Google Maps`}><svg viewBox="0 0 24 28" width="16" height="19" fill="currentColor" aria-hidden="true" style={{verticalAlign:'-0.2em'}}><path fillRule="evenodd" d="M12.6 0C9.1 0 6.3 2.9 6.3 6.5c0 5.7 5.8 10.1 6.3 10.3.5-.2 6.2-4.6 6.2-10.3C18.8 2.9 16 0 12.6 0Zm-.1 3.2a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 0 1 0-6.2Z"/><path d="m4.2 10 .5 1.4-3.2 1.3v13.2l5.6-2.8v-7.8l1.5 1.6v6.2l6.9 2.9v-8.1l1.5-1.3v9.3l5.5-2.8V10.6l-2.2.8.5-1.8 2.1-.9A.8.8 0 0 1 24 9.4v14.4c0 .3-.2.6-.5.8l-7.1 3.3c-.2.1-.4.1-.6 0L7.9 24.6l-6.8 3.3A.8.8 0 0 1 0 27.2V12.3c0-.3.2-.6.5-.7Z"/></svg></a></Tooltip></span>;
}
