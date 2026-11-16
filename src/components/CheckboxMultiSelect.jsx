import React from 'react';
import {Checkbox,Select} from 'antd';
import './CheckboxMultiSelect.css';

/** Shared filter pattern: searchable checkbox options, removable tags, no extra tick. */
export default function CheckboxMultiSelect({value=[],options=[],onChange,...props}){
 return <Select {...props} mode="multiple" allowClear showSearch optionFilterProp="label" maxTagCount="responsive" menuItemSelectedIcon={null} value={value} options={options} onChange={onChange} optionRender={option=><span className="checkbox-multiselect-option"><Checkbox checked={value.includes(option.value)} disabled={option.data.disabled} tabIndex={-1} style={{pointerEvents:'none'}}/><span>{option.label}</span></span>}/>;
}
