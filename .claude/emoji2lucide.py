#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, re, glob

ROOT = "/Users/chenwenbo/Desktop/武汉大学原型"

# emoji -> lucide 图标名
ICON = {
 "🤖":"bot","🏢":"building-2","🔬":"microscope","💰":"banknote","🎯":"target","🧠":"brain",
 "📊":"bar-chart-3","📈":"trending-up","📉":"trending-down","🗄":"database","📦":"package",
 "📋":"clipboard-list","🏗":"building","🚀":"rocket","🔔":"bell","📅":"calendar","✅":"check-circle",
 "⚠":"alert-triangle","👥":"users","👁":"eye","🏛":"landmark","🤝":"handshake","🛠":"wrench",
 "📡":"radar","📑":"files","📐":"ruler","✓":"check","✔":"check","✕":"x","✖":"x","⚡":"zap",
 "🛰":"satellite","🔥":"flame","📤":"upload","📜":"scroll-text","📍":"map-pin","💼":"briefcase",
 "💡":"lightbulb","💎":"gem","🎓":"graduation-cap","⭐":"star","⚖":"scale","🙋":"hand","🗓":"calendar-days",
 "🔗":"link","📚":"library","📄":"file-text","👍":"thumbs-up","🌐":"globe","❤":"heart","♻":"recycle",
 "🧬":"dna","🧩":"puzzle","🧑":"user","🛣":"route","🗺":"map","🔑":"key","🔍":"search","🔎":"search",
 "🔄":"refresh-cw","💬":"message-square","👤":"user","🏭":"factory","🎬":"clapperboard","⚗":"flask-conical",
 "⏳":"hourglass","🩺":"stethoscope","🧾":"receipt","🧭":"compass","🧪":"test-tube","🛡":"shield",
 "🛒":"shopping-cart","🛍":"shopping-bag","🚩":"flag","🗂":"folder","🖼":"image","🕸":"network",
 "🔧":"wrench","🔒":"lock","📱":"smartphone","📭":"inbox","📨":"mail","📥":"download","📣":"megaphone",
 "📝":"pencil","📌":"pin","💻":"laptop","💚":"heart","👋":"hand","🏦":"landmark","🏠":"home",
 "🏆":"trophy","🏃":"activity","🏁":"flag","🎫":"ticket","🎨":"palette","🎤":"mic","🎣":"fish",
 "🌱":"sprout","🌓":"contrast","🌍":"globe","✨":"sparkles","⛶":"maximize","⛓":"link","⏱":"timer",
 "⏰":"alarm-clock","⬇":"download","⬆":"upload","🔆":"sun","📞":"phone","🤔":"help-circle","🔋":"battery",
}
# 彩色圆/方块 -> 状态色点
DOT = {"🔴":"edot-r","🟡":"edot-y","🟢":"edot-g","🟪":"edot-p","🟦":"edot-b","🟠":"edot-y","🔵":"edot-b","🟣":"edot-p"}
# 保留的排版字符(不动)
KEEP = set("→←▸▲▼▶◀●○◦⇅↻↺↑↓⌘★☆△▽▦▤▣▢☰⏎↗↘⇔⬅➡①②③④⑤⑥⑦⑧⑨⑩⓪✦✧·—–")

def convert(text):
    for e,name in ICON.items():
        if e in text:
            text = text.replace(e, f'<i data-lucide="{name}"></i>')
    for e,cls in DOT.items():
        if e in text:
            text = text.replace(e, f'<span class="edot {cls}"></span>')
    text = text.replace("️","")  # 去掉变体选择符
    return text

LUCIDE_TAG = '<script src="assets/js/lucide.min.js"></script>'

def ensure_lucide(html):
    if "assets/js/lucide.min.js" in html:
        return html
    # 插到 </head> 前
    return re.sub(r'</head>', LUCIDE_TAG + '\n</head>', html, count=1)

# 处理文件
files = glob.glob(os.path.join(ROOT,"*.html")) + [os.path.join(ROOT,"assets/js/data.js"), os.path.join(ROOT,"assets/js/components.js"), os.path.join(ROOT,"assets/js/shell.js")]

changed=[]
leftover=set()
EMOJI_RE = re.compile("[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿]")
for f in files:
    with open(f,encoding="utf-8") as fh: s=fh.read()
    orig=s
    s=convert(s)
    if f.endswith(".html"):
        s=ensure_lucide(s)
    if s!=orig:
        with open(f,"w",encoding="utf-8") as fh: fh.write(s)
        changed.append(os.path.basename(f))
    # 检测残留未映射 emoji
    for m in EMOJI_RE.findall(s):
        if m not in KEEP:
            leftover.add(m)

print("CHANGED FILES:", len(changed))
for c in sorted(changed): print("  ",c)
print("\nLEFTOVER (未映射, 需关注):", " ".join(sorted(leftover)) if leftover else "无")
