export const rooms = [
  {
    id: 1,
    name: "波段小組",
    owner: "波段老手",
    tradingCycle: "中期波段",
    description: "聚焦季報與籌碼，偏好電子權值股",
    memberCount: 87,
  },
  {
    id: 2,
    name: "當沖快打",
    owner: "沖沖衝",
    tradingCycle: "短線波段",
    description: "九點半前決策，十點半前出清為主",
    memberCount: 152,
  },
  {
    id: 3,
    name: "存股 ETF",
    owner: "股息雷達",
    tradingCycle: "長期波段",
    description: "聚焦股息與總體經濟趨勢",
    memberCount: 64,
  },
];

export const trades = [
  {
    id: 101,
    roomId: 1,
    stockCode: "2330",
    stockName: "台積電",
    shares: 2,
    tradeDate: "2024-07-08",
    action: "加碼",
    note: "接近季線，分批佈局",
  },
  {
    id: 102,
    roomId: 1,
    stockCode: "2317",
    stockName: "鴻海",
    shares: 3,
    tradeDate: "2024-07-05",
    action: "買進",
    note: "電動車題材持續催化",
  },
  {
    id: 201,
    roomId: 2,
    stockCode: "2603",
    stockName: "長榮",
    shares: 5,
    tradeDate: "2024-07-08",
    action: "賣出",
    note: "運價走弱，先停利",
  },
  {
    id: 202,
    roomId: 2,
    stockCode: "0050",
    stockName: "台灣50",
    shares: 10,
    tradeDate: "2024-07-08",
    action: "買進",
    note: "資金回流權值，短打三日",
  },
  {
    id: 301,
    roomId: 3,
    stockCode: "00878",
    stockName: "國泰永續高股息",
    shares: 20,
    tradeDate: "2024-07-01",
    action: "買進",
    note: "季配息前補貨",
  },
];

export const seedComments = {
  101: [
    { user: "Kevin", content: "季線附近的確不錯，謝謝分享" },
  ],
  201: [
    { user: "Lily", content: "運價指數連跌，先觀望" },
  ],
};

export const getTradesByRoom = (roomId) => trades.filter((t) => t.roomId === roomId);
