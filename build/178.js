"use strict";(globalThis.webpackChunk=globalThis.webpackChunk||[]).push([[178,480],{7480:(e,t,r)=>{r.r(t),r.d(t,{C:()=>l,c:()=>i});var n=r(5421);function a(e,t){for(var r=0;r<t.length;r++){const n=t[r];if("string"!=typeof n&&!Array.isArray(n))for(const t in n)if("default"!==t&&!(t in e)){const r=Object.getOwnPropertyDescriptor(n,t);r&&Object.defineProperty(e,t,r.get?r:{enumerable:!0,get:()=>n[t]})}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(0,Object.defineProperty)(a,"name",{value:"_mergeNamespaces",configurable:!0});var u=(0,n.r)();const l=(0,n.g)(u),i=a({__proto__:null,default:l},[u])},8009:(e,t,r)=>{function n(e,t){var r,n;const{levels:a,indentLevel:u}=e;return((a&&0!==a.length?a.at(-1)-(null!==(r=this.electricInput)&&void 0!==r&&r.test(t)?1:0):u)||0)*((null===(n=this.config)||void 0===n?void 0:n.indentUnit)||0)}r.d(t,{i:()=>n}),(0,Object.defineProperty)(n,"name",{value:"indent",configurable:!0})},4178:(e,t,r)=>{r.r(t);var n=r(7480),a=r(5798),u=r(8009);r(5421),n.C.defineMode("graphql-results",(e=>{const t=(0,a.Xs)({eatWhitespace:e=>e.eatSpace(),lexRules:l,parseRules:i,editorConfig:{tabSize:e.tabSize}});return{config:e,startState:t.startState,token:t.token,indent:u.i,electricInput:/^\s*[}\]]/,fold:"brace",closeBrackets:{pairs:'[]{}""',explode:"[]{}"}}}));const l={Punctuation:/^\[|]|\{|\}|:|,/,Number:/^-?(?:0|(?:[1-9][0-9]*))(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?/,String:/^"(?:[^"\\]|\\(?:"|\/|\\|b|f|n|r|t|u[0-9a-fA-F]{4}))*"?/,Keyword:/^true|false|null/},i={Document:[(0,a.p)("{"),(0,a.pb)("Entry",(0,a.p)(",")),(0,a.p)("}")],Entry:[(0,a.t)("String","def"),(0,a.p)(":"),"Value"],Value(e){switch(e.kind){case"Number":return"NumberValue";case"String":return"StringValue";case"Punctuation":switch(e.value){case"[":return"ListValue";case"{":return"ObjectValue"}return null;case"Keyword":switch(e.value){case"true":case"false":return"BooleanValue";case"null":return"NullValue"}return null}},NumberValue:[(0,a.t)("Number","number")],StringValue:[(0,a.t)("String","string")],BooleanValue:[(0,a.t)("Keyword","builtin")],NullValue:[(0,a.t)("Keyword","keyword")],ListValue:[(0,a.p)("["),(0,a.pb)("Value",(0,a.p)(",")),(0,a.p)("]")],ObjectValue:[(0,a.p)("{"),(0,a.pb)("ObjectField",(0,a.p)(",")),(0,a.p)("}")],ObjectField:[(0,a.t)("String","property"),(0,a.p)(":"),"Value"]}}}]);