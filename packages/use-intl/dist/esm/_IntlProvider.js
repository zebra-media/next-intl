import e,{useState as a,useMemo as o}from"react";import{i as t}from"./initializeConfig-8268c3a9.js";import{I as r}from"./IntlContext-b1dc6cbd.js";function s(s){let{children:n,defaultTranslationValues:l,formats:i,getMessageFallback:m,locale:c,messages:f,now:g,onError:u,timeZone:p}=s;const[d]=a((()=>new Map)),w=o((()=>({...t({locale:c,defaultTranslationValues:l,formats:i,getMessageFallback:m,messages:f,now:g,onError:u,timeZone:p}),messageFormatCache:d})),[l,i,m,c,d,f,g,u,p]);return e.createElement(r.Provider,{value:w},n)}export{s as IntlProvider};
