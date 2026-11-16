import React,{useRef} from 'react';
import {Checkbox,Select} from 'antd';
import './CheckboxMultiSelect.css';

// Empty arrays mean unrestricted/all; this reserved value represents explicitly none.
const NONE='__sfa_filter_none__';
export default function CheckboxMultiSelect({value=[],options=[],onChange,...props}){
 const clearing=useRef(false);
 const enabled=options.filter(option=>!option.disabled);
 const enabledValues=enabled.map(option=>option.value);
 const unrestricted=value.length===0;
 const selected=unrestricted?enabledValues:value.filter(item=>item!==NONE);
 const selectedCount=enabledValues.filter(item=>selected.includes(item)).length;
 const allSelected=enabled.length>0&&selectedCount===enabled.length;
 function emit(next){
  const every=enabled.length>0&&enabledValues.every(item=>next.includes(item));
  const normalized=every?[]:next.length?next:[NONE];
  onChange?.(normalized,options.filter(option=>next.includes(option.value)));
 }
 function change(next){
  // Clicking a checked option while unrestricted removes it from the full set.
  if(unrestricted&&next.length){emit(enabledValues.filter(item=>item!==next[0]));return}
  emit(next.filter(item=>item!==NONE));
 }
 return <Select {...props} classNames={{popup:{root:'checkbox-multiselect-popup'}}} mode="multiple" allowClear showSearch optionFilterProp="label" maxTagCount="responsive" menuItemSelectedIcon={null} value={value} labelRender={item=>item.value===NONE?'None selected':item.label} options={options} onClear={()=>{clearing.current=true;onChange?.([],[])}} onChange={(next)=>{if(clearing.current){clearing.current=false;onChange?.([],[]);return}change(next)}} popupRender={menu=><><div className="checkbox-multiselect-all" onMouseDown={event=>event.preventDefault()}><Checkbox checked={allSelected} indeterminate={selectedCount>0&&!allSelected} disabled={!enabled.length} onChange={event=>emit(event.target.checked?enabledValues:[])}>Select all</Checkbox></div>{menu}</>} optionRender={option=><span className="checkbox-multiselect-option"><Checkbox checked={selected.includes(option.value)} disabled={option.data.disabled} tabIndex={-1} style={{pointerEvents:'none'}}/><span>{option.label}</span></span>}/>;
}
