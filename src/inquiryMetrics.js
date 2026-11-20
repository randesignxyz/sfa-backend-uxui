export const inquiryStatus = value => ['Confirmed', 'Delivered'].includes(value) ? 'Accepted' : value === 'Rejected' ? 'Canceled' : value;
export const matchesStage = (record, stage) => {
  if (stage === 'All') return true;
  if (stage === 'Accepted') return Boolean(record.salesOrder);
  if (stage === 'SO Created') return Boolean(record.salesOrder);
  return inquiryStatus(record.status) === stage;
};
export const scopeInquiries = (records, {query = '', salesperson, day} = {}) => records.filter(record =>
  (!salesperson || record.staff === salesperson) && (!day || record.date === day) &&
  [record.id, record.buyer, record.phone, record.staff, record.staffId].filter(Boolean).join(' ').toLowerCase().includes(query.trim().toLowerCase())
);
export const inquiryMetrics = records => ({
  total: records.length,
  pending: records.filter(record => matchesStage(record, 'Pending')).length,
  accepted: records.filter(record => matchesStage(record, 'Accepted')).length,
  canceled: records.filter(record => matchesStage(record, 'Canceled')).length,
});
