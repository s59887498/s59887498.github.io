const CABIN = {
  name: "黃家小木屋",
  address: "台7甲線 67K（臺中市和平區，環山與梨山之間）",
  coords: "24.2974254,121.2685322",
  mapUrl: "https://maps.app.goo.gl/mDNJemFRUyTvjque8",
};

const tripData = {
  departure: "2026-12-11T15:30:00+08:00",
  days: [
    {
      id: "day-1",
      date: "12/11",
      weekday: "五",
      eyebrow: "Day 1 · 12/11 星期五",
      title: "夜市、採買，夜奔台七甲。",
      lede: "宜蘭市區吃飽、買好兩天的食材，晚上一路開上山，約 23:30 抵達小木屋。",
      items: [
        {
          type: "drive",
          time: "15:30-16:50",
          from: "台北",
          to: "宜蘭東門夜市",
          mins: 80,
          km: 53,
          note: "國 5 雪隧週五下午車多，建議 15:30 前出發，才趕得上 17:00 前抵達。",
        },
        {
          type: "stop",
          time: "17:00-19:30",
          mins: 150,
          icon: "market",
          title: "宜蘭東門觀光夜市",
          category: "晚餐",
          status: "已確認",
          address: "宜蘭縣宜蘭市（東門平交道旁）",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%AE%9C%E8%98%AD%E6%9D%B1%E9%96%80%E8%A7%80%E5%85%89%E5%A4%9C%E5%B8%82",
          navTo: "宜蘭東門觀光夜市",
          note: "17:00 前抵達、先停好車再慢慢吃。夜市攤位多半傍晚陸續開，越晚人越多。",
          parking: [
            {
              name: "東門夜市停車場",
              url: "https://www.google.com/search?kgmid=%2Fg%2F11sjyx0251",
              address: "宜蘭市新興路 32 號",
              note: "緊鄰夜市、步行即到。多為人工引導，計次或現金收費，車位較緊湊。",
            },
            {
              name: "Hi PARKING 宜蘭東門夜市一站",
              url: "https://www.google.com/search?kgmid=%2Fg%2F11wj28ctkg",
              address: "宜蘭市宜興路二段 55 號旁",
              note: "24 小時，支援線上／行動支付；部分場站可能只收現金，進場前看告示。",
            },
            {
              name: "Times 宜蘭東門夜市停車場",
              url: "https://www.google.com/search?kgmid=%2Fg%2F11wbk9_77s",
              address: "宜蘭市宜興路二段 23 號旁",
              note: "24 小時、室外車牌辨識，車位數較少，付款方式依場站公告。",
            },
          ],
          tags: ["現金備著"],
        },
        {
          type: "drive",
          time: "19:45-19:55",
          from: "東門夜市",
          to: "喜互惠",
          mins: 10,
          km: 2,
          note: "市區短程，約 5 分鐘車程加上停車。",
        },
        {
          type: "stop",
          time: "20:00-20:45",
          mins: 45,
          icon: "cart",
          title: "喜互惠（宜蘭文化店）",
          category: "採買",
          status: "營業時間待確認",
          address: "宜蘭縣宜蘭市（導航點為超市停車場）",
          mapUrl: "https://maps.app.goo.gl/6iPqRfYcg5VnrkPV8",
          navTo: "24.7494754,121.7423075",
          note: "一次買齊兩晚的食材：12/12 晚餐的火鍋或韓式鐵板烤肉，加上兩天的早午餐。山上幾乎沒有超市，漏買很難補。",
          points: [
            "火鍋：湯底、肉片、火鍋料、菇類、青菜",
            "韓式鐵板烤肉：五花／梅花肉片、泡菜、生菜、烤肉醬",
            "早午餐：吐司或貝果、蛋、培根、牛奶、水果",
            "飲料、零食、飲用水；需要冷藏的放保冷袋",
          ],
          tags: ["清單在頁尾", "保冷袋"],
        },
        {
          type: "drive",
          time: "20:45-22:25",
          from: "喜互惠",
          to: "南山 7-ELEVEN",
          mins: 100,
          km: 69,
          note: "走台 7 線接台 7 甲，約 1 小時 40 分。過了市區就是山路，建議出發前在宜蘭市區先加滿油。",
        },
        {
          type: "stop",
          time: "22:25-22:40",
          mins: 15,
          icon: "cup",
          title: "7-ELEVEN 南山門市",
          category: "休息點",
          status: "已確認",
          address: "宜蘭縣大同鄉南山村（台 7 甲線上）",
          mapUrl: "https://maps.app.goo.gl/o68QeiA58AeeJkho8",
          navTo: "24.4392173,121.3791021",
          note: "上廁所、買熱飲。接下來的山路沿途店家很少。",
          tags: ["最後補給"],
        },
        {
          type: "drive",
          time: "22:40-23:30",
          from: "南山",
          to: "小木屋",
          mins: 50,
          km: 37,
          note: "經思源埡口往環山方向，夜間可能起霧，彎多請放慢。",
        },
        {
          type: "stop",
          time: "23:30",
          mins: 0,
          icon: "cabin",
          title: "抵達黃家小木屋",
          category: "住宿",
          status: "自家小木屋",
          address: CABIN.address,
          mapUrl: CABIN.mapUrl,
          navTo: CABIN.coords,
          note: "到家了。放行李、食材先冰，早點休息。",
          tags: ["入住"],
        },
      ],
    },
    {
      id: "day-2",
      date: "12/12",
      weekday: "六",
      eyebrow: "Day 2 · 12/12 星期六",
      title: "武陵農場，然後等流星。",
      lede: "睡飽吃早午餐，下午逛武陵農場，回小木屋吃晚餐，晚上上武嶺看雙子座流星雨。",
      items: [
        {
          type: "stop",
          time: "10:00-12:00",
          mins: 120,
          icon: "bowl",
          title: "早午餐歡樂時光",
          category: "早午餐",
          status: "已確認",
          address: CABIN.address,
          mapUrl: CABIN.mapUrl,
          navTo: CABIN.coords,
          note: "用前一晚採買的食材在小木屋開伙，吃飽再出門。",
          tags: ["小木屋"],
        },
        {
          type: "drive",
          time: "12:00-12:40",
          from: "小木屋",
          to: "武陵農場",
          mins: 40,
          km: 21,
          note: "沿台 7 甲往回開，再轉武陵路進農場，約 30 分鐘，加上收費站與停車。",
        },
        {
          type: "stop",
          time: "12:40-16:00",
          mins: 200,
          icon: "leaf",
          title: "武陵農場",
          category: "農場",
          status: "已確認",
          address: "臺中市和平區平等里武陵路 3-1 號",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%AD%A6%E9%99%B5%E8%BE%B2%E5%A0%B4",
          navTo: "武陵農場",
          note: "12 月中旬若碰上楓紅尾聲會很漂亮（每年氣候不同）。門票、停車費與入園時間以農場公告為準。",
          points: [
            "武陵吊橋、七家灣溪步道：平緩好走",
            "櫻花鉤吻鮭生態中心：看國寶魚",
            "茶園與楓林區：拍照",
            "桃山瀑布步道單程約 4.3 公里，來回 3 至 4 小時，時間不夠就跳過",
          ],
          tags: ["門票依現場公告"],
        },
        {
          type: "drive",
          time: "16:00-16:40",
          from: "武陵農場",
          to: "小木屋",
          mins: 40,
          km: 21,
          note: "趁天還亮回到小木屋，山區冬天約 17:00 後就暗了。",
        },
        {
          type: "stop",
          time: "16:40-20:30",
          mins: 230,
          icon: "bowl",
          title: "小木屋晚餐：火鍋或韓式鐵板烤肉",
          category: "晚餐",
          status: "烤肉才帶烤盤",
          address: CABIN.address,
          mapUrl: CABIN.mapUrl,
          navTo: CABIN.coords,
          note: "先休息一下再開伙，大約 18:00 開吃。鍋具小木屋有，如果要烤肉，韓式烤盤記得從台北家裡帶上山。",
          tags: ["休息", "換裝保暖"],
        },
        {
          type: "drive",
          time: "20:30-22:00",
          from: "小木屋",
          to: "武嶺",
          mins: 90,
          km: 47,
          note: "經梨山接台 8 線到大禹嶺，再上台 14 甲到武嶺。全程山路、夜間低溫，出發前查公路局即時路況。",
        },
        {
          type: "stop",
          time: "22:00-00:30",
          mins: 150,
          icon: "star",
          title: "武嶺路牌看流星",
          category: "觀星",
          status: "看天氣",
          address: "南投縣仁愛鄉台 14 甲線（海拔 3,275 公尺）",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%AD%A6%E5%B6%BA",
          navTo: "武嶺停車場",
          note: "雙子座流星雨極大期在 12/14 前後，12/12 晚上已經很有看頭。停好車後讓眼睛適應黑暗 15 分鐘再開始找。",
          tags: ["可能低於 0°C", "詳見觀星筆記"],
        },
        {
          type: "drive",
          time: "00:30-02:00",
          from: "武嶺",
          to: "小木屋",
          mins: 90,
          km: 47,
          note: "深夜回程最需要專心，駕駛累了就在大禹嶺或梨山停下來休息。",
        },
      ],
    },
    {
      id: "day-3",
      date: "12/13",
      weekday: "日",
      eyebrow: "Day 3 · 12/13 星期日",
      title: "睡到自然醒，梨山午餐，回台北。",
      lede: "前一晚很晚睡，早上慢慢收拾，中午到梨山吃飯後一路開回台北。",
      items: [
        {
          type: "stop",
          time: "09:30-11:00",
          mins: 90,
          icon: "moon",
          title: "小木屋休息、收拾出發",
          category: "收拾",
          status: "自家，不趕時間",
          address: CABIN.address,
          mapUrl: CABIN.mapUrl,
          navTo: CABIN.coords,
          note: "自己家沒有退房時間，睡飽再慢慢收。吃完剩下的早餐、整理垃圾，烤盤和睡袋寢具記得帶走。",
          tags: ["睡到自然醒"],
        },
        {
          type: "drive",
          time: "11:00-11:15",
          from: "小木屋",
          to: "梨山市區",
          mins: 15,
          km: 8,
          note: "沿台 7 甲往梨山方向，很近。",
        },
        {
          type: "stop",
          time: "11:15-12:30",
          mins: 75,
          icon: "bowl",
          title: "梨山市區午餐",
          category: "午餐",
          status: "合菜餐廳待問爸爸",
          address: "臺中市和平區梨山里（中正路一帶）",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%A2%A8%E5%B1%B1+%E9%A4%90%E5%BB%B3",
          navTo: "梨山 臺中市和平區",
          note: "爸爸知道一家合菜，店名確認後再補上。",
        },
        {
          type: "drive",
          time: "12:30-17:30",
          from: "梨山",
          to: "台北",
          mins: 300,
          km: 172,
          note: "走台 7 甲回宜蘭再上國 5，順的話約 3 小時 45 分；週日下午國 5 北上常塞，抓 5 小時比較保險，中途可在南山或宜蘭休息。",
        },
      ],
    },
  ],
  nightNotes: [
    {
      title: "雙子座流星雨",
      body: "每年 12 月中旬的流星雨，極大期在 12/14 前後。12/12 晚上已在活躍期內，流星會從雙子座附近往四面八方劃過，不必一直盯著同一個方向。",
    },
    {
      title: "月光幾乎不打擾",
      body: "12/9 前後是新月。12/12 晚上只剩細細的眉月，入夜不久就落下，天空會很暗。",
    },
    {
      title: "什麼時候最好看",
      body: "輻射點晚上爬得越高、看到的流星越多。22:00 之後明顯變多，越接近半夜越好。",
    },
    {
      title: "武嶺會很冷",
      body: "海拔 3,275 公尺，12 月夜裡常在 0°C 上下、風也大。羽絨外套、毛帽、手套、暖暖包都帶上，熱飲裝保溫瓶。",
    },
    {
      title: "路況與管制",
      body: "遇到寒流或降雪，台 14 甲可能實施管制、需要雪鍊。出發前看公路局 1968 App 或「合歡山路況」公告。",
    },
    {
      title: "觀星禮儀",
      body: "停車場車多人多，停好後關大燈；手電筒用紅光或朝地面照，避免影響其他人的暗適應。",
    },
  ],
  checklists: [
    {
      id: "groceries",
      title: "喜互惠採買",
      items: [
        "火鍋湯底、火鍋料",
        "火鍋／烤肉肉片",
        "菇類、青菜、生菜",
        "泡菜、烤肉醬、蒜頭",
        "早午餐：吐司或貝果、蛋、培根",
        "牛奶、果汁、水果",
        "飲用水、啤酒、飲料",
        "零食、泡麵（宵夜）",
        "垃圾袋、廚房紙巾、保鮮盒",
      ],
    },
    {
      id: "gear",
      title: "隨身裝備",
      items: [
        "睡袋，或枕頭＋棉被（至少一組，必帶）",
        "韓式烤盤（從家裡帶）",
        "羽絨外套、毛帽、手套",
        "暖暖包、厚襪",
        "保溫瓶",
        "頭燈或紅光手電筒",
        "行動電源、手機腳架",
        "暈車藥、個人藥品",
        "現金（夜市、停車場）",
      ],
    },
    {
      id: "confirm",
      title: "出發前確認",
      items: [
        "問爸爸梨山合菜餐廳",
        "宜蘭市區加滿油",
        "充滿電",
        "查 12/12 晚上天氣與雲量",
        "查台 8、台 14 甲路況與管制",
      ],
    },
  ],
};

const ICONS = {
  market:
    '<path d="M3 9h18l-1.6-5H4.6z"/><path d="M5 9v11h14V9"/><path d="M9.5 20v-5.5h5V20"/>',
  cart:
    '<circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2.2l2.3 11.2h11l2-8H6.4"/>',
  cup:
    '<path d="M4.5 9h12v4.5a5.5 5.5 0 0 1-5.5 5.5h-1a5.5 5.5 0 0 1-5.5-5.5z"/><path d="M16.5 10.5h1.2a2.3 2.3 0 0 1 0 4.6h-1.4"/><path d="M8.5 3.5v2.5M12.5 3.5v2.5"/>',
  cabin:
    '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>',
  leaf:
    '<path d="M5 19.5C5 11 10.5 5 20 4.5c-.4 9.6-6.4 15-15 15z"/><path d="M5 19.5 13.5 11"/>',
  star:
    '<path d="m12 3.5 2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/>',
  bowl:
    '<path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0z"/><path d="M8.5 8c0-1.2 1-1.6 1-2.8M12 8c0-1.2 1-1.6 1-2.8M15.5 8c0-1.2 1-1.6 1-2.8"/>',
  moon: '<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.3 6.3 0 0 0 10 10z"/>',
};

const STORAGE_KEY = "cabin-trip-checklist-v2";

const formatMins = (mins) => {
  if (!mins) return "0 分";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} 分`;
  if (!m) return `${h} 小時`;
  return `${h} 小時 ${m} 分`;
};

const formatHours = (mins) => {
  const hours = Math.round((mins / 60) * 10) / 10;
  return `${hours} 小時`;
};

const navUrl = (destination) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;

const isPending = (status = "") => status.includes("待");

const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
    ICONS[name] || ICONS.star
  }</svg>`;

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const sumItems = (items) =>
  items.reduce(
    (acc, item) => {
      if (item.type === "stop") {
        acc.stops += 1;
        if (isPending(item.status)) acc.pending += 1;
      } else {
        acc.drive += item.mins || 0;
        acc.km += item.km || 0;
      }
      return acc;
    },
    { stops: 0, drive: 0, km: 0, pending: 0 },
  );

const allItems = tripData.days.flatMap((day) => day.items);
const totals = sumItems(allItems);

const renderStats = () => {
  document.querySelector("#stat-stops").textContent = `${totals.stops} 個`;
  document.querySelector("#stat-drive").textContent = formatHours(totals.drive);
  document.querySelector("#stat-distance").textContent = `${totals.km} km`;
  document.querySelector("#stat-pending").textContent = `${totals.pending} 項`;
};

const renderCountdown = () => {
  const node = document.querySelector("#countdown");
  const start = new Date(tripData.departure);
  const end = new Date("2026-12-13T23:59:59+08:00");
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  if (now < start) {
    const days = Math.ceil((start - now) / dayMs);
    node.textContent = days <= 1 ? "明天就出發" : `距離出發還有 ${days} 天`;
  } else if (now <= end) {
    node.textContent = "旅途進行中";
  } else {
    node.textContent = "這趟旅行已經結束";
  }
};

const renderRouteOverview = () => {
  const wrap = document.querySelector("#route-overview");
  const rows = tripData.days.map((day) => {
    const row = el("div", "route-day");
    const label = el("a", "route-day-label");
    label.href = `#${day.id}`;
    label.innerHTML = `<strong>${day.date}</strong><span>星期${day.weekday}</span>`;

    const track = el("ol", "route-track");
    day.items.forEach((item) => {
      if (item.type === "stop") {
        const li = el("li", "route-stop");
        li.innerHTML = `<span class="route-icon">${icon(item.icon)}</span>`;
        li.append(el("span", "route-name", item.title.replace(/（.*?）/g, "")));
        track.append(li);
      } else {
        track.append(el("li", "route-leg", formatMins(item.mins)));
      }
    });

    row.append(label, track);
    return row;
  });
  wrap.replaceChildren(...rows);
};

const renderStop = (item) => {
  const node = document.querySelector("#stop-template").content.firstElementChild.cloneNode(true);
  node.querySelector("time").textContent = item.time;
  node.querySelector(".icon").innerHTML = icon(item.icon);
  node.querySelector(".tag-category").textContent = item.category;

  const status = node.querySelector(".tag-status");
  status.textContent = item.status;
  if (isPending(item.status)) status.classList.add("is-pending");

  node.querySelector("h3").textContent = item.title;
  node.querySelector(".stop-address").textContent = item.address;
  node.querySelector(".stop-note").textContent = item.note;

  const points = node.querySelector(".stop-points");
  if (item.points?.length) {
    points.replaceChildren(...item.points.map((text) => el("li", "", text)));
  } else {
    points.remove();
  }

  if (item.parking?.length) {
    const parking = node.querySelector(".parking");
    parking.hidden = false;
    parking.querySelector(".parking-list").replaceChildren(
      ...item.parking.map((lot) => {
        const li = el("li", "parking-item");
        const link = el("a", "parking-name", lot.name);
        link.href = lot.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        li.append(link, el("span", "parking-address", lot.address), el("span", "parking-note", lot.note));
        return li;
      }),
    );
  }

  const meta = node.querySelector(".stop-meta");
  const metaItems = [item.mins ? `停留 ${formatMins(item.mins)}` : null, ...(item.tags || [])].filter(Boolean);
  meta.replaceChildren(...metaItems.map((text) => el("span", "pill", text)));

  node.querySelector(".nav-link").href = navUrl(item.navTo || item.title);
  node.querySelector(".map-link").href = item.mapUrl;
  return node;
};

const renderDrive = (item) => {
  const node = document.querySelector("#drive-template").content.firstElementChild.cloneNode(true);
  node.querySelector("time").textContent = item.time;
  node.querySelector(".drive-summary").innerHTML = "";
  node
    .querySelector(".drive-summary")
    .append(
      el("span", "drive-label", "開車"),
      el("strong", "", `${item.from} → ${item.to}`),
      el("span", "drive-figure", `約 ${formatMins(item.mins)} · ${item.km} km`),
    );
  node.querySelector(".drive-note").textContent = item.note;
  return node;
};

const renderDays = () => {
  const container = document.querySelector("#days");
  const sections = tripData.days.map((day, index) => {
    const stats = sumItems(day.items);
    const section = el("section", `section section-day ${index % 2 ? "is-alt" : ""}`);
    section.id = day.id;
    section.setAttribute("aria-labelledby", `${day.id}-title`);

    const inner = el("div", "section-inner");
    const head = el("header", "day-head");
    const titleWrap = el("div");
    titleWrap.append(el("p", "section-eyebrow", day.eyebrow));
    const h2 = el("h2", "section-title", day.title);
    h2.id = `${day.id}-title`;
    titleWrap.append(h2, el("p", "section-lede", day.lede));

    const summary = el("dl", "day-summary");
    [
      ["停靠點", `${stats.stops} 個`],
      ["開車", formatMins(stats.drive)],
      ["里程", `${stats.km} km`],
    ].forEach(([k, v]) => {
      const group = el("div");
      group.append(el("dt", "", k), el("dd", "", v));
      summary.append(group);
    });

    head.append(titleWrap, summary);

    const timeline = el("div", "timeline");
    timeline.append(...day.items.map((item) => (item.type === "drive" ? renderDrive(item) : renderStop(item))));

    inner.append(head, timeline);
    section.append(inner);
    return section;
  });
  container.replaceChildren(...sections);
};

const renderNightNotes = () => {
  const grid = document.querySelector("#night-notes");
  grid.replaceChildren(
    ...tripData.nightNotes.map((note) => {
      const card = el("article", "night-card");
      card.append(el("h3", "", note.title), el("p", "", note.body));
      return card;
    }),
  );
};

const loadChecks = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const saveChecks = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: checks stay in memory only */
  }
};

let checkState = loadChecks();

const renderChecklists = () => {
  const grid = document.querySelector("#checklists");
  grid.replaceChildren(
    ...tripData.checklists.map((list) => {
      const card = el("article", "check-card");
      const head = el("header", "check-head");
      const count = el("span", "check-count");
      head.append(el("h3", "", list.title), count);

      const ul = el("ul", "check-list");
      const updateCount = () => {
        const done = list.items.filter((_, i) => checkState[`${list.id}-${i}`]).length;
        count.textContent = `${done} / ${list.items.length}`;
        card.classList.toggle("is-complete", done === list.items.length);
      };

      list.items.forEach((text, i) => {
        const key = `${list.id}-${i}`;
        const li = el("li");
        const label = el("label", "check-item");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(checkState[key]);
        input.addEventListener("change", () => {
          checkState[key] = input.checked;
          if (!input.checked) delete checkState[key];
          saveChecks(checkState);
          updateCount();
        });
        label.append(input, el("span", "check-box"), el("span", "check-text", text));
        li.append(label);
        ul.append(li);
      });

      updateCount();
      card.append(head, ul);
      return card;
    }),
  );
};

document.querySelector("#reset-checklist").addEventListener("click", () => {
  checkState = {};
  saveChecks(checkState);
  renderChecklists();
});

const startSky = () => {
  const canvas = document.querySelector(".sky");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [];
  let meteor = null;
  let width = 0;
  let height = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.round((width * height) / 5200);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.1 + 0.2,
      a: Math.random() * 0.6 + 0.25,
      t: Math.random() * Math.PI * 2,
    }));
  };

  const draw = (time = 0) => {
    ctx.clearRect(0, 0, width, height);
    stars.forEach((s) => {
      const twinkle = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin(time / 900 + s.t);
      ctx.globalAlpha = s.a * twinkle;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) {
      if (!meteor && Math.random() < 0.006) {
        meteor = {
          x: Math.random() * width * 0.7 + width * 0.2,
          y: Math.random() * height * 0.35,
          len: 90 + Math.random() * 80,
          life: 0,
        };
      }
      if (meteor) {
        meteor.life += 1;
        const progress = meteor.life / 40;
        const headX = meteor.x - progress * 260;
        const headY = meteor.y + progress * 140;
        const gradient = ctx.createLinearGradient(headX, headY, headX + meteor.len, headY - meteor.len * 0.54);
        gradient.addColorStop(0, "rgba(255,255,255,0.9)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(headX + meteor.len, headY - meteor.len * 0.54);
        ctx.stroke();
        if (progress >= 1) meteor = null;
      }
      requestAnimationFrame(draw);
    }
    ctx.globalAlpha = 1;
  };

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw();
  });
  draw();
};

const watchNav = () => {
  const links = [...document.querySelectorAll(".nav-links a")];
  const targets = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  targets.forEach((target) => observer.observe(target));
};

renderStats();
renderCountdown();
renderRouteOverview();
renderDays();
renderNightNotes();
renderChecklists();
startSky();
watchNav();
