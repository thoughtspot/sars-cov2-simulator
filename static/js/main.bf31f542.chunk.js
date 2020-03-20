(this["webpackJsonpsars-cov-2-simulator"]=this["webpackJsonpsars-cov-2-simulator"]||[]).push([[0],{105:function(e,t,a){e.exports=a(116)},110:function(e,t,a){},111:function(e,t,a){},116:function(e,t,a){"use strict";a.r(t);var n,r=a(0),i=a.n(r),o=a(14),c=a.n(o),l=(a(110),a(144)),s=a(160),u=a(155),m=a(152),d=a(149),f=a(151),E=a(87),p=a.n(E),g=(a(111),a(32)),v=a(147),h=a(52),O=a(36),b=a(117),N=a(157),w=a(158),C=a(90),A=a(161),y=Object(l.a)({slider:{width:150}}),j=function(e){var t=e.title,a=e.onChange,n=e.percent,r=void 0!==n&&n,o=Object(C.a)(e,["title","onChange","percent"]),c=y(),l=function(e){return void 0===e?"":r?"".concat(e,"%"):e};return i.a.createElement(v.a,{container:!0,direction:"column",alignItems:"flex-start",spacing:0},i.a.createElement(v.a,{item:!0,container:!0,direction:"row",spacing:1,alignItems:"center"},i.a.createElement(v.a,{item:!0},i.a.createElement(d.a,null,l(o.min))),i.a.createElement(v.a,{item:!0,className:c.slider},i.a.createElement(A.a,Object.assign({"aria-labelledby":"discrete-slider",valueLabelDisplay:"on",valueLabelFormat:l,onChangeCommitted:function(e,t){a(o.name,t)}},o))),i.a.createElement(v.a,null,i.a.createElement(d.a,null,l(o.max)))),i.a.createElement(v.a,{item:!0},i.a.createElement(d.a,{id:"discrete-slider",variant:"caption"},t)))},R=[{title:"Average spread (R0)",name:"R0",min:0,max:3,step:.1,defaultValue:2.2},{title:"Average spread shutdown (R0)",name:"shutdownR0",min:0,max:3,step:.1,defaultValue:1.05},{title:"Mortality Rate",name:"mortalityRate",min:0,max:5,step:.5,defaultValue:.5,percent:!0},{title:"Mortality Rate Overflow",name:"mortalityRateOverflow",min:0,max:7,step:.5,defaultValue:3,percent:!0},{title:"Hospitalization Rate",name:"hospitalizationRate",min:0,max:25,step:1,defaultValue:15,percent:!0},{title:"Hospital stay in weeks",name:"hospitalStayInWeeks",min:0,max:2,step:.1,defaultValue:.3}];!function(e){e[e.CHANGE_SLIDER_VALUE=0]="CHANGE_SLIDER_VALUE",e[e.CHANGE_START_DATE=1]="CHANGE_START_DATE",e[e.CHANGE_POPULATION=2]="CHANGE_POPULATION",e[e.CHANGE_BEDS=3]="CHANGE_BEDS"}(n||(n={}));var H=R.reduce((function(e,t){return e[t.name]=t.defaultValue,e}),{});H.infectionStartDate=new Date("1/1/2020"),H.totalPopulation=331e6,H.totalHospitalBeds=1e6;var T=Object(l.a)((function(e){return Object(s.a)({root:{paddingTop:e.spacing(4),paddingLeft:e.spacing(6),paddingRight:e.spacing(2),width:250},divider:{marginTop:e.spacing(2),marginBottom:e.spacing(2)}})}));function I(e,t){switch(t.type){case n.CHANGE_SLIDER_VALUE:return Object(O.a)({},e,Object(h.a)({},t.sliderName,t.value));case n.CHANGE_START_DATE:return Object(O.a)({},e,{infectionStartDate:t.infectionStartDate});case n.CHANGE_POPULATION:return Object(O.a)({},e,{totalPopulation:t.value});case n.CHANGE_BEDS:return Object(O.a)({},e,{totalHospitalBeds:t.value});default:return e}}var _,D=function(e){var t=e.onChange,a=T(),o=i.a.useReducer(I,H),c=Object(g.a)(o,2),l=c[0],s=c[1];Object(r.useEffect)((function(){t(l)}),[l]);var u=function(e,t){s({type:n.CHANGE_SLIDER_VALUE,sliderName:e,value:t})};return i.a.createElement(b.a,{elevation:3,className:a.root},i.a.createElement(v.a,{container:!0,direction:"column",alignItems:"flex-start",spacing:8},i.a.createElement(v.a,{item:!0},i.a.createElement(d.a,null,"Control Values")),i.a.createElement(v.a,{item:!0},i.a.createElement(N.a,{label:"Total population",onChange:function(e){s({type:n.CHANGE_POPULATION,value:e.target.value})},value:l.totalPopulation})),i.a.createElement(v.a,{item:!0},i.a.createElement(w.a,{onChange:function(e){s({type:n.CHANGE_START_DATE,startDate:e})},variant:"inline",value:l.infectionStartDate,label:"Infection Start date"})),i.a.createElement(v.a,{item:!0},i.a.createElement(N.a,{label:"Total hospital beds",onChange:function(e){s({type:n.CHANGE_BEDS,value:e.target.value})},value:l.totalHospitalBeds})),R.map((function(e){return i.a.createElement(v.a,{item:!0,key:e.name},i.a.createElement(j,Object.assign({},e,{onChange:u})))}))))},G=a(68),S=a.n(G),x=a(83),B=a.n(x),L=Object(l.a)((function(e){return Object(s.a)({root:{padding:e.spacing(4),width:"100%"},divider:{marginTop:e.spacing(2),marginBottom:e.spacing(2)},chartContainer:{height:"100%"}})})),k=function(e){var t=e.config,a=L();return i.a.createElement(b.a,{elevation:3,className:a.root},i.a.createElement(B.a,{containerProps:{className:a.chartContainer},highcharts:S.a,options:t}))},M=a(66),P=a(150),V=a(85),U=a.n(V),W=a(84),z=a.n(W),J=Object(l.a)((function(e){return Object(s.a)({root:{padding:e.spacing(4)},marginBottom:{marginBottom:e.spacing(2)},marginTop:{marginTop:e.spacing(2)}})})),F=function(e){var t=e.onChange,a=J(),n=i.a.useState([]),r=Object(g.a)(n,2),o=r[0],c=r[1];i.a.useEffect((function(){t(o)}),[o]);var l=function(e){return function(){o.splice(e,1),c(Object(M.a)(o))}},s=function(e){return function(t){return function(a){e[t]=a,"start"===t&&(e.end=a),c(Object(M.a)(o))}}};return i.a.createElement(b.a,{elevation:3,className:a.root},i.a.createElement(v.a,{container:!0,direction:"column",alignItems:"flex-start",spacing:2},i.a.createElement(d.a,{className:a.marginBottom},"Shutdown Dates"),o.map((function(e,t){return i.a.createElement(v.a,{container:!0,item:!0,direction:"row",spacing:4,alignItems:"center"},i.a.createElement(v.a,{item:!0},i.a.createElement(w.a,{variant:"inline",onChange:s(e)("start"),value:e.start,label:"Start"})),i.a.createElement(v.a,{item:!0},i.a.createElement(w.a,{variant:"inline",onChange:s(e)("end"),value:e.end,label:"End"})),i.a.createElement(v.a,{item:!0},i.a.createElement(f.a,{onClick:l(t),"aria-label":"delete"},i.a.createElement(z.a,null))))})),i.a.createElement(v.a,{item:!0,className:a.marginTop},i.a.createElement(P.a,{variant:"contained",startIcon:i.a.createElement(U.a,null),onClick:function(){var e,t=(null===(e=o[o.length-1])||void 0===e?void 0:e.end)||new Date,a={start:t,end:t};c([].concat(Object(M.a)(o),[a]))}},"Add"))))},$=a(86),q=a.n($),K=a(89),Q=a(153),X=a(154);function Y(e,t){try{return t.some((function(t){return Object(X.a)(e,t)}))}catch(a){return!1}}!function(e){e[e.CHANGE_CONTROL=0]="CHANGE_CONTROL",e[e.CHANGE_SHUTDOWN=1]="CHANGE_SHUTDOWN"}(_||(_={}));var Z=function(e,t){switch(t.type){case _.CHANGE_CONTROL:return Object(O.a)({},e,{controls:t.controls});case _.CHANGE_SHUTDOWN:return Object(O.a)({},e,{shutdowns:t.shutdowns});default:return e}};function ee(e){var t,a=function(e){var t={};return e.forEach((function(e){Object.keys(e).forEach((function(a){t[a]=t[a]||{name:a,data:[],visible:!1},t[a].data.push({x:e.week,y:e[a]})}))})),delete t.week,delete t.weekNum,t.totalInfected.visible=!0,t.dead.visible=!0,t.newInfected.visible=!0,Object.values(t)}(function(e){for(var t=e.controls,a=t.totalPopulation,n=t.infectionStartDate,r=t.R0,i=t.shutdownR0,o=t.mortalityRate,c=t.mortalityRateOverflow,l=t.hospitalizationRate,s=t.totalHospitalBeds,u=[{week:n,weekNum:0,healthy:a-1,newInfected:1,totalInfected:1,currentlyInfected:1,recovered:0,dead:0,hospitalized:0,movingMortalityRate:o}],m=1;m<100;m++){var d,f,E=Object(Q.a)(n,m),p=Y(E,e.shutdowns)?i:r,g=u[m-1],v=u[m-2],h=(null===(d=u[m-3])||void 0===d?void 0:d.newInfected)||0,O=(null===(f=u[m-3])||void 0===f?void 0:f.currentlyInfected)||0,b=Math.round(g.healthy/a*g.newInfected*p),N=g.totalInfected+b,w=b+g.newInfected+((null===v||void 0===v?void 0:v.newInfected)||0),C=Math.round((1-g.movingMortalityRate/100)*h)+g.recovered,A=Math.round(h*g.movingMortalityRate/100)+g.dead,y=Math.round(O*l/100),j=y<s?o:(c*(y-s)+o*s)/y,R=a-w-C-A;u[m]={week:E,weekNum:m,newInfected:b,totalInfected:N,currentlyInfected:w,recovered:C,dead:A,hospitalized:y,movingMortalityRate:j,healthy:R}}return u}(e)),n={title:{text:""},yAxis:{type:"logarithmic",title:"Number of people"},xAxis:{type:"datetime",title:"Date",gridLineWidth:1,plotBands:(t=e.shutdowns,t.map((function(e){return{color:"#ffcccb",from:e.start,to:e.end}})))},plotOptions:{line:{lineWidth:4}},tooltip:{formatter:function(){return"<b>".concat(this.series.name,"</b>:").concat(q()(this.y)," <br>")+"".concat(Object(K.a)(this.x,"do MMM y"))}},series:a};return console.log(n),n}var te=a(17),ae=a(88),ne=Object(l.a)((function(e){return Object(s.a)({content:{flexGrow:1,flexBasis:"auto",display:"flex"},header:{marginBottom:e.spacing(2)}})})),re=function(){var e=ne(),t=function(){var e=Object(r.useReducer)(Z,{controls:{},shutdowns:[]}),t=Object(g.a)(e,2),a=t[0],n=t[1];return[ee(a),function(e){return n({type:_.CHANGE_CONTROL,controls:e})},function(e){return n({type:_.CHANGE_SHUTDOWN,shutdowns:e})}]}(),a=Object(g.a)(t,3),n=a[0],o=a[1],c=a[2];return i.a.createElement(te.a,{utils:ae.a},i.a.createElement(v.a,{container:!0,spacing:2,direction:"row"},i.a.createElement(v.a,{item:!0},i.a.createElement(D,{onChange:o})),i.a.createElement(v.a,{item:!0,direction:"column",className:e.content,spacing:2},i.a.createElement(v.a,{item:!0,className:e.header},i.a.createElement(F,{onChange:c})),i.a.createElement(v.a,{item:!0,className:e.content},i.a.createElement(k,{config:n})))))},ie=a(156),oe=Object(l.a)((function(e){return Object(s.a)({root:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1},container:{paddingTop:e.spacing(2)}})}));var ce=function(){var e=oe();return i.a.createElement("div",{className:"App"},i.a.createElement(u.a,{position:"static"},i.a.createElement(m.a,null,i.a.createElement(f.a,{edge:"start",className:e.menuButton,color:"inherit","aria-label":"menu"},i.a.createElement(p.a,null)),i.a.createElement(d.a,{variant:"h6",className:e.title},"COVID Simulator"))),i.a.createElement(ie.a,{maxWidth:"lg",className:e.container},i.a.createElement(re,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(ce,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[105,1,2]]]);
//# sourceMappingURL=main.bf31f542.chunk.js.map