(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"013f":function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("q-page",{staticClass:"flex q-pa-lg justify-center bg-grey-3"},[e("q-card",{class:{"full-width":t.$q.platform.is.mobile,"login-desktop":!t.$q.platform.is.mobile}},[e("q-tabs",{staticClass:"text-grey",attrs:{"active-color":"primary","indicator-color":"primary",align:"justify"},model:{value:t.tab,callback:function(a){t.tab=a},expression:"tab"}},[e("q-route-tab",{attrs:{name:"login",label:"Login",to:"/"}}),e("q-route-tab",{attrs:{name:"register",label:"Register",to:"/#register",exact:""}})],1),e("q-separator"),e("q-tab-panels",{attrs:{animated:"",swipeable:""},model:{value:t.tab,callback:function(a){t.tab=a},expression:"tab"}},[e("q-tab-panel",{staticClass:"q-pa-xl",attrs:{name:"login"}},[e("div",{staticClass:"text-grey-8 text-body2",staticStyle:{"font-style":"italic"}},[t._v("\n            First time here? You know what to "),e("a",{attrs:{href:"/#register"}},[t._v("do")]),t._v(".\n          ")]),e("div",{staticClass:"text-grey-8 text-body2",staticStyle:{"font-style":"italic"}},[t._v("\n            No? You still know what to do.\n          ")]),e("br"),e("br"),e("q-btn",{staticClass:"full-width google-btn q-pa-xs q-mt-lg",attrs:{size:"2vh",icon:"fab fa-google",label:"Login with Ashoka ID",type:"a",href:"/auth/google/login"}}),e("div",{staticClass:"login-panel"})],1),e("q-tab-panel",{staticClass:"q-pa-xl",attrs:{name:"register"}},[e("div",{staticClass:"text-grey-8 text-body2",staticStyle:{"font-style":"italic"}},[t._v("\n            Psst.. Splidwise is currently in private beta and can be accessed only at Ashoka University.\n          ")]),e("br"),e("br"),e("q-btn",{staticClass:"full-width google-btn q-pa-xs q-mt-lg",attrs:{size:"2vh",icon:"fab fa-google",label:"Register with Ashoka ID",type:"a",href:"/auth/google/register"}}),e("div",{staticClass:"login-panel"})],1)],1)],1)],1)},i=[],o={name:"Login",mounted:function(){this.$route.query.r&&this.notify_and_push(this.$route.query.r)},data:function(){return{tab:"login"}},methods:{notify_and_push:function(t){var a="",e="/";"unregistered"==t?(a="Please register before trying to log in",e="/#register"):"reregister"==t&&(a="You already have an account, please log in with this ID"),this.$q.notify({color:"neutral",position:"bottom",message:a,icon:"report_problem",actions:[{label:"Dismiss",color:"white"}]}),this.$router.push(e)}}},l=o,n=(e("da41"),e("2877")),r=e("eebe"),c=e.n(r),b=e("9989"),g=e("f09f"),u=e("429b"),p=e("7867"),d=e("eb85"),f=e("adad"),h=e("823b"),y=e("9c40"),m=Object(n["a"])(l,s,i,!1,null,null,null);a["default"]=m.exports;c()(m,"components",{QPage:b["a"],QCard:g["a"],QTabs:u["a"],QRouteTab:p["a"],QSeparator:d["a"],QTabPanels:f["a"],QTabPanel:h["a"],QBtn:y["a"]})},"7c73":function(t,a,e){},da41:function(t,a,e){"use strict";var s=e("7c73"),i=e.n(s);i.a}}]);