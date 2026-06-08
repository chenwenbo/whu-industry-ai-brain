/* ==========================================================================
   武汉大学产业创新AI智脑平台 — 统一假数据 data.js  (window.DB)
   按 8 类数据域组织；结合武大5大优势学科 + 武汉地标 + 湖北行政区划
   所有数值采用确定性生成(seeded)，刷新稳定，便于演示
   ========================================================================== */
(function(){
  // 确定性伪随机
  let _seed = 20260608;
  function rnd(){ _seed=(_seed*9301+49297)%233280; return _seed/233280; }
  function ri(a,b){ return Math.floor(rnd()*(b-a+1))+a; }
  function pick(arr){ return arr[Math.floor(rnd()*arr.length)]; }
  function picks(arr,n){ const c=[...arr],o=[]; while(o.length<n&&c.length){o.push(c.splice(Math.floor(rnd()*c.length),1)[0]);} return o; }
  function seq(n,f){ return Array.from({length:n},(_,i)=>f(i)); }
  function pad(n){ return String(n).padStart(3,'0'); }

  // ---- 学科 / 学院 ----
  const disciplines = [
    {id:'ai', name:'人工智能', icon:'<i data-lucide="brain"></i>', color:'#2f6bff', colleges:['计算机学院','人工智能学院','国家网络安全学院'], desc:'大模型、智能体、计算机视觉、智能感知'},
    {id:'robot', name:'机器人', icon:'<i data-lucide="bot"></i>', color:'#13b6c9', colleges:['动力与机械学院','工业科学研究院'], desc:'特种机器人、人形机器人、智能装备、运动控制'},
    {id:'bio', name:'生物医药', icon:'<i data-lucide="dna"></i>', color:'#0fa37f', colleges:['生命科学学院','医学部','药学院','人民医院'], desc:'创新药、医疗器械、合成生物、基因治疗'},
    {id:'chip', name:'半导体·光芯片', icon:'<i data-lucide="cpu"></i>', color:'#d8932a', colleges:['物理科学与技术学院','电子信息学院','微电子学院'], desc:'硅光集成、化合物半导体、传感芯片、光电器件'},
    {id:'geo', name:'空间信息·测绘遥感', icon:'<i data-lucide="satellite"></i>', color:'#6d5bd0', colleges:['测绘学院','遥感信息工程学院','测绘遥感信息工程国家重点实验室'], desc:'北斗导航、卫星遥感、智慧城市、地理信息'},
  ];
  const allColleges = ['计算机学院','人工智能学院','国家网络安全学院','动力与机械学院','工业科学研究院','生命科学学院','医学部','药学院','物理科学与技术学院','电子信息学院','微电子学院','测绘学院','遥感信息工程学院','化学与分子科学学院','资源与环境科学学院','水利水电学院'];

  // ---- 城市 / 区域 ----
  const hubeiCities = ['武汉市','襄阳市','宜昌市','黄石市','十堰市','荆州市','孝感市','黄冈市','咸宁市','鄂州市','荆门市','随州市','恩施州'];
  const wuhanDistricts = ['东湖高新区','武汉经开区','江夏区','洪山区','武昌区','江岸区','硚口区','汉阳区','青山区','东西湖区'];

  const surnames='王李张刘陈杨黄赵周吴徐孙马朱胡郭何高林郑谢罗梁宋唐许韩冯邓曹彭曾'.split('');
  const givens='伟强磊洋勇军杰涛明超刚平辉鹏华健飞鑫波斌宇浩晨睿志远嘉博文翔楠'.split('');
  function person(){ return pick(surnames)+pick(givens)+(rnd()>.6?pick(givens):''); }

  // =====================================================================
  // 1. 成果与专利域
  // =====================================================================
  const achTitles = {
    ai:['面向工业质检的轻量化视觉大模型','多模态遥感解译智能体框架','低功耗端侧推理加速引擎','政务领域可信问答大模型','自动驾驶多传感融合算法'],
    robot:['面向电力巡检的四足机器人','柔性协作机械臂力控系统','人形机器人全身运动控制','水下管道检测机器人','智能仓储分拣机器人集群'],
    bio:['新型靶向抗肿瘤小分子药物','可降解血管支架材料','基于合成生物的高值化合物','便携式分子诊断POCT平台','基因编辑递送载体技术'],
    chip:['硅基光电子集成芯片','宽禁带功率半导体器件','高灵敏MEMS气体传感芯片','面向AI的存算一体芯片','激光雷达专用光电探测器'],
    geo:['北斗高精度室内外无缝定位','高分辨率卫星影像智能解译','城市级实景三维建模系统','低空无人机遥感监测平台','时空大数据智能分析引擎'],
  };
  const trlStages=[3,4,5,6,7,8];
  const convStatus=['待评估','已立项','概念验证','中试放大','已签约','已转化'];
  const achievements = [];
  disciplines.forEach(d=>{
    const titles=achTitles[d.id];
    const base = d.id==='ai'?16:d.id==='geo'?14:d.id==='bio'?13:d.id==='chip'?12:9;
    seq(base,i=>{
      const t = i<titles.length?titles[i]:titles[i%titles.length]+`（V${Math.floor(i/titles.length)+1}）`;
      const trl=pick(trlStages);
      const college=pick(d.colleges);
      achievements.push({
        id:'ACH-'+d.id.toUpperCase()+'-'+pad(i+1),
        title:t, discipline:d.id, disciplineName:d.name, college,
        leader:person()+(rnd()>.5?' 教授':' 研究员'), trl,
        patents:ri(2,28), papers:ri(3,40), maturity:ri(40,95),
        status:pick(convStatus), value:ri(80,4800), // 万元 估值
        match:ri(55,98), // 场景匹配度
        scenes:picks(['智能制造','智慧城市','医疗健康','能源电力','现代农业','商业航天','低空经济','智能网联汽车'],ri(2,4)),
        year:ri(2021,2025), updated:ri(1,30)+'天前',
        desc:`围绕${d.desc}方向，${t}已形成核心专利与原型，具备向产业转化的技术基础。`,
      });
    });
  });

  const teams = seq(26,i=>{
    const d=pick(disciplines);
    return {
      id:'TEAM-'+pad(i+1), name:person()+'教授团队', pi:person()+' 教授',
      discipline:d.id, disciplineName:d.name, college:pick(d.colleges),
      members:ri(6,38), achievements:ri(3,22), patents:ri(8,86),
      transferred:ri(0,9), demand:ri(1,6),
      field:d.desc.split('、')[ri(0,3)], rank:pick(['国家级','省部级','校级重点']),
      desc:`聚焦${d.name}方向，承担国家级项目多项，具备较强成果转化潜力。`,
    };
  });

  // =====================================================================
  // 2. 企业域（孵化/参股/校属/校友）
  // =====================================================================
  const entPrefix=['珞珈','东湖','光谷','武大','启明','星河','智测','慧芯','远景','卓越','中科','华工','格物','创远','北斗','寰宇'];
  const entSuffix={ai:'智能科技',robot:'机器人',bio:'生物医药',chip:'光电科技',geo:'空间信息'};
  const entType=['孵化企业','参股企业','校属企业','校友企业'];
  const riskLevel=[{k:'g',t:'正常'},{k:'g',t:'正常'},{k:'g',t:'正常'},{k:'y',t:'关注'},{k:'y',t:'关注'},{k:'r',t:'预警'}];
  const enterprises = seq(64,i=>{
    const d=pick(disciplines);
    const type=pick(entType);
    const r=pick(riskLevel);
    const stage=pick(['初创期','成长期','成长期','扩张期','成熟期']);
    return {
      id:'ENT-'+pad(i+1),
      name:pick(entPrefix)+entSuffix[d.id]+(rnd()>.5?'有限公司':'（武汉）有限公司'),
      type, discipline:d.id, disciplineName:d.name, stage,
      city:rnd()>.3?'武汉市':pick(hubeiCities), district:pick(wuhanDistricts),
      founded:ri(2015,2024), reg:ri(100,5000), // 注册资本万
      equity:type==='参股企业'||type==='校属企业'?ri(5,35):0, // 学校/资产公司持股%
      revenue:ri(200,28000), revGrowth:ri(-12,140), employees:ri(8,460),
      valuation:ri(2000,180000), // 估值万
      financingRound:pick(['天使轮','Pre-A','A轮','A+轮','B轮','未融资']),
      risk:r.k, riskText:r.t, score:ri(58,96),
      park:'', founder:person(), patents:ri(2,120),
      tags:picks(['专精特新','高新技术企业','瞪羚企业','武大校友','国家级孵化','省级专精特新','院士团队'],ri(1,3)),
      desc:`${d.name}领域${stage}企业，主营${d.desc.split('、')[0]}相关产品与解决方案。`,
    };
  });

  // 融资记录
  const financings = [];
  enterprises.filter(e=>e.financingRound!=='未融资').slice(0,30).forEach(e=>{
    const n=ri(1,3);
    seq(n,j=>financings.push({
      ent:e.name, entId:e.id, round:['天使轮','Pre-A','A轮','B轮'][j]||'战略融资',
      amount:ri(300,9000), date:(2021+j)+'-0'+ri(1,9), investor:pick(['光谷创投','东湖资本','武大科创基金','中科创星','深创投','湖北高投','达晨财智']),
    }));
  });

  // 投后跟踪 / 风险预警
  const postInvest = enterprises.filter(e=>e.equity>0).map(e=>({
    entId:e.id, ent:e.name, equity:e.equity, bookValue:Math.round(e.valuation*e.equity/100),
    stage:pick(['投后稳定','重点跟踪','拟退出','增资扩股']), risk:e.risk, riskText:e.riskText,
    lastReport:ri(1,6)+'个月前', kpi:ri(60,98),
    alerts: e.risk==='r'?['营收连续两季度下滑','核心团队变动']:e.risk==='y'?['现金流偏紧']:[],
  }));
  const riskAlerts = postInvest.filter(p=>p.risk!=='g').flatMap(p=>p.alerts.map((a,i)=>({
    id:'RA-'+p.entId+'-'+i, ent:p.ent, entId:p.entId, level:p.risk, type:pick(['经营风险','财务风险','团队风险','市场风险','合规风险']),
    desc:a, date:'2026-0'+ri(1,6)+'-'+ri(10,28), status:pick(['待处理','跟进中','已处理']),
  })));

  // 基金 / 资本协同
  const funds = seq(8,i=>({
    id:'FUND-'+pad(i+1), name:pick(['武大科创天使基金','东湖产业引导基金','光谷硬科技基金','珞珈成果转化基金','楚天凤鸣种子基金','湖北高质量发展基金','中科武大联合基金','长江产业基金'])+(i>5?' II期':''),
    scale:ri(2,30)*10000/1000, // 亿
    focus:picks(disciplines.map(d=>d.name),ri(2,3)), stage:pick(['种子/天使','早期VC','成长期PE','并购']),
    invested:ri(4,26), reserved:ri(20,60),
  }));

  // =====================================================================
  // 3. 园区与载体域
  // =====================================================================
  const parks = [
    {id:'PARK-001',name:'武汉大学科技园（主园区）',type:'大学科技园',addr:'东湖高新区珞瑜路',area:18.6,occupancy:92,buildings:6,ents:128,services:42,revenue:6800,level:'国家级'},
    {id:'PARK-002',name:'武汉大学·光谷创意产业园',type:'创意孵化园',addr:'东湖高新区关山大道',area:9.2,occupancy:86,buildings:4,ents:96,services:31,revenue:3200,level:'省级'},
    {id:'PARK-003',name:'珞珈山·人工智能孵化器',type:'专业孵化器',addr:'洪山区珞珈山街道',area:3.4,occupancy:78,buildings:2,ents:54,services:26,revenue:1500,level:'国家级'},
    {id:'PARK-004',name:'东湖·生物医药加速器',type:'专业加速器',addr:'东湖高新区高新大道',area:5.8,occupancy:81,buildings:3,ents:38,services:22,revenue:2100,level:'省级'},
    {id:'PARK-005',name:'空天信息产业创新中心',type:'专业孵化器',addr:'武汉经开区军山新城',area:4.1,occupancy:69,buildings:2,ents:29,services:18,revenue:980,level:'市级'},
    {id:'PARK-006',name:'武大·襄阳产业创新研究院',type:'异地协同载体',addr:'襄阳市高新区',area:6.5,occupancy:64,buildings:3,ents:24,services:15,revenue:1200,level:'市级'},
  ];
  // 给企业分配园区
  enterprises.forEach((e,i)=>{ e.park = parks[i%parks.length].name; e.parkId=parks[i%parks.length].id; });

  const spaceUnits = [];
  parks.forEach(p=>{ seq(ri(8,14),i=>spaceUnits.push({
    park:p.id, unit:p.name.slice(0,2)+'-'+pick(['A','B','C'])+(100+i), area:ri(60,420),
    status:pick(['已入驻','已入驻','已入驻','可租赁','装修中']), ent:rnd()>.3?pick(enterprises).name:'—', rent:ri(60,140),
  })); });

  const tickets = seq(34,i=>({
    id:'WO-'+pad(i+1), park:pick(parks).name, type:pick(['工商注册','政策申报','知识产权','人才招聘','投融资对接','法律咨询','场地报修','财税服务']),
    ent:pick(enterprises).name, level:pick(['普通','普通','紧急','加急']), sla:ri(-2,72), // 剩余小时
    status:pick(['待受理','处理中','处理中','已完成','已完成']), owner:person(), created:ri(1,20)+'天前',
  }));
  const onboarding = seq(12,i=>({
    id:'IN-'+pad(i+1), ent:pick(entPrefix)+pick(['智能','光电','生物','空间'])+'科技', park:pick(parks).name,
    discipline:pick(disciplines).name, step:pick(['资料初审','尽职调查','入驻评审','协议签署','已入驻']),
    progress:ri(20,100), area:ri(80,360), applied:ri(1,30)+'天前',
  }));

  // =====================================================================
  // 4. 活动与赛事 / 线索 / 社群域
  // =====================================================================
  const actTypes=['训练营','创新赛事','投融资对接会','科学家—企业家交流会','大咖直播','政策宣讲'];
  const activities = seq(30,i=>{
    const t=pick(actTypes); const m=ri(1,6);
    return {
      id:'ACT-'+pad(i+1), name:({'训练营':'珞珈产业创新训练营','创新赛事':'东湖杯科技成果转化大赛','投融资对接会':'光谷硬科技投融资对接会','科学家—企业家交流会':'科学家·企业家珞珈对话','大咖直播':'珞珈创新大讲堂直播','政策宣讲':'惠企政策直通车'}[t])+`·第${ri(1,12)}期`,
      type:t, date:'2026-0'+m+'-'+ri(1,28), discipline:pick(disciplines).name,
      enroll:ri(30,520), checkin:ri(20,460), leads:ri(2,46), projects:ri(0,12),
      status:m<=6?pick(['筹备中','报名中','已结束','已结束']):'筹备中', venue:rnd()>.4?'线上':pick(parks).name,
      guests:picks(['院士','教授','投资人','龙头企业CTO','政府部门','创业导师'],ri(2,4)),
    };
  });
  const customerLeads = seq(40,i=>({
    id:'LC-'+pad(i+1), name:pick(['湖北','武汉','光谷','东湖'])+pick(['高投','产投','控股','开发区管委会','龙头企业','研究院','商会'])+(rnd()>.5?'招商部':'创新部'),
    contact:person(), type:pick(['政府/园区','龙头企业','投资机构','行业协会','地方研究院']),
    intent:pick(['托管运营','平台订阅','任务包采购','专业服务','投资协同']),
    value:ri(20,600), stage:pick(['初步接触','需求确认','方案沟通','商务谈判','已签约']), source:pick(activities).name, owner:person(),
  }));
  const projectLeads = seq(30,i=>({
    id:'LP-'+pad(i+1), name:pick(achievements).title.slice(0,12)+'转化项目',
    discipline:pick(disciplines).name, team:person()+'团队', stage:pick(['线索','初筛','尽调','拟立项','已入池']),
    score:ri(55,95), source:pick(activities).name, value:ri(100,3000), owner:person(),
  }));
  const communities = seq(6,i=>({
    name:pick(['珞珈AI创业社群','光谷生物医药圈','空天信息产业群','硬科技投资人俱乐部','武大校友创业营','机器人产业联盟']),
    members:ri(180,2400), active:ri(40,86), posts:ri(20,260), events:ri(2,18),
  }));

  // =====================================================================
  // 5. OPC 线上社区 / 虚拟孵化域
  // =====================================================================
  const opcProjects = seq(18,i=>{
    const d=pick(disciplines);
    return {
      id:'OPC-'+pad(i+1), name:pick(entPrefix)+pick(['智','芯','测','医','创','云'])+pick(['计划','项目','工坊','实验室']),
      discipline:d.id, disciplineName:d.name, stage:pick(['招募中','陪跑中','陪跑中','路演期','已毕业']),
      progress:ri(15,100), mentor:person()+' 导师', members:ri(2,9), tasks:ri(4,16), tasksDone:ri(1,12),
      funding:rnd()>.5?'寻求天使':rnd()>.5?'已获种子':'自筹', views:ri(120,3600),
      desc:`${d.name}方向线上孵化项目，${d.desc.split('、')[0]}场景，正在进行虚拟陪跑。`,
    };
  });
  const experts = seq(16,i=>({
    id:'EXP-'+pad(i+1), name:person()+pick([' 教授',' 研究员',' 合伙人',' 总经理']),
    field:pick(disciplines).name, role:pick(['技术导师','创业导师','投资导师','产业导师','法务/IP导师']),
    org:pick(['武汉大学','光谷创投','头部律所','龙头企业','地方研究院']), sessions:ri(4,68), rating:(4+rnd()).toFixed(1),
  }));
  const lives = seq(8,i=>({
    id:'LIVE-'+pad(i+1), title:pick(['大模型如何重塑产业','从实验室到生产线','硬科技投资逻辑拆解','合成生物的产业机会','北斗+遥感的商业化','光芯片产业全景']),
    host:person()+' 教授', date:'2026-0'+ri(1,6)+'-'+ri(1,28), status:pick(['预告','回放','回放','直播中']),
    views:ri(800,42000), likes:ri(100,5600),
  }));
  const opcServices = [
    {id:'SVC-01',name:'成果成熟度评估包',cat:'成果项目化',price:1.2,unit:'项',sales:46,desc:'TRL评估+技术尽调+转化路径建议'},
    {id:'SVC-02',name:'商业计划书生成包',cat:'成果项目化',price:0.8,unit:'份',sales:62,desc:'AI辅助BP撰写+路演材料'},
    {id:'SVC-03',name:'企业画像深度报告',cat:'企业服务',price:1.5,unit:'家',sales:38,desc:'一企一档+对标分析+风险评估'},
    {id:'SVC-04',name:'产业赛道分析包',cat:'产业分析',price:3.6,unit:'个',sales:24,desc:'赛道研判+图谱+目标企业清单'},
    {id:'SVC-05',name:'知识产权布局服务',cat:'专业服务',price:2.2,unit:'项',sales:31,desc:'专利导航+布局策略+申报代理'},
    {id:'SVC-06',name:'政策申报代理包',cat:'专业服务',price:1.0,unit:'项',sales:54,desc:'政策匹配+材料撰写+全程跟踪'},
    {id:'SVC-07',name:'投融资对接服务',cat:'资本协同',price:5.0,unit:'次',sales:18,desc:'BP打磨+资方撮合+路演陪练'},
    {id:'SVC-08',name:'训练营席位',cat:'活动运营',price:0.5,unit:'人',sales:120,desc:'产业创新训练营标准席位'},
  ];

  // =====================================================================
  // 6. 数据资产底座域（元数据）
  // =====================================================================
  const dataDomains = [
    {id:1,name:'成果与专利',color:'var(--dom-1)',tables:38,records:420,health:95,freq:'日更',owner:'科学技术发展研究院',sensitive:'内部',updated:'2小时前',status:'正常'},
    {id:2,name:'学院与团队',color:'var(--dom-2)',tables:22,records:68,health:93,freq:'周更',owner:'人事部/科研院',sensitive:'内部',updated:'1天前',status:'正常'},
    {id:3,name:'研究院与平台',color:'var(--dom-3)',tables:18,records:45,health:88,freq:'周更',owner:'发展规划与学科建设处',sensitive:'内部',updated:'3天前',status:'同步中'},
    {id:4,name:'科技园与创意园',color:'var(--dom-4)',tables:15,records:32,health:91,freq:'日更',owner:'资产管理公司',sensitive:'内部',updated:'4小时前',status:'正常'},
    {id:5,name:'参股/校属企业',color:'var(--dom-5)',tables:26,records:120,health:94,freq:'日更',owner:'资产管理公司',sensitive:'受限',updated:'1小时前',status:'正常'},
    {id:6,name:'活动与赛事',color:'var(--dom-6)',tables:20,records:56,health:86,freq:'实时',owner:'资产管理公司',sensitive:'公开',updated:'12分钟前',status:'同步中'},
    {id:7,name:'校友企业',color:'var(--dom-7)',tables:31,records:310,health:90,freq:'月更',owner:'校友总会/资产公司',sensitive:'内部',updated:'6天前',status:'正常'},
    {id:8,name:'产业企业与园区',color:'var(--dom-8)',tables:86,records:809,health:92,freq:'日更',owner:'资产管理公司',sensitive:'内部',updated:'30分钟前',status:'正常'},
  ];
  const assetTblNames={1:['发明专利基础信息表','科技成果登记表','技术合同台账','软件著作权表','论文成果表'],2:['学院基础信息表','科研团队表','人才信息表','导师信息表'],3:['研究院信息表','重点实验室表','创新平台表'],4:['园区基础表','楼宇空间表','入驻企业表','服务事项表'],5:['参股企业台账','股权结构表','经营指标表','投后跟踪表'],6:['活动台账','报名记录表','嘉宾信息表','线索记录表'],7:['校友企业表','校友信息表','校友融资表'],8:['产业企业库','工商信息表','产业链图谱表','园区分布表']};
  const dataAssets=[];
  dataDomains.forEach(d=>{(assetTblNames[d.id]||['核心数据表']).forEach((nm,j)=>{
    dataAssets.push({id:'DS-'+pad(d.id)+pad(j+1),name:nm,domain:d.name,domainId:d.id,fields:ri(12,68),records:ri(2,86)+'万',freq:d.freq,updated:d.updated,owner:d.owner,status:pick(['正常','正常','正常','同步中']),health:ri(82,98),sensitive:d.sensitive});
  });});
  const lineage = [
    {from:'学院与团队',to:'成果与专利',rel:'第一发明人关联'},
    {from:'成果与专利',to:'参股/校属企业',rel:'技术作价入股'},
    {from:'校友企业',to:'产业企业与园区',rel:'工商主体匹配'},
    {from:'参股/校属企业',to:'科技园与创意园',rel:'入驻关联'},
    {from:'活动与赛事',to:'参股/校属企业',rel:'线索转化'},
    {from:'产业企业与园区',to:'成果与专利',rel:'需求牵引'},
    {from:'研究院与平台',to:'成果与专利',rel:'成果产出'},
  ];
  const qualityIssues = seq(16,i=>({
    id:'GV-'+pad(i+1), domain:pick(dataDomains).name, type:pick(['缺失值','重复记录','格式错误','逻辑冲突','更新超期']),
    asset:pick(dataAssets).name, count:ri(20,2400), level:pick(['高','中','中','低']), date:'2026-0'+ri(1,6)+'-'+ri(1,28),
    owner:pick(['资产管理公司','科技发展研究院','各学院']), status:pick(['待处理','处理中','已解决']),
  }));
  const syncTasks = seq(10,i=>({
    name:pick(dataAssets).name+'同步', domain:pick(dataDomains).name, status:pick(['运行中','成功','成功','成功','失败']),
    duration:ri(2,180)+'s', records:ri(100,86000), time:ri(1,120)+'分钟前',
  }));

  // =====================================================================
  // 7. 产业创新大脑 / AI 域
  // =====================================================================
  const tracks = [
    {name:'具身智能与人形机器人',disc:'robot',market:3200,growth:48,fit:88,heat:96,ents:46,stage:'爆发期'},
    {name:'AI大模型与智能体',disc:'ai',market:8600,growth:62,fit:92,heat:99,ents:120,stage:'爆发期'},
    {name:'硅光与光电集成',disc:'chip',market:1800,growth:35,fit:90,heat:84,ents:38,stage:'成长期'},
    {name:'创新药与合成生物',disc:'bio',market:5400,growth:28,fit:85,heat:80,ents:64,stage:'成长期'},
    {name:'商业航天与卫星遥感',disc:'geo',market:2600,growth:41,fit:91,heat:88,ents:42,stage:'成长期'},
    {name:'低空经济与无人系统',disc:'geo',market:2100,growth:55,fit:82,heat:90,ents:36,stage:'爆发期'},
    {name:'第三代半导体功率器件',disc:'chip',market:1500,growth:32,fit:78,heat:76,ents:28,stage:'成长期'},
    {name:'医疗器械与高端诊断',disc:'bio',market:3800,growth:24,fit:80,heat:72,ents:52,stage:'成熟期'},
    {name:'智能网联与自动驾驶',disc:'ai',market:4200,growth:38,fit:84,heat:85,ents:58,stage:'成长期'},
    {name:'空间智能与时空大数据',disc:'geo',market:1900,growth:44,fit:93,heat:82,ents:31,stage:'成长期'},
  ];
  const targetEnterprises = seq(20,i=>{
    const d=pick(disciplines);
    return {name:pick(['华为','中信科','长飞','烽火','人福医药','高德红外','光迅科技','逸飞激光','库柏特','奕斯伟'])+(rnd()>.5?'·相关业务':''),
      disc:d.id, discName:d.name, match:ri(70,98), city:pick(hubeiCities), type:pick(['潜在合作','招商目标','并购标的','供应链']),
      revenue:ri(5000,800000), reason:`与武大${d.name}方向技术高度契合`};
  });
  const techRoutes = {
    name:'硅基光电子集成', children:[
      {name:'材料与工艺',children:[{name:'SOI衬底',val:88},{name:'异质集成',val:76},{name:'薄膜铌酸锂',val:82}]},
      {name:'器件设计',children:[{name:'调制器',val:90},{name:'探测器',val:85},{name:'光源集成',val:72}]},
      {name:'封装测试',children:[{name:'光电co-package',val:68},{name:'晶圆级测试',val:74}]},
    ]
  };
  const hotwords = [['大模型',98],['具身智能',92],['硅光',85],['合成生物',80],['北斗',78],['低空经济',88],['存算一体',70],['人形机器人',90],['卫星遥感',75],['脑机接口',62],['固态电池',66],['量子',58],['AI for Science',84],['数字孪生',72],['第三代半导体',68],['基因治疗',64],['车路云一体',60],['空间计算',56]];
  const policyEvents = seq(12,i=>({
    id:'POL-'+pad(i+1), level:pick(['国家级','省级','市级','光谷']), title:pick(['关于加快培育新质生产力的实施意见','低空经济高质量发展三年行动方案','人工智能产业创新发展专项','生物医药产业链强链补链政策','科技成果转化股权激励办法','专精特新企业培育计划']),
    discipline:pick(disciplines).name, date:'2026-0'+ri(1,6)+'-'+ri(1,28), deadline:rnd()>.5?'2026-0'+ri(7,9)+'-'+ri(1,28):'长期有效',
    match:ri(60,96), status:pick(['可申报','申报中','已截止','长期']),
  }));
  const brainInsights = [
    {tag:'趋势',txt:'近30天「具身智能」相关产业事件环比上升 42%，建议优先布局人形机器人零部件赛道。',level:'high'},
    {tag:'赛道',txt:'AI大模型与智能体赛道武大契合度达 92，目标企业池新增 8 家，可启动招商对接。',level:'high'},
    {tag:'风险',txt:'2 家参股企业触发营收下滑预警，建议技术经理人介入投后辅导。',level:'warn'},
    {tag:'政策',txt:'湖北省低空经济三年行动方案发布，匹配学校 6 项成果，存在申报窗口。',level:'high'},
    {tag:'成果',txt:'硅基光电子集成芯片成熟度评估完成，TRL 提升至 7，建议进入项目包装阶段。',level:'normal'},
  ];
  const analysisTasks = seq(8,i=>({
    id:'AT-'+pad(i+1), title:pick(['人形机器人产业趋势研判','硅光赛道目标企业识别','生物医药成果项目化评估','低空经济区域布局分析','参股企业风险扫描','大模型技术路线判断']),
    role:pick(['AI分析师','AI技术经理人','AI投资人']), status:pick(['已交付','生成中','已交付','已复用']),
    time:ri(1,48)+'小时前', owner:person(),
  }));

  // AI 任务包(单一真源)
  const aiTaskTypes={
    'AI分析师':['产业趋势研判','赛道清单生成','产业图谱构建','目标企业识别'],
    'AI技术经理人':['成果画像生成','场景匹配分析','转化路径规划','项目BP包装','路演材料生成'],
    'AI投资人':['企业投资研判','估值区间测算','投后风险扫描','尽调要点生成'],
  };
  const aiTasks = [];
  Object.keys(aiTaskTypes).forEach(role=>{aiTaskTypes[role].forEach((t,j)=>{
    aiTasks.push({id:'TASK-'+role.slice(2,4)+pad(j+1),title:t,role,status:pick(['已交付','已交付','生成中','待生成','已复用']),
      created:ri(1,30)+'天前',duration:ri(2,18)+'分钟',billing:pick(['任务包','订阅内','专项服务']),value:(rnd()*4+0.5).toFixed(1),
      sources:picks(dataDomains.map(d=>d.name),ri(2,4))});
  });});
  const prompts=['分析XX产业未来三年趋势并给出武大布局建议','为XX成果生成商业计划书要点','识别XX赛道湖北区域目标企业清单','评估XX企业投资价值与风险','生成XX技术的转化路径图'];

  // =====================================================================
  // 8. 运营 / 实施 / 竞品域
  // =====================================================================
  const revenueTypes=[
    {key:'托管运营',color:'#2f6bff',amount:2860,target:3200,desc:'系统建设+数据更新+项目运营+活动组织+驾驶舱维护一体化托管'},
    {key:'平台订阅',color:'#13b6c9',amount:1240,target:1500,desc:'标准版/专业版/权限账号年度订阅'},
    {key:'任务包式AI',color:'#6d5bd0',amount:1680,target:1800,desc:'产业分析/成果项目化/企业画像/招商识别任务包'},
    {key:'专业服务',color:'#d8932a',amount:960,target:1200,desc:'成果项目化/企业辅导/训练营/IP与政策服务'},
    {key:'投资协同',color:'#0fa37f',amount:520,target:800,desc:'服务换股/投资协同/基金联动(中长期)'},
  ];
  const revenueTrend = seq(12,i=>({
    month:(i+1)+'月',
    托管运营:Math.round(revenueTypes[0].amount/12*(0.6+i*0.07)),
    平台订阅:Math.round(revenueTypes[1].amount/12*(0.7+i*0.05)),
    任务包式AI:Math.round(revenueTypes[2].amount/12*(0.5+i*0.09)),
    专业服务:Math.round(revenueTypes[3].amount/12*(0.8+i*0.04)),
    投资协同:Math.round(revenueTypes[4].amount/12*(0.3+i*0.12)),
  }));
  const managedClients = seq(14,i=>({
    id:'MC-'+pad(i+1), name:pick(['襄阳高新区','宜昌生物产业园','黄石科技城','光谷东产业园','咸宁创新中心','随州专汽产业园'])+(i>5?'(二期)':''),
    type:pick(['地方政府','园区','研究院','合作平台']), plan:pick(['旗舰托管','标准托管','专业版订阅']),
    amount:ri(80,460), since:(2024+ri(0,2))+'年', status:pick(['服务中','服务中','续约中','洽谈中']), renew:ri(60,100),
  }));
  const subscriptions = seq(18,i=>({
    id:'SUB-'+pad(i+1), name:pick(['XX学院二级平台','XX地方园区','XX研究院','XX服务机构','XX商会'])+pad(i+1),
    edition:pick(['标准版','专业版','权限账号']), accounts:ri(3,50), amount:ri(5,80), expire:'2026-'+ri(7,12)+'-'+ri(1,28), status:pick(['生效','生效','即将到期']),
  }));
  const taskOrders = aiTasks.filter(t=>t.billing==='任务包').map((t,i)=>({
    id:'ORD-'+pad(i+1), task:t.title, client:pick(managedClients).name, amount:t.value, status:pick(['已交付','交付中','已结算']), date:'2026-0'+ri(1,6)+'-'+ri(1,28),
  }));
  const healthMetrics = [
    {name:'数据更新',score:92,trend:'+3'},{name:'项目导入',score:78,trend:'+8'},{name:'活动活跃',score:85,trend:'+5'},
    {name:'社群活跃',score:73,trend:'-2'},{name:'服务交付',score:88,trend:'+4'},{name:'市场化收入',score:81,trend:'+12'},
  ];
  const phases = [
    {phase:'第一阶段',month:'第1个月',start:0,len:1,tasks:'围绕学校战略、资产管理公司场景和现有平台情况开展调研，完成方案定稿、边界梳理、数据口径统一和组织机制建立。',deliver:'立项汇报稿、需求清单、数据目录、组织机制',status:'已完成',progress:100},
    {phase:'第二阶段',month:'第2个月',start:1,len:1,tasks:'完成成果、企业、园区、股权、活动、校友和产业数据底座梳理，形成统一台账和驾驶舱指标体系。',deliver:'数据标准、核心台账、驾驶舱指标口径',status:'已完成',progress:100},
    {phase:'第三阶段',month:'第3个月',start:2,len:1,tasks:'完成产业创新大脑原型、资产管理公司大屏、成果项目化模块、企业画像与检索模块开发。',deliver:'原型系统、企业画像工具、初版大屏',status:'进行中',progress:62},
    {phase:'第四阶段',month:'第4个月',start:3,len:1,tasks:'完成AI分析师、AI技术经理人、AI投资人三个核心角色模块及园区企业管理、活动归口、OPC社区模块开发。',deliver:'测试版平台、智能体初版、活动与社区模块',status:'未开始',progress:0},
    {phase:'第五阶段',month:'第5个月',start:4,len:1,tasks:'完成联调测试、试运行、重点项目导入、市场化运营方案落地、第三方运营团队或机制确定、验收与迭代清单。',deliver:'试运行报告、运营方案、验收材料、二期建议',status:'未开始',progress:0},
  ];
  const competitors = [
    {name:'清华大学',tag:'体系化标杆',cap:[95,78,85,92,80],strength:'体系化成熟、AI与转化深度融合、收益激励强',weak:'中试孵化资源相对分散，区域产业协同需强化',fit:'高（可借鉴AI+转化融合经验）'},
    {name:'浙江大学',tag:'全链条标杆',cap:[82,95,72,80,75],strength:'全链条闭环、中试孵化能力突出、生态完善',weak:'统一AI智能中枢建设不足，产业研判智能化待提升',fit:'高（可补齐中试孵化短板）'},
    {name:'上海交通大学',tag:'AI赋能标杆',cap:[88,80,95,85,82],strength:'AI风控/决策突出、流程规范化、智能化程度高',weak:'全链条转化服务（含中试）覆盖不够全面',fit:'高（可强化AI风控与流程规范）'},
    {name:'我校（拟建）',tag:'后发领跑',cap:[85,85,88,95,96],strength:'统一数据底座+AI+国资深度融合、适配武大校情、后发领跑',weak:'需快速补齐全链条转化能力，强化行业专属AI模型',fit:'整合三者优势，打造"武大特色"'},
  ];
  const capDims=['体系化成熟度','全链条转化','AI风控/决策','统一数据底座','国资深度融合'];

  // 竞品分层功能架构(用于对比表)
  const competitorArch = {
    清华大学:[['数据层','统一成果/企业/国资数据库','整合全校专利、科研项目、转化成果、在投企业数据'],['能力层','产业AI大脑、智能评估、供需匹配','AI产业研判、成果价值评估、企业成果匹配、基金对接'],['业务层','全流程转化管理、国资监管','成果披露至作价投资、收益分配、国资穿透监管'],['运营层','三级协同架构','校级领导小组+技转院+30院系协同']],
    浙江大学:[['需求层','产业需求挖掘与对接','深入园区龙头企业捕捉真实技术需求'],['转化层','概念验证、中试熟化、虚拟孵化','技术验证+中试场地+设备支持'],['培育层','企业梯度培育、创业孵化','分阶段培育+校友资源+产业基金'],['生态层','专利开放许可、联合创新中心','开放专利赋能+36个联合创新中心']],
    上海交通大学:[['智能层','产业AI大脑、企业智能画像','产业趋势报告+企业精准画像'],['业务层','供需匹配、AI风控、合同智能审查','自动匹配+合规风险识别+合同审查'],['管理层','转化一门式服务、年度报告制度','线上化全流程+规范年报'],['协同层','多部门协同、地方研究院联动','打通科研/国资/财务/法务+20余地方研究院']],
  };

  // ---- 平台动态 / 通知 / 顶层KPI ----
  const platformActivities = [
    {time:'14:32',type:'成果',txt:'物理科学与技术学院《硅基光电子集成芯片》专利完成成熟度评估，估值2400万'},
    {time:'13:08',type:'合作',txt:'武汉东湖高新与人工智能学院签署联合实验室共建协议'},
    {time:'11:45',type:'孵化',txt:'OPC孵化器新入驻机器人方向团队3个'},
    {time:'10:20',type:'数据',txt:'数据底座完成校友企业域数据更新（+1,280条）'},
    {time:'09:36',type:'投资',txt:'珞珈光电科技完成Pre-A轮融资2000万，武大科创基金参投'},
    {time:'昨天',type:'活动',txt:'第8期珞珈产业创新训练营圆满结束，沉淀线索46条'},
    {time:'昨天',type:'预警',txt:'2家参股企业触发经营风险预警，已派单技术经理人跟进'},
  ];
  const notifications = [
    {type:'预警',level:'r',title:'参股企业经营风险预警',desc:'珞珈生物医药营收连续两季度下滑',time:'10分钟前',read:false},
    {type:'任务',level:'y',title:'AI任务待生成',desc:'低空经济区域布局分析等待执行',time:'1小时前',read:false},
    {type:'工单',level:'y',title:'服务工单临近SLA',desc:'光谷创意园政策申报工单剩余2小时',time:'2小时前',read:false},
    {type:'入驻',level:'g',title:'新入驻申请待审',desc:'东湖·生物医药加速器收到3份申请',time:'3小时前',read:true},
    {type:'活动',level:'g',title:'活动报名提醒',desc:'光谷硬科技投融资对接会报名达520人',time:'5小时前',read:true},
    {type:'数据',level:'g',title:'数据同步完成',desc:'产业企业与园区域同步成功(86,000条)',time:'今天',read:true},
  ];

  // 顶层 KPI (首页 + 校级驾驶舱)
  const topKPI = {
    achievements:12860, achGrowth:3.2,
    enterprises:386, entGrowth:5.1,
    partners:1240, partnerGrowth:8.4,
    convAmount:8.6, convGrowth:12.7, // 亿元
    projects:268, incubated:152, equity:64, parks:6, services:15600/1000, activities:128,
  };
  const convFunnel=[
    {name:'产业需求识别',value:2400},{name:'科研组织协同',value:1280},{name:'成果项目化',value:680},
    {name:'企业孵化成长',value:320},{name:'资本协同放大',value:152},
  ];
  const directionScores=[
    {name:'人工智能',scores:[92,88,85,90,86]},{name:'机器人',scores:[84,82,80,86,78]},
    {name:'生物医药',scores:[80,85,82,78,84]},{name:'半导体光芯片',scores:[88,90,86,82,80]},
    {name:'空间信息',scores:[90,86,91,88,93]},
  ];
  const directionDims=['成果储备','团队实力','企业集聚','区域契合','资本关注'];

  // 区域分布(湖北各市州 产业协同强度)
  const regionData = hubeiCities.map((c,i)=>({name:c, value: c==='武汉市'?186: ri(6,68)}));
  const wuhanRegion = wuhanDistricts.map(d=>({name:d, value: d==='东湖高新区'?96:d==='武汉经开区'?52:ri(8,40)}));

  // 校企合作网络图谱
  const coopGraph = {
    nodes:[
      {id:'wuda',name:'武汉大学',cat:0,sym:60},
      ...disciplines.map(d=>({id:d.id,name:d.name,cat:1,sym:38})),
      ...['华为','长飞光纤','烽火通信','人福医药','高德红外','东风汽车','中信科','光迅科技'].map((n,i)=>({id:'c'+i,name:n,cat:2,sym:ri(20,34)})),
      ...['东湖高新区','武汉经开区','襄阳高新区'].map((n,i)=>({id:'p'+i,name:n,cat:3,sym:26})),
    ],
    links:[
      ...disciplines.map(d=>({source:'wuda',target:d.id})),
      {source:'ai',target:'c0'},{source:'chip',target:'c1'},{source:'chip',target:'c2'},{source:'chip',target:'c7'},
      {source:'bio',target:'c3'},{source:'ai',target:'c4'},{source:'robot',target:'c5'},{source:'ai',target:'c6'},
      {source:'c0',target:'p0'},{source:'c1',target:'p0'},{source:'bio',target:'p0'},{source:'geo',target:'p1'},{source:'ai',target:'p2'},
    ],
    cats:['学校','优势学科','龙头企业','产业园区'],
  };

  // 现金流(资产公司驾驶舱)
  const cashflow=[{name:'期初',v:1200},{name:'托管收入',v:2860},{name:'订阅收入',v:1240},{name:'服务收入',v:2640},{name:'运营成本',v:-3100},{name:'人力成本',v:-2200},{name:'期末',v:0}];

  // 股权穿透(treemap/sankey)
  const equityTree = {
    name:'武汉大学', children: disciplines.map(d=>({name:d.name, children: enterprises.filter(e=>e.equity>0&&e.discipline===d.id).slice(0,4).map(e=>({name:e.name.slice(0,8),value:Math.round(e.valuation*e.equity/100)}))}))
  };

  // 暴露
  window.DB = {
    disciplines, allColleges, hubeiCities, wuhanDistricts,
    achievements, teams,
    enterprises, financings, postInvest, riskAlerts, funds,
    parks, spaceUnits, tickets, onboarding,
    activities, customerLeads, projectLeads, communities,
    opcProjects, experts, lives, opcServices,
    dataDomains, dataAssets, lineage, qualityIssues, syncTasks,
    tracks, targetEnterprises, techRoutes, hotwords, policyEvents, brainInsights, analysisTasks, aiTasks, prompts,
    revenueTypes, revenueTrend, managedClients, subscriptions, taskOrders, healthMetrics, phases, competitors, capDims, capDims2:capDims, competitorArch,
    platformActivities, notifications, topKPI, convFunnel, directionScores, directionDims, regionData, wuhanRegion, coopGraph, cashflow, equityTree,
    util:{ri,pick,picks,person},
  };
})();
