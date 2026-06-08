/* ==========================================================================
   武汉大学产业创新AI智脑平台 — 图表引擎 charts.js (window.Charts)
   ECharts 双主题(wuda-dark / wuda-light) + 图表工厂函数
   ========================================================================== */
(function(){
  function cssVar(n){ return getComputedStyle(document.body).getPropertyValue(n).trim(); }
  function theme(){ return document.body.getAttribute('data-theme')==='light'?'wuda-light':'wuda-dark'; }
  const PALETTE_DARK=['#00E5FF','#7B61FF','#00FFA3','#FFC857','#FF4D6D','#40A9FF','#36CFC9','#F759AB','#9254DE','#73D13D'];
  const PALETTE_LIGHT=['#1E3A8A','#2b50b8','#C0392B','#16a34a','#d97706','#0891b2','#7c3aed','#db2777','#0d9488','#ca8a04'];

  function baseTheme(dark){
    const axis = dark?'#5d739c':'#94a3b8';
    const split = dark?'rgba(120,170,255,.08)':'#eef2f8';
    const text = dark?'#c7d6f0':'#475569';
    return {
      color: dark?PALETTE_DARK:PALETTE_LIGHT,
      textStyle:{fontFamily:'PingFang SC, Microsoft YaHei, sans-serif', color:text},
      title:{textStyle:{color:dark?'#e7f0ff':'#1f2937',fontSize:14}},
      legend:{textStyle:{color:text},inactiveColor:dark?'#3b4a6b':'#cbd5e1'},
      tooltip:{backgroundColor:dark?'rgba(10,26,58,.94)':'rgba(255,255,255,.98)',
        borderColor:dark?'rgba(0,229,255,.4)':'#e2e8f0',borderWidth:1,
        textStyle:{color:dark?'#e7f0ff':'#1f2937',fontSize:12},
        extraCssText:dark?'box-shadow:0 0 20px rgba(0,229,255,.2);border-radius:8px':'box-shadow:0 6px 22px rgba(30,41,80,.12);border-radius:8px'},
      categoryAxis:{axisLine:{lineStyle:{color:axis}},axisLabel:{color:text},axisTick:{show:false},splitLine:{show:false,lineStyle:{color:split}}},
      valueAxis:{axisLine:{show:false},axisLabel:{color:text},splitLine:{lineStyle:{color:split,type:'dashed'}}},
      grid:{containLabel:true}
    };
  }
  echarts.registerTheme('wuda-dark', baseTheme(true));
  echarts.registerTheme('wuda-light', baseTheme(false));

  const instances=[];
  function init(el, option){
    if(typeof el==='string') el=document.getElementById(el)||document.querySelector(el);
    if(!el) return null;
    const c=echarts.init(el, theme(), {renderer:'canvas'});
    c.setOption(option);
    instances.push(c);
    return c;
  }
  window.addEventListener('resize',()=>instances.forEach(c=>{try{c.resize()}catch(e){}}));

  function grad(c1,c2){ return new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:c1},{offset:1,color:c2}]); }
  function gradH(c1,c2){ return new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:c1},{offset:1,color:c2}]); }

  const C = {
    init, grad, theme, color:cssVar,
    palette(){ return theme()==='wuda-light'?PALETTE_LIGHT:PALETTE_DARK; },

    // 折线(可多系列、面积、平滑)
    line(el, {x, series, area=true, smooth=true, legend=false, stack=false}){
      const pal=C.palette();
      return init(el,{
        legend:legend?{top:0,right:0}:undefined,
        grid:{left:8,right:14,top:legend?28:14,bottom:6,containLabel:true},
        tooltip:{trigger:'axis'},
        xAxis:{type:'category',data:x,boundaryGap:false},
        yAxis:{type:'value'},
        series:series.map((s,i)=>({
          name:s.name,type:'line',smooth,data:s.data,stack:stack?'t':undefined,
          showSymbol:false,lineStyle:{width:2.4,color:pal[i%pal.length]},
          itemStyle:{color:pal[i%pal.length]},
          areaStyle:area?{opacity:.18,color:grad(pal[i%pal.length],'transparent')}:undefined,
        })),
      });
    },

    // 柱状(可分组、横向)
    bar(el,{x, series, horizontal=false, legend=false, stack=false}){
      const pal=C.palette();
      const cat={type:'category',data:x}; const val={type:'value'};
      return init(el,{
        legend:legend?{top:0,right:0}:undefined,
        grid:{left:8,right:14,top:legend?28:14,bottom:6,containLabel:true},
        tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},
        xAxis: horizontal?val:cat, yAxis: horizontal?{...cat,inverse:true}:val,
        series:series.map((s,i)=>({name:s.name,type:'bar',data:s.data,stack:stack?'t':undefined,barMaxWidth:horizontal?16:26,
          itemStyle:{borderRadius: horizontal?[0,4,4,0]:[4,4,0,0], color:horizontal?gradH(pal[i%pal.length],pal[(i+1)%pal.length]):grad(pal[i%pal.length],theme()==='wuda-light'?pal[i%pal.length]:'rgba(0,229,255,.15)')}})),
      });
    },

    pie(el,{data, ring=true, legend=true, rose=false, center=['50%','52%']}){
      return init(el,{
        legend:legend?{type:'scroll',orient:'vertical',right:0,top:'center',textStyle:{fontSize:11}}:undefined,
        tooltip:{trigger:'item',formatter:'{b}: {c} ({d}%)'},
        series:[{type:'pie',radius:ring?['44%','70%']:'68%',center,roseType:rose?'radius':false,
          avoidLabelOverlap:true,itemStyle:{borderColor:cssVar('--bg2'),borderWidth:2,borderRadius:4},
          label:{show:!legend,formatter:'{b}\n{d}%',fontSize:11},data}]});
    },

    radar(el,{indicators, series, legend=false, max=100}){
      const pal=C.palette();
      return init(el,{
        legend:legend?{top:0,textStyle:{fontSize:11}}:undefined,
        tooltip:{},
        radar:{indicator:indicators.map(i=>({name:i,max})),radius:'66%',
          axisName:{color:cssVar('--text-dim'),fontSize:11},
          splitLine:{lineStyle:{color:cssVar('--chart-split')}},splitArea:{areaStyle:{color:['transparent']}},
          axisLine:{lineStyle:{color:cssVar('--chart-split')}}},
        series:[{type:'radar',data:series.map((s,i)=>({name:s.name,value:s.value,
          lineStyle:{width:2,color:pal[i%pal.length]},itemStyle:{color:pal[i%pal.length]},
          areaStyle:{opacity:.18,color:pal[i%pal.length]}}))}]});
    },

    gauge(el,{value, name='', max=100, color}){
      const pal=C.palette();
      return init(el,{series:[{type:'gauge',min:0,max,radius:'92%',center:['50%','58%'],
        progress:{show:true,width:14,itemStyle:{color:color||pal[0]}},
        axisLine:{lineStyle:{width:14,color:[[0.6,cssVar('--danger')],[0.85,cssVar('--warning')],[1,cssVar('--success')]]}},
        pointer:{width:5,length:'62%',itemStyle:{color:color||pal[0]}},
        axisTick:{show:false},splitLine:{length:10,lineStyle:{color:cssVar('--text-mute')}},
        axisLabel:{show:false},
        detail:{valueAnimation:true,fontSize:30,fontFamily:'Oswald',offsetCenter:[0,'34%'],color:cssVar('--text'),formatter:'{value}'},
        title:{offsetCenter:[0,'68%'],fontSize:12,color:cssVar('--text-dim')},
        data:[{value,name}]}]});
    },

    funnel(el,{data, horizontal=false}){
      const pal=C.palette();
      return init(el,{tooltip:{trigger:'item',formatter:'{b}: {c}'},
        series:[{type:'funnel',left:'8%',right:'8%',top:10,bottom:10,minSize:'24%',
          sort:'descending',gap:3,orient:horizontal?'horizontal':'vertical',
          label:{position:'inside',formatter:'{b}\n{c}',color:'#fff',fontSize:12,fontWeight:600},
          itemStyle:{borderWidth:0},
          data:data.map((d,i)=>({...d,itemStyle:{color:grad(pal[i%pal.length],pal[(i+1)%pal.length])}}))}]});
    },

    scatter(el,{data, xName='', yName='', symbolField=2, legendCats}){
      // data: [{name, value:[x,y,size], cat}]
      const pal=C.palette();
      return init(el,{
        tooltip:{trigger:'item',formatter:p=>`${p.data.name}<br/>${xName}: ${p.value[0]}<br/>${yName}: ${p.value[1]}`},
        legend:legendCats?{top:0,data:legendCats}:undefined,
        grid:{left:10,right:18,top:legendCats?28:14,bottom:6,containLabel:true},
        xAxis:{type:'value',name:xName,nameTextStyle:{color:cssVar('--text-mute')},scale:true},
        yAxis:{type:'value',name:yName,nameTextStyle:{color:cssVar('--text-mute')},scale:true},
        series:[{type:'scatter',data:data.map(d=>({name:d.name,value:d.value,
          symbolSize:Math.max(10,(d.value[symbolField]||20)/2.2),
          itemStyle:{color:d.color||pal[0],opacity:.78,shadowBlur:10,shadowColor:d.color||pal[0]}})),
          emphasis:{focus:'self',label:{show:true,formatter:'{b}',position:'top',color:cssVar('--text')}}}]});
    },

    graph(el,{nodes, links, cats, layout='force', roam=true}){
      const pal=C.palette();
      return init(el,{
        legend:cats?{top:0,data:cats,textStyle:{fontSize:11}}:undefined,
        tooltip:{},
        series:[{type:'graph',layout,roam,draggable:true,
          force:{repulsion:layout==='force'?260:120,edgeLength:[60,140],gravity:.08},
          label:{show:true,color:cssVar('--text'),fontSize:11,position:'right'},
          lineStyle:{color:'source',opacity:.5,width:1.4,curveness:.12},
          emphasis:{focus:'adjacency',lineStyle:{width:3}},
          categories:cats?cats.map(c=>({name:c})):undefined,
          data:nodes.map(n=>({id:n.id,name:n.name,category:n.cat,symbolSize:n.sym||24,
            itemStyle:{color:pal[(n.cat||0)%pal.length],shadowBlur:14,shadowColor:pal[(n.cat||0)%pal.length]}})),
          links:links.map(l=>({source:l.source,target:l.target,label:l.rel?{show:false,formatter:l.rel}:undefined,value:l.rel}))}]});
    },

    tree(el,{data, horizontal=true}){
      return init(el,{tooltip:{trigger:'item',triggerOn:'mousemove'},
        series:[{type:'tree',data:[data],top:'4%',left:'8%',bottom:'4%',right:'18%',
          orient:horizontal?'LR':'TB',symbolSize:10,
          itemStyle:{color:C.palette()[0],borderColor:C.palette()[0]},
          label:{position:horizontal?'left':'top',color:cssVar('--text'),fontSize:11,align:'right'},
          leaves:{label:{position:horizontal?'right':'bottom',align:'left'}},
          lineStyle:{color:cssVar('--chart-axis'),width:1.2,curveness:.4},
          emphasis:{focus:'descendant'},expandAndCollapse:true,initialTreeDepth:3}]});
    },

    sankey(el,{nodes, links}){
      const pal=C.palette();
      return init(el,{tooltip:{trigger:'item',triggerOn:'mousemove'},
        series:[{type:'sankey',left:8,right:120,top:10,bottom:10,nodeWidth:14,nodeGap:10,
          data:nodes.map((n,i)=>({name:n.name,itemStyle:{color:pal[i%pal.length]}})),
          links,
          label:{color:cssVar('--text'),fontSize:11},
          lineStyle:{color:'gradient',opacity:.35,curveness:.5}}]});
    },

    treemap(el,{data}){
      return init(el,{tooltip:{formatter:'{b}: {c}'},
        series:[{type:'treemap',roam:false,nodeClick:'zoomToNode',breadcrumb:{show:true,bottom:0,itemStyle:{color:cssVar('--panel-solid')},textStyle:{color:cssVar('--text-dim')}},
          label:{fontSize:11,color:'#fff'},upperLabel:{show:true,height:22,color:cssVar('--text')},
          itemStyle:{borderColor:cssVar('--bg2'),borderWidth:2,gapWidth:2},
          levels:[{itemStyle:{borderWidth:0,gapWidth:4}},{colorSaturation:[.35,.6],itemStyle:{gapWidth:2,borderColorSaturation:.6}}],
          data}]});
    },

    wordcloud(el,{words}){
      const pal=C.palette();
      return init(el,{series:[{type:'wordCloud',shape:'circle',width:'96%',height:'96%',
        sizeRange:[13,52],rotationRange:[-30,30],gridSize:6,drawOutOfBound:false,
        textStyle:{color:()=>pal[Math.floor(Math.random()*pal.length)],fontWeight:600},
        emphasis:{textStyle:{shadowBlur:8,shadowColor:pal[0]}},
        data:words.map(w=>({name:w[0],value:w[1]}))}]});
    },

    // 甘特图(custom series)
    gantt(el,{phases}){
      const pal=C.palette();
      const data=phases.map((p,i)=>({value:[i,p.start,p.start+p.len,p.phase,p.progress],itemStyle:{color:p.progress===100?cssVar('--success'):p.progress>0?pal[0]:cssVar('--text-mute')}}));
      return init(el,{
        tooltip:{formatter:p=>`${p.value[3]}<br/>第${p.value[1]+1}-${p.value[2]}月 · 进度${p.value[4]}%`},
        grid:{left:90,right:30,top:16,bottom:30},
        xAxis:{min:0,max:5,interval:1,axisLabel:{formatter:v=>'第'+v+'月'},splitLine:{show:true,lineStyle:{color:cssVar('--chart-split')}}},
        yAxis:{type:'category',inverse:true,data:phases.map(p=>p.phase),axisLabel:{color:cssVar('--text-dim')}},
        series:[{type:'custom',renderItem:(params,api)=>{
          const cat=api.value(0); const start=api.coord([api.value(1),cat]); const end=api.coord([api.value(2),cat]);
          const h=api.size([0,1])[1]*0.5;
          const w=end[0]-start[0]; const prog=api.value(4)/100;
          return {type:'group',children:[
            {type:'rect',shape:{x:start[0],y:start[1]-h/2,width:w,height:h,r:5},style:{fill:cssVar('--panel-2'),stroke:api.visual('color'),lineWidth:1}},
            {type:'rect',shape:{x:start[0],y:start[1]-h/2,width:w*prog,height:h,r:5},style:{fill:api.visual('color'),opacity:.85}},
            {type:'text',style:{text:api.value(4)+'%',x:start[0]+w/2,y:start[1],textAlign:'center',textVerticalAlign:'middle',fill:'#fff',fontSize:11,fontWeight:600}},
          ]};
        },encode:{x:[1,2],y:0},data}]});
    },

    // 瀑布图(现金流)
    waterfall(el,{data}){
      const pal=C.palette();
      let acc=0; const base=[]; const pos=[]; const neg=[];
      data.forEach((d,i)=>{
        if(i===0||i===data.length-1){base.push(0);pos.push(d.name==='期末'?acc:d.v);neg.push('-');if(i===0)acc=d.v;}
        else{ if(d.v>=0){base.push(acc);pos.push(d.v);neg.push('-');acc+=d.v;} else {acc+=d.v;base.push(acc);pos.push('-');neg.push(-d.v);} }
      });
      // 末列=累计
      pos[pos.length-1]=acc; base[base.length-1]=0;
      return init(el,{tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},
        grid:{left:8,right:14,top:14,bottom:6,containLabel:true},
        xAxis:{type:'category',data:data.map(d=>d.name),axisLabel:{interval:0,fontSize:10}},
        yAxis:{type:'value'},
        series:[
          {type:'bar',stack:'t',itemStyle:{color:'transparent'},data:base,silent:true},
          {type:'bar',stack:'t',name:'流入',itemStyle:{color:cssVar('--success'),borderRadius:[4,4,0,0]},data:pos},
          {type:'bar',stack:'t',name:'流出',itemStyle:{color:cssVar('--danger'),borderRadius:[4,4,0,0]},data:neg},
        ]});
    },

    // 地图
    map(el,{geo, mapName, data, max=100, visualText=['高','低']}){
      if(!echarts.getMap(mapName)) echarts.registerMap(mapName, geo);
      return init(el,{tooltip:{trigger:'item',formatter:p=>`${p.name}<br/>产业协同强度: ${p.value||0}`},
        visualMap:{min:0,max,left:10,bottom:10,text:visualText,calculable:true,
          inRange:{color: theme()==='wuda-light'?['#dbeafe','#3b82f6','#1e3a8a']:['#0b2a5e','#1565c0','#00e5ff']},
          textStyle:{color:cssVar('--text-dim')}},
        series:[{type:'map',map:mapName,roam:true,
          label:{show:true,fontSize:9,color:cssVar('--text-dim')},
          itemStyle:{borderColor:cssVar('--border-strong'),areaColor:cssVar('--panel-2')},
          emphasis:{label:{color:cssVar('--text'),fontWeight:600},itemStyle:{areaColor:cssVar('--primary')}},
          data}]});
    },

    // KPI 迷你趋势
    spark(el,{data, color}){
      const c=color||C.palette()[0];
      return init(el,{grid:{left:0,right:0,top:2,bottom:2},xAxis:{type:'category',show:false,data:data.map((_,i)=>i)},
        yAxis:{type:'value',show:false,scale:true},tooltip:{show:false},
        series:[{type:'line',data,smooth:true,showSymbol:false,lineStyle:{width:2,color:c},areaStyle:{opacity:.22,color:grad(c,'transparent')}}]});
    },

    // 进度环(目标完成度)
    progressRing(el,{value, color, label}){
      const c=color||C.palette()[0];
      return init(el,{series:[{type:'gauge',startAngle:90,endAngle:-270,radius:'92%',
        pointer:{show:false},progress:{show:true,overlap:false,roundCap:true,clip:false,itemStyle:{color:c}},
        axisLine:{lineStyle:{width:10,color:[[1,cssVar('--panel-2')]]}},splitLine:{show:false},axisTick:{show:false},axisLabel:{show:false},
        data:[{value,detail:{offsetCenter:[0,0]}}],
        detail:{valueAnimation:true,fontSize:20,fontFamily:'Oswald',color:cssVar('--text'),formatter:'{value}%'}}]});
    },
  };
  window.Charts = C;
})();
