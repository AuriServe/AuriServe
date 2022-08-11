(()=>{"use strict";var e={888:(e,n)=>{n.TS=void 0,n.TS=function(...e){return e.filter((e=>e)).join(" ")}}},n={};function t(_){var r=n[_];if(void 0!==r)return r.exports;var o=n[_]={exports:{}};return e[_](o,o.exports,t),o.exports}t.d=(e,n)=>{for(var _ in n)t.o(n,_)&&!t.o(e,_)&&Object.defineProperty(e,_,{enumerable:!0,get:n[_]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={};t.r(e),t.d(e,{Component:()=>k,Fragment:()=>g,cloneElement:()=>$,createContext:()=>B,createElement:()=>y,createRef:()=>b,h:()=>y,hydrate:()=>V,isValidElement:()=>l,options:()=>o,render:()=>I,toChildArray:()=>x});var n={};t.r(n),t.d(n,{useCallback:()=>ae,useContext:()=>fe,useDebugValue:()=>se,useEffect:()=>oe,useErrorBoundary:()=>pe,useImperativeHandle:()=>ie,useLayoutEffect:()=>ue,useMemo:()=>ce,useReducer:()=>re,useRef:()=>le,useState:()=>_e});var _={};t.r(_),t.d(_,{Children:()=>xe,Component:()=>k,Fragment:()=>g,PureComponent:()=>Ce,StrictMode:()=>cn,Suspense:()=>Ne,SuspenseList:()=>He,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:()=>Xe,cloneElement:()=>_n,createContext:()=>B,createElement:()=>y,createFactory:()=>nn,createPortal:()=>Fe,createRef:()=>b,default:()=>an,findDOMNode:()=>on,flushSync:()=>ln,forwardRef:()=>Pe,hydrate:()=>je,isValidElement:()=>tn,lazy:()=>Ue,memo:()=>Se,render:()=>Be,unmountComponentAtNode:()=>rn,unstable_batchedUpdates:()=>un,useCallback:()=>ae,useContext:()=>fe,useDebugValue:()=>se,useEffect:()=>oe,useErrorBoundary:()=>pe,useImperativeHandle:()=>ie,useLayoutEffect:()=>ue,useMemo:()=>ce,useReducer:()=>re,useRef:()=>le,useState:()=>_e,version:()=>en});var r,o,u,l,i,c,a,f,s={},p=[],d=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function h(e,n){for(var t in n)e[t]=n[t];return e}function v(e){var n=e.parentNode;n&&n.removeChild(e)}function y(e,n,t){var _,o,u,l={};for(u in n)"key"==u?_=n[u]:"ref"==u?o=n[u]:l[u]=n[u];if(arguments.length>2&&(l.children=arguments.length>3?r.call(arguments,2):t),"function"==typeof e&&null!=e.defaultProps)for(u in e.defaultProps)void 0===l[u]&&(l[u]=e.defaultProps[u]);return m(e,l,_,o,null)}function m(e,n,t,_,r){var l={type:e,props:n,key:t,ref:_,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u:r};return null==r&&null!=o.vnode&&o.vnode(l),l}function b(){return{current:null}}function g(e){return e.children}function k(e,n){this.props=e,this.context=n}function C(e,n){if(null==n)return e.__?C(e.__,e.__.__k.indexOf(e)+1):null;for(var t;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e)return t.__e;return"function"==typeof e.type?C(e):null}function S(e){var n,t;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,n=0;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e){e.__e=e.__c.base=t.__e;break}return S(e)}}function E(e){(!e.__d&&(e.__d=!0)&&i.push(e)&&!w.__r++||a!==o.debounceRendering)&&((a=o.debounceRendering)||c)(w)}function w(){for(var e;w.__r=i.length;)e=i.sort((function(e,n){return e.__v.__b-n.__v.__b})),i=[],e.some((function(e){var n,t,_,r,o,u;e.__d&&(o=(r=(n=e).__v).__e,(u=n.__P)&&(t=[],(_=h({},r)).__v=r.__v+1,H(u,r,_,n.__n,void 0!==u.ownerSVGElement,null!=r.__h?[o]:null,t,null==o?C(r):o,r.__h),D(t,r),r.__e!=o&&S(r)))}))}function P(e,n,t,_,r,o,u,l,i,c){var a,f,d,h,v,y,b,k=_&&_.__k||p,S=k.length;for(t.__k=[],a=0;a<n.length;a++)if(null!=(h=t.__k[a]=null==(h=n[a])||"boolean"==typeof h?null:"string"==typeof h||"number"==typeof h||"bigint"==typeof h?m(null,h,null,null,h):Array.isArray(h)?m(g,{children:h},null,null,null):h.__b>0?m(h.type,h.props,h.key,null,h.__v):h)){if(h.__=t,h.__b=t.__b+1,null===(d=k[a])||d&&h.key==d.key&&h.type===d.type)k[a]=void 0;else for(f=0;f<S;f++){if((d=k[f])&&h.key==d.key&&h.type===d.type){k[f]=void 0;break}d=null}H(e,h,d=d||s,r,o,u,l,i,c),v=h.__e,(f=h.ref)&&d.ref!=f&&(b||(b=[]),d.ref&&b.push(d.ref,null,h),b.push(f,h.__c||v,h)),null!=v?(null==y&&(y=v),"function"==typeof h.type&&h.__k===d.__k?h.__d=i=R(h,i,e):i=A(e,h,d,k,v,i),"function"==typeof t.type&&(t.__d=i)):i&&d.__e==i&&i.parentNode!=e&&(i=C(d))}for(t.__e=y,a=S;a--;)null!=k[a]&&("function"==typeof t.type&&null!=k[a].__e&&k[a].__e==t.__d&&(t.__d=C(_,a+1)),F(k[a],k[a]));if(b)for(a=0;a<b.length;a++)M(b[a],b[++a],b[++a])}function R(e,n,t){for(var _,r=e.__k,o=0;r&&o<r.length;o++)(_=r[o])&&(_.__=e,n="function"==typeof _.type?R(_,n,t):A(t,_,_,r,_.__e,n));return n}function x(e,n){return n=n||[],null==e||"boolean"==typeof e||(Array.isArray(e)?e.some((function(e){x(e,n)})):n.push(e)),n}function A(e,n,t,_,r,o){var u,l,i;if(void 0!==n.__d)u=n.__d,n.__d=void 0;else if(null==t||r!=o||null==r.parentNode)e:if(null==o||o.parentNode!==e)e.appendChild(r),u=null;else{for(l=o,i=0;(l=l.nextSibling)&&i<_.length;i+=2)if(l==r)break e;e.insertBefore(r,o),u=o}return void 0!==u?u:r.nextSibling}function T(e,n,t){"-"===n[0]?e.setProperty(n,t):e[n]=null==t?"":"number"!=typeof t||d.test(n)?t:t+"px"}function N(e,n,t,_,r){var o;e:if("style"===n)if("string"==typeof t)e.style.cssText=t;else{if("string"==typeof _&&(e.style.cssText=_=""),_)for(n in _)t&&n in t||T(e.style,n,"");if(t)for(n in t)_&&t[n]===_[n]||T(e.style,n,t[n])}else if("o"===n[0]&&"n"===n[1])o=n!==(n=n.replace(/Capture$/,"")),n=n.toLowerCase()in e?n.toLowerCase().slice(2):n.slice(2),e.l||(e.l={}),e.l[n+o]=t,t?_||e.addEventListener(n,o?U:O,o):e.removeEventListener(n,o?U:O,o);else if("dangerouslySetInnerHTML"!==n){if(r)n=n.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==n&&"list"!==n&&"form"!==n&&"tabIndex"!==n&&"download"!==n&&n in e)try{e[n]=null==t?"":t;break e}catch(e){}"function"==typeof t||(null!=t&&(!1!==t||"a"===n[0]&&"r"===n[1])?e.setAttribute(n,t):e.removeAttribute(n))}}function O(e){this.l[e.type+!1](o.event?o.event(e):e)}function U(e){this.l[e.type+!0](o.event?o.event(e):e)}function H(e,n,t,_,r,u,l,i,c){var a,f,s,p,d,v,y,m,b,C,S,E=n.type;if(void 0!==n.constructor)return null;null!=t.__h&&(c=t.__h,i=n.__e=t.__e,n.__h=null,u=[i]),(a=o.__b)&&a(n);try{e:if("function"==typeof E){if(m=n.props,b=(a=E.contextType)&&_[a.__c],C=a?b?b.props.value:a.__:_,t.__c?y=(f=n.__c=t.__c).__=f.__E:("prototype"in E&&E.prototype.render?n.__c=f=new E(m,C):(n.__c=f=new k(m,C),f.constructor=E,f.render=W),b&&b.sub(f),f.props=m,f.state||(f.state={}),f.context=C,f.__n=_,s=f.__d=!0,f.__h=[]),null==f.__s&&(f.__s=f.state),null!=E.getDerivedStateFromProps&&(f.__s==f.state&&(f.__s=h({},f.__s)),h(f.__s,E.getDerivedStateFromProps(m,f.__s))),p=f.props,d=f.state,s)null==E.getDerivedStateFromProps&&null!=f.componentWillMount&&f.componentWillMount(),null!=f.componentDidMount&&f.__h.push(f.componentDidMount);else{if(null==E.getDerivedStateFromProps&&m!==p&&null!=f.componentWillReceiveProps&&f.componentWillReceiveProps(m,C),!f.__e&&null!=f.shouldComponentUpdate&&!1===f.shouldComponentUpdate(m,f.__s,C)||n.__v===t.__v){f.props=m,f.state=f.__s,n.__v!==t.__v&&(f.__d=!1),f.__v=n,n.__e=t.__e,n.__k=t.__k,n.__k.forEach((function(e){e&&(e.__=n)})),f.__h.length&&l.push(f);break e}null!=f.componentWillUpdate&&f.componentWillUpdate(m,f.__s,C),null!=f.componentDidUpdate&&f.__h.push((function(){f.componentDidUpdate(p,d,v)}))}f.context=C,f.props=m,f.state=f.__s,(a=o.__r)&&a(n),f.__d=!1,f.__v=n,f.__P=e,a=f.render(f.props,f.state,f.context),f.state=f.__s,null!=f.getChildContext&&(_=h(h({},_),f.getChildContext())),s||null==f.getSnapshotBeforeUpdate||(v=f.getSnapshotBeforeUpdate(p,d)),S=null!=a&&a.type===g&&null==a.key?a.props.children:a,P(e,Array.isArray(S)?S:[S],n,t,_,r,u,l,i,c),f.base=n.__e,n.__h=null,f.__h.length&&l.push(f),y&&(f.__E=f.__=null),f.__e=!1}else null==u&&n.__v===t.__v?(n.__k=t.__k,n.__e=t.__e):n.__e=L(t.__e,n,t,_,r,u,l,c);(a=o.diffed)&&a(n)}catch(e){n.__v=null,(c||null!=u)&&(n.__e=i,n.__h=!!c,u[u.indexOf(i)]=null),o.__e(e,n,t)}}function D(e,n){o.__c&&o.__c(n,e),e.some((function(n){try{e=n.__h,n.__h=[],e.some((function(e){e.call(n)}))}catch(e){o.__e(e,n.__v)}}))}function L(e,n,t,_,o,u,l,i){var c,a,f,p=t.props,d=n.props,h=n.type,y=0;if("svg"===h&&(o=!0),null!=u)for(;y<u.length;y++)if((c=u[y])&&"setAttribute"in c==!!h&&(h?c.localName===h:3===c.nodeType)){e=c,u[y]=null;break}if(null==e){if(null===h)return document.createTextNode(d);e=o?document.createElementNS("http://www.w3.org/2000/svg",h):document.createElement(h,d.is&&d),u=null,i=!1}if(null===h)p===d||i&&e.data===d||(e.data=d);else{if(u=u&&r.call(e.childNodes),a=(p=t.props||s).dangerouslySetInnerHTML,f=d.dangerouslySetInnerHTML,!i){if(null!=u)for(p={},y=0;y<e.attributes.length;y++)p[e.attributes[y].name]=e.attributes[y].value;(f||a)&&(f&&(a&&f.__html==a.__html||f.__html===e.innerHTML)||(e.innerHTML=f&&f.__html||""))}if(function(e,n,t,_,r){var o;for(o in t)"children"===o||"key"===o||o in n||N(e,o,null,t[o],_);for(o in n)r&&"function"!=typeof n[o]||"children"===o||"key"===o||"value"===o||"checked"===o||t[o]===n[o]||N(e,o,n[o],t[o],_)}(e,d,p,o,i),f)n.__k=[];else if(y=n.props.children,P(e,Array.isArray(y)?y:[y],n,t,_,o&&"foreignObject"!==h,u,l,u?u[0]:t.__k&&C(t,0),i),null!=u)for(y=u.length;y--;)null!=u[y]&&v(u[y]);i||("value"in d&&void 0!==(y=d.value)&&(y!==p.value||y!==e.value||"progress"===h&&!y)&&N(e,"value",y,p.value,!1),"checked"in d&&void 0!==(y=d.checked)&&y!==e.checked&&N(e,"checked",y,p.checked,!1))}return e}function M(e,n,t){try{"function"==typeof e?e(n):e.current=n}catch(e){o.__e(e,t)}}function F(e,n,t){var _,r;if(o.unmount&&o.unmount(e),(_=e.ref)&&(_.current&&_.current!==e.__e||M(_,null,n)),null!=(_=e.__c)){if(_.componentWillUnmount)try{_.componentWillUnmount()}catch(e){o.__e(e,n)}_.base=_.__P=null}if(_=e.__k)for(r=0;r<_.length;r++)_[r]&&F(_[r],n,"function"!=typeof e.type);t||null==e.__e||v(e.__e),e.__e=e.__d=void 0}function W(e,n,t){return this.constructor(e,t)}function I(e,n,t){var _,u,l;o.__&&o.__(e,n),u=(_="function"==typeof t)?null:t&&t.__k||n.__k,l=[],H(n,e=(!_&&t||n).__k=y(g,null,[e]),u||s,s,void 0!==n.ownerSVGElement,!_&&t?[t]:u?null:n.firstChild?r.call(n.childNodes):null,l,!_&&t?t:u?u.__e:n.firstChild,_),D(l,e)}function V(e,n){I(e,n,V)}function $(e,n,t){var _,o,u,l=h({},e.props);for(u in n)"key"==u?_=n[u]:"ref"==u?o=n[u]:l[u]=n[u];return arguments.length>2&&(l.children=arguments.length>3?r.call(arguments,2):t),m(e.type,l,_||e.key,o||e.ref,null)}function B(e,n){var t={__c:n="__cC"+f++,__:e,Consumer:function(e,n){return e.children(n)},Provider:function(e){var t,_;return this.getChildContext||(t=[],(_={})[n]=this,this.getChildContext=function(){return _},this.shouldComponentUpdate=function(e){this.props.value!==e.value&&t.some(E)},this.sub=function(e){t.push(e);var n=e.componentWillUnmount;e.componentWillUnmount=function(){t.splice(t.indexOf(e),1),n&&n.call(e)}}),e.children}};return t.Provider.__=t.Consumer.contextType=t}r=p.slice,o={__e:function(e,n){for(var t,_,r;n=n.__;)if((t=n.__c)&&!t.__)try{if((_=t.constructor)&&null!=_.getDerivedStateFromError&&(t.setState(_.getDerivedStateFromError(e)),r=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(e),r=t.__d),r)return t.__E=t}catch(n){e=n}throw e}},u=0,l=function(e){return null!=e&&void 0===e.constructor},k.prototype.setState=function(e,n){var t;t=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=h({},this.state),"function"==typeof e&&(e=e(h({},t),this.props)),e&&h(t,e),null!=e&&this.__v&&(n&&this.__h.push(n),E(this))},k.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),E(this))},k.prototype.render=g,i=[],c="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,w.__r=0,f=0;var j=t(888);const q="hydrated:static";var z,G,Y,Z=0,J=[],K=o.__b,Q=o.__r,X=o.diffed,ee=o.__c,ne=o.unmount;function te(e,n){o.__h&&o.__h(G,e,Z||n),Z=0;var t=G.__H||(G.__H={__:[],__h:[]});return e>=t.__.length&&t.__.push({}),t.__[e]}function _e(e){return Z=1,re(be,e)}function re(e,n,t){var _=te(z++,2);return _.t=e,_.__c||(_.__=[t?t(n):be(void 0,n),function(e){var n=_.t(_.__[0],e);_.__[0]!==n&&(_.__=[n,_.__[1]],_.__c.setState({}))}],_.__c=G),_.__}function oe(e,n){var t=te(z++,3);!o.__s&&me(t.__H,n)&&(t.__=e,t.__H=n,G.__H.__h.push(t))}function ue(e,n){var t=te(z++,4);!o.__s&&me(t.__H,n)&&(t.__=e,t.__H=n,G.__h.push(t))}function le(e){return Z=5,ce((function(){return{current:e}}),[])}function ie(e,n,t){Z=6,ue((function(){"function"==typeof e?e(n()):e&&(e.current=n())}),null==t?t:t.concat(e))}function ce(e,n){var t=te(z++,7);return me(t.__H,n)&&(t.__=e(),t.__H=n,t.__h=e),t.__}function ae(e,n){return Z=8,ce((function(){return e}),n)}function fe(e){var n=G.context[e.__c],t=te(z++,9);return t.c=e,n?(null==t.__&&(t.__=!0,n.sub(G)),n.props.value):e.__}function se(e,n){o.useDebugValue&&o.useDebugValue(n?n(e):e)}function pe(e){var n=te(z++,10),t=_e();return n.__=e,G.componentDidCatch||(G.componentDidCatch=function(e){n.__&&n.__(e),t[1](e)}),[t[0],function(){t[1](void 0)}]}function de(){for(var e;e=J.shift();)if(e.__P)try{e.__H.__h.forEach(ve),e.__H.__h.forEach(ye),e.__H.__h=[]}catch(n){e.__H.__h=[],o.__e(n,e.__v)}}o.__b=function(e){G=null,K&&K(e)},o.__r=function(e){Q&&Q(e),z=0;var n=(G=e.__c).__H;n&&(n.__h.forEach(ve),n.__h.forEach(ye),n.__h=[])},o.diffed=function(e){X&&X(e);var n=e.__c;n&&n.__H&&n.__H.__h.length&&(1!==J.push(n)&&Y===o.requestAnimationFrame||((Y=o.requestAnimationFrame)||function(e){var n,t=function(){clearTimeout(_),he&&cancelAnimationFrame(n),setTimeout(e)},_=setTimeout(t,100);he&&(n=requestAnimationFrame(t))})(de)),G=null},o.__c=function(e,n){n.some((function(e){try{e.__h.forEach(ve),e.__h=e.__h.filter((function(e){return!e.__||ye(e)}))}catch(t){n.some((function(e){e.__h&&(e.__h=[])})),n=[],o.__e(t,e.__v)}})),ee&&ee(e,n)},o.unmount=function(e){ne&&ne(e);var n,t=e.__c;t&&t.__H&&(t.__H.__.forEach((function(e){try{ve(e)}catch(e){n=e}})),n&&o.__e(n,t.__v))};var he="function"==typeof requestAnimationFrame;function ve(e){var n=G,t=e.__c;"function"==typeof t&&(e.__c=void 0,t()),G=n}function ye(e){var n=G;e.__c=e.__(),G=n}function me(e,n){return!e||e.length!==n.length||n.some((function(n,t){return n!==e[t]}))}function be(e,n){return"function"==typeof n?n(e):n}function ge(e,n){for(var t in n)e[t]=n[t];return e}function ke(e,n){for(var t in e)if("__source"!==t&&!(t in n))return!0;for(var _ in n)if("__source"!==_&&e[_]!==n[_])return!0;return!1}function Ce(e){this.props=e}function Se(e,n){function t(e){var t=this.props.ref,_=t==e.ref;return!_&&t&&(t.call?t(null):t.current=null),n?!n(this.props,e)||!_:ke(this.props,e)}function _(n){return this.shouldComponentUpdate=t,y(e,n)}return _.displayName="Memo("+(e.displayName||e.name)+")",_.prototype.isReactComponent=!0,_.__f=!0,_}(Ce.prototype=new k).isPureReactComponent=!0,Ce.prototype.shouldComponentUpdate=function(e,n){return ke(this.props,e)||ke(this.state,n)};var Ee=o.__b;o.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),Ee&&Ee(e)};var we="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function Pe(e){function n(n,t){var _=ge({},n);return delete _.ref,e(_,(t=n.ref||t)&&("object"!=typeof t||"current"in t)?t:null)}return n.$$typeof=we,n.render=n,n.prototype.isReactComponent=n.__f=!0,n.displayName="ForwardRef("+(e.displayName||e.name)+")",n}var Re=function(e,n){return null==e?null:x(x(e).map(n))},xe={map:Re,forEach:Re,count:function(e){return e?x(e).length:0},only:function(e){var n=x(e);if(1!==n.length)throw"Children.only";return n[0]},toArray:x},Ae=o.__e;o.__e=function(e,n,t){if(e.then)for(var _,r=n;r=r.__;)if((_=r.__c)&&_.__c)return null==n.__e&&(n.__e=t.__e,n.__k=t.__k),_.__c(e,n);Ae(e,n,t)};var Te=o.unmount;function Ne(){this.__u=0,this.t=null,this.__b=null}function Oe(e){var n=e.__.__c;return n&&n.__e&&n.__e(e)}function Ue(e){var n,t,_;function r(r){if(n||(n=e()).then((function(e){t=e.default||e}),(function(e){_=e})),_)throw _;if(!t)throw n;return y(t,r)}return r.displayName="Lazy",r.__f=!0,r}function He(){this.u=null,this.o=null}o.unmount=function(e){var n=e.__c;n&&n.__R&&n.__R(),n&&!0===e.__h&&(e.type=null),Te&&Te(e)},(Ne.prototype=new k).__c=function(e,n){var t=n.__c,_=this;null==_.t&&(_.t=[]),_.t.push(t);var r=Oe(_.__v),o=!1,u=function(){o||(o=!0,t.__R=null,r?r(l):l())};t.__R=u;var l=function(){if(!--_.__u){if(_.state.__e){var e=_.state.__e;_.__v.__k[0]=function e(n,t,_){return n&&(n.__v=null,n.__k=n.__k&&n.__k.map((function(n){return e(n,t,_)})),n.__c&&n.__c.__P===t&&(n.__e&&_.insertBefore(n.__e,n.__d),n.__c.__e=!0,n.__c.__P=_)),n}(e,e.__c.__P,e.__c.__O)}var n;for(_.setState({__e:_.__b=null});n=_.t.pop();)n.forceUpdate()}},i=!0===n.__h;_.__u++||i||_.setState({__e:_.__b=_.__v.__k[0]}),e.then(u,u)},Ne.prototype.componentWillUnmount=function(){this.t=[]},Ne.prototype.render=function(e,n){if(this.__b){if(this.__v.__k){var t=document.createElement("div"),_=this.__v.__k[0].__c;this.__v.__k[0]=function e(n,t,_){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach((function(e){"function"==typeof e.__c&&e.__c()})),n.__c.__H=null),null!=(n=ge({},n)).__c&&(n.__c.__P===_&&(n.__c.__P=t),n.__c=null),n.__k=n.__k&&n.__k.map((function(n){return e(n,t,_)}))),n}(this.__b,t,_.__O=_.__P)}this.__b=null}var r=n.__e&&y(g,null,e.fallback);return r&&(r.__h=null),[y(g,null,n.__e?null:e.children),r]};var De=function(e,n,t){if(++t[1]===t[0]&&e.o.delete(n),e.props.revealOrder&&("t"!==e.props.revealOrder[0]||!e.o.size))for(t=e.u;t;){for(;t.length>3;)t.pop()();if(t[1]<t[0])break;e.u=t=t[2]}};function Le(e){return this.getChildContext=function(){return e.context},e.children}function Me(e){var n=this,t=e.i;n.componentWillUnmount=function(){I(null,n.l),n.l=null,n.i=null},n.i&&n.i!==t&&n.componentWillUnmount(),e.__v?(n.l||(n.i=t,n.l={nodeType:1,parentNode:t,childNodes:[],appendChild:function(e){this.childNodes.push(e),n.i.appendChild(e)},insertBefore:function(e,t){this.childNodes.push(e),n.i.appendChild(e)},removeChild:function(e){this.childNodes.splice(this.childNodes.indexOf(e)>>>1,1),n.i.removeChild(e)}}),I(y(Le,{context:n.context},e.__v),n.l)):n.l&&n.componentWillUnmount()}function Fe(e,n){return y(Me,{__v:e,i:n})}(He.prototype=new k).__e=function(e){var n=this,t=Oe(n.__v),_=n.o.get(e);return _[0]++,function(r){var o=function(){n.props.revealOrder?(_.push(r),De(n,e,_)):r()};t?t(o):o()}},He.prototype.render=function(e){this.u=null,this.o=new Map;var n=x(e.children);e.revealOrder&&"b"===e.revealOrder[0]&&n.reverse();for(var t=n.length;t--;)this.o.set(n[t],this.u=[1,0,this.u]);return e.children},He.prototype.componentDidUpdate=He.prototype.componentDidMount=function(){var e=this;this.o.forEach((function(n,t){De(e,t,n)}))};var We="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,Ie=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,Ve="undefined"!=typeof document,$e=function(e){return("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/i:/fil|che|ra/i).test(e)};function Be(e,n,t){return null==n.__k&&(n.textContent=""),I(e,n),"function"==typeof t&&t(),e?e.__c:null}function je(e,n,t){return V(e,n),"function"==typeof t&&t(),e?e.__c:null}k.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach((function(e){Object.defineProperty(k.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(n){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:n})}})}));var qe=o.event;function ze(){}function Ge(){return this.cancelBubble}function Ye(){return this.defaultPrevented}o.event=function(e){return qe&&(e=qe(e)),e.persist=ze,e.isPropagationStopped=Ge,e.isDefaultPrevented=Ye,e.nativeEvent=e};var Ze,Je={configurable:!0,get:function(){return this.class}},Ke=o.vnode;o.vnode=function(e){var n=e.type,t=e.props,_=t;if("string"==typeof n){var r=-1===n.indexOf("-");for(var o in _={},t){var u=t[o];Ve&&"children"===o&&"noscript"===n||"value"===o&&"defaultValue"in t&&null==u||("defaultValue"===o&&"value"in t&&null==t.value?o="value":"download"===o&&!0===u?u="":/ondoubleclick/i.test(o)?o="ondblclick":/^onchange(textarea|input)/i.test(o+n)&&!$e(t.type)?o="oninput":/^onfocus$/i.test(o)?o="onfocusin":/^onblur$/i.test(o)?o="onfocusout":/^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(o)?o=o.toLowerCase():r&&Ie.test(o)?o=o.replace(/[A-Z0-9]/,"-$&").toLowerCase():null===u&&(u=void 0),_[o]=u)}"select"==n&&_.multiple&&Array.isArray(_.value)&&(_.value=x(t.children).forEach((function(e){e.props.selected=-1!=_.value.indexOf(e.props.value)}))),"select"==n&&null!=_.defaultValue&&(_.value=x(t.children).forEach((function(e){e.props.selected=_.multiple?-1!=_.defaultValue.indexOf(e.props.value):_.defaultValue==e.props.value}))),e.props=_,t.class!=t.className&&(Je.enumerable="className"in t,null!=t.className&&(_.class=t.className),Object.defineProperty(_,"className",Je))}e.$$typeof=We,Ke&&Ke(e)};var Qe=o.__r;o.__r=function(e){Qe&&Qe(e),Ze=e.__c};var Xe={ReactCurrentDispatcher:{current:{readContext:function(e){return Ze.__n[e.__c].props.value}}}},en="17.0.2";function nn(e){return y.bind(null,e)}function tn(e){return!!e&&e.$$typeof===We}function _n(e){return tn(e)?$.apply(null,arguments):e}function rn(e){return!!e.__k&&(I(null,e),!0)}function on(e){return e&&(e.base||1===e.nodeType&&e)||null}var un=function(e,n){return e(n)},ln=function(e,n){return e(n)},cn=g;const an={useState:_e,useReducer:re,useEffect:oe,useLayoutEffect:ue,useRef:le,useImperativeHandle:ie,useMemo:ce,useCallback:ae,useContext:fe,useDebugValue:se,version:"17.0.2",Children:xe,render:Be,hydrate:je,unmountComponentAtNode:rn,createPortal:Fe,createElement:y,createContext:B,createFactory:nn,cloneElement:_n,createRef:b,Fragment:g,isValidElement:tn,findDOMNode:on,Component:k,PureComponent:Ce,memo:Se,forwardRef:Pe,flushSync:ln,unstable_batchedUpdates:un,StrictMode:g,Suspense:Ne,SuspenseList:He,lazy:Ue,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:Xe};window.__AS_PREACT=e,window.__AS_PREACT_HOOKS=n,window.__AS_PREACT_COMPAT=_,window.__AURISERVE={},window.__AURISERVE.hydrated={},window.__AURISERVE.hydrated.Static=function(e){return"undefined"==typeof window?__AS_PREACT.h("div",{class:(0,j.TS)(q,e.class),style:e.style},e.children):__AS_PREACT.h("div",{class:(0,j.TS)(q,e.class),style:e.style,dangerouslySetInnerHTML:{__html:""}})},window.__AURISERVE.hydrated.hydrate=function(e,n){window.setTimeout((()=>{document.querySelectorAll(`[data-element="${e}"]`).forEach((e=>{const t=e.querySelector(":scope > script"),_=JSON.parse(t.innerText);t.remove(),V(y(n,_),e)}),200)}))}})()})();
/*! For license information please see client.js.LICENSE.txt */
(()=>{var t={527:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.assertSchema=e.matchesSchema=e.isRawObject=e.isType=e.assertEq=e.assert=e.AssertError=void 0;class r extends Error{constructor(...t){super(...t),Error.captureStackTrace&&Error.captureStackTrace(this,r),this.name="AssertError"}}function n(t,e,...n){var i;if(!t)throw new(null!==(i=n[0])&&void 0!==i?i:r)(e,...n.length>1?n.slice(1):[])}function i(t,e){if("any"===e)return!0;if("string"==typeof e){if("undefined"===e)return void 0===t;if(typeof t===e)return!0}else if(t instanceof e)return!0;return!1}function o(t){return t&&t.constructor===Object||!1}function a(t,e,r=""){if(!o(t))return"Not an object.";for(const[n,s]of Object.entries(e)){const u=Array.isArray(s)?s:[s],c=Object.keys(t).filter((t=>void 0===e[t])).map((t=>`'${r}${t}'`));if(c.length>0){const t=1===c.length?c[0]:2===c.length?`${c[0]} and ${c[1]}`:`${c.slice(0,-1).join(", ")}, and ${c.slice(-1)}`;return`Unknown propert${c.length>=2?"ies":"y"} ${t}.`}let l=!1;for(const e of u)if(o(e)){if(!0===a(t[n],e,`${r}${n}.`)){l=!0;break}}else if(e.includes("[]")){const r=e.replace("[]","");if(Array.isArray(t[n])){let e=!0;for(const o of t[n])if(!i(o,r)){e=!1;break}if(e){l=!0;break}}}else if(i(t[n],e)){l=!0;break}if(!l){const t=u.map((t=>o(t)?"[subschema]":t.toString())),e=1===t.length?t[0]:2===t.length?`${t[0]} or ${t[1]}`:`${t.slice(0,-1).join(", ")}, or ${t.slice(-1)}`;return`'${r}${n}' must be ${e}.`}}return!0}e.AssertError=r,e.assert=n,e.assertEq=function(t,e,r,...i){if(t!==e)return n(!1,`${r} (${t} != ${e})`,...i)},e.isType=i,e.isRawObject=o,e.matchesSchema=a,e.assertSchema=function(t,e,r,...i){const o=a(t,e);"string"==typeof o&&n(!1,`${r}: ${o}`,...i)}},933:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.to=e.isHSVA=e.isRGBA=e.isHex=void 0;const n=r(527);function i(t){return"string"==typeof t&&"#"===t[0]&&(7===t.length||9===t.length)}function o(t){return"string"!=typeof t&&"r"in t}function a(t={h:0,s:0,v:0,a:1}){let e=0,r=0,n=0;const i=Math.floor(6*t.h),o=6*t.h-i,a=t.v*(1-t.s),s=t.v*(1-o*t.s),u=t.v*(1-(1-o)*t.s);switch(i%6){default:break;case 0:e=t.v,r=u,n=a;break;case 1:e=s,r=t.v,n=a;break;case 2:e=a,r=t.v,n=u;break;case 3:e=a,r=s,n=t.v;break;case 4:e=u,r=a,n=t.v;break;case 5:e=t.v,r=a,n=s}return{r:255*e,g:255*r,b:255*n,a:255*t.a}}function s(t={r:0,g:0,b:0,a:1}){let e,r,n,i,o=0;const a=t.a/255,s=Math.max(t.r,t.g,t.b)/255,u=s-Math.min(t.r,t.g,t.b)/255,c=t=>(s-t)/6/u+.5;return 0===u?o=i=0:(i=u/s,e=c(t.r/255),r=c(t.g/255),n=c(t.b/255),t.r/255===s?o=n-r:t.g/255===s?o=1/3+e-n:t.b/255===s&&(o=2/3+r-e),o<0?o+=1:o>1&&(o-=1)),{h:o,s:i,v:s,a}}function u(t){const e=Math.floor(t).toString(16);return 1===e.length?`0${e}`:e}e.isHex=i,e.isRGBA=o,e.isHSVA=function(t){return"string"!=typeof t&&"h"in t},e.to=function(t,e){const r=i(t)?s(function(t){const e=parseInt(`0x${t[1]}${t[2]}`,16),r=parseInt(`0x${t[3]}${t[4]}`,16),n=parseInt(`0x${t[5]}${t[6]}`,16);let i=parseInt(`0x${t[7]}${t[8]}`,16);return Number.isNaN(i)&&(i=255),{r:e,g:r,b:n,a:i}}(t)):o(t)?s(t):t;switch(e){case"hex":return function(t={h:0,s:0,v:0,a:1}){return function(t={r:0,g:0,b:0,a:255}){return`#${u(t.r)}${u(t.g)}${u(t.b)}${255===t.a?"":u(t.a)}`}(a(t))}(r);case"rgba":return a(r);case"hsva":return r;default:n.assert(!1,`Invalid format '${e}' provided.`)}}},553:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.titleCase=e.identifier=e.date=e.vector=e.bytes=void 0;const n=r(472),i=n.__importDefault(r(872)),o=n.__importDefault(r(259)),a=n.__importDefault(r(664));i.default.extend(o.default),i.default.extend(a.default);const s=["B","KB","MB","GB"];e.bytes=function(t){t=Math.round(t);let e=0;for(;t>800&&e<s.length-1;)e++,t/=1024;return`${Math.ceil(t)} ${s[e]}`},e.vector=function(t){var e,r;return`${null!==(e=t.x)&&void 0!==e?e:t.width} × ${null!==(r=t.y)&&void 0!==r?r:t.height}`},e.date=function(t){const e=t instanceof Date?t:new Date(t);return Date.now()-+e<2592e5?i.default(t).fromNow():e.getFullYear()===(new Date).getFullYear()?`on ${i.default(t).format("MMMM Do")}`:`on ${i.default(t).format("MMMM Do, YYYY")}`},e.identifier=function(t,e=3,r=32,n=!0){const i=t.toLowerCase().replace(/[ -]/g,"_").replace(/[^a-zA-Z0-9_]/g,"").split("_").filter(Boolean).join("_");return i.length>r&&n?i.substring(0,r):i.length<e||i.length>r?null:i},e.titleCase=function(t){return t.replace(/[_-]/g," ").replace(/\w\S*/g,(t=>{var e,r,n,i;return(null!==(r=null===(e=t.charAt(0))||void 0===e?void 0:e.toUpperCase())&&void 0!==r?r:"")+(null!==(i=null===(n=t.substring(1))||void 0===n?void 0:n.toLowerCase())&&void 0!==i?i:"")}))}},22:(t,e,r)=>{"use strict";e.TS=void 0;r(348),r(553),r(933);var n=r(888);Object.defineProperty(e,"TS",{enumerable:!0,get:function(){return n.merge}});r(188),r(527)},348:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.splitPath=e.buildPath=e.traversePath=void 0;const n=r(527);function i(t){return t.replace(/\[/g,".[").split(".").filter(Boolean).map((t=>{if(t.startsWith("[")){n.assert(t.endsWith("]"),`Invalid path array segment '${t}'. [1]`);const e=Number.parseInt(t.substring(1,t.length-1),10);return n.assert(!Number.isNaN(e),`Invalid path array segment '${t}'. [2]`),e}return t}))}e.traversePath=function(t,e){return i(e).forEach((e=>t=function(t,e){return"number"==typeof t?(n.assert(Array.isArray(e),`Invalid Array index into Value '${JSON.stringify(e)}'.`),n.assert(e.length>t,`Index '${t}' is missing in Array '${JSON.stringify(e)}'.`),e[t]):(n.assert(void 0!==e&&"object"==typeof e,`Value is not an object: '${e}'.`),n.assert(t in e,`Object is missing property '${t}': '${JSON.stringify(e)}'.`),e[t])}(e,t))),t},e.buildPath=function(...t){return t.filter((t=>""!==t)).reduce(((t,e,r)=>t+(Number.isInteger(e)?`[${e.toString()}]`:(0!==r?".":"")+e)),"")},e.splitPath=i},888:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.sign=e.merge=void 0,e.merge=function(...t){return t.filter((t=>t)).join(" ")},e.sign=function(t){return t<0?-1:t>0?1:0}},188:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(527);e.default=class{constructor(t){const e=t.trim().split(".");n.assert(3===e.length,`Invalid version string: '${t}'.`),this.major=parseInt(e[0],10),this.minor=parseInt(e[1],10),this.patch=parseInt(e[2],10)}matches(t){const e=t.trim().split(".");let r="x"===e[1];!r&&e[0].startsWith("^")&&(e[0]=e[0].substring(1).trim(),r=!0);let n="x"===e[2];!n&&e[0].startsWith("~")&&(e[0]=e[0].substring(1).trim(),n=!0);const i=e[0].startsWith("x");r||(r=i),n||(n=r);const o="x"===e[0]?0:parseInt(e[0],10),a="x"===e[1]||void 0===e[1]?0:parseInt(e[1],10),s="x"===e[2]||void 0===e[2]?0:parseInt(e[2],10);return o!==this.major?!!i&&this.major>=o:a!==this.minor?!!r&&this.minor>=a:s===this.patch||!!n&&this.patch>=s}}},872:function(t){t.exports=function(){"use strict";var t=6e4,e=36e5,r="millisecond",n="second",i="minute",o="hour",a="day",s="week",u="month",c="quarter",l="year",f="date",h="Invalid Date",d=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,p=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,y={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},v=function(t,e,r){var n=String(t);return!n||n.length>=e?t:""+Array(e+1-n.length).join(r)+t},m={s:v,z:function(t){var e=-t.utcOffset(),r=Math.abs(e),n=Math.floor(r/60),i=r%60;return(e<=0?"+":"-")+v(n,2,"0")+":"+v(i,2,"0")},m:function t(e,r){if(e.date()<r.date())return-t(r,e);var n=12*(r.year()-e.year())+(r.month()-e.month()),i=e.clone().add(n,u),o=r-i<0,a=e.clone().add(n+(o?-1:1),u);return+(-(n+(r-i)/(o?i-a:a-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:u,y:l,w:s,d:a,D:f,h:o,m:i,s:n,ms:r,Q:c}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",b={};b[g]=y;var $=function(t){return t instanceof M},_=function(t,e,r){var n;if(!t)return g;if("string"==typeof t)b[t]&&(n=t),e&&(b[t]=e,n=t);else{var i=t.name;b[i]=t,n=i}return!r&&n&&(g=n),n||!r&&g},w=function(t,e){if($(t))return t.clone();var r="object"==typeof e?e:{};return r.date=t,r.args=arguments,new M(r)},S=m;S.l=_,S.i=$,S.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var M=function(){function y(t){this.$L=_(t.locale,null,!0),this.parse(t)}var v=y.prototype;return v.parse=function(t){this.$d=function(t){var e=t.date,r=t.utc;if(null===e)return new Date(NaN);if(S.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var n=e.match(d);if(n){var i=n[2]-1||0,o=(n[7]||"0").substring(0,3);return r?new Date(Date.UTC(n[1],i,n[3]||1,n[4]||0,n[5]||0,n[6]||0,o)):new Date(n[1],i,n[3]||1,n[4]||0,n[5]||0,n[6]||0,o)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},v.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},v.$utils=function(){return S},v.isValid=function(){return!(this.$d.toString()===h)},v.isSame=function(t,e){var r=w(t);return this.startOf(e)<=r&&r<=this.endOf(e)},v.isAfter=function(t,e){return w(t)<this.startOf(e)},v.isBefore=function(t,e){return this.endOf(e)<w(t)},v.$g=function(t,e,r){return S.u(t)?this[e]:this.set(r,t)},v.unix=function(){return Math.floor(this.valueOf()/1e3)},v.valueOf=function(){return this.$d.getTime()},v.startOf=function(t,e){var r=this,c=!!S.u(e)||e,h=S.p(t),d=function(t,e){var n=S.w(r.$u?Date.UTC(r.$y,e,t):new Date(r.$y,e,t),r);return c?n:n.endOf(a)},p=function(t,e){return S.w(r.toDate()[t].apply(r.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),r)},y=this.$W,v=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case l:return c?d(1,0):d(31,11);case u:return c?d(1,v):d(0,v+1);case s:var b=this.$locale().weekStart||0,$=(y<b?y+7:y)-b;return d(c?m-$:m+(6-$),v);case a:case f:return p(g+"Hours",0);case o:return p(g+"Minutes",1);case i:return p(g+"Seconds",2);case n:return p(g+"Milliseconds",3);default:return this.clone()}},v.endOf=function(t){return this.startOf(t,!1)},v.$set=function(t,e){var s,c=S.p(t),h="set"+(this.$u?"UTC":""),d=(s={},s[a]=h+"Date",s[f]=h+"Date",s[u]=h+"Month",s[l]=h+"FullYear",s[o]=h+"Hours",s[i]=h+"Minutes",s[n]=h+"Seconds",s[r]=h+"Milliseconds",s)[c],p=c===a?this.$D+(e-this.$W):e;if(c===u||c===l){var y=this.clone().set(f,1);y.$d[d](p),y.init(),this.$d=y.set(f,Math.min(this.$D,y.daysInMonth())).$d}else d&&this.$d[d](p);return this.init(),this},v.set=function(t,e){return this.clone().$set(t,e)},v.get=function(t){return this[S.p(t)]()},v.add=function(r,c){var f,h=this;r=Number(r);var d=S.p(c),p=function(t){var e=w(h);return S.w(e.date(e.date()+Math.round(t*r)),h)};if(d===u)return this.set(u,this.$M+r);if(d===l)return this.set(l,this.$y+r);if(d===a)return p(1);if(d===s)return p(7);var y=(f={},f[i]=t,f[o]=e,f[n]=1e3,f)[d]||1,v=this.$d.getTime()+r*y;return S.w(v,this)},v.subtract=function(t,e){return this.add(-1*t,e)},v.format=function(t){var e=this;if(!this.isValid())return h;var r=t||"YYYY-MM-DDTHH:mm:ssZ",n=S.z(this),i=this.$locale(),o=this.$H,a=this.$m,s=this.$M,u=i.weekdays,c=i.months,l=function(t,n,i,o){return t&&(t[n]||t(e,r))||i[n].substr(0,o)},f=function(t){return S.s(o%12||12,t,"0")},d=i.meridiem||function(t,e,r){var n=t<12?"AM":"PM";return r?n.toLowerCase():n},y={YY:String(this.$y).slice(-2),YYYY:this.$y,M:s+1,MM:S.s(s+1,2,"0"),MMM:l(i.monthsShort,s,c,3),MMMM:l(c,s),D:this.$D,DD:S.s(this.$D,2,"0"),d:String(this.$W),dd:l(i.weekdaysMin,this.$W,u,2),ddd:l(i.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(o),HH:S.s(o,2,"0"),h:f(1),hh:f(2),a:d(o,a,!0),A:d(o,a,!1),m:String(a),mm:S.s(a,2,"0"),s:String(this.$s),ss:S.s(this.$s,2,"0"),SSS:S.s(this.$ms,3,"0"),Z:n};return r.replace(p,(function(t,e){return e||y[t]||n.replace(":","")}))},v.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},v.diff=function(r,f,h){var d,p=S.p(f),y=w(r),v=(y.utcOffset()-this.utcOffset())*t,m=this-y,g=S.m(this,y);return g=(d={},d[l]=g/12,d[u]=g,d[c]=g/3,d[s]=(m-v)/6048e5,d[a]=(m-v)/864e5,d[o]=m/e,d[i]=m/t,d[n]=m/1e3,d)[p]||m,h?g:S.a(g)},v.daysInMonth=function(){return this.endOf(u).$D},v.$locale=function(){return b[this.$L]},v.locale=function(t,e){if(!t)return this.$L;var r=this.clone(),n=_(t,e,!0);return n&&(r.$L=n),r},v.clone=function(){return S.w(this.$d,this)},v.toDate=function(){return new Date(this.valueOf())},v.toJSON=function(){return this.isValid()?this.toISOString():null},v.toISOString=function(){return this.$d.toISOString()},v.toString=function(){return this.$d.toUTCString()},y}(),O=M.prototype;return w.prototype=O,[["$ms",r],["$s",n],["$m",i],["$H",o],["$W",a],["$M",u],["$y",l],["$D",f]].forEach((function(t){O[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,M,w),t.$i=!0),w},w.locale=_,w.isDayjs=$,w.unix=function(t){return w(1e3*t)},w.en=b[g],w.Ls=b,w.p={},w}()},664:function(t){t.exports=function(){"use strict";return function(t,e,r){var n=e.prototype,i=n.format;r.en.ordinal=function(t){var e=["th","st","nd","rd"],r=t%100;return"["+t+(e[(r-20)%10]||e[r]||e[0])+"]"},n.format=function(t){var e=this,r=this.$locale(),n=this.$utils(),o=(t||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(t){switch(t){case"Q":return Math.ceil((e.$M+1)/3);case"Do":return r.ordinal(e.$D);case"gggg":return e.weekYear();case"GGGG":return e.isoWeekYear();case"wo":return r.ordinal(e.week(),"W");case"w":case"ww":return n.s(e.week(),"w"===t?1:2,"0");case"W":case"WW":return n.s(e.isoWeek(),"W"===t?1:2,"0");case"k":case"kk":return n.s(String(0===e.$H?24:e.$H),"k"===t?1:2,"0");case"X":return Math.floor(e.$d.getTime()/1e3);case"x":return e.$d.getTime();case"z":return"["+e.offsetName()+"]";case"zzz":return"["+e.offsetName("long")+"]";default:return t}}));return i.bind(this)(o)}}}()},259:function(t){t.exports=function(){"use strict";return function(t,e,r){t=t||{};var n=e.prototype,i={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function o(t,e,r,i){return n.fromToBase(t,e,r,i)}r.en.relativeTime=i,n.fromToBase=function(e,n,o,a,s){for(var u,c,l,f=o.$locale().relativeTime||i,h=t.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],d=h.length,p=0;p<d;p+=1){var y=h[p];y.d&&(u=a?r(e).diff(o,y.d,!0):o.diff(e,y.d,!0));var v=(t.rounding||Math.round)(Math.abs(u));if(l=u>0,v<=y.r||!y.r){v<=1&&p>0&&(y=h[p-1]);var m=f[y.l];s&&(v=s(""+v)),c="string"==typeof m?m.replace("%d",v):m(v,n,y.l,l);break}}if(n)return c;var g=l?f.future:f.past;return"function"==typeof g?g(c):g.replace("%s",c)},n.to=function(t,e){return o(t,e,this,!0)},n.from=function(t,e){return o(t,e,this)};var a=function(t){return t.$u?r.utc():r()};n.toNow=function(t){return this.to(a(this),t)},n.fromNow=function(t){return this.from(a(this),t)}}}()},472:(t,e,r)=>{"use strict";r.r(e),r.d(e,{__extends:()=>i,__assign:()=>o,__rest:()=>a,__decorate:()=>s,__param:()=>u,__metadata:()=>c,__awaiter:()=>l,__generator:()=>f,__createBinding:()=>h,__exportStar:()=>d,__values:()=>p,__read:()=>y,__spread:()=>v,__spreadArrays:()=>m,__spreadArray:()=>g,__await:()=>b,__asyncGenerator:()=>$,__asyncDelegator:()=>_,__asyncValues:()=>w,__makeTemplateObject:()=>S,__importStar:()=>O,__importDefault:()=>x,__classPrivateFieldGet:()=>D,__classPrivateFieldSet:()=>j});var n=function(t,e){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},n(t,e)};function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}var o=function(){return o=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var i in e=arguments[r])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},o.apply(this,arguments)};function a(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(r[n[i]]=t[n[i]])}return r}function s(t,e,r,n){var i,o=arguments.length,a=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,n);else for(var s=t.length-1;s>=0;s--)(i=t[s])&&(a=(o<3?i(a):o>3?i(e,r,a):i(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a}function u(t,e){return function(r,n){e(r,n,t)}}function c(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function l(t,e,r,n){return new(r||(r=Promise))((function(i,o){function a(t){try{u(n.next(t))}catch(t){o(t)}}function s(t){try{u(n.throw(t))}catch(t){o(t)}}function u(t){var e;t.done?i(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(a,s)}u((n=n.apply(t,e||[])).next())}))}function f(t,e){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!((i=(i=a.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=e.call(t,a)}catch(t){o=[6,t],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}var h=Object.create?function(t,e,r,n){void 0===n&&(n=r),Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[r]}})}:function(t,e,r,n){void 0===n&&(n=r),t[n]=e[r]};function d(t,e){for(var r in t)"default"===r||Object.prototype.hasOwnProperty.call(e,r)||h(e,t,r)}function p(t){var e="function"==typeof Symbol&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function y(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,i,o=r.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(t){i={error:t}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a}function v(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(y(arguments[e]));return t}function m(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),i=0;for(e=0;e<r;e++)for(var o=arguments[e],a=0,s=o.length;a<s;a++,i++)n[i]=o[a];return n}function g(t,e,r){if(r||2===arguments.length)for(var n,i=0,o=e.length;i<o;i++)!n&&i in e||(n||(n=Array.prototype.slice.call(e,0,i)),n[i]=e[i]);return t.concat(n||Array.prototype.slice.call(e))}function b(t){return this instanceof b?(this.v=t,this):new b(t)}function $(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,i=r.apply(t,e||[]),o=[];return n={},a("next"),a("throw"),a("return"),n[Symbol.asyncIterator]=function(){return this},n;function a(t){i[t]&&(n[t]=function(e){return new Promise((function(r,n){o.push([t,e,r,n])>1||s(t,e)}))})}function s(t,e){try{(r=i[t](e)).value instanceof b?Promise.resolve(r.value.v).then(u,c):l(o[0][2],r)}catch(t){l(o[0][3],t)}var r}function u(t){s("next",t)}function c(t){s("throw",t)}function l(t,e){t(e),o.shift(),o.length&&s(o[0][0],o[0][1])}}function _(t){var e,r;return e={},n("next"),n("throw",(function(t){throw t})),n("return"),e[Symbol.iterator]=function(){return this},e;function n(n,i){e[n]=t[n]?function(e){return(r=!r)?{value:b(t[n](e)),done:"return"===n}:i?i(e):e}:i}}function w(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,r=t[Symbol.asyncIterator];return r?r.call(t):(t=p(t),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(r){e[r]=t[r]&&function(e){return new Promise((function(n,i){!function(t,e,r,n){Promise.resolve(n).then((function(e){t({value:e,done:r})}),e)}(n,i,(e=t[r](e)).done,e.value)}))}}}function S(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}var M=Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e};function O(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)"default"!==r&&Object.prototype.hasOwnProperty.call(t,r)&&h(e,t,r);return M(e,t),e}function x(t){return t&&t.__esModule?t:{default:t}}function D(t,e,r,n){if("a"===r&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?n:"a"===r?n.call(t):n?n.value:e.get(t)}function j(t,e,r,n,i){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?i.call(t,r):i?i.value=r:e.set(t,r),r}}},e={};function r(n){var i=e[n];if(void 0!==i)return i.exports;var o=e[n]={exports:{}};return t[n].call(o.exports,o,o.exports,r),o.exports}r.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return r.d(e,{a:e}),e},r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{"use strict";var t=r(22);const e=__AS_PREACT_HOOKS,n=__AURISERVE;var i=r.n(n);const{hydrate:o,Static:a}=i().hydrated,s="base:carousel";o(s,(function(r){var n,i;const o=(0,e.useRef)(null),u=Array.isArray(r.children)?r.children:[r.children];return null!==(n=r.speed)&&void 0!==n||(r.speed=200),(0,e.useEffect)((()=>{const t=o.current,e=t.querySelector(".carousel-items"),n=e.children[0];let i=0;t.classList.remove("static"),n.children[0].classList.add("active"),e.style.height=`${n.children[0].clientHeight}px`;let a,s=!0;const u=new IntersectionObserver((t=>{const e=t[0].isIntersecting;e&&!a&&s?a=setInterval((()=>{c(1,"right",!1)}),r.interval):!e&&a&&s&&(clearInterval(a),a=0)}),{threshold:.5});function c(t,o,c){c&&s&&(clearInterval(a),a=0,s=!1,u.disconnect());const l=n.children[i];i=(i+t+4*n.children.length)%n.children.length;const f=n.children[i];l.style.transitionDuration=`${r.speed}ms`,l.classList.add("right"===o?"transition-left":"transition-right"),f.classList.add("active"),f.classList.add("right"===o?"transition-right":"transition-left"),e.style.height=`${f.clientHeight}px`,setTimeout((()=>{requestAnimationFrame((()=>{f.style.transitionDuration=`${r.speed}ms`,requestAnimationFrame((()=>{f.classList.remove("right"===o?"transition-right":"transition-left")}))})),setTimeout((()=>{f.style.transitionDuration=""}),r.speed)}),r.speed/2),setTimeout((()=>{l.classList.remove("active"),l.classList.remove("right"===o?"transition-left":"transition-right"),l.style.transitionDuration=""}),r.speed)}u.observe(t);const l=Array.prototype.slice.call(t.querySelectorAll(".button-arrow"));l.length&&(l[0].addEventListener("click",(()=>c(-1,"left",!0))),l[1].addEventListener("click",(()=>c(1,"right",!0))))}),[r.interval,r.speed]),__AS_PREACT.h("div",{ref:o,class:(0,t.TS)(s,r.class,"static"),style:{maxWidth:r.width?`${r.width}px`:void 0,..."arrows"===r.pagination?{paddingLeft:64,paddingRight:64}:{},...null!==(i=r.style)&&void 0!==i?i:{}}},__AS_PREACT.h("div",{class:"carousel-items",style:{transitionDuration:1.5*r.speed+"ms"}},__AS_PREACT.h(a,null,u.map(((t,e)=>__AS_PREACT.h("div",{key:e,class:"carousel-item"},t))))),"arrows"===r.pagination&&__AS_PREACT.h("button",{class:"button-arrow","aria-label":"Previous"}),"arrows"===r.pagination&&__AS_PREACT.h("button",{class:"button-arrow","aria-label":"Next"}))}))})()})();
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Common/ContactForm.tsx":
/*!********************************!*\
  !*** ./Common/ContactForm.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var auriserve__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! auriserve */ "auriserve");
/* harmony import */ var auriserve__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(auriserve__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* eslint-disable react-hooks/rules-of-hooks */


const {
  hydrate
} = (auriserve__WEBPACK_IMPORTED_MODULE_0___default().hydrated);
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
  if (submitted) return __AS_PREACT.h("div", {
    class: `${identifier} submitted`
  }, __AS_PREACT.h("h6", null, "Submission Recieved!"), __AS_PREACT.h("p", null, "Thanks for reaching out, we'll make sure to get back to you in the next couple of business days."));
  return __AS_PREACT.h("form", {
    class: identifier,
    ref: form,
    onSubmit: handleSubmit,
    disabled: disabled
  }, __AS_PREACT.h("div", {
    class: "left"
  }, __AS_PREACT.h("label", null, __AS_PREACT.h("span", null, "Name"), __AS_PREACT.h("input", {
    disabled: disabled,
    maxLength: 64,
    required: true,
    type: "text",
    placeholder: "John Doe",
    value: name,
    onChange: evt => setName(evt.target.value)
  })), __AS_PREACT.h("label", null, __AS_PREACT.h("span", null, "Municipality"), __AS_PREACT.h("input", {
    disabled: disabled,
    maxLength: 64,
    required: true,
    type: "text",
    placeholder: "Townsville",
    value: municipality,
    onChange: evt => setMunicipality(evt.target.value)
  })), __AS_PREACT.h("label", null, __AS_PREACT.h("span", null, "Email"), __AS_PREACT.h("input", {
    disabled: disabled,
    maxLength: 128,
    required: true,
    name: "email",
    type: "email",
    placeholder: "johndoe@example.com",
    value: email,
    onChange: evt => setEmail(evt.target.value)
  })), __AS_PREACT.h("hr", null), __AS_PREACT.h("button", {
    type: "submit",
    disabled: disabled
  }, __AS_PREACT.h("span", null, "Send Message"))), __AS_PREACT.h("div", {
    class: "right"
  }, __AS_PREACT.h("label", null, __AS_PREACT.h("span", null, "Message"), __AS_PREACT.h("div", {
    class: "message-container"
  }, __AS_PREACT.h("textarea", {
    maxLength: 1024 * 1024,
    disabled: disabled,
    onFocus: handleEditMessage,
    onBlur: handleActivateTemplate,
    name: "message",
    onChange: evt => setMessage(evt.target.value)
  }, message), template && __AS_PREACT.h("div", {
    class: "message-template",
    dangerouslySetInnerHTML: {
      __html: getTemplateMessage(name || 'John Doe', email || 'johndoe@example.com', municipality || 'Townsville')
    }
  })))));
}

const ContactForm = hydrate(identifier, RawContactForm);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: ContactForm
});

/***/ }),

/***/ "./Common/QuoteGenerator.tsx":
/*!***********************************!*\
  !*** ./Common/QuoteGenerator.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var auriserve__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! auriserve */ "auriserve");
/* harmony import */ var auriserve__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(auriserve__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);


const {
  hydrate
} = (auriserve__WEBPACK_IMPORTED_MODULE_0___default().hydrated);
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

  return __AS_PREACT.h("div", {
    class: identifier
  }, __AS_PREACT.h("label", null, __AS_PREACT.h("div", {
    class: "numbers"
  }, __AS_PREACT.h("p", {
    class: "population"
  }, __AS_PREACT.h("span", {
    class: "value"
  }, Intl.NumberFormat('en-us', {
    useGrouping: false,
    maximumFractionDigits: 0
  }).format(population), population === 100000 && '+'), __AS_PREACT.h("span", {
    class: "label"
  }, " Residents")), __AS_PREACT.h("p", {
    class: "evaluation"
  }, __AS_PREACT.h("span", {
    class: "value"
  }, "$", Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0,
    useGrouping: false
  }).format(quote)), __AS_PREACT.h("span", {
    class: "label"
  }, " / year"))), __AS_PREACT.h("input", {
    type: "range",
    min: "0",
    max: "20",
    step: "1",
    value: value,
    onChange: handleChange,
    style: {
      background: `linear-gradient(to right, #60A5FA, #60A5FA ${percent}%, #A4B0C2 ${percent}%, #A4B0C2)`
    }
  }), __AS_PREACT.h("div", {
    class: "notches"
  }, __AS_PREACT.h("span", {
    class: value >= 0 ? 'active' : ''
  }, "0"), __AS_PREACT.h("span", {
    class: value >= 5 ? 'active' : ''
  }, "5k"), __AS_PREACT.h("span", {
    class: value >= 10 ? 'active' : ''
  }, "10k"), __AS_PREACT.h("span", {
    class: value >= 15 ? 'active' : ''
  }, "25k"), __AS_PREACT.h("span", {
    class: value >= 20 ? 'active' : ''
  }, "100k+"))));
}

const QuoteGenerator = hydrate(identifier, RawQuoteGenerator);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: QuoteGenerator
});

/***/ }),

/***/ "./Common/UnsubscribeForm.tsx":
/*!************************************!*\
  !*** ./Common/UnsubscribeForm.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var auriserve__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! auriserve */ "auriserve");
/* harmony import */ var auriserve__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(auriserve__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);


const {
  hydrate
} = (auriserve__WEBPACK_IMPORTED_MODULE_0___default().hydrated);
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
  if (submitted) return __AS_PREACT.h("div", {
    class: `${identifier} submitted`
  }, __AS_PREACT.h("h6", null, "You have been unsubscribed."), __AS_PREACT.h("p", null, "Redirecting to the home page..."));
  return __AS_PREACT.h("form", {
    class: identifier,
    onSubmit: handleSubmit,
    disabled: disabled
  }, __AS_PREACT.h("label", null, __AS_PREACT.h("span", null, "Email"), __AS_PREACT.h("input", {
    disabled: disabled,
    maxLength: 128,
    required: true,
    type: "email",
    placeholder: "johndoe@example.com",
    value: email,
    onChange: evt => setEmail(evt.target.value)
  })), __AS_PREACT.h("button", {
    type: "submit",
    disabled: disabled
  }, __AS_PREACT.h("span", null, "Unsubscribe")));
}

const UnsubscribeForm = hydrate(identifier, RawUnsubscribeForm);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: UnsubscribeForm
});

/***/ }),

/***/ "preact/hooks":
/*!************************************!*\
  !*** external "__AS_PREACT_HOOKS" ***!
  \************************************/
/***/ ((module) => {

module.exports = __AS_PREACT_HOOKS;

/***/ }),

/***/ "auriserve":
/*!******************************!*\
  !*** external "__AURISERVE" ***!
  \******************************/
/***/ ((module) => {

module.exports = __AURISERVE;

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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./Client/Main.ts ***!
  \************************/
/* harmony import */ var _Common_ContactForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Common/ContactForm */ "./Common/ContactForm.tsx");
/* harmony import */ var _Common_QuoteGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Common/QuoteGenerator */ "./Common/QuoteGenerator.tsx");
/* harmony import */ var _Common_UnsubscribeForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Common/UnsubscribeForm */ "./Common/UnsubscribeForm.tsx");




function keep(_t) {
  /* don't tree shake pls */
}

;
keep(_Common_ContactForm__WEBPACK_IMPORTED_MODULE_0__["default"]);
keep(_Common_QuoteGenerator__WEBPACK_IMPORTED_MODULE_1__["default"]);
keep(_Common_UnsubscribeForm__WEBPACK_IMPORTED_MODULE_2__["default"]);
})();

/******/ })()
;
//# sourceMappingURL=client.js.map