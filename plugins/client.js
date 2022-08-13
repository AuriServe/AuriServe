(()=>{"use strict";var e={d:(t,n)=>{for(var _ in n)e.o(n,_)&&!e.o(t,_)&&Object.defineProperty(t,_,{enumerable:!0,get:n[_]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{Component:()=>m,Fragment:()=>y,cloneElement:()=>L,createContext:()=>W,createElement:()=>d,createRef:()=>v,h:()=>d,hydrate:()=>F,isValidElement:()=>o,options:()=>_,render:()=>M,renderToString:()=>Xe,toChildArray:()=>w,useCallback:()=>ie,useContext:()=>ue,useDebugValue:()=>ce,useEffect:()=>ne,useErrorBoundary:()=>ae,useImperativeHandle:()=>oe,useLayoutEffect:()=>_e,useMemo:()=>le,useReducer:()=>te,useRef:()=>re,useState:()=>ee});var n,_,r,o,l,i,u,c={},a=[],f=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(e,t){for(var n in t)e[n]=t[n];return e}function p(e){var t=e.parentNode;t&&t.removeChild(e)}function d(e,t,_){var r,o,l,i={};for(l in t)"key"==l?r=t[l]:"ref"==l?o=t[l]:i[l]=t[l];if(arguments.length>2&&(i.children=arguments.length>3?n.call(arguments,2):_),"function"==typeof e&&null!=e.defaultProps)for(l in e.defaultProps)void 0===i[l]&&(i[l]=e.defaultProps[l]);return h(e,i,r,o,null)}function h(e,t,n,o,l){var i={type:e,props:t,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==l?++r:l};return null==l&&null!=_.vnode&&_.vnode(i),i}function v(){return{current:null}}function y(e){return e.children}function m(e,t){this.props=e,this.context=t}function g(e,t){if(null==t)return e.__?g(e.__,e.__.__k.indexOf(e)+1):null;for(var n;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e)return n.__e;return"function"==typeof e.type?g(e):null}function b(e){var t,n;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e){e.__e=e.__c.base=n.__e;break}return b(e)}}function k(e){(!e.__d&&(e.__d=!0)&&l.push(e)&&!x.__r++||i!==_.debounceRendering)&&((i=_.debounceRendering)||setTimeout)(x)}function x(){for(var e;x.__r=l.length;)e=l.sort((function(e,t){return e.__v.__b-t.__v.__b})),l=[],e.some((function(e){var t,n,_,r,o,l;e.__d&&(o=(r=(t=e).__v).__e,(l=t.__P)&&(n=[],(_=s({},r)).__v=r.__v+1,N(l,r,_,t.__n,void 0!==l.ownerSVGElement,null!=r.__h?[o]:null,n,null==o?g(r):o,r.__h),U(n,r),r.__e!=o&&b(r)))}))}function S(e,t,n,_,r,o,l,i,u,f){var s,p,d,v,m,b,k,x=_&&_.__k||a,S=x.length;for(n.__k=[],s=0;s<t.length;s++)if(null!=(v=n.__k[s]=null==(v=t[s])||"boolean"==typeof v?null:"string"==typeof v||"number"==typeof v||"bigint"==typeof v?h(null,v,null,null,v):Array.isArray(v)?h(y,{children:v},null,null,null):v.__b>0?h(v.type,v.props,v.key,null,v.__v):v)){if(v.__=n,v.__b=n.__b+1,null===(d=x[s])||d&&v.key==d.key&&v.type===d.type)x[s]=void 0;else for(p=0;p<S;p++){if((d=x[p])&&v.key==d.key&&v.type===d.type){x[p]=void 0;break}d=null}N(e,v,d=d||c,r,o,l,i,u,f),m=v.__e,(p=v.ref)&&d.ref!=p&&(k||(k=[]),d.ref&&k.push(d.ref,null,v),k.push(p,v.__c||m,v)),null!=m?(null==b&&(b=m),"function"==typeof v.type&&v.__k===d.__k?v.__d=u=C(v,u,e):u=E(e,v,d,x,m,u),"function"==typeof n.type&&(n.__d=u)):u&&d.__e==u&&u.parentNode!=e&&(u=g(d))}for(n.__e=b,s=S;s--;)null!=x[s]&&("function"==typeof n.type&&null!=x[s].__e&&x[s].__e==n.__d&&(n.__d=g(_,s+1)),R(x[s],x[s]));if(k)for(s=0;s<k.length;s++)D(k[s],k[++s],k[++s])}function C(e,t,n){for(var _,r=e.__k,o=0;r&&o<r.length;o++)(_=r[o])&&(_.__=e,t="function"==typeof _.type?C(_,t,n):E(n,_,_,r,_.__e,t));return t}function w(e,t){return t=t||[],null==e||"boolean"==typeof e||(Array.isArray(e)?e.some((function(e){w(e,t)})):t.push(e)),t}function E(e,t,n,_,r,o){var l,i,u;if(void 0!==t.__d)l=t.__d,t.__d=void 0;else if(null==n||r!=o||null==r.parentNode)e:if(null==o||o.parentNode!==e)e.appendChild(r),l=null;else{for(i=o,u=0;(i=i.nextSibling)&&u<_.length;u+=2)if(i==r)break e;e.insertBefore(r,o),l=o}return void 0!==l?l:r.nextSibling}function P(e,t,n){"-"===t[0]?e.setProperty(t,n):e[t]=null==n?"":"number"!=typeof n||f.test(t)?n:n+"px"}function H(e,t,n,_,r){var o;e:if("style"===t)if("string"==typeof n)e.style.cssText=n;else{if("string"==typeof _&&(e.style.cssText=_=""),_)for(t in _)n&&t in n||P(e.style,t,"");if(n)for(t in n)_&&n[t]===_[t]||P(e.style,t,n[t])}else if("o"===t[0]&&"n"===t[1])o=t!==(t=t.replace(/Capture$/,"")),t=t.toLowerCase()in e?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+o]=n,n?_||e.addEventListener(t,o?O:A,o):e.removeEventListener(t,o?O:A,o);else if("dangerouslySetInnerHTML"!==t){if(r)t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("href"!==t&&"list"!==t&&"form"!==t&&"tabIndex"!==t&&"download"!==t&&t in e)try{e[t]=null==n?"":n;break e}catch(e){}"function"==typeof n||(null!=n&&(!1!==n||"a"===t[0]&&"r"===t[1])?e.setAttribute(t,n):e.removeAttribute(t))}}function A(e){this.l[e.type+!1](_.event?_.event(e):e)}function O(e){this.l[e.type+!0](_.event?_.event(e):e)}function N(e,t,n,r,o,l,i,u,c){var a,f,p,d,h,v,g,b,k,x,C,w,E,P=t.type;if(void 0!==t.constructor)return null;null!=n.__h&&(c=n.__h,u=t.__e=n.__e,t.__h=null,l=[u]),(a=_.__b)&&a(t);try{e:if("function"==typeof P){if(b=t.props,k=(a=P.contextType)&&r[a.__c],x=a?k?k.props.value:a.__:r,n.__c?g=(f=t.__c=n.__c).__=f.__E:("prototype"in P&&P.prototype.render?t.__c=f=new P(b,x):(t.__c=f=new m(b,x),f.constructor=P,f.render=V),k&&k.sub(f),f.props=b,f.state||(f.state={}),f.context=x,f.__n=r,p=f.__d=!0,f.__h=[]),null==f.__s&&(f.__s=f.state),null!=P.getDerivedStateFromProps&&(f.__s==f.state&&(f.__s=s({},f.__s)),s(f.__s,P.getDerivedStateFromProps(b,f.__s))),d=f.props,h=f.state,p)null==P.getDerivedStateFromProps&&null!=f.componentWillMount&&f.componentWillMount(),null!=f.componentDidMount&&f.__h.push(f.componentDidMount);else{if(null==P.getDerivedStateFromProps&&b!==d&&null!=f.componentWillReceiveProps&&f.componentWillReceiveProps(b,x),!f.__e&&null!=f.shouldComponentUpdate&&!1===f.shouldComponentUpdate(b,f.__s,x)||t.__v===n.__v){f.props=b,f.state=f.__s,t.__v!==n.__v&&(f.__d=!1),f.__v=t,t.__e=n.__e,t.__k=n.__k,t.__k.forEach((function(e){e&&(e.__=t)})),f.__h.length&&i.push(f);break e}null!=f.componentWillUpdate&&f.componentWillUpdate(b,f.__s,x),null!=f.componentDidUpdate&&f.__h.push((function(){f.componentDidUpdate(d,h,v)}))}if(f.context=x,f.props=b,f.__v=t,f.__P=e,C=_.__r,w=0,"prototype"in P&&P.prototype.render)f.state=f.__s,f.__d=!1,C&&C(t),a=f.render(f.props,f.state,f.context);else do{f.__d=!1,C&&C(t),a=f.render(f.props,f.state,f.context),f.state=f.__s}while(f.__d&&++w<25);f.state=f.__s,null!=f.getChildContext&&(r=s(s({},r),f.getChildContext())),p||null==f.getSnapshotBeforeUpdate||(v=f.getSnapshotBeforeUpdate(d,h)),E=null!=a&&a.type===y&&null==a.key?a.props.children:a,S(e,Array.isArray(E)?E:[E],t,n,r,o,l,i,u,c),f.base=t.__e,t.__h=null,f.__h.length&&i.push(f),g&&(f.__E=f.__=null),f.__e=!1}else null==l&&t.__v===n.__v?(t.__k=n.__k,t.__e=n.__e):t.__e=T(n.__e,t,n,r,o,l,i,c);(a=_.diffed)&&a(t)}catch(e){t.__v=null,(c||null!=l)&&(t.__e=u,t.__h=!!c,l[l.indexOf(u)]=null),_.__e(e,t,n)}}function U(e,t){_.__c&&_.__c(t,e),e.some((function(t){try{e=t.__h,t.__h=[],e.some((function(e){e.call(t)}))}catch(e){_.__e(e,t.__v)}}))}function T(e,t,_,r,o,l,i,u){var a,f,s,d=_.props,h=t.props,v=t.type,y=0;if("svg"===v&&(o=!0),null!=l)for(;y<l.length;y++)if((a=l[y])&&"setAttribute"in a==!!v&&(v?a.localName===v:3===a.nodeType)){e=a,l[y]=null;break}if(null==e){if(null===v)return document.createTextNode(h);e=o?document.createElementNS("http://www.w3.org/2000/svg",v):document.createElement(v,h.is&&h),l=null,u=!1}if(null===v)d===h||u&&e.data===h||(e.data=h);else{if(l=l&&n.call(e.childNodes),f=(d=_.props||c).dangerouslySetInnerHTML,s=h.dangerouslySetInnerHTML,!u){if(null!=l)for(d={},y=0;y<e.attributes.length;y++)d[e.attributes[y].name]=e.attributes[y].value;(s||f)&&(s&&(f&&s.__html==f.__html||s.__html===e.innerHTML)||(e.innerHTML=s&&s.__html||""))}if(function(e,t,n,_,r){var o;for(o in n)"children"===o||"key"===o||o in t||H(e,o,null,n[o],_);for(o in t)r&&"function"!=typeof t[o]||"children"===o||"key"===o||"value"===o||"checked"===o||n[o]===t[o]||H(e,o,t[o],n[o],_)}(e,h,d,o,u),s)t.__k=[];else if(y=t.props.children,S(e,Array.isArray(y)?y:[y],t,_,r,o&&"foreignObject"!==v,l,i,l?l[0]:_.__k&&g(_,0),u),null!=l)for(y=l.length;y--;)null!=l[y]&&p(l[y]);u||("value"in h&&void 0!==(y=h.value)&&(y!==e.value||"progress"===v&&!y||"option"===v&&y!==d.value)&&H(e,"value",y,d.value,!1),"checked"in h&&void 0!==(y=h.checked)&&y!==e.checked&&H(e,"checked",y,d.checked,!1))}return e}function D(e,t,n){try{"function"==typeof e?e(t):e.current=t}catch(e){_.__e(e,n)}}function R(e,t,n){var r,o;if(_.unmount&&_.unmount(e),(r=e.ref)&&(r.current&&r.current!==e.__e||D(r,null,t)),null!=(r=e.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(e){_.__e(e,t)}r.base=r.__P=null}if(r=e.__k)for(o=0;o<r.length;o++)r[o]&&R(r[o],t,"function"!=typeof e.type);n||null==e.__e||p(e.__e),e.__e=e.__d=void 0}function V(e,t,n){return this.constructor(e,n)}function M(e,t,r){var o,l,i;_.__&&_.__(e,t),l=(o="function"==typeof r)?null:r&&r.__k||t.__k,i=[],N(t,e=(!o&&r||t).__k=d(y,null,[e]),l||c,c,void 0!==t.ownerSVGElement,!o&&r?[r]:l?null:t.firstChild?n.call(t.childNodes):null,i,!o&&r?r:l?l.__e:t.firstChild,o),U(i,e)}function F(e,t){M(e,t,F)}function L(e,t,_){var r,o,l,i=s({},e.props);for(l in t)"key"==l?r=t[l]:"ref"==l?o=t[l]:i[l]=t[l];return arguments.length>2&&(i.children=arguments.length>3?n.call(arguments,2):_),h(e.type,i,r||e.key,o||e.ref,null)}function W(e,t){var n={__c:t="__cC"+u++,__:e,Consumer:function(e,t){return e.children(t)},Provider:function(e){var n,_;return this.getChildContext||(n=[],(_={})[t]=this,this.getChildContext=function(){return _},this.shouldComponentUpdate=function(e){this.props.value!==e.value&&n.some(k)},this.sub=function(e){n.push(e);var t=e.componentWillUnmount;e.componentWillUnmount=function(){n.splice(n.indexOf(e),1),t&&t.call(e)}}),e.children}};return n.Provider.__=n.Consumer.contextType=n}n=a.slice,_={__e:function(e,t,n,_){for(var r,o,l;t=t.__;)if((r=t.__c)&&!r.__)try{if((o=r.constructor)&&null!=o.getDerivedStateFromError&&(r.setState(o.getDerivedStateFromError(e)),l=r.__d),null!=r.componentDidCatch&&(r.componentDidCatch(e,_||{}),l=r.__d),l)return r.__E=r}catch(t){e=t}throw e}},r=0,o=function(e){return null!=e&&void 0===e.constructor},m.prototype.setState=function(e,t){var n;n=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof e&&(e=e(s({},n),this.props)),e&&s(n,e),null!=e&&this.__v&&(t&&this.__h.push(t),k(this))},m.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),k(this))},m.prototype.render=y,l=[],x.__r=0,u=0;var $,j,I,B,q=0,z=[],Z=[],G=_.__b,J=_.__r,K=_.diffed,Q=_.__c,X=_.unmount;function Y(e,t){_.__h&&_.__h(j,e,q||t),q=0;var n=j.__H||(j.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({__V:Z}),n.__[e]}function ee(e){return q=1,te(ve,e)}function te(e,t,n){var _=Y($++,2);if(_.t=e,!_.__c&&(_.__=[n?n(t):ve(void 0,t),function(e){var t=_.__N?_.__N[0]:_.__[0],n=_.t(t,e);t!==n&&(_.__N=[n,_.__[1]],_.__c.setState({}))}],_.__c=j,!_.__c.u)){_.__c.__H.u=!0;var r=_.__c.shouldComponentUpdate;_.__c.shouldComponentUpdate=function(e,t,n){if(!_.__c.__H)return!0;var o=_.__c.__H.__.filter((function(e){return e.__c}));return(o.every((function(e){return!e.__N}))||!o.every((function(e){if(!e.__N)return!0;var t=e.__[0];return e.__=e.__N,e.__N=void 0,t===e.__[0]})))&&(!r||r(e,t,n))}}return _.__N||_.__}function ne(e,t){var n=Y($++,3);!_.__s&&he(n.__H,t)&&(n.__=e,n.i=t,j.__H.__h.push(n))}function _e(e,t){var n=Y($++,4);!_.__s&&he(n.__H,t)&&(n.__=e,n.i=t,j.__h.push(n))}function re(e){return q=5,le((function(){return{current:e}}),[])}function oe(e,t,n){q=6,_e((function(){return"function"==typeof e?(e(t()),function(){return e(null)}):e?(e.current=t(),function(){return e.current=null}):void 0}),null==n?n:n.concat(e))}function le(e,t){var n=Y($++,7);return he(n.__H,t)?(n.__V=e(),n.i=t,n.__h=e,n.__V):n.__}function ie(e,t){return q=8,le((function(){return e}),t)}function ue(e){var t=j.context[e.__c],n=Y($++,9);return n.c=e,t?(null==n.__&&(n.__=!0,t.sub(j)),t.props.value):e.__}function ce(e,t){_.useDebugValue&&_.useDebugValue(t?t(e):e)}function ae(e){var t=Y($++,10),n=ee();return t.__=e,j.componentDidCatch||(j.componentDidCatch=function(e){t.__&&t.__(e),n[1](e)}),[n[0],function(){n[1](void 0)}]}function fe(){for(var e;e=z.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(pe),e.__H.__h.forEach(de),e.__H.__h=[]}catch(t){e.__H.__h=[],_.__e(t,e.__v)}}_.__b=function(e){j=null,G&&G(e)},_.__r=function(e){J&&J(e),$=0;var t=(j=e.__c).__H;t&&(I===j?(t.__h=[],j.__h=[],t.__.forEach((function(e){e.__N&&(e.__=e.__N),e.__V=Z,e.__N=e.i=void 0}))):(t.__h.forEach(pe),t.__h.forEach(de),t.__h=[])),I=j},_.diffed=function(e){K&&K(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(1!==z.push(t)&&B===_.requestAnimationFrame||((B=_.requestAnimationFrame)||function(e){var t,n=function(){clearTimeout(_),se&&cancelAnimationFrame(t),setTimeout(e)},_=setTimeout(n,100);se&&(t=requestAnimationFrame(n))})(fe)),t.__H.__.forEach((function(e){e.i&&(e.__H=e.i),e.__V!==Z&&(e.__=e.__V),e.i=void 0,e.__V=Z}))),I=j=null},_.__c=function(e,t){t.some((function(e){try{e.__h.forEach(pe),e.__h=e.__h.filter((function(e){return!e.__||de(e)}))}catch(n){t.some((function(e){e.__h&&(e.__h=[])})),t=[],_.__e(n,e.__v)}})),Q&&Q(e,t)},_.unmount=function(e){X&&X(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.forEach((function(e){try{pe(e)}catch(e){t=e}})),t&&_.__e(t,n.__v))};var se="function"==typeof requestAnimationFrame;function pe(e){var t=j,n=e.__c;"function"==typeof n&&(e.__c=void 0,n()),j=t}function de(e){var t=j;e.__c=e.__(),j=t}function he(e,t){return!e||e.length!==t.length||t.some((function(t,n){return t!==e[n]}))}function ve(e,t){return"function"==typeof t?t(e):t}function ye(e,t){for(var n in e)if("__source"!==n&&!(n in t))return!0;for(var _ in t)if("__source"!==_&&e[_]!==t[_])return!0;return!1}function me(e){this.props=e}(me.prototype=new m).isPureReactComponent=!0,me.prototype.shouldComponentUpdate=function(e,t){return ye(this.props,e)||ye(this.state,t)};var ge=_.__b;_.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),ge&&ge(e)},"undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref");var be=_.__e;_.__e=function(e,t,n,_){if(e.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return null==t.__e&&(t.__e=n.__e,t.__k=n.__k),r.__c(e,t);be(e,t,n,_)};var ke=_.unmount;function xe(){this.__u=0,this.t=null,this.__b=null}function Se(e){var t=e.__.__c;return t&&t.__a&&t.__a(e)}function Ce(){this.u=null,this.o=null}_.unmount=function(e){var t=e.__c;t&&t.__R&&t.__R(),t&&!0===e.__h&&(e.type=null),ke&&ke(e)},(xe.prototype=new m).__c=function(e,t){var n=t.__c,_=this;null==_.t&&(_.t=[]),_.t.push(n);var r=Se(_.__v),o=!1,l=function(){o||(o=!0,n.__R=null,r?r(i):i())};n.__R=l;var i=function(){if(!--_.__u){if(_.state.__a){var e=_.state.__a;_.__v.__k[0]=function e(t,n,_){return t&&(t.__v=null,t.__k=t.__k&&t.__k.map((function(t){return e(t,n,_)})),t.__c&&t.__c.__P===n&&(t.__e&&_.insertBefore(t.__e,t.__d),t.__c.__e=!0,t.__c.__P=_)),t}(e,e.__c.__P,e.__c.__O)}var t;for(_.setState({__a:_.__b=null});t=_.t.pop();)t.forceUpdate()}},u=!0===t.__h;_.__u++||u||_.setState({__a:_.__b=_.__v.__k[0]}),e.then(l,l)},xe.prototype.componentWillUnmount=function(){this.t=[]},xe.prototype.render=function(e,t){if(this.__b){if(this.__v.__k){var n=document.createElement("div"),_=this.__v.__k[0].__c;this.__v.__k[0]=function e(t,n,_){return t&&(t.__c&&t.__c.__H&&(t.__c.__H.__.forEach((function(e){"function"==typeof e.__c&&e.__c()})),t.__c.__H=null),null!=(t=function(e,t){for(var n in t)e[n]=t[n];return e}({},t)).__c&&(t.__c.__P===_&&(t.__c.__P=n),t.__c=null),t.__k=t.__k&&t.__k.map((function(t){return e(t,n,_)}))),t}(this.__b,n,_.__O=_.__P)}this.__b=null}var r=t.__a&&d(y,null,e.fallback);return r&&(r.__h=null),[d(y,null,t.__a?null:e.children),r]};var we=function(e,t,n){if(++n[1]===n[0]&&e.o.delete(t),e.props.revealOrder&&("t"!==e.props.revealOrder[0]||!e.o.size))for(n=e.u;n;){for(;n.length>3;)n.pop()();if(n[1]<n[0])break;e.u=n=n[2]}};(Ce.prototype=new m).__a=function(e){var t=this,n=Se(t.__v),_=t.o.get(e);return _[0]++,function(r){var o=function(){t.props.revealOrder?(_.push(r),we(t,e,_)):r()};n?n(o):o()}},Ce.prototype.render=function(e){this.u=null,this.o=new Map;var t=w(e.children);e.revealOrder&&"b"===e.revealOrder[0]&&t.reverse();for(var n=t.length;n--;)this.o.set(t[n],this.u=[1,0,this.u]);return e.children},Ce.prototype.componentDidUpdate=Ce.prototype.componentDidMount=function(){var e=this;this.o.forEach((function(t,n){we(e,n,t)}))};var Ee="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,Pe=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,He="undefined"!=typeof document,Ae=function(e){return("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/i:/fil|che|ra/i).test(e)};m.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach((function(e){Object.defineProperty(m.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})}));var Oe=_.event;function Ne(){}function Ue(){return this.cancelBubble}function Te(){return this.defaultPrevented}_.event=function(e){return Oe&&(e=Oe(e)),e.persist=Ne,e.isPropagationStopped=Ue,e.isDefaultPrevented=Te,e.nativeEvent=e};var De={configurable:!0,get:function(){return this.class}},Re=_.vnode;_.vnode=function(e){var t=e.type,n=e.props,_=n;if("string"==typeof t){var r=-1===t.indexOf("-");for(var o in _={},n){var l=n[o];He&&"children"===o&&"noscript"===t||"value"===o&&"defaultValue"in n&&null==l||("defaultValue"===o&&"value"in n&&null==n.value?o="value":"download"===o&&!0===l?l="":/ondoubleclick/i.test(o)?o="ondblclick":/^onchange(textarea|input)/i.test(o+t)&&!Ae(n.type)?o="oninput":/^onfocus$/i.test(o)?o="onfocusin":/^onblur$/i.test(o)?o="onfocusout":/^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(o)?o=o.toLowerCase():r&&Pe.test(o)?o=o.replace(/[A-Z0-9]/g,"-$&").toLowerCase():null===l&&(l=void 0),/^oninput$/i.test(o)&&(o=o.toLowerCase(),_[o]&&(o="oninputCapture")),_[o]=l)}"select"==t&&_.multiple&&Array.isArray(_.value)&&(_.value=w(n.children).forEach((function(e){e.props.selected=-1!=_.value.indexOf(e.props.value)}))),"select"==t&&null!=_.defaultValue&&(_.value=w(n.children).forEach((function(e){e.props.selected=_.multiple?-1!=_.defaultValue.indexOf(e.props.value):_.defaultValue==e.props.value}))),e.props=_,n.class!=n.className&&(De.enumerable="className"in n,null!=n.className&&(_.class=n.className),Object.defineProperty(_,"className",De))}e.$$typeof=Ee,Re&&Re(e)};var Ve=_.__r;_.__r=function(e){Ve&&Ve(e),e.__c};var Me=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,Fe=/[&<>"]/;function Le(e){var t=String(e);return Fe.test(t)?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):t}var We=function(e,t){return String(e).replace(/(\n+)/g,"$1"+(t||"\t"))},$e=function(e,t,n){return String(e).length>(t||40)||!n&&-1!==String(e).indexOf("\n")||-1!==String(e).indexOf("<")},je={};function Ie(e){var t="";for(var n in e){var _=e[n];null!=_&&""!==_&&(t&&(t+=" "),t+="-"==n[0]?n:je[n]||(je[n]=n.replace(/([A-Z])/g,"-$1").toLowerCase()),t+=": ",t+=_,"number"==typeof _&&!1===Me.test(n)&&(t+="px"),t+=";")}return t||void 0}function Be(e,t){for(var n in t)e[n]=t[n];return e}function qe(e,t){return Array.isArray(t)?t.reduce(qe,e):null!=t&&!1!==t&&e.push(t),e}var ze={shallow:!0},Ze=[],Ge=/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/,Je=/[\s\n\\/='"\0<>]/;function Ke(){this.__d=!0}Xe.render=Xe;var Qe=[];function Xe(e,t,n){t=t||{},n=n||{};var r=_.__s;_.__s=!0;var o=Ye(e,t,n);return _.__c&&_.__c(e,Qe),Qe.length=0,_.__s=r,o}function Ye(e,t,n,r,o,l){if(null==e||"boolean"==typeof e)return"";if("object"!=typeof e)return Le(e);var i=n.pretty,u=i&&"string"==typeof i?i:"\t";if(Array.isArray(e)){for(var c="",a=0;a<e.length;a++)i&&a>0&&(c+="\n"),c+=Ye(e[a],t,n,r,o,l);return c}var f,s=e.type,p=e.props,d=!1;if("function"==typeof s){if(d=!0,!n.shallow||!r&&!1!==n.renderRootComponent){if(s===y){var h=[];return qe(h,e.props.children),Ye(h,t,n,!1!==n.shallowHighOrder,o,l)}var v,m=e.__c={__v:e,context:t,props:e.props,setState:Ke,forceUpdate:Ke,__d:!0,__h:[]};_.__b&&_.__b(e);var g=_.__r;if(s.prototype&&"function"==typeof s.prototype.render){var b=s.contextType,k=b&&t[b.__c],x=null!=b?k?k.props.value:b.__:t;(m=e.__c=new s(p,x)).__v=e,m._dirty=m.__d=!0,m.props=p,null==m.state&&(m.state={}),null==m._nextState&&null==m.__s&&(m._nextState=m.__s=m.state),m.context=x,s.getDerivedStateFromProps?m.state=Be(Be({},m.state),s.getDerivedStateFromProps(m.props,m.state)):m.componentWillMount&&(m.componentWillMount(),m.state=m._nextState!==m.state?m._nextState:m.__s!==m.state?m.__s:m.state),g&&g(e),v=m.render(m.props,m.state,m.context)}else for(var S=s.contextType,C=S&&t[S.__c],w=null!=S?C?C.props.value:S.__:t,E=0;m.__d&&E++<25;)m.__d=!1,g&&g(e),v=s.call(e.__c,p,w);return m.getChildContext&&(t=Be(Be({},t),m.getChildContext())),_.diffed&&_.diffed(e),Ye(v,t,n,!1!==n.shallowHighOrder,o,l)}s=(f=s).displayName||f!==Function&&f.name||function(e){var t=(Function.prototype.toString.call(e).match(/^\s*function\s+([^( ]+)/)||"")[1];if(!t){for(var n=-1,_=Ze.length;_--;)if(Ze[_]===e){n=_;break}n<0&&(n=Ze.push(e)-1),t="UnnamedComponent"+n}return t}(f)}var P,H,A="<"+s;if(p){var O=Object.keys(p);n&&!0===n.sortAttributes&&O.sort();for(var N=0;N<O.length;N++){var U=O[N],T=p[U];if("children"!==U){if(!Je.test(U)&&(n&&n.allAttributes||"key"!==U&&"ref"!==U&&"__self"!==U&&"__source"!==U)){if("defaultValue"===U)U="value";else if("defaultChecked"===U)U="checked";else if("defaultSelected"===U)U="selected";else if("className"===U){if(void 0!==p.class)continue;U="class"}else o&&/^xlink:?./.test(U)&&(U=U.toLowerCase().replace(/^xlink:?/,"xlink:"));if("htmlFor"===U){if(p.for)continue;U="for"}"style"===U&&T&&"object"==typeof T&&(T=Ie(T)),"a"===U[0]&&"r"===U[1]&&"boolean"==typeof T&&(T=String(T));var D=n.attributeHook&&n.attributeHook(U,T,t,n,d);if(D||""===D)A+=D;else if("dangerouslySetInnerHTML"===U)H=T&&T.__html;else if("textarea"===s&&"value"===U)P=T;else if((T||0===T||""===T)&&"function"!=typeof T){if(!(!0!==T&&""!==T||(T=U,n&&n.xml))){A=A+" "+U;continue}if("value"===U){if("select"===s){l=T;continue}"option"===s&&l==T&&void 0===p.selected&&(A+=" selected")}A=A+" "+U+'="'+Le(T)+'"'}}}else P=T}}if(i){var R=A.replace(/\n\s*/," ");R===A||~R.indexOf("\n")?i&&~A.indexOf("\n")&&(A+="\n"):A=R}if(A+=">",Je.test(s))throw new Error(s+" is not a valid HTML tag name in "+A);var V,M=Ge.test(s)||n.voidElements&&n.voidElements.test(s),F=[];if(H)i&&$e(H)&&(H="\n"+u+We(H,u)),A+=H;else if(null!=P&&qe(V=[],P).length){for(var L=i&&~A.indexOf("\n"),W=!1,$=0;$<V.length;$++){var j=V[$];if(null!=j&&!1!==j){var I=Ye(j,t,n,!0,"svg"===s||"foreignObject"!==s&&o,l);if(i&&!L&&$e(I)&&(L=!0),I)if(i){var B=I.length>0&&"<"!=I[0];W&&B?F[F.length-1]+=I:F.push(I),W=B}else F.push(I)}}if(i&&L)for(var q=F.length;q--;)F[q]="\n"+u+We(F[q],u)}if(F.length||H)A+=F.join("");else if(n&&n.xml)return A.substring(0,A.length-1)+" />";return!M||V||H?(i&&~A.indexOf("\n")&&(A+="\n"),A=A+"</"+s+">"):A=A.replace(/>$/," />"),A}Xe.shallowRender=function(e,t){return Xe(e,t,ze)},globalThis.__AURISERVE={h:d},window.__ASP_AURISERVE_PREACT=t})();
(()=>{"use strict";var e={888:(e,t)=>{t.TS=void 0,t.TS=function(...e){return e.filter((e=>e)).join(" ")}}},t={};function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,r),i.exports}r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};(()=>{r.r(o),r.d(o,{Static:()=>i,hydrate:()=>s});const e=window.__ASP_AURISERVE_PREACT;var t=r(888);const n="hydrated:static";function i(e){return"undefined"==typeof window?__AURISERVE.h("div",{class:(0,t.TS)(n,e.class),style:e.style},e.children):__AURISERVE.h("div",{class:(0,t.TS)(n,e.class),style:e.style,dangerouslySetInnerHTML:{__html:""}})}function s(t,r){window.setTimeout((()=>{document.querySelectorAll(`[data-element="${t}"]`).forEach((t=>{const o=t.querySelector(":scope > script"),n=JSON.parse(o.innerText);o.remove(),(0,e.hydrate)((0,e.h)(r,n),t)}),200)}))}})(),window.__ASP_HYDRATED=o})();
/*! For license information please see client.js.LICENSE.txt */
(()=>{var t={527:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.assertSchema=e.matchesSchema=e.isRawObject=e.isType=e.assertEq=e.assert=e.AssertError=void 0;class r extends Error{constructor(...t){super(...t),Error.captureStackTrace&&Error.captureStackTrace(this,r),this.name="AssertError"}}function n(t,e,...n){var i;if(!t)throw new(null!==(i=n[0])&&void 0!==i?i:r)(e,...n.length>1?n.slice(1):[])}function i(t,e){if("any"===e)return!0;if("string"==typeof e){if("undefined"===e)return void 0===t;if(typeof t===e)return!0}else if(t instanceof e)return!0;return!1}function o(t){return t&&t.constructor===Object||!1}function s(t,e,r=""){if(!o(t))return"Not an object.";for(const[n,a]of Object.entries(e)){const u=Array.isArray(a)?a:[a],c=Object.keys(t).filter((t=>void 0===e[t])).map((t=>`'${r}${t}'`));if(c.length>0){const t=1===c.length?c[0]:2===c.length?`${c[0]} and ${c[1]}`:`${c.slice(0,-1).join(", ")}, and ${c.slice(-1)}`;return`Unknown propert${c.length>=2?"ies":"y"} ${t}.`}let l=!1;for(const e of u)if(o(e)){if(!0===s(t[n],e,`${r}${n}.`)){l=!0;break}}else if(e.includes("[]")){const r=e.replace("[]","");if(Array.isArray(t[n])){let e=!0;for(const o of t[n])if(!i(o,r)){e=!1;break}if(e){l=!0;break}}}else if(i(t[n],e)){l=!0;break}if(!l){const t=u.map((t=>o(t)?"[subschema]":t.toString())),e=1===t.length?t[0]:2===t.length?`${t[0]} or ${t[1]}`:`${t.slice(0,-1).join(", ")}, or ${t.slice(-1)}`;return`'${r}${n}' must be ${e}.`}}return!0}e.AssertError=r,e.assert=n,e.assertEq=function(t,e,r,...i){if(t!==e)return n(!1,`${r} (${t} != ${e})`,...i)},e.isType=i,e.isRawObject=o,e.matchesSchema=s,e.assertSchema=function(t,e,r,...i){const o=s(t,e);"string"==typeof o&&n(!1,`${r}: ${o}`,...i)}},933:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.to=e.isHSVA=e.isRGBA=e.isHex=void 0;const n=r(527);function i(t){return"string"==typeof t&&"#"===t[0]&&(7===t.length||9===t.length)}function o(t){return"string"!=typeof t&&"r"in t}function s(t={h:0,s:0,v:0,a:1}){let e=0,r=0,n=0;const i=Math.floor(6*t.h),o=6*t.h-i,s=t.v*(1-t.s),a=t.v*(1-o*t.s),u=t.v*(1-(1-o)*t.s);switch(i%6){default:break;case 0:e=t.v,r=u,n=s;break;case 1:e=a,r=t.v,n=s;break;case 2:e=s,r=t.v,n=u;break;case 3:e=s,r=a,n=t.v;break;case 4:e=u,r=s,n=t.v;break;case 5:e=t.v,r=s,n=a}return{r:255*e,g:255*r,b:255*n,a:255*t.a}}function a(t={r:0,g:0,b:0,a:1}){let e,r,n,i,o=0;const s=t.a/255,a=Math.max(t.r,t.g,t.b)/255,u=a-Math.min(t.r,t.g,t.b)/255,c=t=>(a-t)/6/u+.5;return 0===u?o=i=0:(i=u/a,e=c(t.r/255),r=c(t.g/255),n=c(t.b/255),t.r/255===a?o=n-r:t.g/255===a?o=1/3+e-n:t.b/255===a&&(o=2/3+r-e),o<0?o+=1:o>1&&(o-=1)),{h:o,s:i,v:a,a:s}}function u(t){const e=Math.floor(t).toString(16);return 1===e.length?`0${e}`:e}e.isHex=i,e.isRGBA=o,e.isHSVA=function(t){return"string"!=typeof t&&"h"in t},e.to=function(t,e){const r=i(t)?a(function(t){const e=parseInt(`0x${t[1]}${t[2]}`,16),r=parseInt(`0x${t[3]}${t[4]}`,16),n=parseInt(`0x${t[5]}${t[6]}`,16);let i=parseInt(`0x${t[7]}${t[8]}`,16);return Number.isNaN(i)&&(i=255),{r:e,g:r,b:n,a:i}}(t)):o(t)?a(t):t;switch(e){case"hex":return function(t={h:0,s:0,v:0,a:1}){return function(t={r:0,g:0,b:0,a:255}){return`#${u(t.r)}${u(t.g)}${u(t.b)}${255===t.a?"":u(t.a)}`}(s(t))}(r);case"rgba":return s(r);case"hsva":return r;default:n.assert(!1,`Invalid format '${e}' provided.`)}}},553:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.titleCase=e.identifier=e.date=e.vector=e.bytes=void 0;const n=r(472),i=n.__importDefault(r(872)),o=n.__importDefault(r(259)),s=n.__importDefault(r(664));i.default.extend(o.default),i.default.extend(s.default);const a=["B","KB","MB","GB"];e.bytes=function(t){t=Math.round(t);let e=0;for(;t>800&&e<a.length-1;)e++,t/=1024;return`${Math.ceil(t)} ${a[e]}`},e.vector=function(t){var e,r;return`${null!==(e=t.x)&&void 0!==e?e:t.width} × ${null!==(r=t.y)&&void 0!==r?r:t.height}`},e.date=function(t){const e=t instanceof Date?t:new Date(t);return Date.now()-+e<2592e5?i.default(t).fromNow():e.getFullYear()===(new Date).getFullYear()?`on ${i.default(t).format("MMMM Do")}`:`on ${i.default(t).format("MMMM Do, YYYY")}`},e.identifier=function(t,e=3,r=32,n=!0){const i=t.toLowerCase().replace(/[ -]/g,"_").replace(/[^a-zA-Z0-9_]/g,"").split("_").filter(Boolean).join("_");return i.length>r&&n?i.substring(0,r):i.length<e||i.length>r?null:i},e.titleCase=function(t){return t.replace(/[_-]/g," ").replace(/\w\S*/g,(t=>{var e,r,n,i;return(null!==(r=null===(e=t.charAt(0))||void 0===e?void 0:e.toUpperCase())&&void 0!==r?r:"")+(null!==(i=null===(n=t.substring(1))||void 0===n?void 0:n.toLowerCase())&&void 0!==i?i:"")}))}},22:(t,e,r)=>{"use strict";e.TS=void 0;r(348),r(553),r(933);var n=r(888);Object.defineProperty(e,"TS",{enumerable:!0,get:function(){return n.merge}});r(188),r(527)},348:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.splitPath=e.buildPath=e.traversePath=void 0;const n=r(527);function i(t){return t.replace(/\[/g,".[").split(".").filter(Boolean).map((t=>{if(t.startsWith("[")){n.assert(t.endsWith("]"),`Invalid path array segment '${t}'. [1]`);const e=Number.parseInt(t.substring(1,t.length-1),10);return n.assert(!Number.isNaN(e),`Invalid path array segment '${t}'. [2]`),e}return t}))}e.traversePath=function(t,e){return i(e).forEach((e=>t=function(t,e){return"number"==typeof t?(n.assert(Array.isArray(e),`Invalid Array index into Value '${JSON.stringify(e)}'.`),n.assert(e.length>t,`Index '${t}' is missing in Array '${JSON.stringify(e)}'.`),e[t]):(n.assert(void 0!==e&&"object"==typeof e,`Value is not an object: '${e}'.`),n.assert(t in e,`Object is missing property '${t}': '${JSON.stringify(e)}'.`),e[t])}(e,t))),t},e.buildPath=function(...t){return t.filter((t=>""!==t)).reduce(((t,e,r)=>t+(Number.isInteger(e)?`[${e.toString()}]`:(0!==r?".":"")+e)),"")},e.splitPath=i},888:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.sign=e.merge=void 0,e.merge=function(...t){return t.filter((t=>t)).join(" ")},e.sign=function(t){return t<0?-1:t>0?1:0}},188:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(527);e.default=class{constructor(t){const e=t.trim().split(".");n.assert(3===e.length,`Invalid version string: '${t}'.`),this.major=parseInt(e[0],10),this.minor=parseInt(e[1],10),this.patch=parseInt(e[2],10)}matches(t){const e=t.trim().split(".");let r="x"===e[1];!r&&e[0].startsWith("^")&&(e[0]=e[0].substring(1).trim(),r=!0);let n="x"===e[2];!n&&e[0].startsWith("~")&&(e[0]=e[0].substring(1).trim(),n=!0);const i=e[0].startsWith("x");r||(r=i),n||(n=r);const o="x"===e[0]?0:parseInt(e[0],10),s="x"===e[1]||void 0===e[1]?0:parseInt(e[1],10),a="x"===e[2]||void 0===e[2]?0:parseInt(e[2],10);return o!==this.major?!!i&&this.major>=o:s!==this.minor?!!r&&this.minor>=s:a===this.patch||!!n&&this.patch>=a}}},872:function(t){t.exports=function(){"use strict";var t=6e4,e=36e5,r="millisecond",n="second",i="minute",o="hour",s="day",a="week",u="month",c="quarter",l="year",f="date",h="Invalid Date",d=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,p=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,y={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},v=function(t,e,r){var n=String(t);return!n||n.length>=e?t:""+Array(e+1-n.length).join(r)+t},m={s:v,z:function(t){var e=-t.utcOffset(),r=Math.abs(e),n=Math.floor(r/60),i=r%60;return(e<=0?"+":"-")+v(n,2,"0")+":"+v(i,2,"0")},m:function t(e,r){if(e.date()<r.date())return-t(r,e);var n=12*(r.year()-e.year())+(r.month()-e.month()),i=e.clone().add(n,u),o=r-i<0,s=e.clone().add(n+(o?-1:1),u);return+(-(n+(r-i)/(o?i-s:s-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:u,y:l,w:a,d:s,D:f,h:o,m:i,s:n,ms:r,Q:c}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",b={};b[g]=y;var $=function(t){return t instanceof M},w=function(t,e,r){var n;if(!t)return g;if("string"==typeof t)b[t]&&(n=t),e&&(b[t]=e,n=t);else{var i=t.name;b[i]=t,n=i}return!r&&n&&(g=n),n||!r&&g},_=function(t,e){if($(t))return t.clone();var r="object"==typeof e?e:{};return r.date=t,r.args=arguments,new M(r)},S=m;S.l=w,S.i=$,S.w=function(t,e){return _(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var M=function(){function y(t){this.$L=w(t.locale,null,!0),this.parse(t)}var v=y.prototype;return v.parse=function(t){this.$d=function(t){var e=t.date,r=t.utc;if(null===e)return new Date(NaN);if(S.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var n=e.match(d);if(n){var i=n[2]-1||0,o=(n[7]||"0").substring(0,3);return r?new Date(Date.UTC(n[1],i,n[3]||1,n[4]||0,n[5]||0,n[6]||0,o)):new Date(n[1],i,n[3]||1,n[4]||0,n[5]||0,n[6]||0,o)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},v.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},v.$utils=function(){return S},v.isValid=function(){return!(this.$d.toString()===h)},v.isSame=function(t,e){var r=_(t);return this.startOf(e)<=r&&r<=this.endOf(e)},v.isAfter=function(t,e){return _(t)<this.startOf(e)},v.isBefore=function(t,e){return this.endOf(e)<_(t)},v.$g=function(t,e,r){return S.u(t)?this[e]:this.set(r,t)},v.unix=function(){return Math.floor(this.valueOf()/1e3)},v.valueOf=function(){return this.$d.getTime()},v.startOf=function(t,e){var r=this,c=!!S.u(e)||e,h=S.p(t),d=function(t,e){var n=S.w(r.$u?Date.UTC(r.$y,e,t):new Date(r.$y,e,t),r);return c?n:n.endOf(s)},p=function(t,e){return S.w(r.toDate()[t].apply(r.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),r)},y=this.$W,v=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case l:return c?d(1,0):d(31,11);case u:return c?d(1,v):d(0,v+1);case a:var b=this.$locale().weekStart||0,$=(y<b?y+7:y)-b;return d(c?m-$:m+(6-$),v);case s:case f:return p(g+"Hours",0);case o:return p(g+"Minutes",1);case i:return p(g+"Seconds",2);case n:return p(g+"Milliseconds",3);default:return this.clone()}},v.endOf=function(t){return this.startOf(t,!1)},v.$set=function(t,e){var a,c=S.p(t),h="set"+(this.$u?"UTC":""),d=(a={},a[s]=h+"Date",a[f]=h+"Date",a[u]=h+"Month",a[l]=h+"FullYear",a[o]=h+"Hours",a[i]=h+"Minutes",a[n]=h+"Seconds",a[r]=h+"Milliseconds",a)[c],p=c===s?this.$D+(e-this.$W):e;if(c===u||c===l){var y=this.clone().set(f,1);y.$d[d](p),y.init(),this.$d=y.set(f,Math.min(this.$D,y.daysInMonth())).$d}else d&&this.$d[d](p);return this.init(),this},v.set=function(t,e){return this.clone().$set(t,e)},v.get=function(t){return this[S.p(t)]()},v.add=function(r,c){var f,h=this;r=Number(r);var d=S.p(c),p=function(t){var e=_(h);return S.w(e.date(e.date()+Math.round(t*r)),h)};if(d===u)return this.set(u,this.$M+r);if(d===l)return this.set(l,this.$y+r);if(d===s)return p(1);if(d===a)return p(7);var y=(f={},f[i]=t,f[o]=e,f[n]=1e3,f)[d]||1,v=this.$d.getTime()+r*y;return S.w(v,this)},v.subtract=function(t,e){return this.add(-1*t,e)},v.format=function(t){var e=this;if(!this.isValid())return h;var r=t||"YYYY-MM-DDTHH:mm:ssZ",n=S.z(this),i=this.$locale(),o=this.$H,s=this.$m,a=this.$M,u=i.weekdays,c=i.months,l=function(t,n,i,o){return t&&(t[n]||t(e,r))||i[n].substr(0,o)},f=function(t){return S.s(o%12||12,t,"0")},d=i.meridiem||function(t,e,r){var n=t<12?"AM":"PM";return r?n.toLowerCase():n},y={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:S.s(a+1,2,"0"),MMM:l(i.monthsShort,a,c,3),MMMM:l(c,a),D:this.$D,DD:S.s(this.$D,2,"0"),d:String(this.$W),dd:l(i.weekdaysMin,this.$W,u,2),ddd:l(i.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(o),HH:S.s(o,2,"0"),h:f(1),hh:f(2),a:d(o,s,!0),A:d(o,s,!1),m:String(s),mm:S.s(s,2,"0"),s:String(this.$s),ss:S.s(this.$s,2,"0"),SSS:S.s(this.$ms,3,"0"),Z:n};return r.replace(p,(function(t,e){return e||y[t]||n.replace(":","")}))},v.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},v.diff=function(r,f,h){var d,p=S.p(f),y=_(r),v=(y.utcOffset()-this.utcOffset())*t,m=this-y,g=S.m(this,y);return g=(d={},d[l]=g/12,d[u]=g,d[c]=g/3,d[a]=(m-v)/6048e5,d[s]=(m-v)/864e5,d[o]=m/e,d[i]=m/t,d[n]=m/1e3,d)[p]||m,h?g:S.a(g)},v.daysInMonth=function(){return this.endOf(u).$D},v.$locale=function(){return b[this.$L]},v.locale=function(t,e){if(!t)return this.$L;var r=this.clone(),n=w(t,e,!0);return n&&(r.$L=n),r},v.clone=function(){return S.w(this.$d,this)},v.toDate=function(){return new Date(this.valueOf())},v.toJSON=function(){return this.isValid()?this.toISOString():null},v.toISOString=function(){return this.$d.toISOString()},v.toString=function(){return this.$d.toUTCString()},y}(),O=M.prototype;return _.prototype=O,[["$ms",r],["$s",n],["$m",i],["$H",o],["$W",s],["$M",u],["$y",l],["$D",f]].forEach((function(t){O[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),_.extend=function(t,e){return t.$i||(t(e,M,_),t.$i=!0),_},_.locale=w,_.isDayjs=$,_.unix=function(t){return _(1e3*t)},_.en=b[g],_.Ls=b,_.p={},_}()},664:function(t){t.exports=function(){"use strict";return function(t,e,r){var n=e.prototype,i=n.format;r.en.ordinal=function(t){var e=["th","st","nd","rd"],r=t%100;return"["+t+(e[(r-20)%10]||e[r]||e[0])+"]"},n.format=function(t){var e=this,r=this.$locale(),n=this.$utils(),o=(t||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(t){switch(t){case"Q":return Math.ceil((e.$M+1)/3);case"Do":return r.ordinal(e.$D);case"gggg":return e.weekYear();case"GGGG":return e.isoWeekYear();case"wo":return r.ordinal(e.week(),"W");case"w":case"ww":return n.s(e.week(),"w"===t?1:2,"0");case"W":case"WW":return n.s(e.isoWeek(),"W"===t?1:2,"0");case"k":case"kk":return n.s(String(0===e.$H?24:e.$H),"k"===t?1:2,"0");case"X":return Math.floor(e.$d.getTime()/1e3);case"x":return e.$d.getTime();case"z":return"["+e.offsetName()+"]";case"zzz":return"["+e.offsetName("long")+"]";default:return t}}));return i.bind(this)(o)}}}()},259:function(t){t.exports=function(){"use strict";return function(t,e,r){t=t||{};var n=e.prototype,i={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function o(t,e,r,i){return n.fromToBase(t,e,r,i)}r.en.relativeTime=i,n.fromToBase=function(e,n,o,s,a){for(var u,c,l,f=o.$locale().relativeTime||i,h=t.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],d=h.length,p=0;p<d;p+=1){var y=h[p];y.d&&(u=s?r(e).diff(o,y.d,!0):o.diff(e,y.d,!0));var v=(t.rounding||Math.round)(Math.abs(u));if(l=u>0,v<=y.r||!y.r){v<=1&&p>0&&(y=h[p-1]);var m=f[y.l];a&&(v=a(""+v)),c="string"==typeof m?m.replace("%d",v):m(v,n,y.l,l);break}}if(n)return c;var g=l?f.future:f.past;return"function"==typeof g?g(c):g.replace("%s",c)},n.to=function(t,e){return o(t,e,this,!0)},n.from=function(t,e){return o(t,e,this)};var s=function(t){return t.$u?r.utc():r()};n.toNow=function(t){return this.to(s(this),t)},n.fromNow=function(t){return this.from(s(this),t)}}}()},472:(t,e,r)=>{"use strict";r.r(e),r.d(e,{__extends:()=>i,__assign:()=>o,__rest:()=>s,__decorate:()=>a,__param:()=>u,__metadata:()=>c,__awaiter:()=>l,__generator:()=>f,__createBinding:()=>h,__exportStar:()=>d,__values:()=>p,__read:()=>y,__spread:()=>v,__spreadArrays:()=>m,__spreadArray:()=>g,__await:()=>b,__asyncGenerator:()=>$,__asyncDelegator:()=>w,__asyncValues:()=>_,__makeTemplateObject:()=>S,__importStar:()=>O,__importDefault:()=>D,__classPrivateFieldGet:()=>x,__classPrivateFieldSet:()=>j,__classPrivateFieldIn:()=>A});var n=function(t,e){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},n(t,e)};function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}var o=function(){return o=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var i in e=arguments[r])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},o.apply(this,arguments)};function s(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(r[n[i]]=t[n[i]])}return r}function a(t,e,r,n){var i,o=arguments.length,s=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(s=(o<3?i(s):o>3?i(e,r,s):i(e,r))||s);return o>3&&s&&Object.defineProperty(e,r,s),s}function u(t,e){return function(r,n){e(r,n,t)}}function c(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function l(t,e,r,n){return new(r||(r=Promise))((function(i,o){function s(t){try{u(n.next(t))}catch(t){o(t)}}function a(t){try{u(n.throw(t))}catch(t){o(t)}}function u(t){var e;t.done?i(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((n=n.apply(t,e||[])).next())}))}function f(t,e){var r,n,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,n=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!((i=(i=s.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break}i[2]&&s.ops.pop(),s.trys.pop();continue}o=e.call(t,s)}catch(t){o=[6,t],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}}var h=Object.create?function(t,e,r,n){void 0===n&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);i&&!("get"in i?!e.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){void 0===n&&(n=r),t[n]=e[r]};function d(t,e){for(var r in t)"default"===r||Object.prototype.hasOwnProperty.call(e,r)||h(e,t,r)}function p(t){var e="function"==typeof Symbol&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function y(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,i,o=r.call(t),s=[];try{for(;(void 0===e||e-- >0)&&!(n=o.next()).done;)s.push(n.value)}catch(t){i={error:t}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return s}function v(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(y(arguments[e]));return t}function m(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),i=0;for(e=0;e<r;e++)for(var o=arguments[e],s=0,a=o.length;s<a;s++,i++)n[i]=o[s];return n}function g(t,e,r){if(r||2===arguments.length)for(var n,i=0,o=e.length;i<o;i++)!n&&i in e||(n||(n=Array.prototype.slice.call(e,0,i)),n[i]=e[i]);return t.concat(n||Array.prototype.slice.call(e))}function b(t){return this instanceof b?(this.v=t,this):new b(t)}function $(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,i=r.apply(t,e||[]),o=[];return n={},s("next"),s("throw"),s("return"),n[Symbol.asyncIterator]=function(){return this},n;function s(t){i[t]&&(n[t]=function(e){return new Promise((function(r,n){o.push([t,e,r,n])>1||a(t,e)}))})}function a(t,e){try{(r=i[t](e)).value instanceof b?Promise.resolve(r.value.v).then(u,c):l(o[0][2],r)}catch(t){l(o[0][3],t)}var r}function u(t){a("next",t)}function c(t){a("throw",t)}function l(t,e){t(e),o.shift(),o.length&&a(o[0][0],o[0][1])}}function w(t){var e,r;return e={},n("next"),n("throw",(function(t){throw t})),n("return"),e[Symbol.iterator]=function(){return this},e;function n(n,i){e[n]=t[n]?function(e){return(r=!r)?{value:b(t[n](e)),done:"return"===n}:i?i(e):e}:i}}function _(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,r=t[Symbol.asyncIterator];return r?r.call(t):(t=p(t),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(r){e[r]=t[r]&&function(e){return new Promise((function(n,i){!function(t,e,r,n){Promise.resolve(n).then((function(e){t({value:e,done:r})}),e)}(n,i,(e=t[r](e)).done,e.value)}))}}}function S(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}var M=Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e};function O(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)"default"!==r&&Object.prototype.hasOwnProperty.call(t,r)&&h(e,t,r);return M(e,t),e}function D(t){return t&&t.__esModule?t:{default:t}}function x(t,e,r,n){if("a"===r&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?n:"a"===r?n.call(t):n?n.value:e.get(t)}function j(t,e,r,n,i){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?i.call(t,r):i?i.value=r:e.set(t,r),r}function A(t,e){if(null===e||"object"!=typeof e&&"function"!=typeof e)throw new TypeError("Cannot use 'in' operator on non-object");return"function"==typeof t?e===t:t.has(e)}},84:t=>{"use strict";t.exports=window.__ASP_HYDRATED}},e={};function r(n){var i=e[n];if(void 0!==i)return i.exports;var o=e[n]={exports:{}};return t[n].call(o.exports,o,o.exports,r),o.exports}r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var n={};(()=>{"use strict";r.r(n);var t=r(22);const e=window.__ASP_AURISERVE_PREACT,{hydrate:i,Static:o}=r(84),s="base:carousel";i(s,(function(r){var n,i;const a=(0,e.useRef)(null),u=Array.isArray(r.children)?r.children:[r.children];return null!==(n=r.speed)&&void 0!==n||(r.speed=200),(0,e.useEffect)((()=>{const t=a.current,e=t.querySelector(".carousel-items"),n=e.children[0];let i=0;t.classList.remove("static"),n.children[0].classList.add("active"),e.style.height=`${n.children[0].clientHeight}px`;let o,s=!0;const u=new IntersectionObserver((t=>{const e=t[0].isIntersecting;e&&!o&&s?o=setInterval((()=>{c(1,"right",!1)}),r.interval):!e&&o&&s&&(clearInterval(o),o=0)}),{threshold:.5});function c(t,a,c){c&&s&&(clearInterval(o),o=0,s=!1,u.disconnect());const l=n.children[i];i=(i+t+4*n.children.length)%n.children.length;const f=n.children[i];l.style.transitionDuration=`${r.speed}ms`,l.classList.add("right"===a?"transition-left":"transition-right"),f.classList.add("active"),f.classList.add("right"===a?"transition-right":"transition-left"),e.style.height=`${f.clientHeight}px`,setTimeout((()=>{requestAnimationFrame((()=>{f.style.transitionDuration=`${r.speed}ms`,requestAnimationFrame((()=>{f.classList.remove("right"===a?"transition-right":"transition-left")}))})),setTimeout((()=>{f.style.transitionDuration=""}),r.speed)}),r.speed/2),setTimeout((()=>{l.classList.remove("active"),l.classList.remove("right"===a?"transition-left":"transition-right"),l.style.transitionDuration=""}),r.speed)}u.observe(t);const l=Array.prototype.slice.call(t.querySelectorAll(".button-arrow"));l.length&&(l[0].addEventListener("click",(()=>c(-1,"left",!0))),l[1].addEventListener("click",(()=>c(1,"right",!0))))}),[r.interval,r.speed]),__AURISERVE.h("div",{ref:a,class:(0,t.TS)(s,r.class,"static"),style:{maxWidth:r.width?`${r.width}px`:void 0,..."arrows"===r.pagination?{paddingLeft:64,paddingRight:64}:{},...null!==(i=r.style)&&void 0!==i?i:{}}},__AURISERVE.h("div",{class:"carousel-items",style:{transitionDuration:1.5*r.speed+"ms"}},__AURISERVE.h(o,null,u.map(((t,e)=>__AURISERVE.h("div",{key:e,class:"carousel-item"},t))))),"arrows"===r.pagination&&__AURISERVE.h("button",{class:"button-arrow","aria-label":"Previous"}),"arrows"===r.pagination&&__AURISERVE.h("button",{class:"button-arrow","aria-label":"Next"}))}))})(),window.__ASP_ELEMENTS_BASE=n})();
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./common/ContactForm.tsx":
/*!********************************!*\
  !*** ./common/ContactForm.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hydrated */ "hydrated");
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hydrated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* eslint-disable react-hooks/rules-of-hooks */


const identifier = 'tax_calculator:contact_form';

function getTemplateMessage(name, email, municipality, raw) {
  let message = `<p>Hey there! My name is <strong>${name}</strong>,<br/>and I'm contacting you on behalf of the municipality of <strong>${municipality}</strong>.</p><p>We are in need of a simple, user-friendly, and secure Tax Calculator for our residents to use, and your tool looks perfect. We'd love to get in contact.</p><p>You can reach me at <strong>${email}</strong>.<br/>Thanks!</p>`;
  if (raw) message = message.replace(/<\/p>/g, '\n\n').replace(/<br\/>/g, '\n').replace(/<\/?\w+>/g, '');
  return message;
}

function RawContactForm() {
  const form = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const [name, setName] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [email, setEmail] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [municipality, setMunicipality] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [message, setMessage] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [hydrated, setHydrated] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [disabled, setDisabled] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [submitted, setSubmitted] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [template, setTemplate] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => setHydrated(true), []);
  const rawTemplate = getTemplateMessage(name || 'John Doe', email || 'johndoe@example.com', municipality || 'Townsville', true);
  (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (template) setMessage(rawTemplate);
  }, [name, email, municipality, rawTemplate, template]);

  function handleEditMessage() {
    if (!template) return;
    setMessage(rawTemplate);
    setTemplate(false);
  }

  function handleActivateTemplate() {
    if (message === rawTemplate) {
      setMessage('');
      setTemplate(true);
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setDisabled(true);
    fetch('/form/contact', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        municipality,
        message
      })
    }).then(() => setTimeout(() => setSubmitted(true), 500));
  }

  if (!hydrated) return null;
  if (submitted) return __AURISERVE.h("div", {
    class: `${identifier} submitted`
  }, __AURISERVE.h("h6", null, "Submission Recieved!"), __AURISERVE.h("p", null, "Thanks for reaching out, we'll make sure to get back to you in the next couple of business days."));
  return __AURISERVE.h("form", {
    class: identifier,
    ref: form,
    onSubmit: handleSubmit,
    disabled: disabled
  }, __AURISERVE.h("div", {
    class: "left"
  }, __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Name"), __AURISERVE.h("input", {
    disabled: disabled,
    maxLength: 64,
    required: true,
    type: "text",
    placeholder: "John Doe",
    value: name,
    onChange: evt => setName(evt.target.value)
  })), __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Municipality"), __AURISERVE.h("input", {
    disabled: disabled,
    maxLength: 64,
    required: true,
    type: "text",
    placeholder: "Townsville",
    value: municipality,
    onChange: evt => setMunicipality(evt.target.value)
  })), __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Email"), __AURISERVE.h("input", {
    disabled: disabled,
    maxLength: 128,
    required: true,
    name: "email",
    type: "email",
    placeholder: "johndoe@example.com",
    value: email,
    onChange: evt => setEmail(evt.target.value)
  })), __AURISERVE.h("hr", null), __AURISERVE.h("button", {
    type: "submit",
    disabled: disabled
  }, __AURISERVE.h("span", null, "Send Message"))), __AURISERVE.h("div", {
    class: "right"
  }, __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Message"), __AURISERVE.h("div", {
    class: "message-container"
  }, __AURISERVE.h("textarea", {
    maxLength: 1024 * 1024,
    disabled: disabled,
    onFocus: handleEditMessage,
    onBlur: handleActivateTemplate,
    name: "message",
    onChange: evt => setMessage(evt.target.value)
  }, message), template && __AURISERVE.h("div", {
    class: "message-template",
    dangerouslySetInnerHTML: {
      __html: getTemplateMessage(name || 'John Doe', email || 'johndoe@example.com', municipality || 'Townsville')
    }
  })))));
}

const ContactForm = (0,hydrated__WEBPACK_IMPORTED_MODULE_0__.hydrate)(identifier, RawContactForm);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: ContactForm
});

/***/ }),

/***/ "./common/QuoteGenerator.tsx":
/*!***********************************!*\
  !*** ./common/QuoteGenerator.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hydrated */ "hydrated");
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hydrated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);


const identifier = 'tax_calculator:quote_generator';
const quotes = [1000, 1500, 2000, 2500, 3500];
const residents = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 13000, 16000, 19000, 21000, 25000, 40000, 55000, 70000, 85000, 100000];

function RawQuoteGenerator() {
  const currentValueAnim = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const currentPopAnim = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const [value, setValue] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(5);
  const [quote, setQuote] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(quotes[Math.floor(value / 5)]);
  const [population, setPopulation] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(residents[value]);
  const percent = value / 20 * 100;

  function handleChange(evt) {
    const newValue = parseInt(evt.target.value, 10);
    setValue(newValue);
    const lastQuote = quotes[Math.floor(value / 5)];
    const currQuote = quotes[Math.floor(newValue / 5)];
    const lastPop = residents[value];
    const currPop = residents[newValue];

    if (lastQuote !== currQuote) {
      if (currentValueAnim.current) {
        currentValueAnim.current.abort();
      }

      const aborter = new AbortController();
      currentValueAnim.current = aborter;
      let frame = 0;
      const maxFrames = 11;

      function callback() {
        if (aborter.signal.aborted) return;
        setQuote(lastQuote + (currQuote - lastQuote) * frame / maxFrames);
        if (frame++ < maxFrames) requestAnimationFrame(callback);
      }

      callback();
    }

    if (lastPop !== currPop) {
      if (currentPopAnim.current) {
        currentPopAnim.current.abort();
      }

      const aborter = new AbortController();
      currentPopAnim.current = aborter;
      let frame = 0;
      const maxFrames = 5;

      function callback() {
        if (aborter.signal.aborted) return;
        setPopulation(lastPop + (currPop - lastPop) * frame / maxFrames);
        if (frame++ < maxFrames) requestAnimationFrame(callback);
      }

      callback();
    }
  }

  return __AURISERVE.h("div", {
    class: identifier
  }, __AURISERVE.h("label", null, __AURISERVE.h("div", {
    class: "numbers"
  }, __AURISERVE.h("p", {
    class: "population"
  }, __AURISERVE.h("span", {
    class: "value"
  }, Intl.NumberFormat('en-us', {
    useGrouping: false,
    maximumFractionDigits: 0
  }).format(population), population === 100000 && '+'), __AURISERVE.h("span", {
    class: "label"
  }, " Residents")), __AURISERVE.h("p", {
    class: "evaluation"
  }, __AURISERVE.h("span", {
    class: "value"
  }, "$", Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0,
    useGrouping: false
  }).format(quote)), __AURISERVE.h("span", {
    class: "label"
  }, " / year"))), __AURISERVE.h("input", {
    type: "range",
    min: "0",
    max: "20",
    step: "1",
    value: value,
    onChange: handleChange,
    style: {
      background: `linear-gradient(to right, #60A5FA, #60A5FA ${percent}%, #A4B0C2 ${percent}%, #A4B0C2)`
    }
  }), __AURISERVE.h("div", {
    class: "notches"
  }, __AURISERVE.h("span", {
    class: value >= 0 ? 'active' : ''
  }, "0"), __AURISERVE.h("span", {
    class: value >= 5 ? 'active' : ''
  }, "5k"), __AURISERVE.h("span", {
    class: value >= 10 ? 'active' : ''
  }, "10k"), __AURISERVE.h("span", {
    class: value >= 15 ? 'active' : ''
  }, "25k"), __AURISERVE.h("span", {
    class: value >= 20 ? 'active' : ''
  }, "100k+"))));
}

const QuoteGenerator = (0,hydrated__WEBPACK_IMPORTED_MODULE_0__.hydrate)(identifier, RawQuoteGenerator);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: QuoteGenerator
});

/***/ }),

/***/ "./common/UnsubscribeForm.tsx":
/*!************************************!*\
  !*** ./common/UnsubscribeForm.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hydrated */ "hydrated");
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hydrated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);


const identifier = 'tax_calculator:unsubscribe_form';

function RawUnsubscribeForm() {
  const [email, setEmail] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [hydrated, setHydrated] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [disabled, setDisabled] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [submitted, setSubmitted] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => setHydrated(true), []);

  function handleSubmit(evt) {
    evt.preventDefault();
    setDisabled(true);
    fetch('/form/unsubscribe', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    }).then(() => setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }, 500));
  }

  if (!hydrated) return null;
  if (submitted) return __AURISERVE.h("div", {
    class: `${identifier} submitted`
  }, __AURISERVE.h("h6", null, "You have been unsubscribed."), __AURISERVE.h("p", null, "Redirecting to the home page..."));
  return __AURISERVE.h("form", {
    class: identifier,
    onSubmit: handleSubmit,
    disabled: disabled
  }, __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Email"), __AURISERVE.h("input", {
    disabled: disabled,
    maxLength: 128,
    required: true,
    type: "email",
    placeholder: "johndoe@example.com",
    value: email,
    onChange: evt => setEmail(evt.target.value)
  })), __AURISERVE.h("button", {
    type: "submit",
    disabled: disabled
  }, __AURISERVE.h("span", null, "Unsubscribe")));
}

const UnsubscribeForm = (0,hydrated__WEBPACK_IMPORTED_MODULE_0__.hydrate)(identifier, RawUnsubscribeForm);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: UnsubscribeForm
});

/***/ }),

/***/ "preact/hooks":
/*!*****************************************!*\
  !*** external "__ASP_AURISERVE_PREACT" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = window["__ASP_AURISERVE_PREACT"];

/***/ }),

/***/ "hydrated":
/*!*********************************!*\
  !*** external "__ASP_HYDRATED" ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["__ASP_HYDRATED"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./client/Main.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_ContactForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/ContactForm */ "./common/ContactForm.tsx");
/* harmony import */ var _common_QuoteGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/QuoteGenerator */ "./common/QuoteGenerator.tsx");
/* harmony import */ var _common_UnsubscribeForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/UnsubscribeForm */ "./common/UnsubscribeForm.tsx");




function keep(_t) {
  /* don't tree shake pls */
}

;
keep(_common_ContactForm__WEBPACK_IMPORTED_MODULE_0__["default"]);
keep(_common_QuoteGenerator__WEBPACK_IMPORTED_MODULE_1__["default"]);
keep(_common_UnsubscribeForm__WEBPACK_IMPORTED_MODULE_2__["default"]);
})();

window.__ASP_TAX_CALCULATOR = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=client.js.map