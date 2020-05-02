(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{e4bb:function(t,e,o){"use strict";o.r(e);var s=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-pull-to-refresh",{on:{refresh:t.reload}},[o("q-page",{staticClass:"q-pa-lg bg-grey-3"},[Object.keys(t.responseObj).length>0?o("div",{staticClass:"q-pa-md"},[o("q-list",{staticClass:"rounded-borders bg-white",attrs:{bordered:"",separator:""}},t._l(t.responseObj,(function(e,s){return o("q-expansion-item",{key:s,attrs:{"expand-separator":""},scopedSlots:t._u([{key:"header",fn:function(){return[o("q-item-section",{attrs:{avatar:""}},[o("q-avatar",{attrs:{icon:"perm_identity",color:"primary","text-color":"white"}})],1),o("q-item-section",[o("q-item-label",{attrs:{overline:""}},[t._v(t._s(e.name.toUpperCase()))])],1),o("q-item-section",{staticClass:"desktop-only"},[t._v(t._s(s))])]},proxy:!0}],null,!0)},[o("div",{staticClass:"q-pa-md scroll-y",staticStyle:{height:"25vh"},on:{touchstart:t.preventPull}},[o("div",{staticClass:"row mobile-only",staticStyle:{"margin-top":"-2.5vh"}},[o("div",{staticClass:"col"}),o("div",{staticClass:"col"},[o("q-item-section",{staticStyle:{color:"grey"}},[t._v(t._s(s))])],1)]),o("q-markup-table",{staticClass:"q-mt-md",attrs:{"virtual-scroll":"",flat:""}},[o("tbody",t._l(e.payments,(function(e,n){return o("tr",{key:n},[o("td",{staticClass:"text-left"},[o("span",{staticClass:"text-body1"},[t._v("₹ "+t._s(e.amount)+"/-")])]),o("td",{staticClass:"text-left"},[o("span",{staticClass:"text-body1"},[t._v(t._s(e.description))])]),o("td",{staticClass:"text-center"},[o("q-btn",{staticClass:"mobile-only q-my-xs",attrs:{round:"",dense:"",color:"secondary",loading:t.loading_status,icon:"check_circle"},on:{click:function(e){return t.approvePayment(s,t.responseObj[s].payments[n].pmtId)}},scopedSlots:t._u([{key:"loading",fn:function(){return[o("q-spinner-gears")]},proxy:!0}],null,!0)}),o("q-btn",{staticClass:"desktop-only q-my-sm",attrs:{color:"secondary",size:"1.8vh",loading:t.loading_status,icon:"check_circle"},on:{click:function(e){return t.approvePayment(s,t.responseObj[s].payments[n].pmtId)}},scopedSlots:t._u([{key:"loading",fn:function(){return[o("q-spinner-gears")]},proxy:!0}],null,!0)})],1)])})),0)])],1)])})),1)],1):o("div",{staticClass:"no-tasks absolute-center"},[o("q-icon",{attrs:{name:"check",size:"100px",color:"primary"}}),o("div",{staticClass:"text-h5 text-center absolute-center text-primary",staticStyle:{"margin-top":"10vh"}},[t._v("\n      No Payments!\n    ")])],1)])],1)},n=[],a=(o("8e6e"),o("8a81"),o("ac6a"),o("cadf"),o("456d"),o("551c"),o("06db"),o("097d"),o("c47a")),r=o.n(a),i=o("758b"),c=o("2f62");function l(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,s)}return o}function p(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?l(Object(o),!0).forEach((function(e){r()(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):l(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var u={name:"UnapprovedPayments",created:function(){this.uname||(this.$router.push("/"),this.$q.notify({color:"neutral",position:"bottom",message:"Please log in with your registered ID",icon:"report_problem"}))},computed:p({},Object(c["c"])("user_info",["uname"])),data:function(){return{responseObj:{},loading_status:!1}},mounted:function(){this.loadData()},methods:{approvePayment:function(t,e){var o=this;this.uname||(console.log("User not logged in"),this.$q.notify({color:"neutral",position:"top",message:"Please log in with your registered ID.",icon:"report_problem"}),this.$router.push("/")),this.loading_status=!0,setTimeout((function(){o.loading_status=!1}),1500),i["a"].post("/".concat(this.uname,"/approvePayment"),{debtor:this.uname,creditor:t,pmtId:e}).then((function(t){o.$q.notify({color:"neutral",position:"bottom",timeout:500,message:"".concat(t.data.message),icon:"info",actions:[{icon:"close",color:"white"}]})})).catch((function(t){console.log(t.response),o.$q.notify({color:"negative",position:"top",message:"[".concat(t.response.status,"] ").concat(t.response.data.error),icon:"report_problem"}),401==t.response.status&&o.$router.push("/")})).finally(setTimeout((function(){o.loadData()}),3e3))},reload:function(t){this.loadData(),t()},loadData:function(){var t=this;this.uname?i["a"].post("/".concat(this.uname,"/getUnapprovedPayments"),{debtor:this.uname}).then((function(e){t.responseObj=e.data.data,t.$q.notify({color:"neutral",position:"bottom",timeout:500,message:"".concat(e.data.message),icon:"info",actions:[{icon:"close",color:"white"}]})})).catch((function(e){console.log(e.response),t.$q.notify({color:"negative",position:"top",message:"[".concat(e.response.status,"] ").concat(e.response.data.error),icon:"report_problem"}),401==e.response.status&&t.$router.push("/")})):console.log("User not logged in")},preventPull:function(t){var e=t.target;while(void 0!==e&&!e.classList.contains("scroll-y"))e=e.parentNode;void 0!==e&&e.scrollTop>0&&t.stopPropagation()}}},d=u,m=o("2877"),y=o("eebe"),b=o.n(y),f=o("59d7"),g=o("9989"),h=o("1c1c"),v=o("3b73"),_=o("4074"),q=o("cb32"),O=o("0170"),P=o("2bb1"),j=o("05c0"),w=o("9c40"),k=o("cf57"),C=o("0016"),x=Object(m["a"])(d,s,n,!1,null,null,null);e["default"]=x.exports;b()(x,"components",{QPullToRefresh:f["a"],QPage:g["a"],QList:h["a"],QExpansionItem:v["a"],QItemSection:_["a"],QAvatar:q["a"],QItemLabel:O["a"],QMarkupTable:P["a"],QTooltip:j["a"],QBtn:w["a"],QSpinnerGears:k["a"],QIcon:C["a"]})}}]);