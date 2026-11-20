import test from 'node:test';
import assert from 'node:assert/strict';
import {inquiryStatus, matchesStage, scopeInquiries, inquiryMetrics} from '../src/inquiryMetrics.js';
const records = [
  {id:'PI-1',status:'Pending',date:'2026-11-04',staff:'A',staffId:'0023456',buyer:'Shop One'},
  {id:'PI-2',status:'Confirmed',date:'2026-11-04',staff:'A'},
  {id:'PI-3',status:'Delivered',date:'2026-11-03',staff:'B',salesOrder:{id:'SO-1'}},
  {id:'PI-4',status:'Canceled',date:'2026-11-04',staff:'A'},
  {id:'PI-5',status:'Rejected',date:'2026-11-04',staff:'A'},
];
test('counts acceptance only when a sales order is saved',()=>{
  assert.deepEqual(inquiryMetrics(records),{total:5,pending:1,accepted:1,canceled:2});
  assert.equal(matchesStage(records[1],'Accepted'),false);
  const saved=records.map(r=>r.id==='PI-2'?{...r,salesOrder:{id:'SO-2'}}:r);
  assert.deepEqual(inquiryMetrics(saved),{total:5,pending:1,accepted:2,canceled:2});
});
test('shares date, salesperson and search scope across metrics and stages',()=>{
  const scoped=scopeInquiries(records,{day:'2026-11-04',salesperson:'A',query:' 0023456 '});
  assert.deepEqual(scoped.map(r=>r.id),['PI-1']);
  assert.equal(inquiryMetrics(scoped).pending,1);
  assert.equal(scopeInquiries(records,{query:'shop one'}).length,1);
  assert.equal(scopeInquiries(records,{query:'missing'}).length,0);
});
test('canceled inquiries leave pending counts and include legacy rejections',()=>{
  assert.equal(inquiryStatus('Rejected'),'Canceled');
  assert.equal(records.filter(r=>matchesStage(r,'Canceled')).length,2);
  const canceled=records.map(r=>r.id==='PI-1'?{...r,status:'Canceled'}:r);
  assert.equal(inquiryMetrics(canceled).pending,0);
});
