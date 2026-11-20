import React from 'react';
import {createRoot} from 'react-dom/client';
import {ConfigProvider,App} from 'antd';
import Workspace from './Workspace';
createRoot(document.getElementById('root')).render(<ConfigProvider theme={{token:{colorPrimary:'#B49A00',colorPrimaryHover:'#9c8500',colorPrimaryActive:'#806d00',colorLink:'#1677ff',colorLinkHover:'#4096ff',colorLinkActive:'#0958d9',borderRadius:8,fontSize:14,colorBgLayout:'#f5f5f5',fontFamily:'Inter, "Kantumruy Pro", Arial, sans-serif'},components:{Checkbox:{borderRadiusSM:4,controlInteractiveSize:16},Table:{rowHoverBg:'#fcfaef'},Menu:{itemHeight:40},Card:{headerFontSize:16}}}}><App><Workspace/></App></ConfigProvider>);
