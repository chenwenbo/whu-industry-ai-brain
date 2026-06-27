/* ==========================================================================
   武汉大学产业创新AI智脑平台 — 应用外壳 shell.js
   注入顶栏 + 左侧导航 + 全局搜索(⌘K) + 通知中心 + AI助手 + 实时时钟
   每页 <body data-page="xxx" data-theme="dark|light"> ，内容置于 <main class="wuda-view">
   ========================================================================== */
(function(){
  const NAV = [
    {group:'决策分析', items:[
      {p:'data-foundation', t:'数据资产', i:'<i data-lucide="database"></i>', alias:['data-catalog']},
      {p:'cockpit-school', t:'产业驾驶舱', i:'<i data-lucide="satellite"></i>', badge:'大屏'},
    ]},
    {group:'三大AI智能体', items:[
      {p:'ai-workbench', q:'research', t:'AI产业研究院', i:'<i data-lucide="brain"></i>'},
      {p:'ai-workbench', q:'tech', t:'AI技术经理人', i:'<i data-lucide="briefcase"></i>'},
      {p:'ai-workbench', q:'invest', t:'AI投资人', i:'<i data-lucide="trending-up"></i>'},
    ]},
    {group:'七大功能板块', items:[
      {p:'innovation-graph', t:'创新图谱', i:'<i data-lucide="git-fork"></i>'},
      {p:'industry-graph', t:'产业图谱', i:'<i data-lucide="network"></i>'},
      {p:'achievement-library', t:'创新成果', i:'<i data-lucide="microscope"></i>', alias:['achievement-detail','project-pipeline']},
      {p:'enterprise-library', t:'企业管理', i:'<i data-lucide="building-2"></i>', alias:['enterprise-detail','post-investment']},
      {p:'park-list', t:'园区管理', i:'<i data-lucide="building"></i>', alias:['park-detail','cockpit-asset']},
      {p:'opc-services', t:'服务广场', i:'<i data-lucide="shopping-bag"></i>'},
      {p:'activity-calendar', t:'活动与培训', i:'<i data-lucide="calendar"></i>', alias:['activity-detail']},
    ]},
    {group:'系统', items:[
      {p:'notifications', t:'通知·待办中心', i:'<i data-lucide="bell"></i>'},
      {p:'_design-system', t:'设计系统', i:'<i data-lucide="palette"></i>'},
    ]},
  ];

  const cur = document.body.getAttribute('data-page')||'index';
  const curRole = new URLSearchParams(location.search).get('role')||'';
  function isActive(it){
    // 带 role 参数的智能体三项：需同时匹配页面与 role 才高亮
    if(it.q){ return it.p===cur && it.q===curRole; }
    return it.p===cur || (it.alias&&it.alias.includes(cur));
  }

  // ---------- 侧栏 ----------
  const aside=document.createElement('aside');aside.className='wuda-sidebar';
  aside.innerHTML = `
    <div class="side-logo">
      <div class="crest">武</div>
      <div class="txt"><div class="t1">产业创新AI智脑平台</div><div class="t2">WHU INDUSTRY · AI BRAIN</div></div>
    </div>
    <div class="side-scroll">
      ${NAV.map(g=>`<div class="nav-group-title">${g.group}</div>`+g.items.map(it=>`
        <a class="nav-item ${isActive(it)?'active':''}" href="${it.p}.html${it.q?('?role='+it.q):''}">
          <span class="ico">${it.i}</span><span class="lbl">${it.t}</span>${it.badge?`<span class="badge">${it.badge}</span>`:''}
        </a>`).join('')).join('')}
    </div>
    <div class="side-foot"><span>v1.0 · 原型</span><span class="pointer" id="navCollapse">⇔ 折叠</span></div>`;

  // ---------- 顶栏 ----------
  const header=document.createElement('header');header.className='wuda-topbar';
  const unread = (window.DB?DB.notifications.filter(n=>!n.read).length:0);
  header.innerHTML=`
    <div class="tb-search">
      <span class="si"><i data-lucide="search"></i></span>
      <input type="text" id="globalSearch" placeholder="搜索成果 / 企业 / 团队 / 园区 / 数据资产..." readonly>
      <span class="kbd">⌘K</span>
    </div>
    <div class="tb-actions">
      <div class="tb-clock" id="tbClock"></div>
      <div class="tb-btn tb-ai" id="aiBtn" title="AI助手 · 随时唤起对话"><i data-lucide="sparkles"></i><span class="tb-ai-lbl">AI助手</span></div>
      <div class="tb-btn" id="bellBtn" title="通知"><i data-lucide="bell"></i>${unread?`<span class="dot">${unread}</span>`:''}</div>
      <div class="tb-btn" id="themeBtn" title="切换皮肤"><i data-lucide="contrast"></i></div>
      <div class="tb-user" id="userBtn"><span class="av">管</span><div><div class="un">管理员</div><div class="ur">资产管理公司</div></div></div>
    </div>`;

  document.body.insertBefore(header,document.body.firstChild);
  document.body.insertBefore(aside,document.body.firstChild);

  // ---------- 折叠 ----------
  if(localStorage.getItem('navCollapsed')==='1')document.body.classList.add('nav-collapsed');
  document.getElementById('navCollapse').onclick=()=>{document.body.classList.toggle('nav-collapsed');localStorage.setItem('navCollapsed',document.body.classList.contains('nav-collapsed')?'1':'0');setTimeout(()=>window.dispatchEvent(new Event('resize')),280);};

  // ---------- 实时时钟 ----------
  function tick(){ const d=new Date(); const w='日一二三四五六'[d.getDay()];
    const p=n=>String(n).padStart(2,'0');
    document.getElementById('tbClock').textContent=`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} 周${w} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; }
  tick();setInterval(tick,1000);

  // ---------- 皮肤切换(演示) ----------
  document.getElementById('themeBtn').onclick=()=>{
    const t=document.body.getAttribute('data-theme')==='light'?'dark':'light';
    document.body.setAttribute('data-theme',t);
    UI&&UI.toast('已切换为'+(t==='light'?'浅色':'深色')+'皮肤，刷新后图表配色同步','warn');
  };

  // ---------- 用户菜单 ----------
  document.getElementById('userBtn').onclick=()=>{
    UI.modal('个人中心',`<div style="display:flex;gap:16px;align-items:center;margin-bottom:16px">
      <div class="av" style="width:54px;height:54px;font-size:22px;border-radius:14px;background:linear-gradient(135deg,var(--primary),var(--accent));display:grid;place-items:center;font-weight:800;color:var(--on-brand)">管</div>
      <div><div class="fw7 f18">管理员</div><div class="text-dim">资产管理公司 · 平台运营岗</div></div></div>
      ${UI.descList([['所属机构','武汉大学资产经营投资管理有限责任公司'],['角色权限','超级管理员（全模块）'],['上次登录','2026-06-08 09:12'],['绑定手机','138****6688']])}
      <div class="mt-4" style="display:flex;gap:9px"><a class="btn" href="ai-workbench.html">我的AI任务</a><a class="btn" href="notifications.html">我的待办</a><a class="btn" href="login.html">退出登录</a></div>`);
  };

  // ---------- 通知 ----------
  document.getElementById('bellBtn').onclick=()=>{
    const items=(window.DB?DB.notifications:[]);
    UI.drawer('通知 · 待办中心',
      `<div style="display:flex;gap:8px;margin-bottom:14px"><span class="chip sel">全部 ${items.length}</span><span class="chip">未读 ${items.filter(n=>!n.read).length}</span></div>`+
      items.map(n=>`<div class="panel" style="margin-bottom:10px;padding:13px 15px">
        <div class="flex justify-between items-center"><div class="flex items-center gap-2">${UI.light(n.level,'')}<span class="fw7">${n.title}</span> ${UI.tag(n.type,'gray')}</div><span class="f12 text-mute">${n.time}</span></div>
        <div class="text-dim mt-2" style="font-size:13px">${n.desc}</div></div>`).join('')+
      `<a class="btn btn-primary w-full" style="justify-content:center;margin-top:8px" href="notifications.html">进入通知中心</a>`);
  };

  // ---------- AI 助手 ----------
  function openAI(preset){
    UI.drawer('AI 助手 · 产业创新大脑',`
      <div id="aiChat" style="min-height:300px;display:flex;flex-direction:column;gap:12px;font-size:13.5px"></div>
      <div style="margin:14px 0"><div class="text-mute f12 mb-3">试试这样问：</div>
        <div style="display:flex;flex-wrap:wrap;gap:7px">${(DB?DB.prompts:[]).slice(0,4).map(p=>`<span class="chip pointer" onclick="document.getElementById('aiInput').value='${p}'">${p}</span>`).join('')}</div></div>
      <div style="display:flex;gap:8px"><input id="aiInput" class="fb-field" style="flex:1" placeholder="向产业创新大脑提问..." value="${preset||''}">
        <button class="btn btn-primary" id="aiSend">发送 ▸</button></div>`,{width:'520px'});
    const chat=document.getElementById('aiChat');
    function bubble(role,html){const d=document.createElement('div');d.style.cssText=role==='u'?'align-self:flex-end;background:var(--primary);color:var(--on-brand);padding:9px 13px;border-radius:12px 12px 2px 12px;max-width:85%':'align-self:flex-start;background:var(--panel-2);padding:11px 14px;border-radius:12px 12px 12px 2px;max-width:92%;border:1px solid var(--border)';d.innerHTML=html;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;return d;}
    function ask(q){ if(!q)return; bubble('u',UI.esc(q));
      const ans=bubble('ai','<span class="text-mute">大脑正在分析数据底座...</span>');
      setTimeout(()=>{ans.innerHTML='';UI.typewriter(ans,aiAnswer(q));},500);
      document.getElementById('aiInput').value=''; }
    document.getElementById('aiSend').onclick=()=>ask(document.getElementById('aiInput').value);
    document.getElementById('aiInput').onkeydown=e=>{if(e.key==='Enter')ask(e.target.value);};
    bubble('ai','您好，我是产业创新大脑 AI 助手 <i data-lucide="brain"></i>。我已接入「成果与专利」「参股企业」「产业企业与园区」等 8 类数据域，可为您做产业研判、成果项目化、企业识别与投资风险分析。请问需要什么？');
    if(preset)setTimeout(()=>ask(preset),300);
  }
  function aiAnswer(q){
    if(/趋势|研判/.test(q))return '根据数据底座近30天产业事件分析：\n① 「具身智能/人形机器人」热度环比 +42%，建议优先布局零部件赛道；\n② 「AI大模型与智能体」赛道武大契合度 92，目标企业池新增 8 家；\n③ 「低空经济」存在政策申报窗口，匹配学校 6 项成果。\n\n建议：启动人形机器人赛道分析任务包，并安排 AI 技术经理人推进相关成果项目化。';
    if(/成果|项目化|bp|商业计划/i.test(q))return '已为「硅基光电子集成芯片」成果生成项目化建议：\n· 成熟度 TRL 7，估值约 2400 万元；\n· 推荐应用场景：数据中心光互连、AI算力网络；\n· 转化路径：概念验证 → 中试放大 → 技术作价入股；\n· 已生成商业计划书要点与路演材料框架。\n\n是否需要我生成完整 BP 任务包？';
    if(/企业|识别|招商/.test(q))return '基于「企业识别」模型，为您筛选出 5 家高契合目标企业：\n· 长飞光纤（硅光，契合度 92）\n· 光迅科技（光电集成，90）\n· 高德红外（传感，86）\n· 库柏特（机器人，84）\n· 逸飞激光（激光装备，82）\n\n建议纳入招商目标清单，并由 AI 投资人进行投资价值研判。';
    if(/风险|投后|投资/.test(q))return '投后风险扫描结果：\n· 共 64 家参股/校属企业，正常 58 家、关注 4 家、预警 2 家；\n· 预警企业触发「营收连续两季度下滑」「核心团队变动」，建议技术经理人介入辅导；\n· 整体投资组合健康度 81 分（环比 +12）。';
    return '已基于高校产业数据资产底座完成分析。建议进入「产业创新大脑」或「AI角色工作台」查看结构化产出（产业报告 / 赛道清单 / 企业画像 / 投资研判），并可一键生成任务包交付。';
  }
  document.getElementById('aiBtn').onclick=()=>openAI();
  // 常驻 AI 对话入口(右下角)：更显眼的可达入口，带文字标签 + 呼吸光晕，保留原 openAI 逻辑
  const fab=document.createElement('button');
  fab.className='ai-fab ai-fab-dock';
  fab.type='button';
  fab.title='AI助手 · 随时唤起对话';
  fab.setAttribute('aria-label','打开 AI 助手对话');
  fab.innerHTML='<span class="ai-fab-ico"><i data-lucide="sparkles"></i></span><span class="ai-fab-lbl">AI 助手</span>';
  fab.onclick=()=>openAI();
  document.body.appendChild(fab);
  // 注入常驻入口的视觉增强样式(仅视觉，不影响其他逻辑)
  if(!document.getElementById('aiDockStyle')){
    const st=document.createElement('style');st.id='aiDockStyle';
    st.textContent=`
    .tb-ai{display:inline-flex;align-items:center;gap:6px;padding:0 12px;width:auto;border-radius:999px;
      background:linear-gradient(135deg,var(--primary),var(--accent));color:var(--on-brand);font-weight:700;}
    .tb-ai .tb-ai-lbl{font-size:13px;letter-spacing:.5px;}
    .tb-ai svg{color:var(--on-brand);}
    .ai-fab-dock{position:fixed;right:22px;bottom:26px;z-index:60;display:inline-flex;align-items:center;gap:9px;
      height:52px;padding:0 20px 0 16px;border:none;cursor:pointer;border-radius:999px;color:var(--on-brand);
      font-size:14px;font-weight:800;letter-spacing:.5px;
      background:linear-gradient(135deg,var(--primary),var(--accent));
      box-shadow:0 10px 28px -6px color-mix(in srgb,var(--primary) 60%,transparent),0 0 0 6px color-mix(in srgb,var(--primary) 14%,transparent);
      transition:transform .18s ease,box-shadow .18s ease;}
    .ai-fab-dock:hover{transform:translateY(-2px) scale(1.03);
      box-shadow:0 16px 34px -6px color-mix(in srgb,var(--primary) 70%,transparent),0 0 0 8px color-mix(in srgb,var(--primary) 18%,transparent);}
    .ai-fab-dock .ai-fab-ico{display:grid;place-items:center;width:26px;height:26px;}
    .ai-fab-dock .ai-fab-ico svg{width:20px;height:20px;}
    .ai-fab-dock::before{content:'';position:absolute;inset:-4px;border-radius:999px;
      box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 55%,transparent);
      animation:aiDockPulse 2.4s ease-out infinite;pointer-events:none;}
    @keyframes aiDockPulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 45%,transparent);}
      70%{box-shadow:0 0 0 16px color-mix(in srgb,var(--accent) 0%,transparent);}
      100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 0%,transparent);}}
    body.nav-collapsed .ai-fab-dock .ai-fab-lbl{display:inline;}
    @media (max-width:680px){.ai-fab-dock .ai-fab-lbl{display:none;}.ai-fab-dock{padding:0 14px;}.tb-ai .tb-ai-lbl{display:none;}}
    `;
    document.head.appendChild(st);
  }
  window.openAIAssistant=openAI;

  // ---------- 全局搜索(⌘K) ----------
  function buildIndex(){ const idx=[]; if(!window.DB)return idx;
    DB.achievements.forEach(a=>idx.push({cat:'科技成果',name:a.title,meta:a.disciplineName,url:'achievement-detail.html?id='+a.id,i:'<i data-lucide="microscope"></i>'}));
    DB.enterprises.forEach(e=>idx.push({cat:'企业',name:e.name,meta:e.type+' · '+e.disciplineName,url:'enterprise-detail.html?id='+e.id,i:'<i data-lucide="building-2"></i>'}));
    DB.parks.forEach(p=>idx.push({cat:'园区',name:p.name,meta:p.type,url:'park-detail.html?id='+p.id,i:'<i data-lucide="building"></i>'}));
    DB.dataAssets.forEach(d=>idx.push({cat:'数据资产',name:d.name,meta:d.domain,url:'data-catalog.html',i:'<i data-lucide="files"></i>'}));
    return idx; }
  const SEARCH_INDEX=buildIndex();
  const cmdMask=document.createElement('div');cmdMask.className='cmd-mask';
  cmdMask.innerHTML=`<div class="cmd"><input type="text" id="cmdInput" placeholder="搜索成果 / 企业 / 团队 / 园区 / 数据资产..."><div class="cmd-res" id="cmdRes"></div></div>`;
  document.body.appendChild(cmdMask);
  function openCmd(){cmdMask.classList.add('open');const i=document.getElementById('cmdInput');i.value='';renderCmd('');setTimeout(()=>i.focus(),60);}
  function closeCmd(){cmdMask.classList.remove('open');}
  function renderCmd(q){
    const res=document.getElementById('cmdRes');
    let list = q? SEARCH_INDEX.filter(x=>x.name.includes(q)||x.meta.includes(q)).slice(0,18) : SEARCH_INDEX.slice(0,8);
    if(!list.length){res.innerHTML=`<div class="empty" style="padding:30px">未找到「${UI.esc(q)}」相关结果</div>`;return;}
    const byCat={};list.forEach(x=>{(byCat[x.cat]=byCat[x.cat]||[]).push(x);});
    res.innerHTML=Object.keys(byCat).map(c=>`<div class="cmd-cat">${c}</div>`+byCat[c].map(x=>`<div class="cmd-item" onclick="location.href='${x.url}'"><span class="ci">${x.i}</span><div><div>${UI.esc(x.name)}</div></div><span class="cm">${UI.esc(x.meta)}</span></div>`).join('')).join('');
  }
  document.getElementById('cmdInput')&&(document.getElementById('cmdInput').oninput=e=>renderCmd(e.target.value));
  cmdMask.onclick=e=>{if(e.target===cmdMask)closeCmd();};
  document.getElementById('globalSearch').onclick=openCmd;
  document.addEventListener('keydown',e=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCmd();} if(e.key==='Escape'){closeCmd();UI.closeDrawer&&UI.closeDrawer();UI.closeModal&&UI.closeModal();} });

  // 工具：读取 URL 参数
  window.qparam=k=>new URLSearchParams(location.search).get(k);

  // ---------- Lucide 图标渲染：初次 + 监听动态注入内容自动转换 ----------
  function refreshIcons(){ if(window.lucide&&lucide.createIcons){ try{ lucide.createIcons(); }catch(e){} } }
  window.refreshIcons=refreshIcons;
  refreshIcons();
  let _icoT; const _mo=new MutationObserver(()=>{ clearTimeout(_icoT); _icoT=setTimeout(refreshIcons,50); });
  _mo.observe(document.body,{childList:true,subtree:true});
})();
