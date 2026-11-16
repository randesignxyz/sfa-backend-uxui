import dayjs from 'dayjs';
export function matchesAdvanced(record,filters){
 if(['salesperson','region','channel','subChannel','outlet'].some(key=>filters[key]&&record[key]!==filters[key]))return false;
 if(filters.hasPhoto!==undefined&&Boolean(record.photoUrl||record.imageUrl)!==filters.hasPhoto)return false;
 if(filters.prospectOnly&&record.customerId)return false;
 if(filters.from||filters.to){const date=dayjs(record.createdAt);if(!record.createdAt||!date.isValid())return false;if(filters.from&&date.isBefore(filters.from,'day'))return false;if(filters.to&&date.isAfter(filters.to,'day'))return false}
 return true;
}
