const key='sfa.prospect-drafts.v1';
export function loadProspectDrafts(){try{const rows=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(rows)?rows.filter(row=>row&&row.status==='Draft'&&typeof row.id==='string'&&typeof row.code==='string'):[]}catch{return []}}
export function storeProspectDrafts(rows){localStorage.setItem(key,JSON.stringify(rows.filter(row=>row.status==='Draft')))}
