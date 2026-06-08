export const meta = {
  name: 'wuda-build-pages',
  description: '并行生成武汉大学产业创新AI智脑平台原型的全部业务页面(基于已建共享地基)',
  phases: [
    { title: '生成页面', detail: '16个Agent并行,各自Write若干HTML页面' },
    { title: '校验修复', detail: '逐页检查并修复明显问题' },
  ],
}

const ROOT = '/Users/chenwenbo/Desktop/武汉大学原型'

const API_REF = `
你正在为「武汉大学产业创新AI智脑平台」高保真原型生成页面。共享地基已建好，必须复用，禁止引入 Tailwind 或任何新库。

# 开始前(必须)
用 Read 读取以下文件掌握真实数据字段与页面写法(这是地面真相)：
- ${ROOT}/assets/js/data.js   (所有 DB.* 数据的确切字段名)
- ${ROOT}/index.html          (页面骨架与 UI./Charts. 用法范例)
如对组件/图表签名不确定，再读 ${ROOT}/assets/js/components.js 和 ${ROOT}/assets/js/charts.js。

# 页面骨架(严格遵守)
<!doctype html><html lang="zh-CN"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>页面名 · 武汉大学产业创新AI智脑平台</title>
<link rel="stylesheet" href="assets/css/theme.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<!-- 含词云的页面在此追加: <script src="https://cdn.jsdelivr.net/npm/echarts-wordcloud@2.1.0/dist/echarts-wordcloud.min.js"></script> -->
</head>
<body data-theme="dark或light" data-page="本页文件名去掉.html">
<main class="wuda-view">
  <div class="page-head"><div><div class="page-title"><span class="accentbar"></span>页面标题</div><div class="page-sub">副标题描述</div></div><div style="display:flex;gap:9px">右上操作按钮</div></div>
  ...内容...
  <!-- 末尾: <div id="..."></div> 等 -->
</main>
<!-- 含地图的页面在此追加(放在 data.js 之前): <script src="assets/geo/hubei.js"></script> -->
<script src="assets/js/data.js"></script>
<script src="assets/js/charts.js"></script>
<script src="assets/js/components.js"></script>
<script src="assets/js/shell.js"></script>
<script>(function(){ /* 页面初始化:DOM已就绪 */ })();</script>
</body></html>

规则：
- data-theme：驾驶舱/产业创新大脑/AI工作台/OPC社区首页/login = "dark"；其余业务后台页 = "light"。
- 内容根容器必须是 <main class="wuda-view">（shell.js 自动注入顶栏+侧栏，勿自己写导航）。
- data-page 必须等于"文件名去掉.html"，否则左侧导航高亮错误。
- 详情页用 window.qparam('id') 读 URL 参数，在 DB 中 find 对应记录渲染；顶部放返回面包屑 <div class="crumb"><a href="列表页.html">← 返回XX</a></div>。
- 每页 <main> 末尾加 数据来源脚注：在内容最后 append UI.srcNote(['成果与专利','参股/校属企业'])（按页面相关域填）。
- 图表容器需要高度：用 class "chart h340"（可选 h220/h260/h300(默认)/h340/h380/h420/h480）或 inline style="height:340px"。
- 初始化脚本在 body 末尾，DOM 已存在；直接 document.getElementById(...).innerHTML=... 再 Charts.xxx('id',{...})。

# Charts API (window.Charts，自动套用当前皮肤主题与resize)
Charts.init('elId', echartsOption)  // 需要自定义图表时用，返回实例
Charts.line('id',{x:['1月',...], series:[{name,data:[]}], area=true, smooth=true, legend=false, stack=false})
Charts.bar('id',{x:[], series:[{name,data:[]}], horizontal=false, legend=false, stack=false})
Charts.pie('id',{data:[{name,value}], ring=true, legend=true, rose=false, center:['50%','52%']})
Charts.radar('id',{indicators:['维度1',...], series:[{name,value:[..]}], legend=false, max=100})
Charts.gauge('id',{value, name:'', max=100, color})
Charts.funnel('id',{data:[{name,value}], horizontal=false})
Charts.scatter('id',{data:[{name,value:[x,y,size],color}], xName,yName, symbolField=2, legendCats})
Charts.graph('id',{nodes:[{id,name,cat,sym}], links:[{source,target,rel}], cats:['类1',..], layout='force', roam=true})
Charts.tree('id',{data:{name,children:[{name,children:[{name,val}]}]}, horizontal=true})
Charts.sankey('id',{nodes:[{name}], links:[{source,target,value}]})
Charts.treemap('id',{data:[{name,value,children}]})
Charts.wordcloud('id',{words:[['词',权重],..]})   // 需在head追加 echarts-wordcloud 脚本
Charts.gantt('id',{phases:[{phase,start,len,progress}]})
Charts.waterfall('id',{data:[{name,v}]})
Charts.map('id',{geo:HUBEI_GEOJSON, mapName:'hubei', data:[{name,value}], max:100, visualText:['高','低']})  // 需追加 hubei.js；武汉用 WUHAN_GEOJSON / 'wuhan'
Charts.spark('id',{data:[..], color})
Charts.progressRing('id',{value, color})

# UI API (window.UI，多为返回HTML字符串的纯函数)
UI.kpi({label,value,unit,delta,deltaUp=true,icon:'🔬',spark:[数值数组]}) -> html  // spark可选迷你趋势
UI.panel(title, bodyHtml, {tools:'',glow:false,tag:''}) -> html  // 标准面板容器
UI.tag(text, type)  // type: blue/green/red/amber/purple/gray
UI.light('g'|'y'|'r', text)  // 红黄绿灯, g=正常 y=关注 r=预警
UI.chip(text, sel=false)
UI.bar(pct, color)  // 进度条
UI.entityCard({title, meta:'html', tags:[], badge:'', onclick:''})
UI.rankList([{name,value,sub}])
UI.timeline([{time,txt,type}])  // type: 成果/合作/孵化/数据/投资/活动/预警
UI.descList([['键','值html'],..])
UI.empty(text); UI.skeleton(n); UI.srcNote(['域名',..])
UI.filterBar('#sel', {fields:[{key,label,options:['A','B'],all:true}], search:false, searchPh:'', extra:'', onChange:vals=>{}}) -> {read()}
UI.table('#sel', {columns:[{key,title,render:(row)=>html, sortable:true, sortVal:(row)=>值}], rows:[], pageSize:10, onRow:(row)=>{}, empty:''}) -> {update(rows)}
UI.drawer(title, bodyHtml, {width:'620px'}); UI.closeDrawer()
UI.modal(title, bodyHtml, {footer:'<button>..'}); UI.closeModal()
UI.toast(msg, 'ok'|'warn')
UI.tabs('#sel', [{key,label}], key=>{切换})
UI.kanban('#sel', {columns:[{key,title,cards:[..]}], cardRender:card=>html, onMove:(i,from,to)=>{}})
UI.typewriter('id', text, {speed:18, onDone})  // AI流式打字机
window.qparam('id')  // 读URL参数

# theme.css 关键类
布局: .wuda-view(自动) | 页头: .page-head .page-title>.accentbar .page-sub .crumb
容器: .panel / .panel.glow | .grid + .cols-2/.cols-3/.cols-4/.cols-5/.cols-6
标签: .chip(.sel) .tag.tag-blue/green/red/amber/purple/gray .light.g/.y/.r
按钮: .btn .btn-primary .btn-sm .btn-ghost | 分段: .seg>button(.on)
图表高度: .chart.h220/.h260/.h340/.h380/.h420/.h480 (默认300)
实体卡: .ecard | 进度: .bar-track>.bar-fill | 选项卡: .tabs>.tab(.active)
工具类: .flex .items-center .justify-between .gap-2/3/4 .mt-2/3/4 .mb-3/4 .text-dim/.text-mute/.text-primary/.text-success/.text-danger/.text-warning .fw7 .fw6 .f12/.f13/.f18/.f22 .w-full .pointer .divider .num .scroll-x .src-note
颜色变量(inline style用): var(--primary) var(--accent) var(--success) var(--danger) var(--warning) var(--text-dim) var(--panel) var(--panel-2) var(--border) var(--dom-1..--dom-8)

# DB 数据(window.DB) 关键字段(以你Read到的data.js为准)
DB.disciplines[{id(ai/robot/bio/chip/geo),name,icon,color,colleges[],desc}]  DB.allColleges[] DB.hubeiCities[] DB.wuhanDistricts[]
DB.achievements[{id,title,discipline,disciplineName,college,leader,trl,patents,papers,maturity,status,value(万),match,scenes[],year,updated,desc}]
DB.teams[{id,name,pi,discipline,disciplineName,college,members,achievements,patents,transferred,demand,field,rank,desc}]
DB.enterprises[{id,name,type(孵化企业/参股企业/校属企业/校友企业),disciplineName,stage,city,district,founded,reg,equity(持股%),revenue(万),revGrowth(%),employees,valuation(万),financingRound,risk(g/y/r),riskText,score,park,parkId,founder,patents,tags[],desc}]
DB.financings[{ent,entId,round,amount,date,investor}] DB.postInvest[{entId,ent,equity,bookValue,stage,risk,riskText,lastReport,kpi,alerts[]}] DB.riskAlerts[{id,ent,entId,level,type,desc,date,status}] DB.funds[{id,name,scale(亿),focus[],stage,invested,reserved}]
DB.parks[{id,name,type,addr,area(万㎡),occupancy(%),buildings,ents,services,revenue(万),level}] DB.spaceUnits[{park,unit,area,status,ent,rent}] DB.tickets[{id,park,type,ent,level,sla(剩余小时),status,owner,created}] DB.onboarding[{id,ent,park,discipline,step,progress,area,applied}]
DB.activities[{id,name,type,date,discipline,enroll,checkin,leads,projects,status,venue,guests[]}] DB.customerLeads[{id,name,contact,type,intent,value,stage,source,owner}] DB.projectLeads[{id,name,discipline,team,stage,score,source,value,owner}] DB.communities[{name,members,active,posts,events}]
DB.opcProjects[{id,name,discipline,disciplineName,stage,progress,mentor,members,tasks,tasksDone,funding,views,desc}] DB.experts[{id,name,field,role,org,sessions,rating}] DB.lives[{id,title,host,date,status,views,likes}] DB.opcServices[{id,name,cat,price(万),unit,sales,desc}]
DB.dataDomains[{id,name,color,tables,records(万),health,freq,owner,sensitive,updated,status}] DB.dataAssets[{id,name,domain,domainId,fields,records(字符串如"42万"),freq,updated,owner,status,health,sensitive}] DB.lineage[{from,to,rel}] DB.qualityIssues[{id,domain,type,asset,count,level(高/中/低),date,owner,status}] DB.syncTasks[{name,domain,status,duration,records,time}]
DB.tracks[{name,disc,market(亿元市场规模),growth(%),fit(契合度),heat,ents,stage}] DB.targetEnterprises[{name,disc,discName,match,city,type,revenue,reason}] DB.techRoutes(树:{name,children}) DB.hotwords[['词',权重]] DB.policyEvents[{id,level,title,discipline,date,deadline,match,status}] DB.brainInsights[{tag,txt,level}] DB.analysisTasks[{id,title,role,status,time,owner}] DB.aiTasks[{id,title,role,status,created,duration,billing,value,sources[]}] DB.prompts[]
DB.revenueTypes[{key,color,amount(万),target,desc}] DB.revenueTrend[{month,托管运营,平台订阅,任务包式AI,专业服务,投资协同}] DB.managedClients[{id,name,type,plan,amount,since,status,renew}] DB.subscriptions[{id,name,edition,accounts,amount,expire,status}] DB.taskOrders[{id,task,client,amount,status,date}] DB.healthMetrics[{name,score,trend}] DB.phases[{phase,month,start,len,tasks,deliver,status,progress}] DB.competitors[{name,tag,cap[5],strength,weak,fit}] DB.capDims[5个字符串] DB.competitorArch{清华大学:[[层,模块,细节]],浙江大学,上海交通大学}
DB.platformActivities[{time,type,txt}] DB.notifications[{type,level,title,desc,time,read}] DB.topKPI{achievements,achGrowth,enterprises,entGrowth,partners,partnerGrowth,convAmount(亿),convGrowth,projects,incubated,equity,parks,services,activities} DB.convFunnel[{name,value}] DB.directionScores[{name,scores[5]}] DB.directionDims[5] DB.regionData[{name(市),value}] DB.wuhanRegion[{name(区),value}] DB.coopGraph{nodes[{id,name,cat,sym}],links[{source,target}],cats[4]} DB.cashflow[{name,v}] DB.equityTree(树) DB.util{ri,pick,picks,person}

# 质量要求
- 高保真：每页要"看起来能用"——丰富KPI、真实图表、可交互(筛选/排序/点击行或卡片弹抽屉看详情/tab切换/弹窗/toast)。
- 数据全部来自 DB.*，不要硬编码大段假数据(少量页面专属补充可以)。
- 深色页面突出科技大屏质感(glow面板、霓虹强调)；浅色页面专业克制。
- 中文，专业术语准确，结合武大5学科(人工智能/机器人/生物医药/半导体光芯片/空间信息测绘遥感)。
- 写完用 Read 自查一遍，确保 <script> 无语法错误、引用的 DB 字段确实存在、图表容器id与初始化一致。
`

function agentFor(label, pages, themeNote){
  return agent(
    `${API_REF}\n\n# 你负责创建以下页面(用 Write 写入 ${ROOT}/ 下，文件名即给定名)：\n${pages}\n\n${themeNote||''}\n务必逐个用 Write 工具把每个页面真正写入磁盘(这是硬性要求)。全部写完后，用一两句话说明你写了哪些文件即可，无需任何结构化输出。`,
    { label, phase:'生成页面' }
  )
}

phase('生成页面')

const GROUPS = [
  ['data1', `
1) data-foundation.html (深色) 数据底座总览：顶部5联KPI(总表数256/数据总量1860万条/数据域8/平均健康度92.4/今日新增4210条)；综合健康度仪表(Charts.gauge value 92.4)；8类数据域资产矩阵(用 DB.dataDomains 渲染4×2域卡片，每卡:域名+表数+条数(万)+更新状态徽章+健康度miniring+最近更新)，点域卡 UI.drawer 展示该域详情(字段/样本/最近同步)；各域数据量占比饼(Charts.pie 用 dataDomains 的 records)；近12月数据增长堆叠面积(Charts.line stack)；同步任务列表(DB.syncTasks 表)。
2) data-catalog.html (浅色) 数据资产目录：UI.filterBar(域/责任方/更新频率/状态/敏感级 + search)；UI.table 渲染 DB.dataAssets(列:编号/名称/所属域/字段数/数据量/频率/最近更新/责任方/状态徽章/健康度/操作)，行点击 UI.drawer 看字段明细(造几条字段示例)+血缘+质量；顶部小KPI(正常/同步中/异常计数)；各责任方资产数柱状。`,
   '两页主题不同(data-foundation=dark, data-catalog=light)。'],

  ['data2', `
1) data-map.html (深色) 数据地图·血缘：主区大图 Charts.graph 用 DB.dataDomains 作为8个大节点(按域色)，根据 DB.lineage 连边并在tooltip显示 rel 关系；点击节点 UI.drawer 显示该域上下游与被哪些AI角色/业务场景消费；底部 Charts.sankey 跨域数据流向(源:8域 → 中:产业创新大脑 → 汇:3AI角色+5业务场景，links自造合理value)；统计条(已打通域对/跨域关联字段/孤立资产/复用率)。
2) data-governance.html (深色) 数据治理质量：中心 Charts.gauge 综合质量分92.4；四维质量卡(完整性94.2/准确性91/及时性89.5/一致性95.1，每个带progressRing或bar)；各域质量五维雷达 Charts.radar(用 dataDomains，indicators=[完整性,准确性,及时性,一致性,规范性])；质量分近12月趋势 Charts.line(目标线90)；UI.table 质量问题清单(DB.qualityIssues, 列:编号/域/类型/资产/影响条数/严重级/发现时间/责任方/状态/操作)，按严重级筛选；问题按类型分布柱状。
3) discipline-industry-map.html (深色) 学科产业方向图：顶部5个学科Tab(UI.tabs 用 DB.disciplines)，切换显示该学科一屏：学科概况卡(成果数=DB.achievements该学科count、团队数、企业数、专利合计、平均成熟度)；该学科成果转化漏斗(Charts.funnel)；该学科相关赛道(DB.tracks筛 disc)契合度条形(Charts.bar horizontal)；该学科重点成果 UI.rankList(按value)；该学科目标企业(DB.targetEnterprises筛)卡片。`,
   '三页均 dark。data-map 需 Charts.graph+sankey。'],

  ['cockpit-school', `
cockpit-school.html (深色大屏) 校级产业创新驾驶舱：
- 顶部一行核心KPI带(用 DB.topKPI：科技成果/在孵参股企业/对接产业伙伴/本年转化额/重点项目268/参股企业64/园区6/活动128)，UI.kpi带spark。
- 主区采用大屏多卡网格布局(grid)：
  · 重点产业方向能力雷达 Charts.radar(DB.directionScores + DB.directionDims，5学科叠加)。
  · 成果转化全链条漏斗 Charts.funnel(DB.convFunnel：需求识别→科研组织→成果项目化→企业孵化→资本协同)；点漏斗某环节 UI.drawer 列出该环节明细(造合理列表)。
  · 区域产业协同地图：追加 assets/geo/hubei.js；Charts.map(geo:HUBEI_GEOJSON,mapName:'hubei',data:DB.regionData)；点市州 UI.toast 或 drawer 显示该市协同详情。
  · 校企合作网络知识图谱 Charts.graph(DB.coopGraph.nodes/links/cats)；点节点 UI.drawer。
  · 重点项目TOP榜 + 重点企业TOP榜(UI.rankList，企业用 DB.enterprises 按valuation/score)。
  · 产业转化趋势 Charts.line(近12月转化金额)。
- 大屏质感:多用 .panel.glow；右上"全屏"按钮(toast即可)。底部 UI.srcNote。`,
   '单页但内容最丰富，务必铺满大屏、图表齐全、含地图(加hubei.js)与图谱与漏斗钻取。dark。'],

  ['cockpit-asset', `
cockpit-asset.html (深色大屏) 资产管理公司经营驾驶舱：
- 顶部经营KPI带(管理园区6/在管面积≈47万㎡(由DB.parks.area求和)/入驻企业(parks.ents求和)/平均出租率/股权资产总值(由postInvest.bookValue求和)/年度服务收入(revenueTypes.amount求和,万→亿)/活动场次128)。
- UI.tabs 分区:【经营总览】【股权穿透】【园区运营】【收入分析】【投后风险】，或直接多卡平铺。建议平铺多卡:
  · 股权资产穿透 Charts.treemap(DB.equityTree) 与 Charts.sankey(学校→资产公司→各学科→参股企业，用 enterprises equity>0 自造links)。
  · 园区运营对比 Charts.bar(DB.parks: 出租率/企业数/收入 多系列 legend)。
  · 五类服务收入结构 Charts.pie(DB.revenueTypes amount) + 近12月收入趋势 Charts.line stack(DB.revenueTrend 5系列)。
  · 现金流瀑布 Charts.waterfall(DB.cashflow)。
  · 投后风险红黄绿灯台账：UI.table(DB.postInvest 按risk排序，列:企业/持股/账面值/阶段/健康度/风险灯/操作)，行点 UI.drawer 看预警(DB.riskAlerts筛该企业)。
  · 活动转化漏斗 Charts.funnel(报名→签到→线索→项目→签约，用 DB.activities 汇总)。
- 底部 UI.srcNote(['参股/校属企业','科技园与创意园','活动与赛事'])。`,
   '单页大屏，dark，突出"统一台账+穿透管理+风险预警+经营大屏"。'],

  ['brain1', `
1) brain-overview.html (深色) 大脑总览·智能问答：顶部"AI版产业研究院"横幅+智能问答输入框(回车或按钮触发，调用 window.openAIAssistant(问题) 打开AI抽屉，或就地用 UI.typewriter 在下方流式输出一段研判)；五大能力入口卡(产业趋势研判/技术路线判断/赛道选择/企业识别/项目评估，链到 brain-*.html)；大脑实时洞察卡片流(DB.brainInsights，按level着色)；最近分析任务流(DB.analysisTasks 列表/时间线)；推荐Prompt(DB.prompts chips)。
2) brain-trend.html (深色) 产业趋势研判：head追加 echarts-wordcloud 脚本。布局:产业热度趋势 Charts.line(多产业方向近12月，可造)；技术热词云 Charts.wordcloud(DB.hotwords)；政策与事件时间线 UI.timeline(DB.policyEvents 转换)；技术成熟度曲线(Gartner式) Charts.scatter(x=成熟阶段1-5,y=期望值,size=关注度，造10个技术点，xName='成熟度阶段',yName='市场期望')；右侧赛道热度榜 UI.rankList(DB.tracks 按heat)。`,
   'brain-trend 需 wordcloud 脚本。两页 dark。'],

  ['brain2', `
1) brain-techroute.html (深色) 技术路线判断：主图 Charts.tree(DB.techRoutes，横向技术路线树)；关键技术评分雷达 Charts.radar(造材料/器件/封装/工艺/可靠性5维)；专利分布柱状 Charts.bar(各技术分支专利数)；技术路线节点点击说明(可用 tooltip + 侧栏文字)；顶部学科/技术方向选择器 UI.filterBar 或 seg。
2) brain-track.html (深色) 赛道选择：核心 Charts.scatter 赛道气泡矩阵(DB.tracks: value=[market,growth,fit]，symbolField=2用fit或单独，xName='市场规模(亿)',yName='增速(%)',气泡大小=契合度，按disc着色 legendCats=学科)；赛道清单 UI.table(DB.tracks 列:赛道/所属学科/市场规模/增速/契合度/热度/相关企业/阶段/操作)，行点 UI.drawer 看赛道详情(含该赛道目标企业)；赛道对比雷达 Charts.radar(选2-3赛道对比，维度:市场规模/增速/契合度/热度/企业集聚)。`,
   '两页 dark。brain-track 散点用 DB.tracks。'],

  ['brain3', `
1) brain-enterprise.html (深色) 企业识别：目标企业清单 UI.filterBar(学科/类型/城市)+UI.table(DB.targetEnterprises 列:企业/学科/匹配度/城市/类型/营收/识别理由/操作)，行点 UI.drawer 企业识别画像(匹配雷达+理由)；企业关系图谱 Charts.graph(以学科为中心连接目标企业，用 targetEnterprises 自造 nodes/links，cats=[学科,目标企业])；匹配度分布与按城市分布柱状。
2) brain-project.html (深色) 项目评估：左侧选择成果(DB.achievements下拉/列表)，右侧该成果评估打分卡(技术成熟度/市场前景/团队能力/转化可行性/政策契合 五维 Charts.radar)+综合评分 progressRing+评估结论文字；评估流水 UI.table(DB.projectLeads 或 achievements 造评估记录:项目/学科/评分/阶段/评估人/时间)。
3) policy-radar.html (深色) 政策雷达：政策库 UI.filterBar(级别/学科/状态)+UI.table(DB.policyEvents 列:级别徽章/标题/相关学科/发布日期/申报截止/匹配度/状态/操作)，行点 UI.drawer 看政策详情+申报指引+匹配的学校成果(DB.achievements筛同学科)；按级别分布饼(国家/省/市/光谷)；到期提醒卡片(deadline非长期的)；政策匹配度TOP榜。`,
   '三页 dark。'],

  ['ai', `
1) ai-workbench.html (深色) AI角色工作台：三栏布局——左栏角色切换(AI分析师/AI技术经理人/AI投资人，点击切换当前角色与推荐prompt)；中栏对话/任务区(消息气泡+输入框+发送，发送后用 UI.typewriter 流式生成对应角色的结构化产出文本；不同角色不同产出:分析师=产业报告+赛道清单+目标企业清单；技术经理人=成果BP要点+转化路径+路演要点；投资人=投资研判+估值区间+风险清单+尽调要点)；右栏产出物面板(生成的"任务包"卡片列表，点开 UI.drawer 看任务包交付详情，含"数据来源引用"脚注 UI.srcNote)。顶部展示当前角色能力说明。用 DB.aiTasks/DB.prompts 作历史与推荐。
2) ai-tasks.html (浅色) AI任务中心：任务包单一真源。UI.filterBar(角色/状态/计费方式)+UI.table(DB.aiTasks 列:编号/任务/角色/状态徽章(待生成/生成中/已交付/已复用)/计费方式/价值(万)/创建/耗时/操作)，行点 UI.drawer 看任务详情(数据来源sources + 产出摘要 + "重新生成/复用"按钮toast)；顶部KPI(总任务/已交付/生成中/累计价值)；按角色任务量柱状+状态分布饼。`,
   'ai-workbench=dark(工作台), ai-tasks=light(管理)。workbench要有流式生成体验。'],

  ['ach', `
1) achievement-library.html (浅色) 成果库：UI.filterBar(学科/学院/TRL成熟度/转化状态 + search)；seg 切换 卡片/表格双视图(extra放seg)；卡片视图用 UI.entityCard 渲染 DB.achievements(标题/学科/学院/负责人/TRL/估值/匹配度/状态徽章, onclick 跳 achievement-detail.html?id=)；表格视图 UI.table；顶部KPI(成果总数/已转化/概念验证中/平均成熟度)；学科分布饼+TRL分布柱状。
2) achievement-detail.html (浅色) 成果详情画像：qparam('id') 找成果；返回面包屑;头部成果概况(标题/学科/学院/负责人/年份/状态/估值)+操作按钮(生成项目包/加入项目池 toast)；左:基本信息descList+应用场景scenes(chips)+市场前景文字；右:TRL成熟度雷达 Charts.radar(技术/市场/团队/工艺/知识产权5维)+专利/论文数KPI;场景匹配推荐 Charts.bar horizontal(scenes匹配度);团队成员(造3-5人)+相关专利列表。若无id取 DB.achievements[0]。`,
   '两页 light。detail 用 qparam。'],

  ['proj', `
1) project-pipeline.html (浅色) 项目化流水线看板：UI.kanban 6泳道(成果遴选/成果画像/成熟度评估/场景匹配/项目包装/路演材料)，卡片来自 DB.achievements 按 status/maturity 分配到不同泳道，cardRender 显示 标题+学科+负责人+估值+TRL；卡片可拖拽(onMove toast提示阶段变更)；顶部各阶段计数KPI;右上"新建项目包"按钮 UI.modal(表单);点卡片 UI.drawer 看项目详情。
2) team-list.html (浅色) 团队科研组织：UI.filterBar(学科/学院/层级)+卡片或表格 DB.teams(名称/PI/学科/成员/成果/专利/已转化/可对接需求, 点击跳 team-detail.html?id=)；顶部KPI(团队数/PI数/成果合计/可对接需求数)；学科团队分布柱状。
3) team-detail.html (浅色) 团队画像：qparam('id') 找团队；头部(团队名/PI/学科/学院/层级)；descList基本信息;成员构成、研究方向chips;团队成果列表(DB.achievements筛同学科取几条)、专利数、转化记录、可对接需求清单;团队能力雷达(论文/专利/项目/转化/人才5维)。无id取 DB.teams[0]。`,
   '三页 light。'],

  ['ent', `
1) enterprise-library.html (浅色) 企业检索库：UI.filterBar(企业类型/学科/阶段/城市/风险 + search)；KPI(企业总数/孵化/参股/校属/校友 分类计数)；seg 卡片/表格双视图；表格 UI.table(DB.enterprises 列:名称/类型徽章/学科/阶段/城市/营收/估值/持股/风险灯/评分/操作)行点跳 enterprise-detail.html?id=；卡片视图 UI.entityCard；企业类型分布饼+学科分布柱状。
2) enterprise-detail.html (浅色) 企业画像一企一档(全平台企业详情真源)：qparam('id') 找企业；返回面包屑;头部(名称/类型/学科/阶段/风险灯/评分)+操作;UI.tabs:【企业概况】(工商信息descList+标签+经营指标趋势 Charts.line 营收近5年)【股权结构】(Charts.pie 股权/或treemap，含学校持股)【融资历史】(DB.financings筛该企业 时间线/表格)【知识产权】(专利数+列表)【投后跟踪】(DB.postInvest该企业+风险预警DB.riskAlerts)【服务记录】(造工单/服务)。无id取 enterprises[0]。`,
   '两页 light。enterprise-detail 是全平台企业详情真源，要丰满。'],

  ['post', `
1) post-investment.html (浅色) 投后跟踪预警：顶部KPI(参股企业64/正常/关注/预警 计数 + 组合健康度81);UI.kanban 投后状态泳道(投后稳定/重点跟踪/拟退出/增资扩股)用 DB.postInvest;或 UI.table 投后台账(企业/持股/账面值/阶段/健康度/风险灯/最近报告/操作)行点 drawer;风险预警台账 UI.table(DB.riskAlerts 列:企业/级别灯/类型/描述/日期/状态/操作);风险等级分布饼+各企业健康度柱状。
2) capital-fund.html (浅色) 基金资本协同：基金台账 UI.table(DB.funds 列:基金/规模(亿)/关注方向/阶段/已投/储备/操作);KPI(基金数/管理规模合计/已投项目/储备项目);基金投资偏好匹配(基金×学科 热力或矩阵，可用 Charts.bar 分组);联合投资记录(DB.financings 造资方表);投融资对接漏斗(线索→对接→尽调→投资)。`,
   '两页 light。'],

  ['parkact', `
1) park-list.html (浅色) 园区载体管理：KPI(园区6/在管面积合计/入驻企业合计/平均出租率);园区卡片网格 DB.parks(名称/类型/级别徽章/地址/面积/出租率bar/企业数/服务数/年收入, 点击跳 park-detail.html?id=);园区出租率对比柱状+各园区企业数。
2) park-detail.html (浅色) 园区详情驾驶舱：qparam('id') 找园区;返回面包屑;头部(名称/类型/级别/地址)+KPI(面积/出租率/楼宇/入驻企业/服务事项/年收入);UI.tabs:【空间资源】(DB.spaceUnits筛该园区 楼宇单元表+出租率环)【入驻企业】(DB.enterprises筛parkId 表/卡)【项目入驻流程】(DB.onboarding筛 看板或进度列表)【服务工单】(DB.tickets筛 SLA倒计时表，sla<6红色);出租率趋势 Charts.line。无id取 parks[0]。
3) activity-calendar.html (浅色) 活动归口台账：月历视图(自绘网格,把 DB.activities 按date放入对应日)+列表视图切换(seg);UI.filterBar(类型/学科/状态);KPI(活动128/本月场次/累计报名/沉淀线索);点活动 UI.drawer 活动详情(议程/嘉宾/报名/转化);活动类型分布饼+月度活动趋势柱状。
4) activity-detail.html (浅色) 活动详情：qparam('id')找活动;头部+descList(类型/日期/地点/学科/状态);报名与签到KPI;嘉宾卡片(guests);活动转化漏斗 Charts.funnel(报名→签到→线索→项目);沉淀线索列表(DB.customerLeads/projectLeads筛 source)。无id取 activities[0]。`,
   '四页 light。活动日历自绘月格。'],

  ['leadsopc', `
1) leads.html (浅色) 线索池CRM：UI.tabs【客户线索】【项目线索】;客户线索 UI.table(DB.customerLeads 列:名称/联系人/类型/意向/价值/阶段/来源/负责人/操作)+漏斗(各stage计数 Charts.funnel);项目线索 UI.table(DB.projectLeads)+评分分布;KPI(客户线索数/项目线索数/预计价值/转化中);行点 drawer。
2) community-board.html (浅色) 社群运营看板：社群卡片 DB.communities(名称/成员/活跃度bar/帖子/活动);KPI(社群数/总成员/平均活跃度/月度互动);各社群成员对比柱状+活跃度趋势 Charts.line;近期话题/动态时间线(造)。
3) opc-community.html (深色) 线上项目社区:项目展示墙卡片流 DB.opcProjects(名称/学科/阶段徽章/陪跑进度bar/导师/成员/任务进度/浏览量, 点击 UI.drawer 项目详情:陪跑任务进度+专家辅导+资源对接);UI.filterBar(学科/阶段);UI.tabs或区块含【专家库】DB.experts卡片;KPI(在孵项目/陪跑中/已毕业/累计浏览);学科分布。
4) opc-services.html (浅色) 线上服务菜单:服务商品卡 DB.opcServices(名称/类别/价格/单位/销量/描述 + "立即下单"按钮→UI.modal确认→UI.toast成功并模拟生成订单);KPI(服务SKU/累计订单/服务收入估算);按类别分布饼+销量榜;已下单订单列表(造)。
5) opc-live.html (深色) 直播推广:直播卡片 DB.lives(标题/主讲/日期/状态徽章(直播中/预告/回放)/观看/点赞 + 预约/观看按钮);KPI(直播场次/累计观看/累计点赞/平均时长);直播观看趋势 Charts.line+热门直播榜。`,
   '混合主题:leads/community/opc-services=light, opc-community/opc-live=dark。'],

  ['ops', `
1) operations-center.html (浅色) 运营中心:五类收入结构看板——KPI(年度收入合计(revenueTypes.amount求和)/目标完成度/客户数/任务包订单数);五类收入占比饼 Charts.pie(DB.revenueTypes) + 目标完成度(每类 amount/target progressRing或bar);近12月收入趋势 Charts.line stack(DB.revenueTrend);运营健康度六指标 Charts.radar(DB.healthMetrics name/score)+各指标卡(带trend涨跌);收入结构说明卡(五类收入desc)。
2) operations-ledger.html (浅色) 客户·订单台账:UI.tabs【托管客户】DB.managedClients表【订阅账号】DB.subscriptions表【任务包订单】DB.taskOrders表;每个表带筛选与行点drawer;KPI(托管客户/订阅数/任务包订单/合计金额);客户类型分布+续约率。
3) implementation-plan.html (浅色) 五个月实施计划:Charts.gantt(DB.phases)主图;5阶段卡片(DB.phases:阶段/月份/重点任务/主要成果/状态徽章/进度bar)时间线展示;整体进度KPI(总进度/已完成阶段/进行中);里程碑列表。严格用 DB.phases 文案(来自需求文档表1)。
4) competitive-analysis.html (浅色) 竞品对标:核心能力对比雷达 Charts.radar(DB.competitors 4家 cap[5] + DB.capDims，legend);竞品卡片(DB.competitors:名称/标签/核心优势/核心短板/适配契合度);分层功能架构对比(DB.competitorArch 三校,各自表格[层级/核心模块/功能细节]);差异化启示卡(我校拟建:统一数据底座+AI+国资深度融合)。严格依据 DB 数据(来自需求文档附录)。`,
   '四页 light。implementation/competitive 严格用 DB 文案。'],

  ['sys', `
1) notifications.html (浅色) 通知·待办中心:UI.tabs或筛选(全部/未读/预警/任务/工单);通知列表 DB.notifications(级别灯/类型徽章/标题/描述/时间/已读态),"标记已读"toast;KPI(未读/预警/待办任务);按类型分布。
2) login.html (深色) 品牌登录门户:全屏居中登录卡——左侧品牌区(武大盾形+平台名+一句话定位+1+1+3+N简介+科技感背景);右侧登录表单(用户名/密码/记住我/登录按钮→点击 location.href='index.html');底部版权"武汉大学资产经营投资管理有限责任公司"。此页不需要 wuda-view/shell(它是独立落地页)——但仍可加载theme.css；不要 data-page;不引入 shell.js(避免出现侧栏)。用纯深色科技背景。
3) _design-system.html (浅色, 但提供深浅切换) 设计系统+组件库画廊:展示双皮肤色板(深色/浅色token色卡)、字体、圆角阴影;然后逐个渲染共享组件活样例:UI.kpi、UI.panel、按钮.btn系列、UI.tag全色、UI.light三灯、.chip、UI.table(小样)、UI.timeline、UI.rankList、UI.entityCard、各类Charts(line/bar/pie/radar/gauge/funnel/scatter/graph/sankey/treemap/gantt/waterfall 各一个小样)、UI.drawer/UI.modal/UI.toast触发按钮;顶部一个"切换深/浅皮肤"按钮(document.body.setAttribute('data-theme',...))。`,
   'notifications=light, login=dark(无shell), _design-system=light含切换。login.html特殊:不要 <main class="wuda-view"> 也不要 shell.js。'],
]

const MISSING=['proj','ent','post','parkact','leadsopc','ops','sys']
const results = await parallel(GROUPS.filter(g=>MISSING.includes(g[0])).map(g => () => agentFor(g[0], g[1], g[2])))

return { groups: GROUPS.map(g=>g[0]), results: results.filter(Boolean) }
