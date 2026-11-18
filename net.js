/* Chaos Island - multiplayer networking (works on GitHub Pages, no server of your own).
 *
 * Uses PeerJS (WebRTC). The free public PeerJS broker is only used to introduce
 * players to each other; game traffic then goes directly browser <-> browser.
 *
 * Topology: the lobby creator is the HOST. Every other player connects to the host,
 * and the host relays presence (position, name, outfit...) and events (kills, opened
 * containers, doors) to everybody else. Max 6 players per lobby.
 *
 * The public API (Net.create / join / leave / start / emit / setPos / remotePlayers ...)
 * is what game.js uses, so you can swap the transport (Firebase, WebSocket server...)
 * by re-implementing makeRoom() below.
 */
(function () {
  const CI = globalThis.CI = globalThis.CI || {};
  const Net = CI.Net = { ok: false, room: null, code: null, host: false, seed: 0, busy: false, err: '', running: false };

  const PREFIX = 'chaosisland-v1-'; // change this if you fork the game so lobbies don't mix
  const MAX_PLAYERS = 6;
  const CONNECT_TIMEOUT = 12000;

  const clean = s => String(s || '').replace(/[^A-Za-z0-9 _-]/g, '').trim().slice(0, 14) || 'Survivor';
  const rcode = () => { const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 4; i++) s += a[(Math.random() * a.length) | 0]; return s; };
  const safeSend = (conn, msg) => { try { if (conn && conn.open) conn.send(msg); } catch (e) { } };

  // Optional: point at your own PeerJS server with ?peerhost=example.com&peerport=443&peersecure=1
  // (default is the free public PeerJS broker).
  function peerOptions() {
    const o = { debug: 0 };
    try {
      const q = new URLSearchParams(location.search);
      if (q.get('peerhost')) {
        o.host = q.get('peerhost');
        o.port = +(q.get('peerport') || 443);
        o.path = q.get('peerpath') || '/';
        o.secure = q.get('peersecure') !== '0' && q.get('peersecure') !== 'false';
      }
    } catch (e) { }
    return o;
  }

  // ---- open a PeerJS peer, resolve once registered with the broker ----
  function openPeer(id) {
    return new Promise((resolve, reject) => {
      let done = false;
      const peer = id ? new Peer(id, peerOptions()) : new Peer(peerOptions());
      const finish = (fn, v) => { if (done) return; done = true; clearTimeout(timer); fn(v); };
      const timer = setTimeout(() => { try { peer.destroy(); } catch (e) { } finish(reject, new Error('Could not reach the matchmaking server. Check your connection and try again.')); }, CONNECT_TIMEOUT);
      peer.on('open', () => finish(resolve, peer));
      peer.on('error', err => {
        if (!done) { try { peer.destroy(); } catch (e) { } finish(reject, err); }
      });
    });
  }

  // ---- a "room": table of peers + presence, events, star relay through the host ----
  function makeRoom(peer, isHost) {
    const room = {
      myId: peer.id, isHost, table: new Map(), conns: new Map(), hostConn: null,
      handlers: {}, peerCbs: new Set(), closed: false, up: true, onClosed: null
    };
    room.table.set(peer.id, {});
    const notify = () => room.peerCbs.forEach(f => { try { f(); } catch (e) { } });
    const fire = (t, data, from) => (room.handlers[t] || []).slice().forEach(f => { try { f({ isMe: from === room.myId, data, peer: from }); } catch (e) { } });
    const broadcast = (msg, exceptId) => room.conns.forEach((c, id) => { if (id !== exceptId) safeSend(c, msg); });

    room.peers = () => [...room.table].map(([id, p]) => ({ peer: id, isMe: id === room.myId, presence: p }));
    room.onPeers = f => { room.peerCbs.add(f); return () => room.peerCbs.delete(f); };
    room.on = (t, f) => { (room.handlers[t] = room.handlers[t] || []).push(f); return () => { const a = room.handlers[t] || []; const i = a.indexOf(f); if (i >= 0) a.splice(i, 1); }; };
    room.connected = () => !room.closed && room.up;

    room.presence = obj => {
      Object.assign(room.table.get(room.myId), obj);
      if (isHost) broadcast({ k: 'pres', id: room.myId, d: obj });
      else safeSend(room.hostConn, { k: 'pres', d: obj });
      notify();
      return Promise.resolve();
    };
    room.emit = (t, d) => {
      if (isHost) broadcast({ k: 'ev', t, d, from: room.myId });
      else safeSend(room.hostConn, { k: 'ev', t, d });
      return Promise.resolve();
    };
    room.leave = () => {
      room.closed = true; room.up = false;
      try { room.conns.forEach(c => { try { c.close(); } catch (e) { } }); if (room.hostConn) room.hostConn.close(); } catch (e) { }
      try { peer.destroy(); } catch (e) { }
      room.conns.clear(); room.table.clear();
      return Promise.resolve();
    };

    peer.on('disconnected', () => { room.up = false; if (!room.closed) { try { peer.reconnect(); } catch (e) { } } });
    peer.on('open', () => { room.up = true; });
    peer.on('error', () => { });

    if (isHost) {
      peer.on('connection', conn => {
        if (room.table.size >= MAX_PLAYERS) {
          conn.on('open', () => { safeSend(conn, { k: 'full' }); setTimeout(() => { try { conn.close(); } catch (e) { } }, 300); });
          return;
        }
        const id = conn.peer;
        conn.on('open', () => {
          room.conns.set(id, conn);
          safeSend(conn, { k: 'hello', table: Object.fromEntries(room.table) });
          room.table.set(id, {});
          broadcast({ k: 'join', id }, id);
          notify();
        });
        conn.on('data', m => {
          if (!m || typeof m !== 'object') return;
          if (m.k === 'pres' && m.d && typeof m.d === 'object' && room.table.has(id)) {
            Object.assign(room.table.get(id), m.d);
            broadcast({ k: 'pres', id, d: m.d }, id);
            notify();
          } else if (m.k === 'ev' && typeof m.t === 'string') {
            broadcast({ k: 'ev', t: m.t, d: m.d, from: id }, id);
            fire(m.t, m.d, id);
          }
        });
        const gone = () => {
          if (!room.conns.has(id)) return;
          room.conns.delete(id); room.table.delete(id);
          broadcast({ k: 'left', id });
          notify();
        };
        conn.on('close', gone);
        conn.on('error', gone);
      });
    }

    // client-side: handle messages from the host
    room.attachClient = (conn, onHello) => {
      room.hostConn = conn;
      conn.on('data', m => {
        if (!m || typeof m !== 'object') return;
        if (m.k === 'hello') {
          const mine = room.table.get(room.myId) || {};
          room.table = new Map(Object.entries(m.table || {}));
          room.table.set(room.myId, mine);
          onHello && onHello(); onHello = null;
          notify();
        } else if (m.k === 'pres' && m.id) {
          if (!room.table.has(m.id)) room.table.set(m.id, {});
          Object.assign(room.table.get(m.id), m.d);
          notify();
        } else if (m.k === 'ev') {
          fire(m.t, m.d, m.from);
        } else if (m.k === 'join' && m.id) {
          if (!room.table.has(m.id)) room.table.set(m.id, {});
          notify();
        } else if (m.k === 'left' && m.id) {
          room.table.delete(m.id); notify();
        } else if (m.k === 'full') {
          room.full = true;
        }
      });
      const closed = () => { if (room.closed) return; room.up = false; room.closed = true; room.onClosed && room.onClosed(); };
      conn.on('close', closed); conn.on('error', closed);
    };
    return room;
  }

  // ---- public API (same shape the game already used) ----
  Net.init = async function () { Net.ok = typeof Peer !== 'undefined'; };
  Net.status = () => !Net.ok ? 'unavailable' : (Net.room ? (Net.room.connected() ? 'online' : 'reconnecting') : 'ready');
  Net.lobbies = () => []; // no public lobby list on a static site: share the 4-letter code instead
  Net.advertise = () => { };
  Net.players = function () {
    if (!Net.room) return [];
    return Net.room.peers().map(p => ({ peer: p.peer, me: p.isMe, name: p.presence.n || 'Survivor', cls: p.presence.cls || '', host: !!p.presence.host, st: p.presence.st || 'lobby' }));
  };

  function wire(room, code, host, info) {
    Net.room = room; Net.code = code; Net.host = host; Net.name = clean(info.name); Net.running = false;
    Net.unsub = [];
    ['start', 'kill', 'open', 'door'].forEach(t => Net.unsub.push(room.on(t, m => {
      if (m.isMe) return;
      if (t === 'start') { if (Net.onStart) Net.onStart(m.data && m.data.seed >>> 0); }
      else if (Net.onEvent) Net.onEvent(t, m.data, m);
    })));
    Net.unsub.push(room.onPeers(() => { if (Net.onChange) Net.onChange(); }));
    room.onClosed = () => {
      if (Net.room !== room) return;
      Net.err = 'The host closed the lobby.';
      Net.leave();
    };
  }

  Net.create = async function (info) {
    if (!Net.ok) throw new Error('Multiplayer library failed to load (peerjs.min.js).');
    if (Net.room) await Net.leave();
    let peer = null, code = null, lastErr = null;
    for (let i = 0; i < 5 && !peer; i++) {
      code = rcode();
      try { peer = await openPeer(PREFIX + code); }
      catch (e) { lastErr = e; if (!(e && e.type === 'unavailable-id')) break; }
    }
    if (!peer) throw new Error(lastErr && lastErr.message ? lastErr.message : 'Could not create a lobby.');
    Net.seed = (Math.random() * 4294967295) >>> 0;
    const room = makeRoom(peer, true);
    wire(room, code, true, info);
    await room.presence({ n: Net.name, cls: info.cls, host: true, st: 'lobby', seed: Net.seed, o: info.outfit });
    return code;
  };

  Net.join = async function (code, info) {
    if (!Net.ok) throw new Error('Multiplayer library failed to load (peerjs.min.js).');
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    if (code.length !== 4) throw new Error('Enter the 4-character lobby code.');
    if (Net.room) await Net.leave();
    let peer;
    try { peer = await openPeer(); } catch (e) { throw new Error(e && e.message ? e.message : 'Could not reach the matchmaking server.'); }
    const room = makeRoom(peer, false);
    try {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('No host found for that code. Check it and try again.')), CONNECT_TIMEOUT);
        const fail = e => { clearTimeout(timer); reject(e); };
        peer.on('error', e => fail(e && e.type === 'peer-unavailable' ? new Error('No host found for that code. Check it and try again.') : new Error('Connection failed: ' + ((e && e.type) || 'unknown'))));
        const conn = peer.connect(PREFIX + code, { reliable: true, serialization: 'json' });
        room.attachClient(conn, () => { clearTimeout(timer); resolve(); });
        conn.on('error', () => fail(new Error('Connection to the host failed.')));
        conn.on('close', () => { if (room.full) fail(new Error('That lobby is full (6 players max).')); });
      });
    } catch (e) { await room.leave(); throw e; }
    const host = room.peers().find(p => !p.isMe && p.presence && p.presence.host && p.presence.seed);
    if (!host) { await room.leave(); throw new Error('No host found for that code. Check it and try again.'); }
    wire(room, code, false, info);
    Net.seed = host.presence.seed >>> 0;
    await room.presence({ n: Net.name, cls: info.cls, host: false, st: 'lobby', seed: Net.seed, o: info.outfit });
    return { seed: Net.seed, running: host.presence.st === 'run' };
  };

  Net.leave = async function () {
    const room = Net.room;
    try { (Net.unsub || []).forEach(u => u()); if (room) await room.leave(); } catch (e) { }
    Net.room = null; Net.code = null; Net.host = false; Net.running = false;
    if (Net.onChange) Net.onChange();
  };
  Net.start = function () { if (!Net.room || !Net.host) return; Net.running = true; Net.room.presence({ st: 'run' }); Net.room.emit('start', { seed: Net.seed }); };
  Net.markRun = function () { if (Net.room) Net.room.presence({ st: 'run' }); };
  Net.emit = function (t, d) { if (Net.room) Net.room.emit(t, d); };
  Net.setPos = function (p) { if (Net.room) Net.room.presence(p); };
  Net.remotePlayers = function () {
    if (!Net.room) return [];
    const out = [];
    for (const p of Net.room.peers()) {
      if (p.isMe) continue;
      const q = p.presence;
      if (q.st !== 'run' || typeof q.x !== 'number') continue;
      out.push({ x: q.x, y: q.y, dir: q.d | 0, frame: q.f | 0, name: q.n || 'Survivor', sheet: CI.sheetFor(q.o || { skin: 0, hair: 1, shirt: 3, style: 0 }) });
    }
    return out;
  };
})();
