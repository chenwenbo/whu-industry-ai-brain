/* ==========================================================================
   武汉大学产业创新AI智脑平台 — 共享组件库 components.js (window.UI)
   返回HTML字符串的纯函数 + 少量命令式组件(table/kanban/drawer/modal/toast)
   ========================================================================== */
(function(){
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const UI = {
    esc,$,$$,
    // ---- KPI 卡 ----
    kpi({label,value,unit='',delta,deltaUp=true,icon='',spark}){
      const id='sk'+Math.random().toString(36).slice(2,8);
      const d = delta!=null?`<div class="delta ${deltaUp?'up':'down'}">${deltaUp?'▲':'▼'} ${delta}</div>`:'';
      const sp = spark?`<div class="spark" id="${id}"></div>`:'';
      setTimeout(()=>{ if(spark&&document.getElementById(id)) Charts.spark(id,{data:spark}); },30);
      return `<div class="kpi fade-in"><div class="lab">${icon?`<span class="i">${icon}</span>`:''}${esc(label)}</div>
        <div class="val"><span class="num">${value}</span>${unit?`<span class="unit">${unit}</span>`:''}</div>${d}${sp}</div>`;
    },
    // ---- 面板 ----
    panel(title,body,{tools='',glow=false,tag=''}={}){
      return `<div class="panel ${glow?'glow':''}"><div class="panel-h"><div class="t"><span class="bar"></span>${esc(title)}${tag?` <span class="tag tag-gray">${tag}</span>`:''}</div><div class="tools">${tools}</div></div>${body}</div>`;
    },
    // ---- 标签 ----
    tag(text,type='gray'){ return `<span class="tag tag-${type}">${esc(text)}</span>`; },
    light(level,text){ return `<span class="light ${level}"><span class="o"></span>${esc(text||({g:'正常',y:'关注',r:'预警'}[level]))}</span>`; },
    chip(text,sel=false){ return `<span class="chip ${sel?'sel':''}">${esc(text)}</span>`; },
    bar(pct,color){ return `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;${color?`background:${color}`:''}"></div></div>`; },
    avatar(name){ const c=name.slice(0,1); return `<span class="tb-user" style="border:none;padding:0;gap:6px"><span class="av" style="width:26px;height:26px;font-size:11px">${esc(c)}</span></span>`; },

    // ---- 实体卡 ----
    entityCard({title,meta,tags=[],badge='',onclick=''}){
      return `<div class="ecard" ${onclick?`onclick="${onclick}"`:''}>
        <div class="flex justify-between items-center"><div class="et">${esc(title)}</div>${badge}</div>
        <div class="em mt-2">${meta}</div>
        ${tags.length?`<div class="mt-3" style="display:flex;gap:5px;flex-wrap:wrap">${tags.map(t=>UI.tag(t,'blue')).join('')}</div>`:''}
      </div>`;
    },
    // ---- 榜单 ----
    rankList(items){ // [{name, value, sub}]
      return `<div>${items.map((it,i)=>`<div class="flex items-center gap-3" style="padding:9px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="width:24px;height:24px;border-radius:7px;display:grid;place-items:center;font-size:12px;font-weight:700;
          background:${i<3?'linear-gradient(135deg,var(--primary),var(--accent))':'var(--panel-2)'};color:${i<3?'var(--on-brand)':'var(--text-dim)'}">${i+1}</span>
        <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(it.name)}</div>
          ${it.sub?`<div class="f12 text-mute">${esc(it.sub)}</div>`:''}</div>
        <div class="num text-primary fw7">${it.value}</div></div>`).join('')}</div>`;
    },
    // ---- 时间线 ----
    timeline(items){ // [{time, txt, type}]
      const tc={成果:'var(--dom-1)',合作:'var(--dom-2)',孵化:'var(--dom-6)',数据:'var(--dom-8)',投资:'var(--dom-5)',活动:'var(--dom-3)',预警:'var(--danger)'};
      return `<div class="timeline">${items.map(it=>`<div class="tl-item"><div class="tl-time">${esc(it.time)} ${it.type?`<span style="color:${tc[it.type]||'var(--primary)'}">●</span> ${esc(it.type)}`:''}</div><div class="tl-txt">${esc(it.txt)}</div></div>`).join('')}</div>`;
    },
    // ---- 描述列表 ----
    descList(pairs){ // [[k,v],...]
      return `<div style="display:grid;grid-template-columns:auto 1fr;gap:9px 18px;font-size:13px">${pairs.map(([k,v])=>`<div class="text-mute">${esc(k)}</div><div class="fw6" style="text-align:right">${v}</div>`).join('')}</div>`;
    },
    empty(text='暂无数据'){ return `<div class="empty"><div class="ei"><i data-lucide="inbox"></i></div>${esc(text)}</div>`; },
    skeleton(n=3){ return seqHtml(n,()=>`<div class="skel" style="height:14px;margin:9px 0"></div>`); },
    srcNote(domains){ return `<div class="src-note"><span class="d"></span>数据来源：${[].concat(domains).map(esc).join(' · ')}（高校产业数据资产底座）</div>`; },

    // ================= 命令式组件 =================
    // 筛选条
    filterBar(container,{fields=[],search=false,searchPh='搜索...',extra='',onChange}){
      const el=typeof container==='string'?$(container):container;
      el.classList.add('filterbar');
      el.innerHTML = fields.map(f=>`<div class="fb-field"><select data-k="${f.key}">${(f.all!==false?`<option value="">${f.label||'全部'}</option>`:'')+f.options.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></div>`).join('')
        + (search?`<div class="fb-field" style="flex:1;max-width:280px"><input type="text" data-k="_q" placeholder="${esc(searchPh)}"></div>`:'')
        + extra
        + `<button class="btn btn-sm btn-ghost" data-reset>↺ 重置</button>`;
      const read=()=>{const o={};$$('[data-k]',el).forEach(i=>o[i.dataset.k]=i.value);return o;};
      el.addEventListener('change',e=>{ if(e.target.dataset.k) onChange&&onChange(read()); });
      el.addEventListener('input',e=>{ if(e.target.dataset.k==='_q') onChange&&onChange(read()); });
      $('[data-reset]',el).onclick=()=>{ $$('[data-k]',el).forEach(i=>i.value=''); onChange&&onChange(read()); };
      return {read};
    },

    // 数据表(排序/分页/行点击)
    table(container,{columns,rows,pageSize=10,onRow,empty='暂无数据'}){
      const el=typeof container==='string'?$(container):container;
      let sortK=null,sortDir=1,page=1,data=rows.slice();
      function render(){
        const sorted=data.slice();
        if(sortK){const c=columns.find(c=>c.key===sortK);sorted.sort((a,b)=>{let x=c.sortVal?c.sortVal(a):a[sortK],y=c.sortVal?c.sortVal(b):b[sortK];if(typeof x==='string'){return sortDir*x.localeCompare(y,'zh')}return sortDir*((x||0)-(y||0));});}
        const pages=Math.max(1,Math.ceil(sorted.length/pageSize));
        page=Math.min(page,pages);
        const view=sorted.slice((page-1)*pageSize,page*pageSize);
        el.innerHTML=`<div class="tbl-wrap"><table class="tbl"><thead><tr>${columns.map(c=>`<th data-k="${c.key}" ${c.sortable===false?'style="cursor:default"':''}>${esc(c.title)}${c.sortable!==false?`<span class="so">${sortK===c.key?(sortDir>0?'▲':'▼'):'⇅'}</span>`:''}</th>`).join('')}</tr></thead>
          <tbody>${view.length?view.map((r,i)=>`<tr class="${onRow?'clickable':''}" data-i="${(page-1)*pageSize+i}">${columns.map(c=>`<td>${c.render?c.render(r):esc(r[c.key])}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${columns.length}">${UI.empty(empty)}</td></tr>`}</tbody></table></div>
          <div class="pager"><span>共 ${sorted.length} 条 · 第 ${page}/${pages} 页</span><div class="pg">
            <button data-pg="prev">‹</button>${seqHtml(Math.min(pages,7),i=>`<button data-pg="${i+1}" class="${page===i+1?'on':''}">${i+1}</button>`)}<button data-pg="next">›</button>
          </div></div>`;
        $$('th[data-k]',el).forEach(th=>{ if(columns.find(c=>c.key===th.dataset.k).sortable!==false) th.onclick=()=>{if(sortK===th.dataset.k)sortDir*=-1;else{sortK=th.dataset.k;sortDir=1;}render();};});
        $$('[data-pg]',el).forEach(b=>b.onclick=()=>{const v=b.dataset.pg;if(v==='prev')page=Math.max(1,page-1);else if(v==='next')page=Math.min(pages,page+1);else page=+v;render();});
        if(onRow)$$('tr[data-i]',el).forEach(tr=>tr.onclick=()=>onRow(sorted[+tr.dataset.i]));
      }
      render();
      return { update(newRows){data=newRows.slice();page=1;render();} };
    },

    // 抽屉
    drawer(title,body,{width}={}){
      UI.closeDrawer();
      const mask=document.createElement('div');mask.className='drawer-mask';
      const dr=document.createElement('div');dr.className='drawer';if(width)dr.style.width=width;
      dr.innerHTML=`<div class="drawer-h"><div>${typeof title==='string'?`<div class="page-title" style="font-size:18px">${esc(title)}</div>`:title}</div><div class="x" onclick="UI.closeDrawer()"><i data-lucide="x"></i></div></div><div class="drawer-b">${body}</div>`;
      document.body.appendChild(mask);document.body.appendChild(dr);
      mask.onclick=UI.closeDrawer;
      requestAnimationFrame(()=>{mask.classList.add('open');dr.classList.add('open');});
      UI._drawer=[mask,dr];
      return dr;
    },
    closeDrawer(){ if(UI._drawer){const[m,d]=UI._drawer;m.classList.remove('open');d.classList.remove('open');setTimeout(()=>{m.remove();d.remove();},300);UI._drawer=null;} },

    // 弹窗
    modal(title,body,{footer=''}={}){
      UI.closeModal();
      const mask=document.createElement('div');mask.className='modal-mask';
      mask.innerHTML=`<div class="modal"><div class="modal-h"><div class="fw7 f18">${esc(title)}</div><div class="x pointer" onclick="UI.closeModal()" style="font-size:20px;color:var(--text-dim)"><i data-lucide="x"></i></div></div><div class="modal-b">${body}</div>${footer?`<div class="modal-h" style="border-top:1px solid var(--border);border-bottom:none;justify-content:flex-end;gap:9px">${footer}</div>`:''}</div>`;
      document.body.appendChild(mask);
      mask.onclick=e=>{if(e.target===mask)UI.closeModal();};
      requestAnimationFrame(()=>mask.classList.add('open'));
      UI._modal=mask; return mask;
    },
    closeModal(){ if(UI._modal){UI._modal.classList.remove('open');const m=UI._modal;setTimeout(()=>m.remove(),200);UI._modal=null;} },

    // Toast
    toast(msg,type='ok'){
      let w=$('.toast-wrap');if(!w){w=document.createElement('div');w.className='toast-wrap';document.body.appendChild(w);}
      const t=document.createElement('div');t.className='toast '+type;
      t.innerHTML=`<span class="ti">${type==='ok'?'<i data-lucide="check"></i>':type==='warn'?'!':'i'}</span><span>${esc(msg)}</span>`;
      w.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(40px)';t.style.transition='.3s';setTimeout(()=>t.remove(),300);},2600);
    },

    // Tabs
    tabs(container,items,onSwitch){ // items:[{key,label}]
      const el=typeof container==='string'?$(container):container;
      el.classList.add('tabs');
      el.innerHTML=items.map((it,i)=>`<div class="tab ${i===0?'active':''}" data-tab="${it.key}">${it.html!==undefined?it.html:esc(it.label)}</div>`).join('');
      el.addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;$$('.tab',el).forEach(x=>x.classList.remove('active'));t.classList.add('active');onSwitch&&onSwitch(t.dataset.tab);});
      onSwitch&&onSwitch(items[0].key);
    },

    // Kanban(支持拖拽)
    kanban(container,{columns,cardRender,onMove}){ // columns:[{key,title,cards:[]}]
      const el=typeof container==='string'?$(container):container;
      el.classList.add('kanban');
      el.innerHTML=columns.map(c=>`<div class="kb-col" data-col="${c.key}"><div class="kb-col-h"><span>${esc(c.title)}</span><span class="cnt">${c.cards.length}</span></div>
        <div class="kb-body" data-col="${c.key}">${c.cards.map((card,i)=>`<div class="kb-card" draggable="true" data-col="${c.key}" data-i="${i}">${cardRender(card)}</div>`).join('')}</div></div>`).join('');
      let drag=null;
      $$('.kb-card',el).forEach(card=>{
        card.addEventListener('dragstart',()=>{drag=card;card.classList.add('dragging');});
        card.addEventListener('dragend',()=>{card.classList.remove('dragging');drag=null;$$('.kb-col',el).forEach(c=>c.classList.remove('dragover'));});
      });
      $$('.kb-body',el).forEach(body=>{
        const col=body.closest('.kb-col');
        body.addEventListener('dragover',e=>{e.preventDefault();col.classList.add('dragover');});
        body.addEventListener('dragleave',()=>col.classList.remove('dragover'));
        body.addEventListener('drop',e=>{e.preventDefault();if(drag){body.appendChild(drag);col.classList.remove('dragover');
          $$('.kb-col',el).forEach(c=>{const cnt=$('.cnt',c);if(cnt)cnt.textContent=$$('.kb-card',c).length;});
          onMove&&onMove(drag.dataset.i,drag.dataset.col,body.dataset.col);drag.dataset.col=body.dataset.col;}});
      });
    },

    // 流式打字机(AI 生成模拟)
    typewriter(el,text,{speed=18,onDone}={}){
      const node=typeof el==='string'?$(el):el; node.innerHTML='';let i=0;
      const cur=document.createElement('span');cur.textContent='▊';cur.style.color='var(--primary)';cur.style.animation='breathe 1s infinite';
      const span=document.createElement('span');node.appendChild(span);node.appendChild(cur);
      const t=setInterval(()=>{ span.innerHTML=text.slice(0,i).replace(/\n/g,'<br>'); i++; node.scrollTop=node.scrollHeight; if(i>text.length){clearInterval(t);cur.remove();onDone&&onDone();} },speed);
      return ()=>clearInterval(t);
    },
  };
  function seqHtml(n,f){let s='';for(let i=0;i<n;i++)s+=f(i);return s;}
  UI.seqHtml=seqHtml;
  window.UI=UI;
})();
