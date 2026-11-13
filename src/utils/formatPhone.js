export function formatPhone(value){
 if(!value)return '—';
 const digits=String(value).replace(/\D/g,'').replace(/^855(?=\d)/,'0');
 if(/^0\d{8,9}$/.test(digits))return `${digits.slice(0,3)} ${digits.slice(3,6)} ${digits.slice(6)}`;
 return String(value);
}
