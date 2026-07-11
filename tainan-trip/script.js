const tripData = {
  title: "台南兩天一夜",
  dateRange: "2026.07.18 - 2026.07.19",
  note:
    "這版先用「台北南下 → 東區牛肉湯 → 中西區住宿 → 漁光島 → 國華街甜點漢堡 → 成功路酒吧」排動線。面交地點尚未確認，所以保留 15 分鐘彈性槽。",
  summary:
    "最順的核心是抵達台南時先處理東區的鴻牛，進中西區後放行李，再去漁光島看海。回市區後先吃冰、再接漢堡，晚上從住宿步行去 Moonrock，沿路安排便利商店酒精路跑站點。",
  reminders: [
    "國華街周邊停車成本高，建議停好車後步行或短程計程車",
    "賣家面交地點若能約在住宿、國華街或東區鴻牛附近，整體最順",
    "便利商店酒精路跑抓 3-5 個站點，實際店數以當晚 Google Maps 搜尋為準",
    "永樂牛肉湯 7/18 深夜未營業，已從主行程移除；醒酒改便利商店補水或直接回住宿",
    "有明確抵達時間的店家都要標示營業狀態；目前未能穩定查證者先標營業待確認",
  ],
  days: [
    {
      id: "day-1",
      date: "7/18",
      weekday: "六",
      title: "Day 1｜南下、進中西區、酒吧路跑",
      items: [
        {
          type: "stop",
          time: "07:30",
          durationMins: 10,
          title: "台北出發",
          category: "出發",
          status: "預估",
          address: "台北市",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%8F%B0%E5%8C%97%E5%B8%82",
          image: "assets/thumb-road.svg",
          imageAlt: "南下公路與旅程起點",
          note: "建議越早出發越好，週六南下車流要抓寬一點。",
          tags: ["國道", "休息站"],
        },
        {
          type: "drive",
          mode: "開車",
          time: "07:40",
          from: "台北",
          to: "鴻牛溫體牛肉湯-東寧店",
          travelMins: 285,
          parkingMins: 30,
          note: "含休息站與進市區緩衝，若國道塞車整體順延。",
        },
        {
          type: "stop",
          time: "12:55",
          durationMins: 60,
          title: "鴻牛溫體牛肉湯-東寧店",
          category: "牛肉湯",
          status: "建議安排",
          address: "701 臺南市東區東寧路430號",
          mapUrl: "https://maps.app.goo.gl/JAs1y7zrr69Sf6Z39?g_st=ic",
          image: "assets/thumb-beef.svg",
          imageAlt: "牛肉湯與熱湯碗",
          businessStatus: "營業待確認",
          note: "東區位置比較像進台南後的第一餐，不要特地從中西區折返。",
          tags: ["午餐", "東區"],
        },
        {
          type: "drive",
          mode: "開車",
          time: "13:55",
          from: "鴻牛東寧店",
          to: "電子琴面交點",
          travelMins: 20,
          parkingMins: 10,
          note: "面交地點還沒定；若賣家可配合，優先約東區往中西區路上。",
        },
        {
          type: "stop",
          time: "14:25",
          durationMins: 15,
          title: "電子琴面交",
          category: "任務",
          status: "待約地點",
          address: "地點待確認，建議約住宿或國華街周邊",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E6%96%87%E8%B3%A2%E8%B7%AF32%E5%B7%B75%E8%99%9F",
          image: "assets/thumb-music.svg",
          imageAlt: "電子琴與面交任務",
          note: "實作上抓 15 分鐘即可，但前後各留 10 分鐘找路與臨停。",
          tags: ["15 分鐘", "彈性"],
        },
        {
          type: "drive",
          mode: "開車",
          time: "14:40",
          from: "面交點",
          to: "住宿",
          travelMins: 15,
          parkingMins: 15,
          note: "住宿附近停車方式待確認；若可先寄放行李，晚點再正式 check-in。",
        },
        {
          type: "stop",
          time: "15:10",
          durationMins: 50,
          title: "住宿 Check-in／放行李",
          category: "住宿",
          status: "已知地址",
          address: "700 臺南市中西區文賢路32巷5號",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=700%20%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E6%96%87%E8%B3%A2%E8%B7%AF32%E5%B7%B75%E8%99%9F",
          image: "assets/thumb-hotel.svg",
          imageAlt: "旅宿與放行李",
          note: "這裡是晚間路跑起點；漁光島可用車或叫車，回市區後建議不要再頻繁移車。",
          tags: ["放行李", "停車確認"],
        },
        {
          type: "drive",
          mode: "開車/叫車",
          time: "16:00",
          from: "住宿",
          to: "漁光島",
          travelMins: 22,
          parkingMins: 10,
          note: "去海邊比在市區移動遠一點，抓停車與走到沙灘的時間。",
        },
        {
          type: "stop",
          time: "16:35",
          durationMins: 65,
          title: "漁光島",
          category: "海邊",
          status: "建議安排",
          address: "台南市安平區漁光路",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%BC%81%E5%85%89%E5%B3%B6",
          image: "assets/thumb-island.svg",
          imageAlt: "漁光島海邊與夕光",
          businessStatus: "戶外全天",
          note: "放在傍晚最舒服，回市區後再接冰店和漢堡。若天氣太熱或下雨可跳過。",
          tags: ["海邊", "夕陽"],
        },
        {
          type: "drive",
          mode: "開車/叫車",
          time: "17:40",
          from: "漁光島",
          to: "Ø無醉推定",
          travelMins: 20,
          parkingMins: 12,
          note: "回國華街周邊後建議停好車，後續甜點與漢堡步行串。",
        },
        {
          type: "stop",
          time: "18:15",
          durationMins: 45,
          title: "Ø無醉推定",
          category: "甜點冰店",
          status: "建議安排",
          address: "700 臺南市中西區民生路二段51號，國華街三段50號斜對面",
          mapUrl: "https://maps.app.goo.gl/WkAfFTCWtADjJHp29?g_st=ic",
          image: "assets/thumb-dessert.svg",
          imageAlt: "冰品甜點",
          businessStatus: "營業待確認",
          note: "依你的調整先吃冰，再步行去漢堡。若當天營業時間不合，改放 Day 2 彈性補點。",
          tags: ["甜點", "國華街"],
        },
        {
          type: "drive",
          mode: "步行",
          time: "19:00",
          from: "Ø無醉推定",
          to: "蓋拉澳式漢堡-淺草店",
          travelMins: 3,
          parkingMins: 0,
          note: "兩點都在國華街三段附近，直接步行串起來。",
        },
        {
          type: "stop",
          time: "19:05",
          durationMins: 75,
          title: "蓋拉澳式漢堡-淺草店",
          category: "漢堡",
          status: "建議安排",
          address: "70059 臺南市中西區國華街三段28號之4",
          mapUrl: "https://maps.app.goo.gl/gi1zozzjSr8VUBhVA?g_st=ic",
          image: "assets/thumb-burger.svg",
          imageAlt: "漢堡與薯條",
          businessStatus: "營業待確認",
          note: "改成冰店後的晚餐。若中午牛肉湯吃太飽，可以點輕一點或外帶。",
          tags: ["晚餐", "國華街"],
        },
        {
          type: "drive",
          mode: "步行",
          time: "20:20",
          from: "國華街",
          to: "住宿",
          travelMins: 18,
          parkingMins: 0,
          note: "回去補水、整理，晚點準備便利商店酒精路跑。",
        },
        {
          type: "stop",
          time: "20:40",
          durationMins: 30,
          title: "住宿休息／晚間準備",
          category: "緩衝",
          status: "建議保留",
          address: "700 臺南市中西區文賢路32巷5號",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=700%20%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E6%96%87%E8%B3%A2%E8%B7%AF32%E5%B7%B75%E8%99%9F",
          image: "assets/thumb-hotel.svg",
          imageAlt: "晚間休息與整備",
          note: "這段不要排太滿，南下開車後需要一點空檔。",
          tags: ["補水", "換裝"],
        },
        {
          type: "drive",
          mode: "步行",
          time: "21:10",
          from: "住宿",
          to: "Moonrock",
          travelMins: 35,
          parkingMins: 0,
          note: "沿成功路方向前進，便利商店酒精路跑站點粗估 3-5 間；當晚用 Google Maps 搜尋 7-ELEVEN / 全家微調。",
        },
        {
          type: "stop",
          time: "21:45",
          durationMins: 25,
          title: "便利商店酒精路跑",
          category: "路線",
          status: "粗估",
          address: "住宿 → 成功路22巷42弄13號 Moonrock",
          mapUrl:
            "https://www.google.com/maps/dir/?api=1&origin=700%20%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E6%96%87%E8%B3%A2%E8%B7%AF32%E5%B7%B75%E8%99%9F&destination=704%20%E5%8F%B0%E5%8D%97%E5%B8%82%E5%8C%97%E5%8D%80%E6%88%90%E5%8A%9F%E8%B7%AF22%E5%B7%B742%E5%BC%8413%E8%99%9F%20Moonrock&travelmode=walking",
          image: "assets/thumb-route.svg",
          imageAlt: "步行路線與便利商店酒精路跑站點",
          note: "不要每間都停太久，設定 2-3 個正式酒精路跑站點，其餘當路過備案。",
          tags: ["3-5 間", "步行"],
        },
        {
          type: "stop",
          time: "22:10",
          durationMins: 150,
          title: "Moonrock",
          category: "酒吧",
          status: "晚間主行程",
          address: "704 臺南市北區成功路22巷42弄13號",
          mapUrl: "https://maps.app.goo.gl/F2yB9QznB5tnbRBw5?g_st=ic",
          image: "assets/thumb-bar.svg",
          imageAlt: "夜晚酒吧",
          businessStatus: "營業待確認",
          note: "從住宿走過去可行，回程視狀態叫車比較安全。",
          tags: ["酒吧", "成功路"],
        },
      ],
    },
    {
      id: "day-2",
      date: "7/19",
      weekday: "日",
      title: "Day 2｜咖啡、牛肉湯、回台北",
      items: [
        {
          type: "stop",
          time: "09:00",
          durationMins: 30,
          title: "退房／裝車",
          category: "住宿",
          status: "預估",
          address: "700 臺南市中西區文賢路32巷5號",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=700%20%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E6%96%87%E8%B3%A2%E8%B7%AF32%E5%B7%B75%E8%99%9F",
          image: "assets/thumb-hotel.svg",
          imageAlt: "退房與裝車",
          note: "先把行李處理好，再出門去咖啡店比較不趕。",
          tags: ["退房", "行李"],
        },
        {
          type: "drive",
          mode: "開車",
          time: "09:30",
          from: "住宿",
          to: "Barista Ray Coffee",
          travelMins: 12,
          parkingMins: 10,
          note: "友愛街在中西區核心，週日上午仍要抓停車或臨停時間。",
        },
        {
          type: "stop",
          time: "09:55",
          durationMins: 45,
          title: "Barista Ray Coffee",
          category: "咖啡",
          status: "新增",
          address: "700 臺南市中西區友愛街22號",
          mapUrl: "https://maps.app.goo.gl/Etj8pxsHd9d6K3o47?g_st=ic",
          image: "assets/thumb-coffee.svg",
          imageAlt: "早晨咖啡",
          businessStatus: "營業待確認",
          note: "第二天早上的新點。若現場人多，可外帶後直接往牛家莊。",
          tags: ["咖啡", "友愛街"],
        },
        {
          type: "drive",
          mode: "開車",
          time: "10:40",
          from: "Barista Ray Coffee",
          to: "牛家莊牛肉湯",
          travelMins: 8,
          parkingMins: 12,
          note: "中西區早餐時段仍要抓停車時間。",
        },
        {
          type: "stop",
          time: "11:00",
          durationMins: 60,
          title: "牛家莊牛肉湯",
          category: "牛肉湯",
          status: "建議安排",
          address: "70056 臺南市中西區郡西路86號",
          mapUrl: "https://maps.app.goo.gl/cAGRdiwgJzfTmze57?g_st=ic",
          image: "assets/thumb-beef.svg",
          imageAlt: "台南牛肉湯早餐",
          businessStatus: "營業待確認",
          note: "這間放 Day 2 很合理，離住宿與國華街圈都近，不會跟東區鴻牛互相打架。",
          tags: ["早餐", "中西區"],
        },
        {
          type: "drive",
          mode: "開車",
          time: "12:00",
          from: "牛家莊",
          to: "彈性補點／回程前整理",
          travelMins: 15,
          parkingMins: 10,
          note: "看前一天有沒有漏吃漢堡、甜點，或把面交備案放這裡。",
        },
        {
          type: "stop",
          time: "12:25",
          durationMins: 35,
          title: "彈性補點",
          category: "備案",
          status: "自由調整",
          address: "國華街／住宿周邊",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%8F%B0%E5%8D%97%20%E5%9C%8B%E8%8F%AF%E8%A1%97",
          image: "assets/thumb-route.svg",
          imageAlt: "回程前彈性補點",
          note: "如果 Day 1 漢堡或甜點因營業時間沒吃到，這段補；若都完成，就提早回台北。",
          tags: ["備案", "不硬排"],
        },
        {
          type: "drive",
          mode: "開車",
          time: "13:00",
          from: "台南",
          to: "台北",
          travelMins: 285,
          parkingMins: 25,
          note: "含休息站緩衝；週日下午北上可能塞，建議不要太晚出發。",
        },
      ],
    },
  ],
};

const formatMins = (mins) => {
  if (!mins) return "0 分";
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  if (!hours) return `${rest} 分`;
  if (!rest) return `${hours} 小時`;
  return `${hours} 小時 ${rest} 分`;
};

const getTravelMins = (item) => item.travelMins ?? item.driveMins ?? item.walkMins ?? 0;

const getMapUrl = (item) => {
  if (item.mapUrl) return item.mapUrl;
  const query = encodeURIComponent([item.title, item.address].filter(Boolean).join(" "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const sumDay = (day) => {
  return day.items.reduce(
    (acc, item) => {
      if (item.type === "stop") {
        acc.stops += 1;
        acc.stay += item.durationMins || 0;
        if ((item.status || "").includes("待")) acc.pending += 1;
      }

      if (item.type === "drive") {
        acc.travel += getTravelMins(item);
        acc.parking += item.parkingMins || 0;
      }

      return acc;
    },
    { stops: 0, stay: 0, travel: 0, parking: 0, pending: 0 },
  );
};

const totalStats = tripData.days.reduce(
  (acc, day) => {
    const dayStats = sumDay(day);
    acc.stops += dayStats.stops;
    acc.stay += dayStats.stay;
    acc.travel += dayStats.travel;
    acc.parking += dayStats.parking;
    acc.pending += dayStats.pending;
    return acc;
  },
  { stops: 0, stay: 0, travel: 0, parking: 0, pending: 0 },
);

const setText = (selector, text) => {
  const node = document.querySelector(selector);
  if (node) node.textContent = text;
};

const renderOverview = () => {
  setText("#trip-note", tripData.note);
  setText("#trip-summary", tripData.summary);
  setText("#metric-stops", `${totalStats.stops} 個`);
  setText("#metric-driving", formatMins(totalStats.travel + totalStats.parking));
  setText("#metric-stay", formatMins(totalStats.stay));
  setText("#metric-pending", `${totalStats.pending} 項`);

  const reminders = document.querySelector("#trip-reminders");
  reminders.replaceChildren(
    ...tripData.reminders.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }),
  );

  const dayStats = document.querySelector("#day-stats");
  dayStats.replaceChildren(
    ...tripData.days.map((day) => {
      const stats = sumDay(day);
      const row = document.createElement("div");
      row.className = "day-stat";
      row.innerHTML = `
        <strong>${day.date}（${day.weekday}）</strong>
        <span>${stats.stops} 個點 · 停留 ${formatMins(stats.stay)} · 移動/停車 ${formatMins(
          stats.travel + stats.parking,
        )}</span>
      `;
      return row;
    }),
  );
};

const renderStop = (item) => {
  const template = document.querySelector("#stop-template");
  const node = template.content.firstElementChild.cloneNode(true);
  const img = node.querySelector("img");
  const figcaption = node.querySelector("figcaption");

  node.querySelector("time").textContent = item.time || "待排";
  node.querySelector(".category").textContent = item.category || "景點";
  node.querySelector(".status").textContent = item.status || "已排";
  node.querySelector("h3").textContent = item.title;
  node.querySelector(".address").textContent = item.address || "地址待補";
  node.querySelector(".note").textContent = item.note || "";
  node.querySelector(".map-link").href = getMapUrl(item);

  img.src = item.image || "";
  img.alt = item.imageAlt || item.title;
  img.addEventListener("error", () => {
    node.querySelector(".thumb").classList.add("is-fallback");
    figcaption.textContent = item.title;
  });
  figcaption.textContent = item.imageAlt || item.title;

  const metaRow = node.querySelector(".meta-row");
  const metaItems = [item.businessStatus, `停留 ${formatMins(item.durationMins || 0)}`, ...(item.tags || [])].filter(Boolean);
  metaRow.replaceChildren(
    ...metaItems.map((text) => {
      const pill = document.createElement("span");
      pill.className = "meta-pill";
      pill.textContent = text;
      return pill;
    }),
  );

  return node;
};

const renderDrive = (item) => {
  const template = document.querySelector("#drive-template");
  const node = template.content.firstElementChild.cloneNode(true);
  const travel = getTravelMins(item);
  const parking = item.parkingMins || 0;
  const total = travel + parking;
  const mode = item.mode || "開車";
  const parkingText = parking ? ` + ${formatMins(parking)}找停車位` : "";

  node.querySelector("time").textContent = item.time || "";
  node.querySelector(".drive-label").textContent = mode;
  node.querySelector("strong").textContent = `${item.from} → ${item.to} · ${formatMins(total)}`;
  node.querySelector("p").textContent = `${formatMins(travel)} ${mode}${parkingText}。${item.note || ""}`;

  return node;
};

const renderTimeline = () => {
  const timeline = document.querySelector("#timeline");
  const blocks = tripData.days.map((day, index) => {
    const stats = sumDay(day);
    const block = document.createElement("section");
    block.className = "day-block";
    block.id = day.id;

    const list = document.createElement("div");
    list.className = "day-list";

    if (day.items.length) {
      list.replaceChildren(...day.items.map((item) => (item.type === "drive" ? renderDrive(item) : renderStop(item))));
    } else {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "這天還沒有行程。";
      list.append(empty);
    }

    block.innerHTML = `
      <header class="day-header">
        <div>
          <p>${day.date} · 星期${day.weekday}</p>
          <h2>${day.title}</h2>
        </div>
        <div class="day-total">
          ${stats.stops} 個停靠點<br>
          ${formatMins(stats.travel + stats.parking)} 移動緩衝
        </div>
      </header>
    `;
    block.append(list);

    if (index > 0) block.setAttribute("tabindex", "-1");
    return block;
  });

  timeline.replaceChildren(...blocks);
};

renderOverview();
renderTimeline();
