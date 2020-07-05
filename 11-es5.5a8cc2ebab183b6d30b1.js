function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _iterableToArrayLimit(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,c=!1,i=void 0;try{for(var o,a=e[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(s){c=!0,i=s}finally{try{r||null==a.return||a.return()}finally{if(c)throw i}}return n}}function _arrayWithHoles(e){if(Array.isArray(e))return e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _createSuper(e){var t=_isNativeReflectConstruct();return function(){var n,r=_getPrototypeOf(e);if(t){var c=_getPrototypeOf(this).constructor;n=Reflect.construct(r,arguments,c)}else n=r.apply(this,arguments);return _possibleConstructorReturn(this,n)}}function _possibleConstructorReturn(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{A8Ph:function(e,t,n){"use strict";n.r(t),n.d(t,"JobsModule",(function(){return se}));var r=n("ofXK"),c=n("aceb"),i=n("LPYB"),o=n("JU/d"),a=n("FTbq"),s=n("V2v1"),u=n("G3Ii"),l=n("tyNb"),f=n("U5lE"),h=n("x0Mr"),d=n("XNiG"),p=n("itXk"),b=n("lJxs"),g=n("GJmQ"),v=n("JYL7"),y=n("yCtX"),m=n("DH7j"),_=n("7o/Q"),C=n("l7GE"),k=n("ZUHj"),O=n("Lhse"),S=function(){function e(t){_classCallCheck(this,e),this.resultSelector=t}return _createClass(e,[{key:"call",value:function(e,t){return t.subscribe(new w(e,this.resultSelector))}}]),e}(),w=function(e){_inherits(n,e);var t=_createSuper(n);function n(e,r){var c,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Object.create(null);return _classCallCheck(this,n),(c=t.call(this,e)).iterators=[],c.active=0,c.resultSelector="function"==typeof r?r:null,c.values=i,c}return _createClass(n,[{key:"_next",value:function(e){var t=this.iterators;Object(m.a)(e)?t.push(new M(e)):t.push("function"==typeof e[O.a]?new x(e[O.a]()):new j(this.destination,this,e))}},{key:"_complete",value:function(){var e=this.iterators,t=e.length;if(this.unsubscribe(),0!==t){this.active=t;for(var n=0;n<t;n++){var r=e[n];r.stillUnsubscribed?this.destination.add(r.subscribe(r,n)):this.active--}}else this.destination.complete()}},{key:"notifyInactive",value:function(){this.active--,0===this.active&&this.destination.complete()}},{key:"checkIterators",value:function(){for(var e=this.iterators,t=e.length,n=this.destination,r=0;r<t;r++){var c=e[r];if("function"==typeof c.hasValue&&!c.hasValue())return}for(var i=!1,o=[],a=0;a<t;a++){var s=e[a],u=s.next();if(s.hasCompleted()&&(i=!0),u.done)return void n.complete();o.push(u.value)}this.resultSelector?this._tryresultSelector(o):n.next(o),i&&n.complete()}},{key:"_tryresultSelector",value:function(e){var t;try{t=this.resultSelector.apply(this,e)}catch(n){return void this.destination.error(n)}this.destination.next(t)}}]),n}(_.a),x=function(){function e(t){_classCallCheck(this,e),this.iterator=t,this.nextResult=t.next()}return _createClass(e,[{key:"hasValue",value:function(){return!0}},{key:"next",value:function(){var e=this.nextResult;return this.nextResult=this.iterator.next(),e}},{key:"hasCompleted",value:function(){var e=this.nextResult;return e&&e.done}}]),e}(),M=function(){function e(t){_classCallCheck(this,e),this.array=t,this.index=0,this.length=0,this.length=t.length}return _createClass(e,[{key:O.a,value:function(){return this}},{key:"next",value:function(e){var t=this.index++;return t<this.length?{value:this.array[t],done:!1}:{value:null,done:!0}}},{key:"hasValue",value:function(){return this.array.length>this.index}},{key:"hasCompleted",value:function(){return this.array.length===this.index}}]),e}(),j=function(e){_inherits(n,e);var t=_createSuper(n);function n(e,r,c){var i;return _classCallCheck(this,n),(i=t.call(this,e)).parent=r,i.observable=c,i.stillUnsubscribed=!0,i.buffer=[],i.isComplete=!1,i}return _createClass(n,[{key:O.a,value:function(){return this}},{key:"next",value:function(){var e=this.buffer;return 0===e.length&&this.isComplete?{value:null,done:!0}:{value:e.shift(),done:!1}}},{key:"hasValue",value:function(){return this.buffer.length>0}},{key:"hasCompleted",value:function(){return 0===this.buffer.length&&this.isComplete}},{key:"notifyComplete",value:function(){this.buffer.length>0?(this.isComplete=!0,this.parent.notifyInactive()):this.destination.complete()}},{key:"notifyNext",value:function(e,t,n,r,c){this.buffer.push(t),this.parent.checkIterators()}},{key:"subscribe",value:function(e,t){return Object(k.a)(this,this.observable,this,t)}}]),n}(C.a),$=n("LRne"),T=n("zp1y"),P=n("eIep"),A=n("bOdf"),G=n("3E0/"),I=n("fXoL"),R=n("L7Zs");function U(e,t){if(1&e){var n=I.fc();I.ec(0,"nb-list-item",4),I.mc("click",(function(e){I.Kc(n);var r=t.index,c=I.oc();return c.check[r]=!c.check[r],e.preventDefault()})),I.ec(1,"nb-checkbox",5),I.mc("checkedChange",(function(e){I.Kc(n);var r=t.index;return I.oc().check[r]=e})),I.dc(),I.ec(2,"label"),I.Uc(3),I.dc(),I.dc()}if(2&e){var r=t.$implicit,c=t.index,i=I.oc();I.Mb(1),I.wc("checked",i.check[c]),I.Mb(2),I.Vc(r)}}var L,K=((L=function(){function e(t,n){_classCallCheck(this,e),this.dialog=t,this.cmdService=n,this.finishedGroup=[],this.check=[],this.loading=!1,this.deleteTrigger=new d.a,this.context=t.context}return _createClass(e,[{key:"confirm",value:function(){var e=this;this.deleteTrigger.next(this.finishedGroup.filter((function(t,n){return e.check[n]}))),this.dialog.close()}},{key:"ngOnInit",value:function(){var e=this,t=this,n=new d.a,r=new(function(e){_inherits(c,e);var r=_createSuper(c);function c(){var e;return _classCallCheck(this,c),(e=r.apply(this,arguments)).prerequest$=n.pipe(Object(T.a)(t.cmdService.listCmd$.verify(e.cmd)),Object(b.a)((function(e){return e[1]}))),e}return c}(v.j));r.deploy();var c=new(function(e){_inherits(c,e);var r=_createSuper(c);function c(){var e;return _classCallCheck(this,c),(e=r.apply(this,arguments)).prerequest$=n.pipe(Object(T.a)(t.cmdService.listCmd$.verify(e.cmd)),Object(b.a)((function(e){return e[1]}))),e}return c}(v.e));c.deploy(),this.loading=!0,r.clearCache(),c.clearCache(),function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[t.length-1];return"function"==typeof r&&t.pop(),Object(y.a)(t,void 0).lift(new S(r))}(r.getOutput(),c.getOutput()).subscribe((function(t){var n=_slicedToArray(t,2),r=n[0],c=n[1];if(e.loading=!1,0===r[1].length&&0===c[1].length){var i=c[0]["core-stats"].transferring;e.finishedGroup=i?r[0].groups.filter((function(e){return!i.some((function(t){return e===t.group}))})):r[0].groups,e.check=e.finishedGroup.map((function(){return!0}))}})),n.next(),this.deleteStates$=new(function(e){_inherits(r,e);var n=_createSuper(r);function r(){var e;return _classCallCheck(this,r),(e=n.apply(this,arguments)).prerequest$=t.deleteTrigger.pipe(Object(T.a)(t.cmdService.listCmd$.verify(e.cmd)),Object(P.a)((function(e){var t=_slicedToArray(e,2),n=t[0],r=t[1];return 0!==r[1].length?Object($.a)([{},r[1]]):Object($.a).apply(void 0,_toConsumableArray(n.map((function(e){return[Object.assign(Object.assign({},r[0]),{group:e}),[]]}))))})),Object(A.a)((function(e){return Object($.a)(e).pipe(Object(G.a)(1e3))}))),e}return r}(v.d)),this.deleteStates$.deploy(),this.deleteStates$.getOutput().subscribe()}}]),e}()).\u0275fac=function(e){return new(e||L)(I.Yb(f.d),I.Yb(R.a))},L.\u0275cmp=I.Sb({type:L,selectors:[["ng-component"]],decls:11,vars:2,consts:[["spinnerMessage","Loading...",3,"nbSpinner"],[3,"click",4,"ngFor","ngForOf"],["nbButton","","status","danger",3,"click"],["nbButton","","status","success",1,"push-to-right",3,"click"],[3,"click"],[3,"checked","checkedChange"]],template:function(e,t){1&e&&(I.ec(0,"nb-card"),I.ec(1,"nb-card-header"),I.Uc(2," Select groups to be deleted "),I.dc(),I.ec(3,"nb-card-body",0),I.ec(4,"nb-list"),I.Sc(5,U,4,2,"nb-list-item",1),I.dc(),I.dc(),I.ec(6,"nb-card-footer"),I.ec(7,"button",2),I.mc("click",(function(){return t.dialog.dismiss()})),I.Uc(8,"Close"),I.dc(),I.ec(9,"button",3),I.mc("click",(function(){return t.confirm()})),I.Uc(10," Confirm "),I.dc(),I.dc(),I.dc()),2&e&&(I.Mb(3),I.wc("nbSpinner",t.loading),I.Mb(2),I.wc("ngForOf",t.finishedGroup))},directives:[c.o,c.r,c.n,c.X,c.J,r.n,c.p,c.k,c.K,c.t],styles:["nb-card[_ngcontent-%COMP%] {\n\t\t\t\tmargin: calc(-1em - 5px);\n\t\t\t}\n\t\t\tnb-card-header[_ngcontent-%COMP%], nb-card-footer[_ngcontent-%COMP%] {\n\t\t\t\tdisplay: flex;\n\t\t\t}\n\t\t\tlabel[_ngcontent-%COMP%] {\n\t\t\t\tpadding-left: 0.75rem;\n\t\t\t}\n\t\t\t.push-to-right[_ngcontent-%COMP%] {\n\t\t\t\tmargin-left: auto;\n\t\t\t}"]}),L);function z(e,t){1&e&&(I.Zb(0,"nb-icon",2),I.Uc(1," Reset stats "))}var V,B=((V=function(){function e(t,n,r){_classCallCheck(this,e),this.contextMenuService=t,this.cmdService=n,this.toastrService=r,this.resetTrigger=new d.a}return _createClass(e,[{key:"onContextMenu",value:function(e,t){this.contextMenuService.show.next({contextMenu:this.contextMenu,event:e,item:t}),e.preventDefault(),e.stopPropagation()}},{key:"resetStats",value:function(e){this.resetTrigger.next(e)}},{key:"ngOnInit",value:function(){var e=this,t=this;this.resetStats$=new(function(e){_inherits(r,e);var n=_createSuper(r);function r(){var e;return _classCallCheck(this,r),(e=n.apply(this,arguments)).prerequest$=t.resetTrigger.pipe(Object(T.a)(t.cmdService.listCmd$.verify(e.cmd)),Object(b.a)((function(e){var t=_slicedToArray(e,2),n=t[0],r=t[1];return 0!==r[1].length?[{},r[1]]:n&&""!==n?[Object.assign(Object.assign({},r[0]),{group:n}),[]]:r}))),e}return r}(v.f)),this.resetStats$.deploy(),this.resetStats$.getSupersetOutput().subscribe((function(t){var n=t[0]&&t[0].group;n||(n="[All]"),0===t[1].length?e.toastrService.success("".concat(n),"Reset stats success"):e.toastrService.danger("".concat(n),"Reset stats failure")}))}}]),e}()).\u0275fac=function(e){return new(e||V)(I.Yb(o.c),I.Yb(R.a),I.Yb(c.fb))},V.\u0275cmp=I.Sb({type:V,selectors:[["app-job-group-options-context-menu"]],inputs:{contextMenu:"contextMenu"},decls:3,vars:0,consts:[["OptionMenu",""],["contextMenuItem","",3,"execute"],["icon","refresh"]],template:function(e,t){1&e&&(I.ec(0,"context-menu",null,0),I.Sc(2,z,2,0,"ng-template",1),I.mc("execute",(function(e){return t.resetStats(e.item)})),I.dc())},directives:[o.a,o.d,c.z],encapsulation:2}),V),H=n("gVoi"),E=n("3RaO"),F=n("HRdY"),Y=n("QKBS");function J(e,t){if(1&e&&(I.ec(0,"td"),I.Uc(1),I.dc(),I.ec(2,"td"),I.Uc(3),I.dc(),I.ec(4,"td"),I.Uc(5),I.dc(),I.ec(6,"td"),I.Uc(7),I.dc(),I.ec(8,"td"),I.Uc(9),I.dc()),2&e){var n=t.$implicit;I.Mb(1),I.Vc(n.name),I.Mb(2),I.Vc(n.sizeHumanReadable),I.Mb(2),I.Vc(n.percentage),I.Mb(2),I.Vc(n.speedHumanReadable),I.Mb(2),I.Vc(n.etaHumanReadable)}}var W,q=((W=function(){function e(){_classCallCheck(this,e),this.columns=[{key:"name",title:"Name"},{key:"size",title:"Size"},{key:"percentage",title:"Percentage"},{key:"speed",title:"Speed"},{key:"eta",title:"eta"}],this.data=[]}return _createClass(e,[{key:"ngOnInit",value:function(){var e=this;this.stats$.getOutput().subscribe((function(t){var n=_slicedToArray(t,2),r=n[0];0===n[1].length&&(e.data=r["core-stats"].transferring||[],e.data.forEach((function(e){e.sizeHumanReadable=Object(F.a)(e.size,3),e.speedHumanReadable=Object(F.a)(e.speed)+"/s",e.etaHumanReadable="number"==typeof e.eta?Y.a.humanize(1e3*e.eta,{largest:3}):"-"})))})),this.configuration=Object.assign({},a.c),this.configuration.searchEnabled=!0,this.configuration.isLoading=!1}}]),e}()).\u0275fac=function(e){return new(e||W)},W.\u0275cmp=I.Sb({type:W,selectors:[["app-jobs-transferring"]],inputs:{stats$:"stats$"},decls:2,vars:3,consts:[[3,"configuration","data","columns"]],template:function(e,t){1&e&&(I.ec(0,"ngx-table",0),I.Sc(1,J,10,5,"ng-template"),I.dc()),2&e&&I.wc("configuration",t.configuration)("data",t.data)("columns",t.columns)},directives:[a.b],encapsulation:2}),W),N=function(e){return{"active-group":e}};function Z(e,t){if(1&e){var n=I.fc();I.ec(0,"nb-list-item",15),I.mc("click",(function(){I.Kc(n);var e=t.$implicit;return I.oc(2).activateGroup(e)})),I.Uc(1),I.ec(2,"nb-icon",16),I.mc("click",(function(e){I.Kc(n);var r=t.$implicit;return I.oc(2),I.Gc(3).onContextMenu(e,r)})),I.dc(),I.dc()}if(2&e){var r=t.$implicit,c=I.oc(2);I.wc("ngClass",I.Ac(2,N,c.activeGroup===r)),I.Mb(1),I.Wc(" ",r," ")}}var D=function(e){return{"infinte-rotate":e}};function X(e,t){if(1&e){var n=I.fc();I.ec(0,"nb-sidebar",12),I.ec(1,"nb-card-header"),I.Uc(2," Groups "),I.ec(3,"nb-icon",13),I.mc("click",(function(){return I.Kc(n),I.oc().clearGroups()})),I.dc(),I.ec(4,"nb-icon",14),I.mc("click",(function(){return I.Kc(n),I.oc().refreshList()})),I.dc(),I.dc(),I.ec(5,"nb-list"),I.ec(6,"nb-list-item",15),I.mc("click",(function(){return I.Kc(n),I.oc().activateGroup("")})),I.Uc(7," [All] "),I.ec(8,"nb-icon",16),I.mc("click",(function(e){return I.Kc(n),I.oc(),I.Gc(3).onContextMenu(e,"")})),I.dc(),I.dc(),I.Sc(9,Z,3,4,"nb-list-item",17),I.dc(),I.dc()}if(2&e){var r=I.oc();I.Mb(4),I.wc("ngClass",I.Ac(3,D,r.refreshing)),I.Mb(2),I.wc("ngClass",I.Ac(5,N,""===r.activeGroup)),I.Mb(3),I.wc("ngForOf",r.groups)}}function Q(e,t){if(1&e&&(I.ec(0,"nb-option",22),I.Uc(1),I.dc()),2&e){var n=t.$implicit;I.wc("value",n),I.Mb(1),I.Wc(" ",n,"")}}function ee(e,t){if(1&e){var n=I.fc();I.ec(0,"nb-card"),I.ec(1,"nb-card-header"),I.ec(2,"nb-icon",18),I.mc("click",(function(){return I.Kc(n),I.oc().clearGroups()})),I.dc(),I.ec(3,"nb-select",19),I.mc("selectedChange",(function(e){return I.Kc(n),I.oc().activeGroup=e}))("selectedChange",(function(){I.Kc(n);var e=I.oc();return e.activateGroup(e.activeGroup)})),I.ec(4,"nb-option",20),I.Uc(5,"[All]"),I.dc(),I.Sc(6,Q,2,2,"nb-option",21),I.dc(),I.ec(7,"nb-icon",14),I.mc("click",(function(){return I.Kc(n),I.oc().refreshList()})),I.dc(),I.dc(),I.dc()}if(2&e){var r=I.oc();I.Mb(3),I.wc("selected",r.activeGroup),I.Mb(3),I.wc("ngForOf",r.groups),I.Mb(1),I.wc("ngClass",I.Ac(3,D,r.refreshing))}}function te(e,t){if(1&e){var n=I.fc();I.ec(0,"nb-icon",16),I.mc("click",(function(e){I.Kc(n);var t=I.oc();return I.Gc(3).onContextMenu(e,t.activeGroup)})),I.dc()}}var ne,re,ce,ie=function(){return["xl","lg","md"]},oe=[{path:"",component:(ne=function(){function e(t,n){_classCallCheck(this,e),this.cmdService=t,this.modal=n,this.activeGroup="",this.groups=[],this.listTrigger=new d.a,this.statsTrigger=new d.a,this.visable=!1,this.refreshing=!1}return _createClass(e,[{key:"activateGroup",value:function(e){this.activeGroup=e,this.statsTrigger.next(e)}},{key:"clearGroups",value:function(){var e=this;this.modal.confirm().className("flat-attack").message("Cleaning finished groups?").isBlocking(!0).open().result.then((function(t){t&&e.modal.open(K,Object(f.m)({isBlocking:!0},h.b)).result.then((function(t){t&&e.refreshList()}),(function(){}))}),(function(){}))}},{key:"ngOnInit",value:function(){var e=this,t=this;this.visable=!0,this.listGroup$=new(function(e){_inherits(r,e);var n=_createSuper(r);function r(){var e;return _classCallCheck(this,r),(e=n.apply(this,arguments)).prerequest$=Object(p.a)([t.listTrigger,t.cmdService.listCmd$.verify(e.cmd)]).pipe(Object(b.a)((function(e){return _slicedToArray(e,2)[1]}))),e}return r}(v.j)),this.listGroup$.deploy(),this.listGroup$.getOutput().subscribe((function(t){e.refreshing=!1,0===t[1].length&&(e.groups=t[0].groups)})),this.refreshing=!0,this.listTrigger.next(1),this.stats$=new(function(e){_inherits(r,e);var n=_createSuper(r);function r(){var e;return _classCallCheck(this,r),(e=n.apply(this,arguments)).prerequest$=Object(p.a)([t.cmdService.rst$.getOutput(),t.statsTrigger,t.cmdService.listCmd$.verify(e.cmd)]).pipe(Object(g.a)((function(){return t.visable})),Object(b.a)((function(e){var t=_slicedToArray(e,3),n=t[1],r=t[2];return 0!==r[1].length?[{},r[1]]:""===n?r:[Object.assign(Object.assign({},r[0]),{group:n}),[]]}))),e}return r}(v.e)),this.stats$.deploy(),this.statsTrigger.next("")}},{key:"refreshList",value:function(){this.listGroup$.clearCache(),this.refreshing=!0,this.listTrigger.next(1)}},{key:"ngOnDestroy",value:function(){this.visable=!1}}]),e}(),ne.\u0275fac=function(e){return new(e||ne)(I.Yb(R.a),I.Yb(h.a))},ne.\u0275cmp=I.Sb({type:ne,selectors:[["app-jobs"]],decls:28,vars:9,consts:[["tag","group",4,"showItBootstrap"],["OptionsMenu",""],[4,"hideItBootstrap"],[1,"container-flex"],[1,"row"],[1,"col-xl-6","col-lg-7","col-md-6","col-sm-5","col-sx-12"],["size","small"],[1,"speed-body"],[3,"stats$"],[1,"col-xl-6","col-lg-5","col-md-6","col-sm-7","col-sx-12"],["icon","more-vertical",3,"click",4,"hideItBootstrap"],[1,"col"],["tag","group"],["icon","trash-2-outline",3,"click"],["icon","sync",3,"ngClass","click"],[3,"ngClass","click"],["icon","more-vertical",3,"click"],[3,"ngClass","click",4,"ngFor","ngForOf"],["icon","trash-2-outline",2,"margin","auto auto auto 0",3,"click"],["placeholder","Groups",2,"max-width","calc(100% - 2em - 3rem)","width","calc(100% - 2em - 3rem)",3,"selected","selectedChange"],["value",""],[3,"value",4,"ngFor","ngForOf"],[3,"value"]],template:function(e,t){1&e&&(I.ec(0,"nb-layout"),I.Sc(1,X,10,7,"nb-sidebar",0),I.Zb(2,"app-job-group-options-context-menu",null,1),I.ec(4,"nb-layout-column"),I.Sc(5,ee,8,5,"nb-card",2),I.ec(6,"div",3),I.ec(7,"div",4),I.ec(8,"div",5),I.ec(9,"nb-card",6),I.ec(10,"nb-card-header"),I.Uc(11," Speed "),I.dc(),I.ec(12,"nb-card-body",7),I.Zb(13,"app-rng-speed-chart",8),I.dc(),I.dc(),I.dc(),I.ec(14,"div",9),I.ec(15,"nb-card"),I.ec(16,"nb-card-header"),I.Uc(17," Summary "),I.Sc(18,te,1,0,"nb-icon",10),I.dc(),I.ec(19,"nb-card-body"),I.Zb(20,"app-rng-summary",8),I.dc(),I.dc(),I.dc(),I.dc(),I.ec(21,"div",4),I.ec(22,"div",11),I.ec(23,"nb-card"),I.ec(24,"nb-card-header"),I.Uc(25," Transferring "),I.dc(),I.ec(26,"nb-card-body"),I.Zb(27,"app-jobs-transferring",8),I.dc(),I.dc(),I.dc(),I.dc(),I.dc(),I.dc(),I.dc()),2&e&&(I.Mb(1),I.wc("showItBootstrap",I.zc(6,ie)),I.Mb(4),I.wc("hideItBootstrap",I.zc(7,ie)),I.Mb(8),I.wc("stats$",t.stats$),I.Mb(5),I.wc("hideItBootstrap",I.zc(8,ie)),I.Mb(2),I.wc("stats$",t.stats$),I.Mb(7),I.wc("stats$",t.stats$))},directives:[c.F,s.e,B,c.E,s.a,c.o,c.r,c.n,H.a,E.a,q,c.U,c.z,r.l,c.J,c.K,r.n,c.S,c.O],styles:["nb-card-header[_ngcontent-%COMP%]{display:flex}nb-card-header[_ngcontent-%COMP%] > nb-icon[_ngcontent-%COMP%]{margin-left:auto;margin-top:auto;margin-bottom:auto;font-size:1.5rem;cursor:pointer}nb-sidebar[_ngcontent-%COMP%]{border-left:solid;border-color:#edf1f7;border-left-width:.0668rem}[_nghost-%COMP%]   nb-select[_ngcontent-%COMP%]     button{min-width:unset}[_nghost-%COMP%]     .scrollable{display:contents}ul[_ngcontent-%COMP%]{list-style-type:none}li[_ngcontent-%COMP%]{border-bottom:1px solid #edf1f7}div.row[_ngcontent-%COMP%]{padding-top:1rem}.active-group[_ngcontent-%COMP%]{background-color:rgba(89,139,255,.53);border-radius:.25rem}.speed-body[_ngcontent-%COMP%]{padding:0;min-height:10rem;overflow-y:hidden}nb-list-item[_ngcontent-%COMP%] > nb-icon[_ngcontent-%COMP%]{margin-left:auto}"]}),ne)}],ae=((ce=function e(){_classCallCheck(this,e)}).\u0275mod=I.Wb({type:ce}),ce.\u0275inj=I.Vb({factory:function(e){return new(e||ce)},imports:[[l.g.forChild(oe)],l.g]}),ce),se=((re=function e(){_classCallCheck(this,e)}).\u0275mod=I.Wb({type:re}),re.\u0275inj=I.Vb({factory:function(e){return new(e||re)},imports:[[r.c,s.b,ae,c.I,c.V,c.s,a.d,c.L,c.B,i.b,u.a,c.T,c.l,c.u,c.Y,o.b]]}),re)}}]);