const tripData = {
  title: "台南兩天一夜",
  dateRange: "2026.07.18 - 2026.07.19",
  note:
    "Day 1 下午進台南後先吃鴻牛、去又又美 FotoShop 買底片，再 Check in、面交與休息；Day 2 買完咖啡後，單獨安排台南美術館二館散步。",
  summary:
    "主要時間以最新表格為準。15:00 Check in 時先找好車位，16:30 吃冰、17:00 去漁光島與觀夕平台；Day 2 的咖啡與美館已拆成兩個站點。",
  reminders: [
    "住宿 Check in 時先找好車位，後面國華街與晚間行程盡量步行或短程計程車",
    "電子琴面交已併入 15:00-16:30 的 Check in 時段，最好直接約在住宿附近",
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
          type: "drive",
          mode: "開車",
          time: "07:30-13:00",
          from: "台北市出發",
          to: "抵達台南",
          travelMins: 330,
          parkingMins: 0,
          note: "依截圖時間表抓 5 小時 30 分鐘，含路況、休息站與進市區緩衝。",
        },
        {
          type: "stop",
          time: "13:00-14:00",
          durationMins: 60,
          title: "鴻牛溫體牛肉湯-東寧店",
          category: "牛肉湯",
          status: "建議安排",
          address: "701 臺南市東區東寧路430號",
          mapUrl: "https://maps.app.goo.gl/JAs1y7zrr69Sf6Z39?g_st=ic",
          image: "assets/thumb-beef.svg",
          imageAlt: "牛肉湯與熱湯碗",
          businessStatus: "營業中 24 小時",
          note: "抵達台南後第一餐。目前公開資料標示 24 小時營業，13:00 在營業時段內。",
          tags: ["午餐", "東區"],
        },
        {
          type: "stop",
          time: "14:00-15:00",
          durationMins: 60,
          title: "又又美 FotoShop",
          category: "底片相機店",
          status: "新增",
          address: "700 臺南市中西區大埔街51號",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%8F%88%E5%8F%88%E7%BE%8E%20FotoShop%20%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E5%A4%A7%E5%9F%94%E8%A1%9751%E8%99%9F",
          image: "assets/thumb-film.svg",
          imageAlt: "復古相機與底片",
          businessStatus: "營業中 12:00-20:00",
          note: "圖片上的底片行程是又又美 FotoShop。14:00 抵達時位於公開營業時段內，出發前再看當週公告。",
          tags: ["買底片", "復古相機"],
        },
        {
          type: "stop",
          time: "15:00-16:30",
          durationMins: 90,
          title: "Check in／面交電子琴／休息",
          category: "住宿與任務",
          status: "面交待確認",
          address: "700 臺南市中西區文賢路32巷5號",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=700%20%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E6%96%87%E8%B3%A2%E8%B7%AF32%E5%B7%B75%E8%99%9F",
          image: "assets/thumb-hotel.svg",
          imageAlt: "旅宿、電子琴面交與休息",
          note: "15:00 先 Check in、放行李並找好車位，面交電子琴預估 15 分鐘，剩餘時間休息。之後去吃冰、漁光島與晚間行程就不用再為停車分心。",
          tags: ["放行李", "面交 15 分", "找好車位"],
        },
        {
          type: "stop",
          time: "16:30-17:00",
          durationMins: 30,
          title: "Ø無醉推定",
          category: "甜點冰店",
          status: "建議安排",
          address: "700 臺南市中西區民生路二段51號，國華街三段50號斜對面",
          mapUrl: "https://maps.app.goo.gl/WkAfFTCWtADjJHp29?g_st=ic",
          image: "assets/thumb-dessert.svg",
          imageAlt: "冰品甜點",
          businessStatus: "營業待確認",
          note: "Check in、面交與休息後先吃冰，17:00 再往漁光島。",
          tags: ["甜點", "國華街"],
        },
        {
          type: "stop",
          time: "17:00-19:00",
          durationMins: 120,
          title: "漁光島／觀夕平台",
          category: "海邊與夕陽",
          status: "建議安排",
          address: "台南市安平區漁光路",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%BC%81%E5%85%89%E5%B3%B6",
          image: "assets/thumb-island.svg",
          imageAlt: "漁光島、觀夕平台與夕光",
          businessStatus: "戶外全天",
          note: "17:00 從市區出發，這段包含移動、漁光島與觀夕平台的停留時間。",
          tags: ["海邊", "觀夕", "移動含在時段內"],
        },
        {
          type: "stop",
          time: "19:00-21:00",
          durationMins: 120,
          title: "蓋拉澳式漢堡-淺草店",
          category: "漢堡",
          status: "建議安排",
          address: "70059 臺南市中西區國華街三段28號之4",
          mapUrl: "https://maps.app.goo.gl/gi1zozzjSr8VUBhVA?g_st=ic",
          image: "assets/thumb-burger.svg",
          imageAlt: "漢堡與薯條",
          businessStatus: "營業中 17:00-24:00",
          note: "依最新時間表排 19:00-21:00，位於公開營業時段內；這段包含排隊、用餐與聊天。",
          tags: ["晚餐", "國華街"],
        },
        {
          type: "stop",
          time: "21:00-21:30",
          durationMins: 30,
          title: "住宿休息／晚間準備",
          category: "緩衝",
          status: "建議保留",
          address: "700 臺南市中西區文賢路32巷5號",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=700%20%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E6%96%87%E8%B3%A2%E8%B7%AF32%E5%B7%B75%E8%99%9F",
          image: "assets/thumb-hotel.svg",
          imageAlt: "晚間休息與整備",
          note: "回住宿補水、整理 30 分鐘，準備晚上的便利商店酒精路跑。",
          tags: ["補水", "換裝"],
        },
        {
          type: "stop",
          time: "21:30-22:30",
          durationMins: 60,
          title: "便利商店酒精路跑",
          category: "路線",
          status: "粗估",
          address: "住宿 → 成功路22巷42弄13號 Moonrock",
          mapUrl:
            "https://www.google.com/maps/dir/?api=1&origin=700%20%E5%8F%B0%E5%8D%97%E5%B8%82%E4%B8%AD%E8%A5%BF%E5%8D%80%E6%96%87%E8%B3%A2%E8%B7%AF32%E5%B7%B75%E8%99%9F&destination=704%20%E5%8F%B0%E5%8D%97%E5%B8%82%E5%8C%97%E5%8D%80%E6%88%90%E5%8A%9F%E8%B7%AF22%E5%B7%B742%E5%BC%8413%E8%99%9F%20Moonrock&travelmode=walking",
          image: "assets/thumb-route.svg",
          imageAlt: "步行路線與便利商店酒精路跑站點",
          note: "依最新時間表排 21:30-22:30。便利商店酒精路跑站點可抓 3-5 間，實際路線當晚看狀態微調。",
          tags: ["3-5 間", "步行"],
        },
        {
          type: "stop",
          time: "22:30-00:00",
          durationMins: 90,
          title: "Moonrock（候位）",
          category: "酒吧",
          status: "候位",
          address: "704 臺南市北區成功路22巷42弄13號",
          mapUrl: "https://maps.app.goo.gl/F2yB9QznB5tnbRBw5?g_st=ic",
          image: "assets/thumb-bar.svg",
          imageAlt: "夜晚酒吧",
          businessStatus: "營業中 20:00-02:00",
          note: "依截圖排 22:30-00:00 候位，位於公開營業時段內。回程視狀態叫車比較安全。",
          tags: ["酒吧", "成功路"],
        },
      ],
    },
    {
      id: "day-2",
      date: "7/19",
      weekday: "日",
      title: "Day 2｜咖啡、美術館、牛肉湯、回台北",
      items: [
        {
          type: "stop",
          time: "10:00-10:30",
          durationMins: 30,
          title: "Barista Ray Coffee",
          category: "咖啡",
          status: "新增",
          address: "700 臺南市中西區友愛街22號",
          mapUrl: "https://maps.app.goo.gl/Etj8pxsHd9d6K3o47?g_st=ic",
          image: "assets/thumb-coffee.svg",
          imageAlt: "早晨咖啡",
          businessStatus: "營業中 10:00-18:00",
          note: "10:00 先買咖啡，退房與行李整理要在這之前完成。買完後單獨前往附近的台南美術館二館。",
          tags: ["咖啡", "友愛街"],
        },
        {
          type: "stop",
          time: "10:30-12:00",
          durationMins: 90,
          title: "台南美術館二館",
          category: "美術館",
          status: "已拆開安排",
          address: "700 臺南市中西區忠義路二段1號",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E8%87%BA%E5%8D%97%E5%9C%8B%E5%AE%B6%E7%BE%8E%E8%A1%93%E9%A4%A8%E7%B1%8C%E5%82%99%E8%99%95%20%E5%BF%A0%E7%BE%A9%E8%B7%AF%E4%BA%8C%E6%AE%B51%E8%99%9F",
          image: "assets/thumb-museum.svg",
          imageAlt: "台南美術館二館多邊形建築",
          businessStatus: "開館中 10:00-18:00",
          note: "買完咖啡後再進美館走走。2026 年起二館已改由「臺南國家美術館籌備處」營運；7/19 是週日，10:30 位於官方開館時段內。",
          tags: ["步行可達", "週日開館"],
        },
        {
          type: "stop",
          time: "12:00-13:00",
          durationMins: 60,
          title: "牛家莊牛肉湯",
          category: "牛肉湯",
          status: "建議安排",
          address: "70056 臺南市中西區郡西路86號",
          mapUrl: "https://maps.app.goo.gl/cAGRdiwgJzfTmze57?g_st=ic",
          image: "assets/thumb-beef.svg",
          imageAlt: "台南牛肉湯早餐",
          businessStatus: "營業中 11:00-14:00",
          note: "依截圖排 12:00-13:00，美館結束後再去吃牛肉湯；週日中午營業到 14:00。",
          tags: ["早餐", "中西區"],
        },
        {
          type: "drive",
          mode: "開車",
          time: "13:30-19:30",
          from: "台南",
          to: "台北",
          travelMins: 360,
          parkingMins: 0,
          note: "依截圖排 13:30-19:30 回台北，含休息站與週日下午北上緩衝。",
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
