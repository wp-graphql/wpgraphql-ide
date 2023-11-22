"use strict";(globalThis.webpackChunk=globalThis.webpackChunk||[]).push([[92],{5092:(e,n,t)=>{t.r(n),t.d(n,{c:()=>c});var i=t(5421),l=Object.defineProperty,o=(e,n)=>l(e,"name",{value:n,configurable:!0});function r(e,n){for(var t=0;t<n.length;t++){const i=n[t];if("string"!=typeof i&&!Array.isArray(i))for(const n in i)if("default"!==n&&!(n in e)){const t=Object.getOwnPropertyDescriptor(i,n);t&&Object.defineProperty(e,n,t.get?t:{enumerable:!0,get:()=>i[n]})}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}o(r,"_mergeNamespaces"),function(e){var n={},t=/[^\s\u00a0]/,i=e.Pos,l=e.cmpPos;function r(e){var n=e.search(t);return-1==n?0:n}function a(e,n,t){return/\bstring\b/.test(e.getTokenTypeAt(i(n.line,0)))&&!/^[\'\"\`]/.test(t)}function c(e,n){var t=e.getMode();return!1!==t.useInnerComments&&t.innerMode?e.getModeAt(n):t}o(r,"firstNonWS"),e.commands.toggleComment=function(e){e.toggleComment()},e.defineExtension("toggleComment",(function(e){e||(e=n);for(var t=this,l=1/0,o=this.listSelections(),r=null,a=o.length-1;a>=0;a--){var c=o[a].from(),m=o[a].to();c.line>=l||(m.line>=l&&(m=i(l,0)),l=c.line,null==r?t.uncomment(c,m,e)?r="un":(t.lineComment(c,m,e),r="line"):"un"==r?t.uncomment(c,m,e):t.lineComment(c,m,e))}})),o(a,"probablyInsideString"),o(c,"getMode"),e.defineExtension("lineComment",(function(e,l,o){o||(o=n);var m=this,g=c(m,e),s=m.getLine(e.line);if(null!=s&&!a(m,e,s)){var f=o.lineComment||g.lineComment;if(!f)return void((o.blockCommentStart||g.blockCommentStart)&&(o.fullLines=!0,m.blockComment(e,l,o)));var u=Math.min(0!=l.ch||l.line==e.line?l.line+1:l.line,m.lastLine()+1),d=null==o.padding?" ":o.padding,h=o.commentBlankLines||e.line==l.line;m.operation((function(){if(o.indent){for(var n=null,l=e.line;l<u;++l){var a=(c=m.getLine(l)).slice(0,r(c));(null==n||n.length>a.length)&&(n=a)}for(l=e.line;l<u;++l){var c=m.getLine(l),g=n.length;!h&&!t.test(c)||(c.slice(0,g)!=n&&(g=r(c)),m.replaceRange(n+f+d,i(l,0),i(l,g)))}}else for(l=e.line;l<u;++l)(h||t.test(m.getLine(l)))&&m.replaceRange(f+d,i(l,0))}))}})),e.defineExtension("blockComment",(function(e,o,r){r||(r=n);var a=this,m=c(a,e),g=r.blockCommentStart||m.blockCommentStart,s=r.blockCommentEnd||m.blockCommentEnd;if(g&&s){if(!/\bcomment\b/.test(a.getTokenTypeAt(i(e.line,0)))){var f=Math.min(o.line,a.lastLine());f!=e.line&&0==o.ch&&t.test(a.getLine(f))&&--f;var u=null==r.padding?" ":r.padding;e.line>f||a.operation((function(){if(0!=r.fullLines){var n=t.test(a.getLine(f));a.replaceRange(u+s,i(f)),a.replaceRange(g+u,i(e.line,0));var c=r.blockCommentLead||m.blockCommentLead;if(null!=c)for(var d=e.line+1;d<=f;++d)(d!=f||n)&&a.replaceRange(c+u,i(d,0))}else{var h=0==l(a.getCursor("to"),o),p=!a.somethingSelected();a.replaceRange(s,o),h&&a.setSelection(p?o:a.getCursor("from"),o),a.replaceRange(g,e)}}))}}else(r.lineComment||m.lineComment)&&0!=r.fullLines&&a.lineComment(e,o,r)})),e.defineExtension("uncomment",(function(e,l,o){o||(o=n);var r,a=this,m=c(a,e),g=Math.min(0!=l.ch||l.line==e.line?l.line:l.line-1,a.lastLine()),s=Math.min(e.line,g),f=o.lineComment||m.lineComment,u=[],d=null==o.padding?" ":o.padding;e:if(f){for(var h=s;h<=g;++h){var p=a.getLine(h),v=p.indexOf(f);if(v>-1&&!/comment/.test(a.getTokenTypeAt(i(h,v+1)))&&(v=-1),-1==v&&t.test(p)||v>-1&&t.test(p.slice(0,v)))break e;u.push(p)}if(a.operation((function(){for(var e=s;e<=g;++e){var n=u[e-s],t=n.indexOf(f),l=t+f.length;t<0||(n.slice(l,l+d.length)==d&&(l+=d.length),r=!0,a.replaceRange("",i(e,t),i(e,l)))}})),r)return!0}var b=o.blockCommentStart||m.blockCommentStart,C=o.blockCommentEnd||m.blockCommentEnd;if(!b||!C)return!1;var k=o.blockCommentLead||m.blockCommentLead,L=a.getLine(s),O=L.indexOf(b);if(-1==O)return!1;var x=g==s?L:a.getLine(g),y=x.indexOf(C,g==s?O+b.length:0),S=i(s,O+1),T=i(g,y+1);if(-1==y||!/comment/.test(a.getTokenTypeAt(S))||!/comment/.test(a.getTokenTypeAt(T))||a.getRange(S,T,"\n").indexOf(C)>-1)return!1;var R=L.lastIndexOf(b,e.ch),M=-1==R?-1:L.slice(0,e.ch).indexOf(C,R+b.length);if(-1!=R&&-1!=M&&M+C.length!=e.ch)return!1;M=x.indexOf(C,l.ch);var A=x.slice(l.ch).lastIndexOf(b,M-l.ch);return R=-1==M||-1==A?-1:l.ch+A,(-1==M||-1==R||R==l.ch)&&(a.operation((function(){a.replaceRange("",i(g,y-(d&&x.slice(y-d.length,y)==d?d.length:0)),i(g,y+C.length));var e=O+b.length;if(d&&L.slice(e,e+d.length)==d&&(e+=d.length),a.replaceRange("",i(s,O),i(s,e)),k)for(var n=s+1;n<=g;++n){var l=a.getLine(n),o=l.indexOf(k);if(-1!=o&&!t.test(l.slice(0,o))){var r=o+k.length;d&&l.slice(r,r+d.length)==d&&(r+=d.length),a.replaceRange("",i(n,o),i(n,r))}}})),!0)}))}((0,i.r)());var a={};const c=r({__proto__:null,default:(0,i.g)(a)},[a])}}]);