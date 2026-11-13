const normalizeName=value=>String(value||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase();
const normalizePhone=value=>String(value||'').replace(/\D/g,'').replace(/^855(?=\d)/,'0');
export function findLeadDuplicates(lead,records){
 const phone=normalizePhone(lead.phone);
 const names=[lead.shop,lead.owner].map(normalizeName).filter(Boolean);
 if(!phone||!names.length)return [];
 return records.filter(other=>other.id!==lead.id&&normalizePhone(other.phone)===phone&&[other.shop,other.owner].some(name=>normalizeName(name)&&names.includes(normalizeName(name))));
}
