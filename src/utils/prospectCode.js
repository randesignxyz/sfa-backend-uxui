export function pendingCode(code){return String(code||'').replace(/^P/i,'')}
export function approvedCode(code){const value=pendingCode(code);return value?`P${value}`:''}
