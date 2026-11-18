# Chaos Island

A top-down raid-and-extract game with up to 6-player online co-op. Pure static files, so it runs on GitHub Pages with no server of your own.

## Put it on GitHub Pages (website only, no terminal)

1. On github.com click **New repository**. Name it `chaos-island`, set it to **Public**, click **Create repository**.
2. On the new repo page click **uploading an existing file**.
3. Unzip this project, then drag **all the files inside the folder** (`index.html`, `style.css`, `game.js`, `net.js`, `peerjs.min.js`, `.nojekyll`, `README.md`) into the upload area. Click **Commit changes**.
4. Go to **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, and click **Save**.
5. Wait about a minute and refresh. Your game is at `https://YOUR-USERNAME.github.io/chaos-island/`.

Every time you upload changed files to the repo, the site updates itself.

## How to play together

1. Everyone opens your Pages link.
2. One person clicks **Multiplayer Lobbies > Create Lobby** and sends the 4-letter code to friends. That person is the host and must keep their tab open.
3. Friends click **Multiplayer Lobbies**, type the code, and click **Join by code**.
4. The host clicks **Deploy Everyone**. Friends click **Join Raid Now**.

Up to 6 players share one island (same seed), see each other, and share kills, opened containers and doors. Everyone extracts and banks loot on their own. Progress is saved in each player's own browser (localStorage).

## How the multiplayer works

- `net.js` uses [PeerJS](https://peerjs.com) (WebRTC). The free public PeerJS broker only introduces players; game data then flows directly between browsers. The host relays everyone's position and events.
- `peerjs.min.js` is included in the repo, so there is no CDN dependency for it.
- Enemies are simulated on each player's machine, so they can look slightly different between players.

### Known limits

- **Strict networks.** Some school, work or mobile-carrier networks block direct peer connections. No free relay (TURN) server is configured, so those players may fail to connect. Home Wi-Fi almost always works.
- **Public broker.** The free PeerJS broker has no uptime guarantee. If it is down, lobbies cannot be created.
- **Host leaves = lobby closes.** Players in a raid keep playing, but without sharing.
- No public lobby list (a static site has nowhere to store one). Share the code.

### Using your own broker (optional)

Run your own PeerJS server and open the game with
`?peerhost=your.server.com&peerport=443` (add `&peersecure=0` for plain http). If you fork the game, also change `PREFIX` at the top of `net.js` so your lobbies do not mix with other forks.

## Files

| File | What it is |
|---|---|
| `index.html` | Page layout and menus |
| `style.css` | Styling |
| `game.js` | The game (world generation, enemies, items, menus, shop) |
| `net.js` | Multiplayer networking |
| `peerjs.min.js` | PeerJS 1.5.4 (MIT licence) |
| `.nojekyll` | Tells GitHub Pages to serve files as they are |

To test locally you need to serve the folder over http (not double-click the file), for example `python3 -m http.server` and open `http://localhost:8000`.
