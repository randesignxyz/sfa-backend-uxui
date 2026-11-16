import React from 'react';
/** Shared status selection with totals calculated from the currently filtered records. */
export default function StatusFilterGroup({value,onChange,statuses,records,label='Status'}){
 return <div className="lead-tabs-toolbar"><div className="lead-status-tabs" role="tablist" aria-label={label}>{['All',...statuses].map(status=><button type="button" role="tab" aria-selected={value===status} className={`${value===status?'active':''} ${status==='Pending'&&records.some(record=>record.status==='Pending')?'pending-status-tab':''}`} key={status} onClick={()=>onChange(status)}>{status}<span>{records.filter(record=>status==='All'||record.status===status).length}</span></button>)}</div></div>;
}
