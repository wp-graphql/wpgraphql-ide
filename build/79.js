"use strict";(globalThis.webpackChunk=globalThis.webpackChunk||[]).push([[79],{6079:(t,e,i)=>{i.r(e),i.d(e,{s:()=>l});var n=i(5421),o=Object.defineProperty,s=(t,e)=>o(t,"name",{value:e,configurable:!0});function r(t,e){for(var i=0;i<e.length;i++){const n=e[i];if("string"!=typeof n&&!Array.isArray(n))for(const e in n)if("default"!==e&&!(e in t)){const i=Object.getOwnPropertyDescriptor(n,e);i&&Object.defineProperty(t,e,i.get?i:{enumerable:!0,get:()=>n[e]})}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}s(r,"_mergeNamespaces"),function(t){var e="CodeMirror-hint-active";function i(t,e){if(this.cm=t,this.options=e,this.widget=null,this.debounce=0,this.tick=0,this.startPos=this.cm.getCursor("start"),this.startLen=this.cm.getLine(this.startPos.line).length-this.cm.getSelection().length,this.options.updateOnCursorActivity){var i=this;t.on("cursorActivity",this.activityFunc=function(){i.cursorActivity()})}}t.showHint=function(t,e,i){if(!e)return t.showHint(i);i&&i.async&&(e.async=!0);var n={hint:e};if(i)for(var o in i)n[o]=i[o];return t.showHint(n)},t.defineExtension("showHint",(function(e){e=r(this,this.getCursor("start"),e);var n=this.listSelections();if(!(n.length>1)){if(this.somethingSelected()){if(!e.hint.supportsSelection)return;for(var o=0;o<n.length;o++)if(n[o].head.line!=n[o].anchor.line)return}this.state.completionActive&&this.state.completionActive.close();var s=this.state.completionActive=new i(this,e);s.options.hint&&(t.signal(this,"startCompletion",this),s.update(!0))}})),t.defineExtension("closeHint",(function(){this.state.completionActive&&this.state.completionActive.close()})),s(i,"Completion");var n=window.requestAnimationFrame||function(t){return setTimeout(t,1e3/60)},o=window.cancelAnimationFrame||clearTimeout;function r(t,e,i){var n=t.options.hintOptions,o={};for(var s in p)o[s]=p[s];if(n)for(var s in n)void 0!==n[s]&&(o[s]=n[s]);if(i)for(var s in i)void 0!==i[s]&&(o[s]=i[s]);return o.hint.resolve&&(o.hint=o.hint.resolve(t,e)),o}function c(t){return"string"==typeof t?t:t.text}function l(t,e){var i={Up:function(){e.moveFocus(-1)},Down:function(){e.moveFocus(1)},PageUp:function(){e.moveFocus(1-e.menuSize(),!0)},PageDown:function(){e.moveFocus(e.menuSize()-1,!0)},Home:function(){e.setFocus(0)},End:function(){e.setFocus(e.length-1)},Enter:e.pick,Tab:e.pick,Esc:e.close};/Mac/.test(navigator.platform)&&(i["Ctrl-P"]=function(){e.moveFocus(-1)},i["Ctrl-N"]=function(){e.moveFocus(1)});var n=t.options.customKeys,o=n?{}:i;function r(t,n){var r;r="string"!=typeof n?s((function(t){return n(t,e)}),"bound"):i.hasOwnProperty(n)?i[n]:n,o[t]=r}if(s(r,"addBinding"),n)for(var c in n)n.hasOwnProperty(c)&&r(c,n[c]);var l=t.options.extraKeys;if(l)for(var c in l)l.hasOwnProperty(c)&&r(c,l[c]);return o}function h(t,e){for(;e&&e!=t;){if("LI"===e.nodeName.toUpperCase()&&e.parentNode==t)return e;e=e.parentNode}}function a(i,n){this.id="cm-complete-"+Math.floor(Math.random(1e6)),this.completion=i,this.data=n,this.picked=!1;var o=this,s=i.cm,r=s.getInputField().ownerDocument,a=r.defaultView||r.parentWindow,u=this.hints=r.createElement("ul");u.setAttribute("role","listbox"),u.setAttribute("aria-expanded","true"),u.id=this.id;var d=i.cm.options.theme;u.className="CodeMirror-hints "+d,this.selectedHint=n.selectedHint||0;for(var f=n.list,p=0;p<f.length;++p){var g=u.appendChild(r.createElement("li")),m=f[p],v="CodeMirror-hint"+(p!=this.selectedHint?"":" "+e);null!=m.className&&(v=m.className+" "+v),g.className=v,p==this.selectedHint&&g.setAttribute("aria-selected","true"),g.id=this.id+"-"+p,g.setAttribute("role","option"),m.render?m.render(g,n,m):g.appendChild(r.createTextNode(m.displayText||c(m))),g.hintId=p}var y=i.options.container||r.body,b=s.cursorCoords(i.options.alignWithWord?n.from:null),w=b.left,H=b.bottom,A=!0,C=0,k=0;if(y!==r.body){var O=-1!==["absolute","relative","fixed"].indexOf(a.getComputedStyle(y).position)?y:y.offsetParent,S=O.getBoundingClientRect(),T=r.body.getBoundingClientRect();C=S.left-T.left-O.scrollLeft,k=S.top-T.top-O.scrollTop}u.style.left=w-C+"px",u.style.top=H-k+"px";var x=a.innerWidth||Math.max(r.body.offsetWidth,r.documentElement.offsetWidth),F=a.innerHeight||Math.max(r.body.offsetHeight,r.documentElement.offsetHeight);y.appendChild(u),s.getInputField().setAttribute("aria-autocomplete","list"),s.getInputField().setAttribute("aria-owns",this.id),s.getInputField().setAttribute("aria-activedescendant",this.id+"-"+this.selectedHint);var M,N=i.options.moveOnOverlap?u.getBoundingClientRect():new DOMRect,P=!!i.options.paddingForScrollbar&&u.scrollHeight>u.clientHeight+1;if(setTimeout((function(){M=s.getScrollInfo()})),N.bottom-F>0){var I=N.bottom-N.top;if(b.top-(b.bottom-N.top)-I>0)u.style.top=(H=b.top-I-k)+"px",A=!1;else if(I>F){u.style.height=F-5+"px",u.style.top=(H=b.bottom-N.top-k)+"px";var E=s.getCursor();n.from.ch!=E.ch&&(b=s.cursorCoords(E),u.style.left=(w=b.left-C)+"px",N=u.getBoundingClientRect())}}var W,R=N.right-x;if(P&&(R+=s.display.nativeBarWidth),R>0&&(N.right-N.left>x&&(u.style.width=x-5+"px",R-=N.right-N.left-x),u.style.left=(w=b.left-R-C)+"px"),P)for(var B=u.firstChild;B;B=B.nextSibling)B.style.paddingRight=s.display.nativeBarWidth+"px";s.addKeyMap(this.keyMap=l(i,{moveFocus:function(t,e){o.changeActive(o.selectedHint+t,e)},setFocus:function(t){o.changeActive(t)},menuSize:function(){return o.screenAmount()},length:f.length,close:function(){i.close()},pick:function(){o.pick()},data:n})),i.options.closeOnUnfocus&&(s.on("blur",this.onBlur=function(){W=setTimeout((function(){i.close()}),100)}),s.on("focus",this.onFocus=function(){clearTimeout(W)})),s.on("scroll",this.onScroll=function(){var t=s.getScrollInfo(),e=s.getWrapperElement().getBoundingClientRect();M||(M=s.getScrollInfo());var n=H+M.top-t.top,o=n-(a.pageYOffset||(r.documentElement||r.body).scrollTop);if(A||(o+=u.offsetHeight),o<=e.top||o>=e.bottom)return i.close();u.style.top=n+"px",u.style.left=w+M.left-t.left+"px"}),t.on(u,"dblclick",(function(t){var e=h(u,t.target||t.srcElement);e&&null!=e.hintId&&(o.changeActive(e.hintId),o.pick())})),t.on(u,"click",(function(t){var e=h(u,t.target||t.srcElement);e&&null!=e.hintId&&(o.changeActive(e.hintId),i.options.completeOnSingleClick&&o.pick())})),t.on(u,"mousedown",(function(){setTimeout((function(){s.focus()}),20)}));var K=this.getSelectedHintRange();return(0!==K.from||0!==K.to)&&this.scrollToActive(),t.signal(n,"select",f[this.selectedHint],u.childNodes[this.selectedHint]),!0}function u(t,e){if(!t.somethingSelected())return e;for(var i=[],n=0;n<e.length;n++)e[n].supportsSelection&&i.push(e[n]);return i}function d(t,e,i,n){if(t.async)t(e,n,i);else{var o=t(e,i);o&&o.then?o.then(n):n(o)}}function f(e,i){var n,o=e.getHelpers(i,"hint");if(o.length){var r=s((function(t,e,i){var n=u(t,o);function r(o){if(o==n.length)return e(null);d(n[o],t,i,(function(t){t&&t.list.length>0?e(t):r(o+1)}))}s(r,"run"),r(0)}),"resolved");return r.async=!0,r.supportsSelection=!0,r}return(n=e.getHelper(e.getCursor(),"hintWords"))?function(e){return t.hint.fromList(e,{words:n})}:t.hint.anyword?function(e,i){return t.hint.anyword(e,i)}:function(){}}i.prototype={close:function(){this.active()&&(this.cm.state.completionActive=null,this.tick=null,this.options.updateOnCursorActivity&&this.cm.off("cursorActivity",this.activityFunc),this.widget&&this.data&&t.signal(this.data,"close"),this.widget&&this.widget.close(),t.signal(this.cm,"endCompletion",this.cm))},active:function(){return this.cm.state.completionActive==this},pick:function(e,i){var n=e.list[i],o=this;this.cm.operation((function(){n.hint?n.hint(o.cm,e,n):o.cm.replaceRange(c(n),n.from||e.from,n.to||e.to,"complete"),t.signal(e,"pick",n),o.cm.scrollIntoView()})),this.options.closeOnPick&&this.close()},cursorActivity:function(){this.debounce&&(o(this.debounce),this.debounce=0);var t=this.startPos;this.data&&(t=this.data.from);var e=this.cm.getCursor(),i=this.cm.getLine(e.line);if(e.line!=this.startPos.line||i.length-e.ch!=this.startLen-this.startPos.ch||e.ch<t.ch||this.cm.somethingSelected()||!e.ch||this.options.closeCharacters.test(i.charAt(e.ch-1)))this.close();else{var s=this;this.debounce=n((function(){s.update()})),this.widget&&this.widget.disable()}},update:function(t){if(null!=this.tick){var e=this,i=++this.tick;d(this.options.hint,this.cm,this.options,(function(n){e.tick==i&&e.finishUpdate(n,t)}))}},finishUpdate:function(e,i){this.data&&t.signal(this.data,"update");var n=this.widget&&this.widget.picked||i&&this.options.completeSingle;this.widget&&this.widget.close(),this.data=e,e&&e.list.length&&(n&&1==e.list.length?this.pick(e,0):(this.widget=new a(this,e),t.signal(e,"shown")))}},s(r,"parseOptions"),s(c,"getText"),s(l,"buildKeyMap"),s(h,"getHintElement"),s(a,"Widget"),a.prototype={close:function(){if(this.completion.widget==this){this.completion.widget=null,this.hints.parentNode&&this.hints.parentNode.removeChild(this.hints),this.completion.cm.removeKeyMap(this.keyMap);var t=this.completion.cm.getInputField();t.removeAttribute("aria-activedescendant"),t.removeAttribute("aria-owns");var e=this.completion.cm;this.completion.options.closeOnUnfocus&&(e.off("blur",this.onBlur),e.off("focus",this.onFocus)),e.off("scroll",this.onScroll)}},disable:function(){this.completion.cm.removeKeyMap(this.keyMap);var t=this;this.keyMap={Enter:function(){t.picked=!0}},this.completion.cm.addKeyMap(this.keyMap)},pick:function(){this.completion.pick(this.data,this.selectedHint)},changeActive:function(i,n){if(i>=this.data.list.length?i=n?this.data.list.length-1:0:i<0&&(i=n?0:this.data.list.length-1),this.selectedHint!=i){var o=this.hints.childNodes[this.selectedHint];o&&(o.className=o.className.replace(" "+e,""),o.removeAttribute("aria-selected")),(o=this.hints.childNodes[this.selectedHint=i]).className+=" "+e,o.setAttribute("aria-selected","true"),this.completion.cm.getInputField().setAttribute("aria-activedescendant",o.id),this.scrollToActive(),t.signal(this.data,"select",this.data.list[this.selectedHint],o)}},scrollToActive:function(){var t=this.getSelectedHintRange(),e=this.hints.childNodes[t.from],i=this.hints.childNodes[t.to],n=this.hints.firstChild;e.offsetTop<this.hints.scrollTop?this.hints.scrollTop=e.offsetTop-n.offsetTop:i.offsetTop+i.offsetHeight>this.hints.scrollTop+this.hints.clientHeight&&(this.hints.scrollTop=i.offsetTop+i.offsetHeight-this.hints.clientHeight+n.offsetTop)},screenAmount:function(){return Math.floor(this.hints.clientHeight/this.hints.firstChild.offsetHeight)||1},getSelectedHintRange:function(){var t=this.completion.options.scrollMargin||0;return{from:Math.max(0,this.selectedHint-t),to:Math.min(this.data.list.length-1,this.selectedHint+t)}}},s(u,"applicableHelpers"),s(d,"fetchHints"),s(f,"resolveAutoHints"),t.registerHelper("hint","auto",{resolve:f}),t.registerHelper("hint","fromList",(function(e,i){var n,o=e.getCursor(),s=e.getTokenAt(o),r=t.Pos(o.line,s.start),c=o;s.start<o.ch&&/\w/.test(s.string.charAt(o.ch-s.start-1))?n=s.string.substr(0,o.ch-s.start):(n="",r=o);for(var l=[],h=0;h<i.words.length;h++){var a=i.words[h];a.slice(0,n.length)==n&&l.push(a)}if(l.length)return{list:l,from:r,to:c}})),t.commands.autocomplete=t.showHint;var p={hint:t.hint.auto,completeSingle:!0,alignWithWord:!0,closeCharacters:/[\s()\[\]{};:>,]/,closeOnPick:!0,closeOnUnfocus:!0,updateOnCursorActivity:!0,completeOnSingleClick:!0,container:null,customKeys:null,extraKeys:null,paddingForScrollbar:!0,moveOnOverlap:!0};t.defineOption("hintOptions",null)}((0,n.r)());var c={};const l=r({__proto__:null,default:(0,n.g)(c)},[c])}}]);