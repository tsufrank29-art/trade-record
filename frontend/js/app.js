import { rooms, getTradesByRoom, seedComments } from './mock-data.js';

const joinedRoomsKey = 'stockClub_joinedRooms';
const storedCommentsKey = 'stockClub_comments';

let selectedRoomId = null;
let joinedRooms = new Set(loadJoinedRooms());
let userComments = loadComments();

function loadJoinedRooms() {
  try {
    const saved = localStorage.getItem(joinedRoomsKey);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.warn('Failed to read joined rooms from storage', err);
    return [];
  }
}

function saveJoinedRooms() {
  localStorage.setItem(joinedRoomsKey, JSON.stringify([...joinedRooms]));
}

function loadComments() {
  try {
    const saved = localStorage.getItem(storedCommentsKey);
    return saved ? JSON.parse(saved) : {};
  } catch (err) {
    console.warn('Failed to read comments from storage', err);
    return {};
  }
}

function saveComments() {
  localStorage.setItem(storedCommentsKey, JSON.stringify(userComments));
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
  });
}

function setActiveView(view) {
  const overview = document.getElementById('view-overview');
  const roomDetail = document.getElementById('view-room');
  const placeholder = document.getElementById('view-placeholder');
  [overview, roomDetail, placeholder].forEach((node) => node.classList.add('hidden'));
  if (view === 'overview') overview.classList.remove('hidden');
  if (view === 'room') roomDetail.classList.remove('hidden');
  if (view === 'placeholder') placeholder.classList.remove('hidden');
}

function renderRooms() {
  const container = document.getElementById('room-list');
  const sortSelect = document.getElementById('sort-select');
  container.innerHTML = '';
  let list = [...rooms];
  if (sortSelect.value === 'members') {
    list.sort((a, b) => b.memberCount - a.memberCount);
  }

  list.forEach((room) => {
    const card = document.createElement('div');
    card.className = 'card';
    const joined = joinedRooms.has(room.id);
    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs text-gray-400">${room.owner}</p>
          <h3 class="text-lg font-semibold">${room.name}</h3>
          <p class="text-sm text-gray-300">${room.description}</p>
        </div>
        <div class="text-right text-sm text-gray-300">
          <p class="flex items-center justify-end gap-1">${room.tradingCycle}</p>
          <p class="flex items-center justify-end gap-1"><i data-feather="users" class="w-4 h-4"></i>${room.memberCount}</p>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-between text-sm">
        <div class="text-gray-300">最近操作：${summarizeTrades(room.id)}</div>
        <div class="flex gap-2">
          <button class="btn-secondary" data-room="${room.id}" data-action="view">進入</button>
          <button class="btn-primary" data-room="${room.id}" data-action="join">${joined ? '已加入' : '加入房間'}</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  feather.replace();
}

function summarizeTrades(roomId) {
  const trades = getTradesByRoom(roomId)
    .sort((a, b) => new Date(b.tradeDate) - new Date(a.tradeDate))
    .slice(0, 3)
    .map((t) => `${t.stockCode} ${t.stockName}`);
  return trades.length ? trades.join(' · ') : '尚未新增操作記錄';
}

function renderRoomDetail(roomId) {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;
  const title = document.getElementById('room-title');
  const info = document.getElementById('room-info');
  const list = document.getElementById('trade-list');
  list.innerHTML = '';
  title.textContent = room.name;
  info.textContent = `${room.tradingCycle} · 成員 ${room.memberCount}`;

  const roomTrades = getTradesByRoom(roomId);
  roomTrades.forEach((trade) => {
    const card = document.createElement('div');
    card.className = 'card';
    const comments = getCommentsForTrade(trade.id);
    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs text-gray-400">${formatDate(trade.tradeDate)}</p>
          <h3 class="text-lg font-semibold">${trade.stockCode} ${trade.stockName}</h3>
          <p class="text-sm text-green-300 font-medium">${trade.action} · ${trade.shares} 張</p>
          <p class="text-sm text-gray-300">${trade.note}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary" data-trade="${trade.id}" data-action="comment">我要留言</button>
        </div>
      </div>
      <div class="mt-3 text-sm">
        <p class="text-gray-400 mb-1">留言</p>
        <div class="space-y-2" data-comments-for="${trade.id}">
          ${comments.length ? comments.map((c) => commentTemplate(c)).join('') : '<p class="text-gray-500">尚無留言</p>'}
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

function commentTemplate(comment) {
  return `<div class="p-2 bg-gray-800 rounded-xl border border-gray-700">
    <p class="text-xs text-gray-400">${comment.user}</p>
    <p class="text-sm">${comment.content}</p>
  </div>`;
}

function getCommentsForTrade(tradeId) {
  const seeded = seedComments[tradeId] || [];
  const persisted = userComments[tradeId] || [];
  return [...seeded, ...persisted];
}

function promptComment(tradeId) {
  const user = prompt('你的暱稱？', '訪客');
  if (user === null) return;
  const content = prompt('留言內容');
  if (!content) return;
  const payload = { user, content };
  if (!userComments[tradeId]) userComments[tradeId] = [];
  userComments[tradeId].push(payload);
  saveComments();
  refreshComments(tradeId);
}

function refreshComments(tradeId) {
  const container = document.querySelector(`[data-comments-for="${tradeId}"]`);
  if (!container) return;
  const comments = getCommentsForTrade(tradeId);
  container.innerHTML = comments.length
    ? comments.map((c) => commentTemplate(c)).join('')
    : '<p class="text-gray-500">尚無留言</p>';
}

function joinRoom(roomId) {
  joinedRooms.add(roomId);
  saveJoinedRooms();
  renderRooms();
}

function setupEventDelegation() {
  document.body.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('[data-action="join"]')) {
      const roomId = Number(target.getAttribute('data-room'));
      joinRoom(roomId);
    }
    if (target.matches('[data-action="view"]')) {
      const roomId = Number(target.getAttribute('data-room'));
      selectedRoomId = roomId;
      renderRoomDetail(roomId);
      setActiveView('room');
    }
    if (target.matches('#btn-back')) {
      setActiveView('overview');
    }
    if (target.matches('[data-action="comment"]')) {
      const tradeId = Number(target.getAttribute('data-trade'));
      promptComment(tradeId);
    }
    if (target.matches('#nav-overview')) {
      event.preventDefault();
      setActiveView('overview');
    }
    if (target.matches('#nav-room')) {
      event.preventDefault();
      if (!selectedRoomId && rooms.length) {
        selectedRoomId = rooms[0].id;
        renderRoomDetail(selectedRoomId);
      }
      setActiveView('room');
    }
    if (target.matches('#nav-placeholder')) {
      event.preventDefault();
      setActiveView('placeholder');
    }
  });

  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', () => renderRooms());
}

function renderPlaceholders() {
  const placeholders = document.querySelectorAll('.placeholder');
  placeholders.forEach((node) => {
    node.innerHTML = '<p class="text-gray-400">TODO - 即將推出</p>';
  });
}

export async function loadRoomsFromSheet(sheetId, apiKey) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/rooms?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Google Sheets 讀取失敗');
  const data = await response.json();
  const [, ...rows] = data.values || [];
  return rows.map((row, index) => ({
    id: index + 1,
    name: row[0],
    owner: row[1],
    tradingCycle: row[2],
    description: row[3],
    memberCount: Number(row[4]) || 0,
  }));
}

function init() {
  setupEventDelegation();
  renderRooms();
  renderPlaceholders();
  setActiveView('overview');
}

document.addEventListener('DOMContentLoaded', init);
