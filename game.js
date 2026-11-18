globalThis.CI=globalThis.CI||{};
(function(){
const CI=globalThis.CI=globalThis.CI||{};
const U=CI.U={};
U.clamp=(v,a,b)=>v<a?a:v>b?b:v;
U.lerp=(a,b,t)=>a+(b-a)*t;
U.rng=function(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}};
U.hash=function(x,y,s){let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul((s|0)+1,1013904223))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
const NT=new Float32Array(65536);
{const r=U.rng(1337);for(let i=0;i<65536;i++)NT[i]=r();}
U.vn=function(x,y){const xi=Math.floor(x),yi=Math.floor(y);let fx=x-xi,fy=y-yi;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
const a=NT[((yi&255)<<8)|(xi&255)],b=NT[((yi&255)<<8)|((xi+1)&255)],c=NT[(((yi+1)&255)<<8)|(xi&255)],d=NT[(((yi+1)&255)<<8)|((xi+1)&255)];
const t=a+(b-a)*fx,u=c+(d-c)*fx;return t+(u-t)*fy};
U.fbm=function(x,y,o){o=o||3;let s=0,a=.5,f=1,n=0;for(let i=0;i<o;i++){s+=a*U.vn(x*f+i*17.3,y*f+i*9.1);n+=a;a*=.5;f*=2}return s/n};
U.mkCanvas=function(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c};
U.hex=function(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]};
U.fmtTime=function(s){s=Math.floor(s);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
})();

(function(){
const CI=globalThis.CI,U=CI.U;
const D=CI.D={};
D.GW=250;D.CELL=16;D.WORLD=4000;
const TN=['DEEP','WATER','SHALLOW','SAND','WETSAND','GRASS','JGRASS','DIRT','SNOW','ICE','ROCK','BASALT','ASH','LAVA','CLIFF','ROAD','CONC','PLANK','F_WOOD','F_TILE','F_METAL','F_STONE','W_WOOD','W_BRICK','W_CONC','W_METAL','W_STONE','MUD'];
const T=D.T={};TN.forEach((n,i)=>T[n]=i);
const P={
DEEP:['#0b3a63','#0e4a7a','#135a8c','#1a6aa0'],WATER:['#13608f','#1a77a8','#2390b8','#34a9c7'],SHALLOW:['#27a3b8','#3bbdc4','#59d2cf','#9ae9de'],
SAND:['#e2c88a','#ecd49b','#f4e0ae','#fff0c8'],WETSAND:['#c9a76d','#d3b27a','#dcbc86','#e5c892'],
GRASS:['#4f9a3c','#5aab43','#69bc4d','#86d05f'],JGRASS:['#1c5230','#256338','#2e7440','#4a9650'],
DIRT:['#8a6a43','#9a7a50','#aa8a5c','#c0a273'],SNOW:['#d3e1ec','#e2edf6','#eef5fa','#ffffff'],ICE:['#8fcbe6','#a8dcf0','#c2ecf9','#eaffff'],
ROCK:['#6c7078','#7b7f88','#8b909a','#a3a8b2'],BASALT:['#26262e','#2f2f39','#393944','#524f5c'],ASH:['#45454b','#505057','#5d5d65','#76767e'],
LAVA:['#c52c10','#e04c18','#f57a22','#ffc04a'],CLIFF:['#464853','#535664','#636775','#7f8494'],
ROAD:['#36383d','#3f4147','#484a51','#585b63'],CONC:['#878990','#9496a0','#a1a3aa','#b4b6be'],PLANK:['#74502e','#845c36','#946a40','#a67c4f'],
F_WOOD:['#84583a','#946540','#a47347','#b58455'],F_TILE:['#c3cdd2','#d0d9dd','#dde4e7','#eef3f4'],F_METAL:['#343f49','#3f4b56','#4a5864','#5c6c79'],F_STONE:['#68635a','#777162','#867f6d','#98917d'],
W_WOOD:['#5a3822','#6b4427','#7c502f','#906139'],W_BRICK:['#85402f','#984b39','#ab5a48','#bf715d'],W_CONC:['#767a80','#868a90','#979ba1','#a8acb2'],W_METAL:['#2b343e','#36424d','#425059','#546676'],W_STONE:['#504e47','#605d54','#716e64','#85817a'],
MUD:['#463623','#56432e','#675236','#7a6240']};
D.PAL=TN.map(n=>P[n].map(U.hex));
const flag=(list)=>{const a=new Uint8Array(TN.length);list.forEach(n=>a[T[n]]=1);return a};
D.SOLID=flag(['DEEP','WATER','LAVA','CLIFF','W_WOOD','W_BRICK','W_CONC','W_METAL','W_STONE']);
D.CRISP=flag(['ROAD','CONC','PLANK','F_WOOD','F_TILE','F_METAL','F_STONE','W_WOOD','W_BRICK','W_CONC','W_METAL','W_STONE']);
D.LIQUID=flag(['DEEP','WATER','SHALLOW']);
D.WALL=flag(['W_WOOD','W_BRICK','W_CONC','W_METAL','W_STONE']);
D.FLOORT=flag(['F_WOOD','F_TILE','F_METAL','F_STONE']);
D.SOFTLAND=flag(['SAND','WETSAND','GRASS','JGRASS','DIRT','SNOW','ICE','ROCK','BASALT','ASH','MUD']);
D.REGIONS=[
{id:0,name:'Open Sea',amb:[200,215,235],map:'#1a6aa0'},
{id:1,name:'Tropical Beach',amb:[255,246,226],map:'#e8d29a',desc:'Where the tide left you.'},
{id:2,name:'Dark Jungle',amb:[150,176,160],map:'#2a6b3a',desc:'The canopy swallows the sun.'},
{id:3,name:'Abandoned City',amb:[196,196,206],map:'#8c8f98',desc:'Someone left in a hurry.'},
{id:4,name:'Snowy Mountains',amb:[212,224,246],map:'#dbe8f2',desc:'Cold enough to hear your own pulse.'},
{id:5,name:'Research Facility',amb:[70,84,106],map:'#3a4650',desc:'Nobody mentions what they studied here.'},
{id:6,name:'Volcano',amb:[190,128,112],map:'#3a2a30',desc:'The ground is warm. The ground should not be warm.'}];
D.NOTES={
camp_log:{title:'Salvage Log — Camp Driftwood',text:'Day 1. Three of us washed up on this beach. Radio is dead, boat is splinters. Marlow thinks there are buildings inland. Day 4. Marlow went east along the coast and came back pale. Won\'t say what he saw. Day 6. We are not leaving by sea.'},
hut_note:{title:'Scrawled on the wall',text:'Whoever finds this: the lighthouse still turns. Nobody lit it. Nobody is up there. Do not go up at night.'},
dock_sign:{title:'Harbor Notice',text:'ISLAND HARBOR LICENSE No. 0041. Supply ferry departs on the last Friday of the month. Passengers must be off the island by sundown.'},
ruin_tablet:{title:'Weathered Tablet',text:'The carvings show a mountain that breathes fire, and a second mountain beneath the first. Between them a door that was sealed from the inside.'},
ruin_signpost:{title:'Rotting Signpost',text:'West: Old Ruins. South: Beach. East: the town. North: the Station. Someone has scratched out the last one.'},
jungle_den:{title:'Hand-painted Warning',text:'DO NOT CAMP HERE. Tracks too big. Bones too fresh.'},
clearing_note:{title:'Waterlogged Notebook',text:'Found the spring behind the ferns. Left supplies under the stump in case I come back. If you read this, take what you need. I did not make it back.'},
heart_tree:{title:'The Heart Tree',text:'Roots as wide as a house. The bark is warm to the touch and hums very quietly. You decide not to carve your initials into it.'},
hospital_sign:{title:'Reception Whiteboard',text:'Ward B quarantined. Ward C quarantined. Staff are reminded that nobody enters the north stairwell without a badge. Patients are reminded that they were never here.'},
hospital_log:{title:'Nurse Station Memo',text:'Patient transfers from the Station continue overnight. Do not log arrival times. Do not photograph the patients. Dr. Okafor will explain the dosage in the morning.'},
shop_note:{title:'Closing Notice',text:'Closed until further notice. Shelves are empty because everyone took what they could carry. Left the till open. It had nothing worth taking.'},
gas_note:{title:'Handwritten Sign',text:'NO FUEL. NO WATER. NO ROOM IN THE TRUCK. Try the harbor.'},
house_note:{title:'Fridge Door Note',text:'Gone to the harbor with the kids. Back by dark. P.S. Locked the cat in the bathroom. Sorry.'},
radio_note:{title:'Radio Tower Log',text:'Signal repeats every nine minutes. It is not a distress call. It is a countdown that restarts.'},
cabin_note:{title:'Trapper\'s Journal',text:'Lake froze early this year. Heard the ice singing at night. Went out to check and found boot prints leading in. None leading out.'},
outpost_log:{title:'Outpost Terminal',text:'WEATHER STATION 7. Seismic readings from the east peak are no longer within tolerance. Recommend evacuating personnel. Recommend not telling the Facility.'},
cave_note:{title:'Carved in the ice',text:'It is warmer the deeper you go. That is not how caves work.'},
grotto_note:{title:'Maintenance Placard',text:'SERVICE ACCESS — Authorized staff only. West tunnel connects to the Station utility hall. Doors lock automatically at shift change.'},
mine_note:{title:'Foreman\'s Whiteboard',text:'Crew B is down the shaft again. Crew A is not talking to Crew B. Whatever is down there, it isn\'t ore.'},
fac_term1:{title:'Lobby Terminal',text:'WELCOME TO STATION OMEGA. Please surrender all personal devices. Please do not look directly at the central chamber. Please do not feed the subject.'},
fac_term2:{title:'Lab Terminal — Dr. Okafor',text:'Experiment 14 survived the night. Experiment 15 survived the night and the one after. We stopped naming them after 16. Containment holds as long as the power holds. The power is not our problem.'},
fac_term3:{title:'Server Room Terminal',text:'Backup complete. 3,412 audio logs. 12 of them are in a language nobody on staff speaks. One of them is addressed to us by name.'},
fac_term4:{title:'Vault Terminal',text:'VAULT 1: SEALED. Access requires Level 3 clearance card. Contents: prototype regulator, archival specimens, and Dr. Okafor\'s personal journal. Card last seen: Dr. Okafor.'},
fac_term5:{title:'Quarters Terminal',text:'Roommate keeps sleepwalking toward the chamber. Last night I followed him. He stood at the glass for an hour and whispered something back to it.'},
fac_ctrl:{title:'Control Room — Emergency Release',text:'Emergency exit doors have been released. The east tunnel is now unlocked from the outside. Good luck. Please do not tell them we helped.'},
fac_ctrl_done:{title:'Control Room',text:'The emergency exit is already open. The east tunnel leads out to the foot of the volcano.'},
fac_core:{title:'The Central Chamber',text:'A glass cylinder the height of a house. It is empty. The inside of the glass is covered in handprints from the inside.'}
};
})();

(function(){
const CI=globalThis.CI,U=CI.U;
const SP=CI.Sprites={};
const cache={};
const mk=(w,h)=>{const c=U.mkCanvas(w,h);return[c,c.getContext('2d')]};
const P=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w||1,h||1)};
function ell(c,cx,cy,rx,ry,col){c.fillStyle=col;for(let y=-Math.round(ry);y<=Math.round(ry);y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry+.01))));c.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1)}}
function ball(c,cx,cy,rx,ry,p){ell(c,cx,cy,rx,ry,p[0]);ell(c,cx-rx*.12,cy-ry*.14,rx*.86,ry*.86,p[1]);ell(c,cx-rx*.28,cy-ry*.3,rx*.55,ry*.52,p[2]);if(p[3])ell(c,cx-rx*.4,cy-ry*.42,rx*.25,ry*.22,p[3])}
function line(c,x0,y0,x1,y1,col,th){th=th||1;x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;c.fillStyle=col;
for(;;){c.fillRect(x0,y0,th,th);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
const shadow=(c,cx,cy,rx,ry,a)=>{ell(c,cx,cy,rx,ry,'rgba(10,20,15,'+(a||.3)+')')};
const rect=(c,col,x,y,w,h)=>P(c,col,x,y,w,h);
const GREENS=[['#123d24','#1d5a31','#2a7a3f','#4aa95a'],['#17462a','#23683a','#33894a','#5cb75e'],['#1c4a22','#2c6c2e','#468c3a','#7ac04e'],['#0f3a2c','#175240','#237058','#3f9a78']];
function hashS(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h}
const GEN={};
GEN.palm=v=>{const[cv,c]=mk(64,72),r=U.rng(11+v*7),lean=[-6,5,-2][v];shadow(c,32,66,15,4);
for(let t=0;t<=1;t+=.02){const x=32+lean*t*t,y=66-40*t;P(c,(Math.round(t*20)%2)?'#6e4a2a':'#85603a',x-2,y,4,2);P(c,'#9a7248',x-2,y,1,2)}
const cx=32+lean,cy=26;
for(let i=0;i<8;i++){const a=i/8*Math.PI*2+r()*.4,L=20+r()*8;for(let s=0;s<L;s++){const t=s/L,x=cx+Math.cos(a)*s,y=cy+Math.sin(a)*s*.55+t*t*13-3;
P(c,t<.6?'#2c7a34':'#1f6428',x,y,3,2);if(s%3===0){P(c,'#3f9f48',x+(Math.sin(a)>0?-1:1),y-2,2,2);P(c,'#1a5a24',x,y+2,2,2)}if(t<.4)P(c,'#5cc060',x,y-1,2,1)}}
ell(c,cx,cy+1,4,3,'#1f6428');ball(c,cx,cy,3,2,['#1c5a22','#2c7a34','#4aa850']);P(c,'#5a3a1e',cx-3,cy+3,3,3);P(c,'#6e4a2a',cx+1,cy+4,3,3);return{cv,ax:32,ay:66,sway:.55}};
GEN.jtree=v=>{const S=[[44,62,15],[54,72,19],[70,90,25],[82,104,30]][v],w=S[0],h=S[1],R=S[2],r=U.rng(90+v*13),[cv,c]=mk(w,h),cx=w/2,gy=h-6,pal=GREENS[(v+(r()*3|0))%4];
shadow(c,cx,gy,R*.8,R*.22);const tw=Math.max(5,R*.34);rect(c,'#4a3220',cx-tw/2,gy-R*1.1,tw,R*1.1);rect(c,'#6a482c',cx-tw/2,gy-R*1.1,tw*.45,R*1.1);P(c,'#4a3220',cx-tw/2-2,gy-3,tw+4,3);
const cy=gy-R*1.25;for(let i=0;i<6;i++){const a=i/6*Math.PI*2+r(),d=R*.5;ball(c,cx+Math.cos(a)*d,cy+Math.sin(a)*d*.7,R*.55,R*.5,pal)}ball(c,cx-R*.1,cy-R*.15,R*.75,R*.65,pal);
for(let i=0;i<R*3;i++){const a=r()*6.28,d=r()*R*.8;P(c,r()>.5?pal[3]:pal[0],cx+Math.cos(a)*d-R*.1,cy+Math.sin(a)*d*.7-R*.2,2,1)}
if(v>=2)for(let i=0;i<4;i++){const x=cx-R*.7+r()*R*1.4,y=cy+R*.45;line(c,x,y,x+(r()-.5)*2,y+4+r()*8,'#235a2e',1)}return{cv,ax:cx,ay:gy,sway:.5,top:.55}};
GEN.jbig=v=>{const w=130,h=164,[cv,c]=mk(w,h),cx=65,gy=h-8,r=U.rng(5),pal=GREENS[0];shadow(c,cx,gy,50,12);
rect(c,'#3e2a1a',cx-18,gy-70,36,70);rect(c,'#5a3c24',cx-18,gy-70,13,70);rect(c,'#7a5232',cx-18,gy-70,4,70);
for(const s of[-1,1]){for(let i=0;i<20;i++)P(c,'#3e2a1a',cx+s*(18+i*.9),gy-i*i*.12-1,Math.ceil(5+i*.2),i*.9+2)}
for(let i=0;i<10;i++)P(c,'#2c4a2a',cx-14+r()*28,gy-60+r()*50,2,5+r()*7);
const cy=gy-100;for(let i=0;i<9;i++){const a=i/9*6.28+r(),d=34;ball(c,cx+Math.cos(a)*d,cy+Math.sin(a)*d*.62,28,24,pal)}ball(c,cx-6,cy-8,40,30,pal);ball(c,cx-14,cy-16,24,16,[pal[1],pal[2],pal[3],'#8ad060']);
for(let i=0;i<70;i++){const a=r()*6.28,d=r()*40;P(c,r()>.55?'#7ad05a':'#0f3a22',cx+Math.cos(a)*d-6,cy+Math.sin(a)*d*.6-8,2,1)}
if(v===1)for(let i=0;i<30;i++){const a=r()*6.28,d=10+r()*38;P(c,'#7ffff0',cx+Math.cos(a)*d,cy+Math.sin(a)*d*.62,1,1);P(c,'#bffff6',cx+Math.cos(a)*d,cy+Math.sin(a)*d*.62,1,1)}
for(let i=0;i<9;i++){const x=cx-44+r()*88,y=cy+16+r()*10;line(c,x,y,x+(r()-.5)*3,y+8+r()*20,'#1f5a2e',1)}return{cv,ax:cx,ay:gy,sway:.35,top:.5}};
GEN.pine=v=>{const S=[[30,44,3],[38,58,3],[46,74,4],[54,90,4]][v],w=S[0],h=S[1],T=S[2],[cv,c]=mk(w,h),cx=w/2,gy=h-4,r=U.rng(70+v);shadow(c,cx,gy,w*.32,4);rect(c,'#4a3220',cx-2,gy-8,4,8);rect(c,'#6a482c',cx-2,gy-8,1,8);
const th=(h-14)/T;for(let t=T-1;t>=0;t--){const top=4+t*th*.78,bot=top+th*1.25,bw=w*(.3+.7*(t+1)/T)*.5;for(let y=top;y<bot;y++){const f=(y-top)/(bot-top),hw=Math.max(1,bw*f);
c.fillStyle='#1d4a3a';c.fillRect(Math.round(cx-hw),Math.round(y),Math.round(hw*2),1);c.fillStyle='#2b6150';c.fillRect(Math.round(cx-hw*.8),Math.round(y),Math.round(hw*1.2),1);c.fillStyle='#3a7a66';c.fillRect(Math.round(cx-hw*.7),Math.round(y),Math.round(hw*.5),1);
if(f<.55){c.fillStyle='#eef5fa';c.fillRect(Math.round(cx-hw*.75),Math.round(y),Math.max(1,Math.round(hw*(.55-f)*2.2)),1);c.fillRect(Math.round(cx+hw*.2),Math.round(y),Math.max(1,Math.round(hw*(.4-f)*1.4)),1)}
}for(let i=0;i<4;i++)P(c,'#0f2a22',cx-bw+r()*bw*2,bot-2-r()*3,3,1)}return{cv,ax:cx,ay:gy,sway:.4,top:.6}};
GEN.dead=v=>{const[cv,c]=mk(40,60),r=U.rng(30+v);shadow(c,20,54,10,3);rect(c,'#2a2226',17,26,6,28);rect(c,'#3c3036',17,26,2,28);P(c,'#2a2226',15,50,10,4);
const br=(x,y,a,L,th)=>{for(let s=0;s<L;s++){const px=x+Math.cos(a)*s,py=y+Math.sin(a)*s;P(c,'#2a2226',px,py,th,th);P(c,'#463a40',px,py,1,th);if(s===Math.floor(L*.55)&&L>8)br(px,py,a+(r()-.5)*1.4,L*.5,Math.max(1,th-1))}};
br(20,28,-1.9,16+v*3,3);br(20,32,-1.1,14,3);br(20,24,-1.57,18,3);br(20,36,-2.5,10,2);for(let i=0;i<5;i++)P(c,'#ff7a2a',12+r()*16,6+r()*20,1,1);return{cv,ax:20,ay:54}};
GEN.bush=v=>{const[cv,c]=mk(28,20),r=U.rng(40+v),pals=[['#1d6a2a','#2c8a38','#48b04a','#7ad060'],['#12452a','#1d6238','#2c8248','#4aa458'],['#143c26','#1e5a32','#2c7a42','#c03a3a'],['#e8f0f6','#c6d8e4','#9fb8cc','#ffffff'],['#4a3c34','#665244','#85705a','#a38c70']][v];
shadow(c,14,17,10,3);ball(c,9,12,7,6,pals);ball(c,19,12,7,6,pals);ball(c,14,9,8,7,pals);if(v===0){P(c,'#ff6aa0',9,8,2,2);P(c,'#ffd84a',17,6,2,2)}if(v===2)for(let i=0;i<5;i++)P(c,'#ff5a4a',6+r()*16,5+r()*8,2,2);
if(v===3){P(c,'#5a7a6a',10,13,2,2);P(c,'#5a7a6a',17,13,2,2)}return{cv,ax:14,ay:17,sway:.5,top:.4}};
const ROCKP=[['#a08a5a','#c0aa76','#dcc794','#f0e2b4'],['#9a8456','#bba470','#d6c08c','#ecdcac'],['#a98e5e','#c9b07a','#e4cc96','#f4e6b6'],['#4e5a4a','#6a7a5e','#86987a','#a2b498'],['#4a5446','#66725a','#82907a','#9eac96'],['#7a8494','#98a2b2','#b8c2d0','#dfe8f2'],['#707a8c','#8e98a8','#aeb8c6','#d4dde8'],['#202028','#32323e','#464654','#5e5c6e'],['#2a2630','#3c3844','#524e5c','#706a7c']];
GEN.rockM=v=>{const[cv,c]=mk(26,20),p=ROCKP[v%9];shadow(c,13,17,10,3);ball(c,13,11,10,7,p);ell(c,17,13,6,4,p[0]);ball(c,11,10,8,6,p);if(v>=5&&v<7){ell(c,11,7,6,3,'#f4f8fc');P(c,'#ffffff',8,5,3,1)}if(v===3||v===4){ell(c,9,6,4,2,'#5a9a4a');P(c,'#7ac05a',7,5,3,1)}
line(c,12,8,15,14,p[0],1);if(v>=7){P(c,'#ff6a2a',15,12,1,2);P(c,'#ff9a3a',16,13,1,1)}return{cv,ax:13,ay:17}};
GEN.spire=v=>{const H=[30,38,26][v],[cv,c]=mk(20,H+8),r=U.rng(20+v);shadow(c,10,H+3,8,3);
for(let y=0;y<H;y++){const f=y/H,hw=1+f*7;c.fillStyle='#26222c';c.fillRect(Math.round(10-hw),y+2,Math.round(hw*2),1);c.fillStyle='#3a3642';c.fillRect(Math.round(10-hw),y+2,Math.round(hw*.9),1);c.fillStyle='#524c5c';c.fillRect(Math.round(10-hw),y+2,Math.max(1,Math.round(hw*.35)),1)}
for(let i=0;i<4;i++){const y=6+r()*(H-10);P(c,'#ff6a2a',8+r()*5,y,1,2+r()*3|0);}return{cv,ax:10,ay:H+3}};
GEN.log=v=>{const[cv,c]=mk(36,16);shadow(c,18,13,15,3);const b=v?['#3e3a26','#544e34','#6c6444']:['#a8946a','#c4b088','#dccaa2'];rect(c,b[0],3,5,30,7);rect(c,b[1],3,5,30,5);rect(c,b[2],4,5,28,2);ell(c,4,8,3,4,b[1]);ell(c,33,8,3,4,b[2]);ell(c,33,8,1,2,b[0]);
if(v){P(c,'#4a8a3a',9,4,6,2);P(c,'#5aa04a',20,4,5,2);P(c,'#4a8a3a',27,5,3,2)}for(let x=8;x<30;x+=5)P(c,b[0],x,7,2,1);return{cv,ax:18,ay:13}};
GEN.boat=v=>{const[cv,c]=mk(40,24),h=['#7a4e2a','#8e6034','#a8764a'],t=['#8a3a2a','#2a5a8a','#6a6a5a'][v];shadow(c,20,20,16,3);ell(c,20,13,16,7,h[0]);ell(c,20,12,15,6,h[1]);ell(c,20,11,12,4,'#3a2616');for(let x=8;x<33;x+=4)P(c,h[2],x,8,1,8);rect(c,t,4,11,32,1);rect(c,h[2],18,6,2,12);if(v===2){P(c,'#1a1008',24,10,6,4);}return{cv,ax:20,ay:19}};
GEN.tent=v=>{const[cv,c]=mk(34,30),col=v?['#8a3a2e','#a64a3a','#c25e4a']:['#4a5a3a','#5e7048','#788a5a'];shadow(c,17,26,15,3);
for(let y=0;y<22;y++){const f=y/22,hw=1+f*13;c.fillStyle=col[0];c.fillRect(Math.round(17-hw),4+y,Math.round(hw*2),1);c.fillStyle=col[1];c.fillRect(Math.round(17-hw),4+y,Math.round(hw),1);c.fillStyle=col[2];c.fillRect(Math.round(17-hw),4+y,Math.max(1,Math.round(hw*.3)),1)}
for(let y=0;y<14;y++){const f=y/14,hw=1+f*4.5;c.fillStyle='#1c1814';c.fillRect(Math.round(17-hw),12+y,Math.round(hw*2),1)}line(c,17,4,17,26,col[0],1);return{cv,ax:17,ay:26}};
GEN.crate=v=>{const[cv,c]=mk(18,18);shadow(c,9,15,7,2);rect(c,'#5a3c22',2,4,14,11);rect(c,'#8a6038',3,5,12,9);rect(c,'#a87848',3,5,12,2);for(let x=3;x<15;x+=4)rect(c,'#6a4628',x,5,1,9);rect(c,'#5a3c22',2,9,14,1);if(v){rect(c,'#2a1a0e',4,6,10,4);rect(c,'#a87848',2,2,14,3)}return{cv,ax:9,ay:15}};
GEN.barrel=v=>{const[cv,c]=mk(14,18);shadow(c,7,15,5,2);ball(c,7,9,5,6,v?['#4a2a1a','#6a3e26','#8a5636']:['#3a4a58','#566878','#7a8c9c']);rect(c,'#2a2a30',2,6,10,1);rect(c,'#2a2a30',2,11,10,1);ell(c,7,4,5,2,v?'#8a5636':'#7a8c9c');return{cv,ax:7,ay:15}};
GEN.fire=v=>{const[cv,c]=mk(28,18);shadow(c,14,14,11,3);for(let i=0;i<8;i++){const a=i/8*6.28;ball(c,14+Math.cos(a)*8,11+Math.sin(a)*3.4,3,2,['#4a4a50','#6a6a72','#8a8a94','#a8a8b0'])}
line(c,8,12,20,8,'#5a3a1e',2);line(c,8,8,20,12,'#6e4a2a',2);P(c,'#1a1210',11,9,6,3);return{cv,ax:14,ay:15}};
GEN.sign=v=>{const[cv,c]=mk(18,26);shadow(c,9,23,4,2);rect(c,'#5a3c22',8,10,3,13);rect(c,'#8a6038',2,4,14,9);rect(c,'#a87848',2,4,14,2);rect(c,'#4a301a',2,12,14,1);for(let i=0;i<3;i++)rect(c,'#3a2616',4,7+i*2,3+i*3,1);return{cv,ax:9,ay:23}};
GEN.post=v=>{const[cv,c]=mk(8,16);rect(c,'#4a3220',2,3,4,11);rect(c,'#6a482c',2,3,1,11);rect(c,'#8a6a44',2,3,4,2);return{cv,ax:4,ay:14}};
GEN.chest=v=>{const[cv,c]=mk(22,20);shadow(c,11,17,9,2);rect(c,'#4a2e18',3,9,16,8);rect(c,'#7a4e2a',4,10,14,6);rect(c,'#c9a23a',3,12,16,1);rect(c,'#c9a23a',10,9,2,5);
if(v){rect(c,'#2a1608',4,9,14,3);rect(c,'#7a4e2a',3,4,16,4);rect(c,'#c9a23a',4,7,14,1);P(c,'#ffe27a',8,10,2,1);P(c,'#ffe27a',13,10,2,1)}else{ell(c,11,8,8,3,'#7a4e2a');ell(c,11,7,7,2,'#9a6a3a');rect(c,'#c9a23a',3,9,16,1)}return{cv,ax:11,ay:17}};
GEN.stump=v=>{const[cv,c]=mk(18,14);shadow(c,9,11,7,2);ball(c,9,6,6,5,['#4a3220','#6a482c','#8a6a44']);ell(c,9,4,5,3,'#b89a6a');ell(c,9,4,3,2,'#9a7a4a');return{cv,ax:9,ay:11}};
GEN.pillar=v=>{const H=[34,22,38,14][v],[cv,c]=mk(20,H+8);shadow(c,10,H+4,8,3);rect(c,'#4a4840',4,4,12,H);rect(c,'#706c5e',5,4,9,H);rect(c,'#908a78',5,4,3,H);rect(c,'#4a4840',3,H,14,5);rect(c,'#908a78',3,H,14,1);
if(v===0||v===2){rect(c,'#4a4840',3,2,14,3);rect(c,'#a8a290',3,2,14,1)}for(let i=0;i<5;i++)P(c,'#4a8a3a',5+(i*5)%10,5+i*5%H,2,3);P(c,'#6ad8c0',8,10,1,3);return{cv,ax:10,ay:H+4}};
GEN.altar=v=>{const[cv,c]=mk(38,28);shadow(c,19,24,16,3);rect(c,'#4a4840',4,12,30,11);rect(c,'#76705f',5,13,28,9);rect(c,'#9a9482',3,8,32,6);rect(c,'#b8b29e',3,8,32,2);for(let x=8;x<32;x+=5)rect(c,'#6ad8c0',x,16,2,3);P(c,'#4a8a3a',6,9,5,2);P(c,'#4a8a3a',27,12,4,2);return{cv,ax:19,ay:24}};
GEN.dish=v=>{const[cv,c]=mk(40,40);shadow(c,20,35,13,3);rect(c,'#505862',17,22,6,12);ell(c,20,18,15,11,'#7a8490');ell(c,19,17,13,9,'#aab4c0');ell(c,18,16,9,6,'#d0d8e2');rect(c,'#3a424c',19,6,2,12);P(c,'#e04a3a',19,4,2,2);return{cv,ax:20,ay:35}};
GEN.radio=v=>{const[cv,c]=mk(44,140),cx=22;shadow(c,cx,134,14,4);for(let y=8;y<130;y++){const f=y/130,hw=2+f*11;P(c,'#c8c0b0',cx-hw,y,2,1);P(c,'#c8c0b0',cx+hw-1,y,2,1);if(y%14===0){line(c,cx-hw,y,cx+hw,y+14,'#a8a090',1);line(c,cx+hw,y,cx-hw,y+14,'#a8a090',1);P(c,'#a8a090',cx-hw,y,hw*2,1)}}
for(let y=8;y<130;y+=24)for(let x=0;x<8;x++){}P(c,'#d04a3a',cx-3,8,6,6);P(c,'#d04a3a',cx-5,50,10,3);P(c,'#d04a3a',cx-8,92,16,3);rect(c,'#6a645a',cx-9,128,18,5);return{cv,ax:cx,ay:132}};
GEN.light=v=>{const[cv,c]=mk(48,134),cx=24;shadow(c,cx,128,18,5);for(let y=24;y<122;y++){const f=(y-24)/98,hw=8+f*8,band=Math.floor((y-24)/14)%2;c.fillStyle=band?'#c8362e':'#ece6d8';c.fillRect(Math.round(cx-hw),y,Math.round(hw*2),1);c.fillStyle=band?'#9a2620':'#c4bca8';c.fillRect(Math.round(cx+hw*.3),y,Math.round(hw*.7),1);c.fillStyle=band?'#e05a4e':'#fffaf0';c.fillRect(Math.round(cx-hw),y,2,1)}
rect(c,'#3a3a42',cx-14,20,28,5);rect(c,'#5a5a64',cx-14,20,28,1);rect(c,'#f6e6a0',cx-8,8,16,12);rect(c,'#fff6c0',cx-8,8,5,12);rect(c,'#3a3a42',cx-10,5,20,4);ell(c,cx,3,7,4,'#c8362e');rect(c,'#4a3a2a',cx-3,106,6,16);rect(c,'#3a3a42',cx-16,118,32,8);return{cv,ax:cx,ay:126}};
GEN.lamp=v=>{const[cv,c]=mk(16,40);shadow(c,8,36,4,2);rect(c,'#3a3a42',7,8,2,28);rect(c,'#5a5a64',7,8,1,28);rect(c,'#3a3a42',3,6,10,3);rect(c,'#ffd98a',4,8,8,2);return{cv,ax:8,ay:36}};
const CARP=[['#8a3a2a','#a8503a'],['#2a4a6a','#3e6a92'],['#6a6a62','#8a8a82'],['#3a5a3a','#4e7a4e'],['#a89a6a','#c8b884'],['#5a3a5a','#7e527e']];
GEN.car=v=>{const vert=v&1,cc=CARP[(v>>1)%6]||CARP[0],[cv,c]=vert?mk(26,38):mk(40,26);
if(!vert){shadow(c,20,22,17,3);rect(c,'#1a1a1e',5,17,8,4);rect(c,'#1a1a1e',27,17,8,4);rect(c,cc[0],3,8,34,11);rect(c,cc[1],3,8,34,6);rect(c,'#3a3a40',12,4,18,6);rect(c,cc[1],13,3,16,2);rect(c,'#1c2a34',14,5,6,4);rect(c,'#1c2a34',22,5,6,4);P(c,'#8a8f98',16,5,1,3);rect(c,'#a8562a',5,13,5,3);rect(c,'#a8562a',30,10,4,3);P(c,'#ffd98a',3,11,2,2)}
else{shadow(c,13,34,10,3);rect(c,'#1a1a1e',3,8,4,8);rect(c,'#1a1a1e',19,8,4,8);rect(c,'#1a1a1e',3,24,4,8);rect(c,'#1a1a1e',19,24,4,8);rect(c,cc[0],4,3,18,31);rect(c,cc[1],4,3,18,22);rect(c,'#3a3a40',6,10,14,14);rect(c,'#1c2a34',7,11,12,5);rect(c,'#1c2a34',7,18,12,5);P(c,'#8a8f98',12,12,1,4);rect(c,'#a8562a',5,28,6,4);rect(c,'#a8562a',16,5,4,3)}
return{cv,ax:vert?13:20,ay:vert?32:22}};
GEN.pump=v=>{const[cv,c]=mk(18,30);shadow(c,9,27,6,2);rect(c,'#7a2a22',3,6,12,19);rect(c,'#b4362c',3,6,12,12);rect(c,'#1c2a34',5,8,8,5);rect(c,'#d8d0c0',5,19,8,3);rect(c,'#3a3a42',2,24,14,2);rect(c,'#2a2a30',14,12,2,8);return{cv,ax:9,ay:26}};
GEN.cart=v=>{const[cv,c]=mk(26,22);shadow(c,13,19,10,2);rect(c,'#3e3834',3,6,20,10);rect(c,'#6a5e52',4,7,18,8);rect(c,'#8a7a68',4,7,18,2);ell(c,13,8,8,2,'#2a2420');P(c,'#c8a050',9,6,2,2);P(c,'#c8a050',14,7,2,2);rect(c,'#1a1a1e',5,16,4,3);rect(c,'#1a1a1e',17,16,4,3);return{cv,ax:13,ay:18}};
GEN.drill=v=>{const[cv,c]=mk(36,42);shadow(c,18,38,13,3);line(c,6,34,17,6,'#6a6258',2);line(c,30,34,19,6,'#6a6258',2);rect(c,'#c8a030',9,16,18,10);rect(c,'#e8c048',9,16,18,3);rect(c,'#3a3a42',16,26,4,10);rect(c,'#5a5a64',16,4,4,6);rect(c,'#2a2a30',10,20,16,2);return{cv,ax:18,ay:36}};
GEN.tank=v=>{const[cv,c]=mk(44,100),cx=22;shadow(c,cx,94,20,5);rect(c,'#2a323a',2,80,40,12);rect(c,'#4a5864',2,80,40,3);ell(c,cx,80,20,6,'#4a5864');
for(let y=20;y<82;y++){c.fillStyle='rgba(120,230,220,.35)';c.fillRect(cx-16,y,32,1);c.fillStyle='rgba(190,255,250,.55)';c.fillRect(cx-16,y,3,1);c.fillStyle='rgba(40,120,130,.5)';c.fillRect(cx+10,y,6,1)}
ell(c,cx,20,16,6,'#7ae0d6');ell(c,cx,19,13,4,'#b0fff4');rect(c,'#3a4450',cx-18,12,36,10);rect(c,'#566474',cx-18,12,36,3);rect(c,'#2a323a',cx-4,0,8,14);for(let x=-14;x<=14;x+=7)rect(c,'#2a323a',cx+x,22,2,60);return{cv,ax:cx,ay:94}};
GEN.dig=v=>{const[cv,c]=mk(16,10);if(!v){line(c,3,2,12,8,'#b03a2a',2);line(c,12,2,3,8,'#b03a2a',2)}else{ell(c,8,6,6,3,'#8a6a3a');ell(c,8,6,4,2,'#4a3a20');ell(c,6,5,2,1,'#c9a050')}return{cv,ax:8,ay:6,flat:true}};
// ----- interior props (16 wide, anchored bottom-centre of a cell) -----
const PR={};
PR.bed=(c,v)=>{rect(c,'#3a2a1c',1,6,14,15);rect(c,'#6a4a2c',2,6,12,14);rect(c,'#e8e4d8',3,7,10,5);rect(c,'#5a7aa8',2,12,12,8);rect(c,'#7a9ac8',2,12,12,3)};
PR.table=(c)=>{rect(c,'#4a3220',2,8,12,9);rect(c,'#8a6038',1,6,14,6);rect(c,'#a87848',1,6,14,2);rect(c,'#d8d0c0',6,7,3,2);P(c,'#c04a3a',10,8,2,2)};
PR.shelf=(c)=>{rect(c,'#4a3220',0,0,16,25);rect(c,'#6a482c',1,1,14,23);for(let i=0;i<3;i++){rect(c,'#3a2616',1,7+i*8,14,1);for(let k=0;k<5;k++)rect(c,['#c04a3a','#4a7ac0','#e0b040','#58a058','#a058a0'][(k+i*2)%5],2+k*3,2+i*8,2,5)}};
PR.crate=(c,v)=>{rect(c,'#5a3c22',1,5,14,13);rect(c,'#8a6038',2,6,12,11);rect(c,'#a87848',2,6,12,2);for(let x=2;x<14;x+=4)rect(c,'#6a4628',x,6,1,11);if(v){rect(c,'#2a1a0e',3,7,10,4);rect(c,'#a87848',1,2,14,3)}};
PR.stove=(c)=>{rect(c,'#6a6e76',1,3,14,19);rect(c,'#9aa0a8',2,4,12,10);rect(c,'#2a2e34',3,15,10,5);rect(c,'#c8ccd2',2,4,12,2);rect(c,'#2a2e34',4,7,3,3);rect(c,'#2a2e34',9,7,3,3)};
PR.sofa=(c)=>{rect(c,'#4a2a2a',1,3,14,12);rect(c,'#7a3e3e',2,4,12,7);rect(c,'#9a5252',2,4,12,3);rect(c,'#4a2a2a',0,6,2,9);rect(c,'#4a2a2a',14,6,2,9)};
PR.counter=(c)=>{rect(c,'#3a3a42',0,6,16,12);rect(c,'#8a6a48',0,4,16,6);rect(c,'#b08a5c',0,4,16,2);rect(c,'#5a5a64',0,10,16,1);P(c,'#d8d0c0',4,3,3,2)};
PR.hbed=(c)=>{rect(c,'#8a909a',1,6,14,15);rect(c,'#e6ecf2',2,7,12,5);rect(c,'#7ab0d0',2,12,12,8);rect(c,'#a8d0e6',2,12,12,3);rect(c,'#5a6068',1,19,2,3);rect(c,'#5a6068',13,19,2,3)};
PR.terminal=(c)=>{rect(c,'#2e343c',1,10,14,10);rect(c,'#4a525c',1,10,14,3);rect(c,'#1a1e24',3,1,10,9);rect(c,'#3ae0a8',4,2,8,6);for(let i=0;i<3;i++)rect(c,'#a0ffe0',5,3+i*2,3+i,1);rect(c,'#1a1e24',6,17,4,2)};
PR.relterm=(c)=>{PR.terminal(c);rect(c,'#e0742a',4,2,8,6);for(let i=0;i<3;i++)rect(c,'#ffd08a',5,3+i*2,4,1)};
PR.bench=(c)=>{rect(c,'#3a4450',0,8,16,10);rect(c,'#c8d0d8',0,6,16,5);rect(c,'#e6ecf2',0,6,16,2);rect(c,'#7ae0d6',3,3,3,4);rect(c,'#e06a6a',9,2,3,5);rect(c,'#3a4450',3,3,3,1)};
PR.locker=(c,v)=>{rect(c,'#3a4a5a',1,0,14,25);rect(c,'#566a7e',2,1,12,23);rect(c,'#7088a0',2,1,12,3);rect(c,'#2a3a48',8,2,1,22);rect(c,'#c8d0d8',6,12,1,3);rect(c,'#c8d0d8',10,12,1,3);if(v)rect(c,'#1a2a38',3,6,10,10)};
PR.rack=(c)=>{rect(c,'#1c2026',0,0,16,25);rect(c,'#2e343c',1,1,14,23);for(let i=0;i<5;i++){rect(c,'#4a525c',2,3+i*4,12,3);P(c,i%2?'#3ae070':'#e0a03a',3,4+i*4);P(c,'#3ae0e0',5,4+i*4)}};
PR.gen=(c)=>{rect(c,'#3a3e44',0,5,16,16);rect(c,'#c8a030',1,6,14,7);rect(c,'#e8c048',1,6,14,2);rect(c,'#2a2e34',3,15,10,4);rect(c,'#5a5a64',12,1,2,6)};
PR.barrel=(c)=>{ball(c,8,12,6,7,['#3a4a58','#566878','#7a8c9c']);rect(c,'#2a2a30',2,9,12,1);rect(c,'#2a2a30',2,15,12,1)};
PR.chest=(c,v)=>{rect(c,'#4a2e18',1,7,14,9);rect(c,'#7a4e2a',2,8,12,7);rect(c,'#c9a23a',1,10,14,1);rect(c,'#c9a23a',7,7,2,5);if(v){rect(c,'#2a1608',2,7,12,3);rect(c,'#7a4e2a',1,3,14,4)}else{rect(c,'#9a6a3a',2,5,12,3)}};
PR.plant=(c)=>{rect(c,'#8a4a2a',5,13,6,7);rect(c,'#a8603a',5,13,6,2);ball(c,8,8,6,6,GREENS[0]);P(c,'#ff7ab0',6,5,2,2)};
Object.keys(PR).forEach(k=>{GEN['p_'+k]=v=>{const[cv,c]=mk(16,28);const ctx2=c;ctx2.translate(0,6);PR[k](c,v);return{cv,ax:8,ay:22}}});
SP.get=function(k,v){const key=k+'|'+(v|0);let s=cache[key];if(!s){const g=GEN[k]||GEN.bush;s=cache[key]=g(v|0)}return s};
// ----- characters -----
const SKIN=['#f2c9a0','#e0a878','#b9805a','#7a4e34'],HAIR=['#2a1c14','#6a4226','#c9a24a','#b84a2a','#a8a8b0','#2a4a8a'],SHIRT=['#d4543a','#3a7ac0','#4aa05a','#e0b040','#8a4ab0','#c8ccd2','#2a2a30','#d87aa0'];
SP.SKIN=SKIN;SP.HAIR=HAIR;SP.SHIRT=SHIRT;
SP.charSheet=function(o){const FW=16,FH=26,[sheet,sc]=mk(FW*4,FH*4);const skin=SKIN[o.skin%4],hair=o.hairHex||HAIR[o.hair%6],shirt=o.shirtHex||SHIRT[o.shirt%8],pants=o.pants||'#3a4658',boot='#2a1e18',pack=o.pack||'#7a5a34',long=o.style===1,white=o.white;
const shade=(h,a)=>{const n=U.hex(h);return'rgb('+n.map(v=>Math.max(0,Math.min(255,Math.round(v*a)))).join(',')+')'};
for(let d=0;d<4;d++)for(let f=0;f<4;f++){const[fc,c]=mk(FW,FH),bob=(f===1||f===3)?-1:0,sw=f===1?1:f===3?-1:0,ox=0,oy=2+bob;
const legY=17+oy,L=(f===1?-1:f===3?1:0);
if(d===1||d===2){const dir=d===1?-1:1;const lx=(a)=>Math.round(8+a);
rect(c,pants,lx(-2+L*dir*2),legY,3,5);rect(c,boot,lx(-2+L*dir*2),legY+4,4,2);rect(c,shade(pants,.8),lx(0-L*dir*2),legY,3,5);rect(c,boot,lx(0-L*dir*2),legY+4,4,2);
if(o.pack!==false)rect(c,pack,d===1?9:3,10+oy,4,7);
rect(c,shirt,4,10+oy,8,8);rect(c,shade(shirt,1.15),4,10+oy,8,2);rect(c,shade(shirt,.8),d===1?9:4,12+oy,3,6);
rect(c,skin,6+sw*dir,12+oy,2,6);rect(c,skin,5,2+oy,7,8);rect(c,hair,4,1+oy,8,4);rect(c,hair,d===1?8:4,3+oy,4,long?9:5);if(white){rect(c,'#e8e8ee',d===1?4:8,8+oy,4,3)}
rect(c,'#1a1410',d===1?5:10,6+oy,1,2);rect(c,shade(skin,.85),d===1?5:11,9+oy,1,1)}
else{const back=d===3;
rect(c,pants,4+(L>0?-1:0)*0,legY,3,5+(L<0?1:0));rect(c,boot,4,legY+4+(L<0?1:0),3,2);rect(c,shade(pants,.8),9,legY,3,5+(L>0?1:0));rect(c,boot,9,legY+4+(L>0?1:0),3,2);
rect(c,shirt,3,10+oy,10,8);rect(c,shade(shirt,1.15),3,10+oy,10,2);rect(c,shade(shirt,.75),3,16+oy,10,2);
rect(c,skin,1,11+oy,2,6+(sw?-sw:0));rect(c,skin,13,11+oy,2,6+(sw?sw:0));rect(c,shade(shirt,.9),1,11+oy,2,2);rect(c,shade(shirt,.9),13,11+oy,2,2);
if(back&&o.pack!==false){rect(c,pack,4,11+oy,8,8);rect(c,shade(pack,.7),4,17+oy,8,2);rect(c,shade(pack,1.2),4,11+oy,8,2)}
rect(c,skin,4,2+oy,8,8);rect(c,hair,3,1+oy,10,back?9:4);if(!back){rect(c,hair,3,1+oy,2,long?9:5);rect(c,hair,11,1+oy,2,long?9:5);rect(c,'#1a1410',6,6+oy,1,2);rect(c,'#1a1410',9,6+oy,1,2);if(white)rect(c,'#e8e8ee',5,8+oy,6,3)}
else if(long)rect(c,hair,3,9+oy,10,3)}
// outline
const[t,tc]=mk(FW,FH);tc.drawImage(fc,0,0);tc.globalCompositeOperation='source-in';tc.fillStyle='#1b1410';tc.fillRect(0,0,FW,FH);
const dest=sc;dest.save();dest.translate(f*FW,d*FH);[[1,0],[-1,0],[0,1],[0,-1]].forEach(a=>dest.drawImage(t,a[0],a[1]));dest.drawImage(fc,0,0);dest.restore()}
return{cv:sheet,FW,FH,ax:8,ay:25}};
})();

(function(){
const CI=globalThis.CI,U=CI.U,SP=CI.Sprites;
const mk=(w,h)=>{const c=U.mkCanvas(w,h);return[c,c.getContext('2d')]};
const R=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
const shade=(h,a)=>{const n=U.hex(h);return'rgb('+n.map(v=>Math.max(0,Math.min(255,Math.round(v*a)))).join(',')+')'};
function outline(src,W,H){const[t,tc]=mk(W,H);tc.drawImage(src,0,0);tc.globalCompositeOperation='source-in';tc.fillStyle='#14100e';tc.fillRect(0,0,W,H);const[o,oc]=mk(W,H);[[1,0],[-1,0],[0,1],[0,-1]].forEach(a=>oc.drawImage(t,a[0],a[1]));oc.drawImage(src,0,0);return o}
// every enemy: sheet of 2 frames, facing RIGHT, FW x FH each, anchor at feet (ax,ay)
const GEN={};
GEN.jackal=(c,f)=>{const col='#b08850',dk='#7a5a34';const b=f?1:0;
R(c,dk,2,6,4,2);R(c,col,4,5,12,6);R(c,'#d8b878',5,9,10,2);R(c,col,15,3,6,5);R(c,dk,19,2,2,3);R(c,'#e8d0a0',20,6,3,2);R(c,'#14100e',19,4,1,1);R(c,dk,16,1,2,3);
R(c,dk,5+b*2,10,2,4);R(c,dk,13-b*2,10,2,4);R(c,col,8-b*2,10,2,4);R(c,col,11+b*2,10,2,4);R(c,'#a02a20',20,5,1,1)};
GEN.wolf=(c,f)=>{const col='#9aa2ac',dk='#5a626c',lt='#d8dde4';const b=f?1:0;
R(c,dk,1,6,5,3);R(c,col,4,5,15,8);R(c,lt,5,11,13,2);R(c,col,18,3,7,6);R(c,dk,22,2,2,3);R(c,dk,19,1,2,4);R(c,lt,23,7,3,2);R(c,'#14100e',22,4,1,1);R(c,'#e8c040',22,5,1,1);R(c,dk,17,5,3,3);
R(c,dk,5+b*2,12,2,5);R(c,dk,15-b*2,12,2,5);R(c,col,9-b*2,12,2,5);R(c,col,12+b*2,12,2,5)};
GEN.infected=(c,f)=>{const sk='#8aa070',sh='#6a5a48',pt='#3a4048';const b=f?1:0,bob=b?-1:0;
R(c,pt,5,17+bob,3,5);R(c,pt,9,17+bob,3,5);R(c,'#2a1e18',5+b*2,21,4,2);R(c,'#2a1e18',9-b*2,21,4,2);
R(c,sh,4,9+bob,8,9);R(c,'#8a2a22',5,12+bob,3,2);R(c,shade(sh,.7),4,16+bob,8,2);
R(c,sk,11,10+bob,5,2);R(c,sk,14,10+bob,2,3);R(c,sk,6,1+bob,7,8);R(c,'#4a5a3a',5,0+bob,8,3);R(c,'#d8e060',10,4+bob,2,2);R(c,'#14100e',11,5+bob,1,1);R(c,'#5a2a22',9,7+bob,3,1)};
GEN.raider=(c,f)=>{const b=f?1:0,bob=b?-1:0;
R(c,'#2a2a30',5,17+bob,3,5);R(c,'#2a2a30',9,17+bob,3,5);R(c,'#14100e',5+b*2,21,4,2);R(c,'#14100e',9-b*2,21,4,2);
R(c,'#4a3a30',4,9+bob,8,9);R(c,'#6a5040',4,9+bob,8,2);R(c,'#a82a22',4,9+bob,8,1);R(c,'#2a2018',3,14+bob,10,2);
R(c,'#d8b090',11,11+bob,4,2);R(c,'#7a5a34',14,5+bob,2,9);R(c,'#4a3a1c',13,4+bob,4,3);
R(c,'#d8b090',6,2+bob,7,7);R(c,'#a82a22',5,1+bob,9,3);R(c,'#a82a22',4,3+bob,2,3);R(c,'#14100e',10,5+bob,1,2);R(c,'#14100e',8,8+bob,5,1)};
GEN.imp=(c,f)=>{const b=f?1:0,bob=b?-1:0;
R(c,'#c8382a',4,5+bob,8,8);R(c,'#ff7a30',5,7+bob,6,4);R(c,'#ffd060',6,8+bob,3,2);R(c,'#7a1a14',3,3+bob,2,3);R(c,'#7a1a14',11,3+bob,2,3);R(c,'#e8c040',5,5+bob,2,1);R(c,'#e8c040',9,5+bob,2,1);
R(c,'#7a1a14',4+b*2,13,2,3);R(c,'#7a1a14',9-b*2,13,2,3);R(c,'#ff9a2e',1,7+bob,3,2);R(c,'#ff9a2e',12,7+bob,3,2);R(c,'#ffd060',13,6+bob,1,1)};
GEN.sentry=(c,f)=>{const b=f?1:0,bob=b?-1:0;
R(c,'#2a323a',4,8+bob,10,10);R(c,'#566474',4,8+bob,10,3);R(c,'#7a8a9a',5,9+bob,8,1);R(c,'#3a4450',3,12+bob,12,3);
R(c,'#14100e',6,10+bob,6,4);R(c,f?'#ff4a3a':'#ff8a7a',8,11+bob,3,2);R(c,'#566474',8,3+bob,2,5);R(c,'#e84a3a',8,2+bob,2,2);R(c,'#8a9aaa',1,12+bob,2,5);R(c,'#8a9aaa',15,12+bob,2,5);
R(c,'rgba(120,230,220,.45)',6,19,6,1);R(c,'rgba(120,230,220,.25)',5,20,8,1)};
const SIZE={jackal:[24,14,12,13],wolf:[28,18,14,17],infected:[16,24,8,23],raider:[18,24,9,23],imp:[16,18,8,17],sentry:[18,22,9,18]};
const cache={};
SP.enemy=function(type){let e=cache[type];if(e)return e;const[W,H,ax,ay]=SIZE[type],[sheet,sc]=mk(W*2,H);
for(let f=0;f<2;f++){const[fc,c]=mk(W,H);GEN[type](c,f);const o=outline(fc,W,H);sc.drawImage(o,f*W,0)}
return cache[type]={cv:sheet,FW:W,FH:H,ax,ay}};
// pickup / misc
SP.coin=function(){if(cache.coin)return cache.coin;const[cv,c]=mk(8,8);R(c,'#7a5a14',2,0,4,8);R(c,'#7a5a14',0,2,8,4);R(c,'#f2c040',2,1,4,6);R(c,'#f2c040',1,2,6,4);R(c,'#fff0a0',2,2,2,2);R(c,'#c8941c',5,4,1,2);return cache.coin={cv,ax:4,ay:6}};
SP.itemIcon=function(k){const key='i'+k;if(cache[key])return cache[key];const[cv,c]=mk(8,8);
if(k==='medkit'){R(c,'#e8e8ee',0,1,8,6);R(c,'#d03a30',3,2,2,4);R(c,'#d03a30',2,3,4,2)}
else if(k==='bandage'){R(c,'#e8e0c8',0,2,8,4);R(c,'#c03a30',3,2,2,4)}
else if(k==='ammo'){R(c,'#6a5a2a',1,1,6,6);R(c,'#e8c040',2,2,1,4);R(c,'#e8c040',4,2,1,4);R(c,'#e8c040',6,2,1,4)}
else if(k==='stim'){R(c,'#8ae0d0',3,0,2,6);R(c,'#e8e8ee',2,5,4,2);R(c,'#3a4450',3,7,2,1)}
else if(k==='vest'){R(c,'#4a5a6a',1,1,6,6);R(c,'#7a8a9a',1,1,6,1);R(c,'#2a323a',3,1,2,3)}
else if(k==='keycard'){R(c,'#e8c040',0,2,8,5);R(c,'#14100e',1,3,3,1);R(c,'#d03a30',5,4,2,2)}
else{R(c,'#8a7a5a',1,1,6,6)}
return cache[key]={cv,ax:4,ay:6}};
})();

(function(){
const CI=globalThis.CI,U=CI.U,D=CI.D,T=D.T;
const TR=CI.Terrain={};
const CS=256,PAL=D.PAL,CRISP=D.CRISP,LIQ=D.LIQUID,WALL=D.WALL;
const {DEEP,WATER,SHALLOW,SAND,WETSAND,GRASS,JGRASS,DIRT,SNOW,ICE,ROCK,BASALT,ASH,LAVA,CLIFF,ROAD,CONC,PLANK,F_WOOD,F_TILE,F_METAL,F_STONE,W_WOOD,W_BRICK,W_CONC,W_METAL,W_STONE,MUD}=T;
const vn=U.vn,hs=U.hash;
function hsh(x,y){let h=(Math.imul(x,374761393)+Math.imul(y,668265263))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
// shared rock colour (cliff tops, facility roof)
function rock(wx,wy,out){const p=PAL[CLIFF];const s=vn(wx/22,wy/4.5)*.5+vn(wx/7,wy/7)*.35+hsh(wx,wy)*.15;const big=vn(wx/60+3,wy/60);let i=s<.38?0:s<.66?1:s<.92?2:3;
let r=p[i][0],g=p[i][1],b=p[i][2];if(big>.66&&vn(wx/5,wy/5)>.45){r=60;g=104;b=64;if(s>.6){r=84;g=130;b=78}}else if(big<.22&&vn(wx/4,wy/4)>.5){r=214;g=226;b=236}
out[0]=r;out[1]=g;out[2]=b}
TR.rockColor=rock;
const tmp=[0,0,0];
TR.chunk=function(W,cx0,cy0){
const GW=W.GW,ter=W.ter,dec=W.dec,X0=cx0*CS,Y0=cy0*CS;
const cv=U.mkCanvas(CS,CS),ctx=cv.getContext('2d'),img=ctx.createImageData(CS,CS),d=img.data;
let foam=null,anyFoam=false;const Tat=(x,y)=>ter[(y<0?0:y>=GW?GW-1:y)*GW+(x<0?0:x>=GW?GW-1:x)];
for(let py=0;py<CS;py++){const wy=Y0+py,ccy=wy>>4,ly=wy&15;
for(let px=0;px<CS;px++){const wx=X0+px,ccx=wx>>4,lx=wx&15,o=ter[ccy*GW+ccx];let t=o,landW=0,cliffFace=0,cliffShade=0,lavaGlow=0;
if(!CRISP[o]){const u=(wx+.5)/16-.5,v=(wy+.5)/16-.5,ix=Math.floor(u),iy=Math.floor(v),fx=u-ix,fy=v-iy;
let a=Tat(ix,iy),b=Tat(ix+1,iy),c=Tat(ix,iy+1),dd=Tat(ix+1,iy+1);if(CRISP[a])a=o;if(CRISP[b])b=o;if(CRISP[c])c=o;if(CRISP[dd])dd=o;
if(a!==b||b!==c||c!==dd){const wa=(1-fx)*(1-fy),wb=fx*(1-fy),wc=(1-fx)*fy,wd=fx*fy;const n=vn(wx/4.5,wy/4.5)*.55+hsh(wx,wy)*.45;const r=Math.min(.9999,Math.max(0,(n-.5)*1.7+.5));
t=r<wa?a:r<wa+wb?b:r<wa+wb+wc?c:dd;
if(LIQ[t]){if(!LIQ[a])landW+=wa;if(!LIQ[b])landW+=wb;if(!LIQ[c])landW+=wc;if(!LIQ[dd])landW+=wd}
if(t===CLIFF){cliffFace=(c!==CLIFF?wc:0)+(dd!==CLIFF?wd:0)}else{cliffShade=(a===CLIFF?wa:0)+(b===CLIFF?wb:0)}
if(t!==LAVA)lavaGlow=(a===LAVA?wa:0)+(b===LAVA?wb:0)+(c===LAVA?wc:0)+(dd===LAVA?wd:0)}else t=a}
const p=PAL[t];let R,G,B,m=1;
const big=vn(wx/48,wy/48),s=vn(wx/6,wy/6)*.5+vn(wx/2.4+.5,wy/2.4)*.28+hsh(wx,wy)*.08+(big-.5)*.36+.12;
let i=s<.36?0:s<.64?1:s<.93?2:3;
switch(t){
case DEEP:case WATER:case SHALLOW:{const rip=Math.sin((wx*.7+wy*.45)*.33+vn(wx/18,wy/18)*7);i=s<.42?0:s<.7?1:2;if(rip>.9)i=3;if(t===SHALLOW&&vn(wx/30,wy/30)>.62&&rip>.4)i=3;break}
case SAND:{const rp=Math.sin((wx+wy*.45)*.2+vn(wx/30,wy/30)*8);if(rp>.992)i=0;else if(s>.82)i=3;break}
case SNOW:if(hsh(wx,wy)>.996)i=3;else i=s<.4?0:s<.78?1:2;break;
case GRASS:case JGRASS:{if(hsh(wx>>1,wy)>.93&&(wy&1))i=3;break}
case LAVA:{const f=vn(wx/9+wy/40,wy/6),f2=vn(wx/3.2,wy/3.2);i=f<.3?0:f<.55?1:f2>.6?3:2;break}
case ICE:{if(Math.abs(vn(wx/16,wy/16)-.5)<.018||Math.abs(vn(wx/9+5,wy/9)-.5)<.01)i=0;else i=s<.5?1:s<.85?2:3;break}
case BASALT:case ASH:{const cr=Math.abs(vn(wx/13,wy/13)-.5);if(t===BASALT&&cr<.016){R=255;G=120+hsh(wx,wy)*60;B=30;i=-1}else if(cr<.022)i=0;break}
case ROCK:{const st=vn(wx/16,wy/3)*.6+s*.4;i=st<.4?0:st<.7?1:st<.93?2:3;break}
case MUD:if(hsh(wx>>2,wy>>2)>.86)i=0;break;
case DIRT:if(hsh(wx,wy)>.985){i=3}break;
case CLIFF:{rock(wx,wy,tmp);R=tmp[0];G=tmp[1];B=tmp[2];i=-1;if(cliffFace>.1){const str=vn(wx/3,wy/22);m=.5+str*.35-(cliffFace-.1)*.2;if(str>.7)m+=.12;G=Math.min(255,G);}break}
case ROAD:{const cr=Math.abs(vn(wx/10,wy/10)-.5);if(cr<.014||(hsh(wx>>2,wy>>2)>.97&&hsh(wx,wy)>.5))i=0;const dk=dec[ccy*GW+ccx];
if(dk===2&&ly>=7&&ly<=8&&(lx&15)<14){R=214;G=176;B=52;i=-1}else if(dk===3&&lx>=7&&lx<=8&&(ly&15)<14){R=214;G=176;B=52;i=-1}else if(dk===4&&((ly>>1)&1)===0){R=222;G=222;B=214;i=-1}break}
case CONC:{if(lx===0||ly===0)i=0;else if(Math.abs(vn(wx/11,wy/11)-.5)<.012)i=0;break}
case PLANK:{const pl=(wy>>2)&1;if((wy&3)===3)i=0;else{i=pl?1:2;if(hsh(wx>>3,wy>>2)>.8)i=1}if(((wx&15)===1||(wx&15)===14)&&(wy&3)===1)i=3;break}
case F_WOOD:{if((wy&3)===3)i=0;else{const sh=hsh((wx+((wy>>2)&1)*7)>>4,wy>>2);i=sh<.3?1:sh<.7?2:1;if(((wx+((wy>>2)&1)*7)&15)===0)i=0}break}
case F_TILE:{if(lx===0||ly===0)i=0;else if((((wx>>4)+(wy>>4))&1)===0)i=2;else i=3;if(hsh(wx>>4,wy>>4)>.9&&i>0)i=1;break}
case F_METAL:{if(lx===0||ly===0)i=0;else if((lx===3||lx===12)&&(ly===3||ly===12))i=3;else i=((wx>>4)+(wy>>4))&1?1:2;break}
case F_STONE:{const bx=(wx+((wy>>3)&1)*5)>>3,sh=hsh(bx,wy>>3);if((wy&7)===0||((wx+((wy>>3)&1)*5)&7)===0)i=0;else i=sh<.3?1:sh<.7?2:3;break}
case W_BRICK:case W_WOOD:case W_CONC:case W_METAL:case W_STONE:{
const south=ter[Math.min(GW-1,ccy+1)*GW+ccx],front=!WALL[south],dk=dec[ccy*GW+ccx];
if(!front){i=0;R=Math.round(p[0][0]*.72);G=Math.round(p[0][1]*.72);B=Math.round(p[0][2]*.72);if(ly<2||lx<1){R+=16;G+=16;B+=16}i=-1;break}
if(t===W_BRICK){const row=ly>>2,bx=(lx+(row&1)*4)&7;if((ly&3)===3||bx===7)i=0;else i=hsh((wx+(row&1)*4)>>3,wy>>2)>.5?1:2}
else if(t===W_WOOD){if((lx&3)===3)i=0;else i=((lx>>2)+(wx>>4))&1?1:2;if(ly<2)i=3}
else if(t===W_CONC){if(ly===8||lx===0)i=0;else i=(lx>7)?1:2;if(hsh(wx>>3,wy>>3)>.88)i=1}
else if(t===W_METAL){if(lx===0||ly===8)i=0;else if((lx===3||lx===12)&&(ly===3||ly===12))i=3;else i=lx<8?1:2;if(ly<2)i=3}
else{const row=ly>>3,bx=(lx+row*5)&15;if((ly&7)===7||bx===0)i=0;else i=hsh((wx+row*5)>>4,wy>>3)>.5?1:2}
if(ly>=14)m=.72;else if(ly>=12)m=.88;
if(dk===1&&lx>=4&&lx<=11&&ly>=3&&ly<=11){const edge=lx===4||lx===11||ly===3||ly===11||lx===7||lx===8;if(edge){R=198;G=186;B=160}else{const k=(lx-4)+(ly-3)*.5;R=40+k*3;G=68+k*4;B=96+k*5;if((lx+ly)%7===0){R+=60;G+=60;B+=60}}i=-1;m=1}
break}}
if(i>=0){const q=p[i];R=q[0];G=q[1];B=q[2]}
if(!WALL[t]&&t!==LAVA&&t!==CLIFF){const nn=ter[Math.max(0,ccy-1)*GW+ccx];if(ly<5&&WALL[nn]){m*=1-.34*(5-ly)/5}else if(WALL[ter[ccy*GW+Math.max(0,ccx-1)]]&&lx<2)m*=.85}
if(cliffShade>.15)m*=1-.38*cliffShade;
if(lavaGlow>0){const k=Math.min(.55,lavaGlow*.9);R=R+(255-R)*k;G=G+(110-G)*k;B=B+(30-B)*k}
const o4=(py*CS+px)*4;d[o4]=Math.min(255,R*m);d[o4+1]=Math.min(255,G*m);d[o4+2]=Math.min(255,B*m);d[o4+3]=255;
if(landW>0&&hsh(wx>>1,wy>>1)>.18){const band=landW<.14?1:landW<.3?2:landW<.58?3:0;if(band){if(!foam)foam=new Uint8Array(128*128);foam[(py>>1)*128+(px>>1)]=band;anyFoam=true}}
}}
ctx.putImageData(img,0,0);
// special decor: rails
W.rails.forEach(r=>{if(r.x<X0+CS&&r.x+r.w>X0&&r.y<Y0+CS&&r.y+r.h>Y0){ctx.fillStyle='#3e2814';ctx.fillRect(r.x-X0,r.y-Y0,r.w,r.h);ctx.fillStyle='#8a6038';ctx.fillRect(r.x-X0,r.y-Y0,r.w>r.h?r.w:1,r.w>r.h?1:r.h);if(r.w>r.h)for(let k=0;k<r.w;k+=8){ctx.fillStyle='#2a1a0c';ctx.fillRect(r.x-X0+k,r.y-Y0-2,2,6)}else for(let k=0;k<r.h;k+=8){ctx.fillStyle='#2a1a0c';ctx.fillRect(r.x-X0-2,r.y-Y0+k,6,2)}}});
bakeDecor(ctx,W,cx0,cy0);
let foams=null;
if(anyFoam){foams=[];for(let b=1;b<=3;b++){const fc=U.mkCanvas(128,128),fx=fc.getContext('2d'),fi=fx.createImageData(128,128);for(let k=0;k<128*128;k++)if(foam[k]===b){fi.data[k*4]=244;fi.data[k*4+1]=252;fi.data[k*4+2]=255;fi.data[k*4+3]=255}fx.putImageData(fi,0,0);foams.push(fc)}}
return{cv,foams}};
function bakeDecor(ctx,W,cx0,cy0){const GW=W.GW,ter=W.ter,pm=W.pm;const P=(col,x,y,w,h)=>{ctx.fillStyle=col;ctx.fillRect(x,y,w||1,h||1)};
for(let cy=0;cy<16;cy++)for(let cx=0;cx<16;cx++){const gx=cx0*16+cx,gy=cy0*16+cy;if(gx>=GW||gy>=GW)continue;const t=ter[gy*GW+gx],h=hs(gx,gy,3),h2=hs(gx,gy,4),h3=hs(gx,gy,5),X=cx*16+((h2*13)|0),Y=cy*16+((h3*13)|0);
switch(t){
case GRASS:if(h<.55){P('#3e8a30',X,Y+1,1,2);P('#7acb52',X+1,Y,1,3);P('#3e8a30',X+2,Y+1,1,2)}if(h2<.05){P('#ffffff',X,Y,2,2);P('#ffd84a',X,Y,1,1)}else if(h2>.97){P('#ff7ab0',X,Y,2,2);P('#fff',X,Y,1,1)}break;
case JGRASS:if(h<.2){P('#124a26',X,Y+2,1,3);P('#1f7a3a',X+1,Y,1,5);P('#2e9a48',X+2,Y+1,1,4);P('#124a26',X+3,Y+2,1,3);P('#1f7a3a',X-1,Y+3,1,2)}else if(h<.48){P('#133f27',X,Y+1,1,2);P('#3a9a50',X+1,Y,1,3)}
if(h2<.012){P('#e8e0d0',X,Y+2,1,2);P('#d8503a',X-1,Y,3,2)}else if(h2>.93){P('#6a4a28',X,Y,2,1)}break;
case SAND:if(h<.05){P('#b8a276',X,Y,2,1);P('#d6c496',X,Y-1,1,1)}else if(h<.075){P('#f2d6e0',X,Y,2,2);P('#d89aae',X,Y+1,2,1)}break;
case WETSAND:if(h<.05){P('#f2d6e0',X,Y,2,1)}break;
case SNOW:if(h<.09){P('#b8cce0',X,Y+1,4,1);P('#ffffff',X,Y,3,1)}else if(h<.1){P('#8a8f98',X,Y,2,1)}break;
case BASALT:case ASH:if(h<.12){P('#14141a',X,Y+1,2,1);P('#4a4856',X,Y,2,1)}break;
case DIRT:if(h<.1){P('#6a5030',X,Y+1,2,1);P('#c0a273',X,Y,1,1)}break;
case GRASS+100:break}}}
// ---- roofs ----
TR.roof=function(W,b){const GW=W.GW,C=16,ox=b.x0*C,oy=b.y0*C,w=b.w*C,h=b.h*C,cv=U.mkCanvas(w,h),ctx=cv.getContext('2d'),img=ctx.createImageData(w,h),d=img.data;
const set=new Set(b.cells.map(c=>c[0]+','+c[1])),fac=new Set(b.facade),last=b.y0+b.h-1,kind=(b.roof&&b.roof.t)||'flat',base=U.hex((b.roof&&b.roof.c)||'#7a7f88');
const inRoof=(x,y)=>set.has(x+','+y)&&!(y===last&&fac.has(x));
const rnd=U.rng(b.id*77);const vents=[];for(let k=0;k<Math.floor(b.w*b.h/40);k++)vents.push([b.x0+1+Math.floor(rnd()*(b.w-2)),b.y0+1+Math.floor(rnd()*(b.h-3))]);
for(let gy=b.y0;gy<b.y0+b.h;gy++)for(let gx=b.x0;gx<b.x0+b.w;gx++){if(!inRoof(gx,gy))continue;
const rim=[inRoof(gx,gy-1)?99:0,inRoof(gx,gy+1)?99:0,inRoof(gx-1,gy)?99:0,inRoof(gx+1,gy)?99:0];
for(let ly=0;ly<C;ly++)for(let lx=0;lx<C;lx++){const wx=gx*C+lx,wy=gy*C+ly,px=wx-ox,py=wy-oy;let R,G,B,m=1;
if(kind==='rock'){rock(wx,wy,tmp);R=tmp[0];G=tmp[1];B=tmp[2]}
else if(kind==='shingle'){const row=wy/3|0,off=(row&1)*3;m=((wx+off)%6===5)?.78:(wy%3===2)?.84:(wy%3===0?1.08:1);m*=.9+hsh(row,(wx+off)/6|0)*.18;R=base[0];G=base[1];B=base[2];if(Math.abs(wy-(oy+h/2-C))<2){m*=1.18}}
else if(kind==='thatch'){const n=hsh(wx,wy>>1);m=.78+n*.4+((wy&3)===3?-.12:0);R=206;G=164;B=84}
else if(kind==='metal'){const st=(wx%4);m=st===0?1.14:st===3?.78:1;R=70;G=92;B=116;if(wy%24===0)m*=.7}
else if(kind==='snow'){const n=vn(wx/8,wy/8);R=232;G=240;B=248;m=.86+n*.2;if(n<.35){R=184;G=204;B=226}if((wx+wy)%9===0)m*=.96}
else{R=base[0];G=base[1];B=base[2];m=.9+vn(wx/10,wy/10)*.2+hsh(wx>>1,wy>>1)*.05}
if(kind==='flat'){for(const v of vents)if(v[0]===gx&&v[1]===gy&&lx>3&&lx<12&&ly>3&&ly<12){const e=lx===4||ly===4;R=e?150:96;G=e?154:100;B=e?160:106;m=1}}
const e0=ly<2&&rim[0]!==99,e1=ly>13&&rim[1]!==99,e2=lx<2&&rim[2]!==99,e3=lx>13&&rim[3]!==99;
if(kind!=='rock'){if(e0||e2){m*=1.2}if(e1||e3){m*=.6}}else{if(e1||e3||e0||e2)m*=.8}
const o4=(py*w+px)*4;d[o4]=Math.min(255,R*m);d[o4+1]=Math.min(255,G*m);d[o4+2]=Math.min(255,B*m);d[o4+3]=255}}
ctx.putImageData(img,0,0);
if(b.roof&&b.roof.h){const cx=(b.w-6)*C,cy=(b.h-1)*C*.35;ctx.strokeStyle='#e8c040';ctx.lineWidth=3;ctx.beginPath();ctx.arc(w-C*5.4,C*3.9,C*2.4,0,6.3);ctx.stroke();ctx.fillStyle='#e8c040';ctx.fillRect(w-C*5.4-9,C*3.9-12,4,24);ctx.fillRect(w-C*5.4+5,C*3.9-12,4,24);ctx.fillRect(w-C*5.4-9,C*3.9-2,18,4);
ctx.fillStyle='#d03a30';ctx.fillRect(C*2.6,C*2.6,5,18);ctx.fillRect(C*2.6-6,C*2.6+6,17,5)}
return{cv,ox,oy,sortY:last*C+1}};
})();

(function(){
const CI=globalThis.CI,U=CI.U,D=CI.D,T=D.T;
const {DEEP,WATER,SHALLOW,SAND,WETSAND,GRASS,JGRASS,DIRT,SNOW,ICE,ROCK,BASALT,ASH,LAVA,CLIFF,ROAD,CONC,PLANK,F_WOOD,F_TILE,F_METAL,F_STONE,W_WOOD,W_BRICK,W_CONC,W_METAL,W_STONE,MUD}=T;
// ---------- shared templates ----------
const PROP={B:'bed',T:'table',S:'shelf',K:'crate',F:'stove',N:'sofa',C:'counter',H:'hbed',P:'terminal',b:'bench',k:'locker',r:'rack',g:'gen',x:'barrel',c:'chest',R:'relterm',v:'plant'};
const LOOT={S:[5,16],K:[8,26],k:[10,32],c:[70,150]};
const carveGrid=(w,h,fn)=>{const g=Array.from({length:h},()=>Array(w).fill('#'));const car=(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]=c||'.'};const set=(x,y,c)=>{if(g[y]&&g[y][x]!==undefined)g[y][x]=c};fn(g,car,set);return g.map(r=>r.join(''))};
const hospital=carveGrid(22,15,(g,car,set)=>{car(1,1,6,4);car(8,1,13,4);car(15,1,20,4);car(1,6,20,7);car(1,9,6,13);car(8,9,13,13);car(15,9,20,13);
set(3,5,'d');set(10,5,'d');set(17,5,'d');set(3,8,'d');set(10,8,'d');set(11,8,'d');set(17,8,'d');set(10,14,'D');set(11,14,'D');
[[2,1],[5,1],[2,3],[5,3],[9,1],[12,1],[9,3],[12,3],[16,1],[19,1]].forEach((p,i)=>set(p[0],p[1],i<8?'H':'K'));set(20,4,'K');set(16,3,'K');set(13,4,'S');
set(8,11,'C');set(9,11,'C');set(12,11,'N');set(13,11,'N');set(12,13,'N');set(13,13,'N');set(13,9,'n');set(9,13,'n');
[1,2,4,5].forEach(x=>set(x,9,'S'));set(2,12,'K');set(5,12,'k');set(16,11,'H');set(18,11,'H');set(15,13,'b');set(20,10,'P');set(20,13,'k');
[2,6,10,14,18].forEach(x=>{if(g[0][x]==='#')set(x,0,'W')});[4,12,19].forEach(x=>set(x,14,'W'))});
const FAC=carveGrid(50,34,(g,car,set)=>{
car(17,28,32,32);car(1,28,15,32);car(34,28,48,32);car(15,8,17,26);car(32,8,34,26);car(15,8,34,10);car(15,25,34,26);car(19,12,30,23);
car(2,9,13,15);car(1,17,14,19);car(2,21,13,26);car(2,2,13,7);car(36,9,48,15);car(36,17,48,19);car(36,21,48,26);car(36,2,48,7);car(17,2,32,6);
set(24,33,'D');set(25,33,'D');set(24,27,'Z');set(25,27,'Z');set(24,24,'Z');set(25,24,'Z');set(24,11,'Z');set(25,11,'Z');set(24,7,'Z');set(25,7,'Z');
set(16,30,'d');set(33,30,'d');set(14,12,'d');set(6,16,'d');set(6,20,'d');set(8,8,'d');set(35,18,'Z');set(42,16,'d');set(42,20,'d');set(42,8,'L');set(0,18,'D');set(49,18,'X');
const P=(c,pts)=>pts.forEach(p=>set(p[0],p[1],c));
P('P',[[18,29],[3,14],[3,6],[40,9],[37,25]]);P('N',[[20,31],[21,31],[28,31],[29,31]]);P('S',[[2,28],[3,28],[4,28],[5,28],[6,28],[36,28],[37,28],[38,28],[39,28],[40,28]]);
P('K',[[9,30],[10,30],[9,31],[44,30],[45,30],[31,29],[19,29],[2,31]]);P('k',[[13,28],[14,28],[46,28],[47,28],[37,10],[38,10],[46,10],[47,10],[13,14],[41,26]]);P('c',[[47,31],[3,32]]);
P('b',[[20,13],[21,13],[28,13],[29,13],[3,10],[4,10],[5,10],[6,10],[9,10],[10,10],[11,10],[12,10],[3,23],[4,23],[5,23],[9,23],[10,23],[11,23],[12,23],[20,22],[29,22],[19,2],[19,3],[30,2],[30,3],[21,2],[23,2],[26,2],[28,2]]);
P('r',[[3,3],[4,3],[6,3],[7,3],[9,3],[10,3],[12,3],[13,3],[3,4],[4,4],[12,4],[13,4]]);P('B',[[37,22],[38,22],[41,22],[42,22],[45,22],[46,22],[37,24],[46,24]]);
P('g',[[44,9],[45,9],[47,13],[48,13]]);P('x',[[34,26],[34,25]]);P('R',[[28,3]]);P('c',[[44,3],[46,3]]);P('v',[[2,2],[2,26]]);P('n',[[22,31]]);set(32,3,'P');set(30,26,'P')});
const PAL=['#a8483a','#8a8f98','#4f7a5a','#b98a3e','#6b5a8a'];
const NOTE_BY={house:['house_note'],shop:['shop_note'],gas:['gas_note'],cabin:['cabin_note'],hut:['hut_note'],lab:['outpost_log'],cave:['cave_note'],mine:['mine_note'],bunker:['cave_note','mine_note'],ware:['shop_note','gas_note']};
const SITE_NAMES={
camp:['Abandoned Camp','Burnt-Out Camp','Survivor Camp','Deserted Camp','Looted Camp'],
cabin:['Overgrown Shack','Hunter Cabin','Trapper Cabin','Lonely Cabin','Collapsed Lodge'],
hut:['Beach Hut','Fisher Hut','Wreck Shack'],
town:['Ghost Town','Dead Hamlet','Silent Village','Empty Borough','Quarantine Row'],
outpost:['Weather Outpost','Signal Station','Relay Outpost','Survey Post'],
ruins:['Ancient Ruins','Moss Temple','Sunken Shrine','Stone Circle'],
mine:['Mining Camp','Ash Quarry','Cinder Works'],
bunker:['Hidden Bunker','Sealed Cellar','Old Shelter'],
facility:['Station Omega']};
CI.generate=function(seed,GWopt){
seed=(seed>>>0)||1;const GW=GWopt||448,N=GW*GW,C=16,WORLD=GW*C,H=GW/2,SC=GW/448;
const rnd=U.rng(seed),OX=(seed%1009)*7.3,OY=(seed%1013)*5.1;
const vn=(x,y)=>U.vn(x+OX,y+OY),fbm=(x,y,o)=>U.fbm(x+OX,y+OY,o);
const rr=(a,b)=>a+rnd()*(b-a),ri=(a,b)=>Math.floor(rr(a,b+1)),pick=a=>a[(rnd()*a.length)|0];
const ter=new Uint8Array(N),reg=new Uint8Array(N),inn=new Uint16Array(N),dec=new Uint8Array(N),pm=new Uint8Array(N),land=new Uint8Array(N),occ=new Uint8Array(N),brg=new Uint8Array(N);
const inb=(x,y)=>x>=0&&y>=0&&x<GW&&y<GW,ix=(x,y)=>y*GW+x;
const statics=[],buildings=[],doors=[],inter=[],pois=[],lights=[],emitters=[],colliders=[],npcs=[],rails=[],sites=[],spawnReq=[],extracts=[];
const S8=GW*2,tk=new Uint8Array(S8*S8);
const rect=(x0,y0,x1,y1,t,r)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inb(x,y)){ter[ix(x,y)]=t;if(r!==undefined)reg[ix(x,y)]=r}};
const disc=(cx,cy,r,fn)=>{for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)if(inb(x,y)&&(x-cx)*(x-cx)+(y-cy)*(y-cy)<=r*r)fn(x,y,ix(x,y))};
function bfs(src,maxd){const d=new Int16Array(N).fill(-1),q=new Int32Array(N);let h=0,t=0;for(let i=0;i<N;i++)if(src[i]){d[i]=0;q[t++]=i}
while(h<t){const i=q[h++];if(d[i]>=maxd)continue;const x=i%GW,y=(i/GW)|0;for(let k=0;k<4;k++){const nx=x+(k===0?1:k===1?-1:0),ny=y+(k===2?1:k===3?-1:0);if(!inb(nx,ny))continue;const j=ix(nx,ny);if(d[j]<0){d[j]=d[i]+1;q[t++]=j}}}return d}
function curve(pts,step){step=step||.6;const out=[],P=[pts[0]].concat(pts,[pts[pts.length-1]]);
for(let i=1;i<P.length-2;i++){const p0=P[i-1],p1=P[i],p2=P[i+1],p3=P[i+2];const n=Math.max(2,Math.ceil(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/step));
for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;const f=a=>.5*(2*p1[a]+(-p0[a]+p2[a])*t+(2*p0[a]-5*p1[a]+4*p2[a]-p3[a])*t2+(-p0[a]+3*p1[a]-3*p2[a]+p3[a])*t3);out.push([f(0),f(1)])}}
out.push(pts[pts.length-1].slice());return out}
function blob(cx,cy,r,t,o){o=o||{};disc(cx,cy,r*1.5,(x,y,i)=>{const d=Math.hypot(x-cx,y-cy)/r+(vn(x*.25+cx,y*.25+cy)-.5)*(o.nz||.5);if(d<1&&(!o.only||o.only.has(ter[i])))ter[i]=t})}
// ---------- 1. COAST ----------
const harm=[];for(let k=0;k<5;k++)harm.push({f:[2,3,4,6,9][k]+(k>2?ri(0,1):0),a:[9,7,5,3,2][k]*rr(.7,1.2)*SC,p:rr(0,6.28)});
const R0=a=>{let r=GW*.425;for(const h of harm)r+=h.a*Math.sin(a*h.f+h.p);return r};
const aS=rr(0,Math.PI*2);
for(let y=0;y<GW;y++)for(let x=0;x<GW;x++){const dx=x-H+.5,dy=y-H+.5,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
const R=R0(a)+(fbm(x*.02,y*.02,3)-.5)*26*SC;if(r<R&&x>10&&y>10&&x<GW-11&&y<GW-11)land[ix(x,y)]=1}
const coastPt=(a,inset)=>{let r=GW*.5;while(r>10){const x=Math.round(H+Math.cos(a)*r),y=Math.round(H+Math.sin(a)*r);if(inb(x,y)&&land[ix(x,y)])break;r--}r-=inset||0;return[H+Math.cos(a)*r,H+Math.sin(a)*r]};
const ocean=new Uint8Array(N);for(let i=0;i<N;i++)ocean[i]=land[i]?0:1;
const dsea=bfs(ocean,60),dland=bfs(land,40);for(let i=0;i<N;i++)if(dsea[i]<0)dsea[i]=99;
// ---------- 2. REGION SITES ----------
const quad=[2,3,4,6];for(let i=3;i>0;i--){const j=(rnd()*(i+1))|0;[quad[i],quad[j]]=[quad[j],quad[i]]}
const SITES=[];const polar=(a,rf)=>{const R=R0(a);return[H+Math.cos(a)*R*rf,H+Math.sin(a)*R*rf]};
for(let k=-2;k<=2;k++){const p=polar(aS+k*.26,.9);SITES.push([1,p[0],p[1],1])}
quad.forEach((rg,q)=>{const a0=aS+Math.PI/4+q*Math.PI/2+rr(-.15,.15);const n=rg===6?3:6;
for(let k=0;k<n;k++){const a=a0+rr(-.62,.62),p=polar(a,rg===6?rr(.45,.7):rr(.3,.82));SITES.push([rg,p[0],p[1],rr(.9,1.15)])}});
for(let k=0;k<3;k++){const a=rr(0,6.28),p=polar(a,rr(.05,.25));SITES.push([pick([2,4,3]),p[0],p[1],.9])}
const reg2=new Uint8Array(N),gap=new Float32Array(N);
for(let y=0;y<GW;y++)for(let x=0;x<GW;x++){const i=ix(x,y);if(!land[i])continue;let b=1e9,s=1e9,br=0,sr=0;
for(let k=0;k<SITES.length;k++){const S=SITES[k];const d=Math.hypot(x-S[1],y-S[2])/S[3]+(vn(x*.05+S[1],y*.05+S[2])-.5)*26;
if(d<b){s=b;sr=br;b=d;br=S[0]}else if(d<s&&S[0]!==br){s=d;sr=S[0]}}reg[i]=br;reg2[i]=sr;gap[i]=s-b}
function baseTer(rg,x,y,ds){const n=fbm(x*.08,y*.08,2),n2=vn(x*.1+40,y*.1+7);
switch(rg){
case 1:if(ds<=1)return WETSAND;if(ds<=10+n*8)return SAND;return n>.64?SAND:GRASS;
case 2:if(ds<=1)return WETSAND;if(ds<=3)return SAND;if(n2>.76)return GRASS;if(vn(x*.12,y*.12)<.17)return MUD;return JGRASS;
case 3:if(ds<=1)return WETSAND;if(ds<=3)return SAND;return n2>.8?DIRT:GRASS;
case 4:if(ds<=1)return ROCK;return n>.7?ROCK:SNOW;
case 6:if(ds<=1)return BASALT;return n>.6?ASH:BASALT;}
return GRASS}
for(let y=0;y<GW;y++)for(let x=0;x<GW;x++){const i=ix(x,y);
if(!land[i]){const d=dland[i];ter[i]=d<0?DEEP:d<=2?SHALLOW:d<=5?WATER:DEEP;continue}
let rg=reg[i];if(gap[i]<4.5&&vn(x*.3,y*.3)>.5)rg=reg2[i];ter[i]=baseTer(rg,x,y,dsea[i])}
// ---------- 3. BIG FEATURES ----------
// zones to route around
const zones=[];
// volcano: best spot with deep land inside the volcano quadrant
function bestSpot(rg,rad,avoid){let best=null,bs=-1;for(let t=0;t<3000;t++){const x=ri(30,GW-30),y=ri(30,GW-30),i=ix(x,y);if(!land[i]||dsea[i]<rad*.9)continue;let sc=(reg[i]===rg?200:0)+Math.min(dsea[i],60)+rnd()*30;
if(avoid)for(const a of avoid){if(Math.hypot(x-a[0],y-a[1])<a[2])sc=-1}if(sc>bs){bs=sc;best=[x,y]}}return best||[H|0,H|0]}
const VOL=bestSpot(6,30);const VX=VOL[0],VY=VOL[1];
const FP=bestSpot(4,44,[[VX,VY,110]]);const FCX=FP[0],FCY=FP[1];
const FX=FCX-25,FY=FCY-17,FW=50,FH=34;
// reassign regions around feature centres so they read correctly
disc(VX,VY,38,(x,y,i)=>{if(land[i])reg[i]=6});
// volcano crater
for(let y=VY-26;y<=VY+26;y++)for(let x=VX-26;x<=VX+26;x++){if(!inb(x,y)||!land[ix(x,y)])continue;const d=Math.hypot(x-VX,y-VY)+(vn(x*.2,y*.2)-.5)*3;
if(d>=16&&d<=21){ter[ix(x,y)]=CLIFF;reg[ix(x,y)]=6}else if(d<16){ter[ix(x,y)]=vn(x*.15,y*.15)>.62?ASH:BASALT;reg[ix(x,y)]=6}else if(d<26&&ter[ix(x,y)]!==CLIFF){ter[ix(x,y)]=vn(x*.15,y*.15)>.5?ASH:BASALT}}
rect(VX-6,VY+13,VX+6,VY+24,BASALT);rect(VX-24,VY-4,VX-13,VY+4,BASALT);
blob(VX,VY-9,6.5,LAVA,{nz:.35});
function lriver(pts,rd,rs,tc,te){const c=curve(pts);c.forEach((p,k)=>{const wob=(vn(k*.05,p[0]*.1)-.5)*3;disc(p[0]+wob,p[1],rs,(x,y,i)=>{const d=Math.hypot(x-p[0]-wob,y-p[1]);if(d<=rd){if(ter[i]!==PLANK)ter[i]=tc}else if(ter[i]!==tc&&D.SOFTLAND[ter[i]])ter[i]=te})})}
lriver([[VX-4,VY-5],[VX-8,VY+1],[VX-8,VY+6],[VX-8,VY+10]],1.3,2.3,LAVA,BASALT);lriver([[VX+4,VY-5],[VX+8,VY+1],[VX+8,VY+6],[VX+8,VY+10]],1.3,2.3,LAVA,BASALT);
blob(VX-8,VY+11,2.6,LAVA);blob(VX+8,VY+11,2.6,LAVA);
rect(VX-6,VY+5,VX+7,VY+9,ASH);rect(VX-18,VY+1,VX-14,VY+3,BASALT);
for(let y=VY+13;y<=VY+24;y++)for(let x=VX-6;x<=VX+6;x++)pm[ix(x,y)]=1;for(let y=VY-4;y<=VY+4;y++)for(let x=VX-24;x<=VX-13;x++)pm[ix(x,y)]=1;
zones.push({x:VX,y:VY,rx:30,ry:30});
// facility massif
for(let y=FCY-32;y<=FCY+34;y++)for(let x=FCX-42;x<=FCX+42;x++){const v=Math.pow(Math.abs((x-FCX)/38),4)+Math.pow(Math.abs((y-FCY)/29),4);if(v<1+(fbm(x*.12,y*.12,2)-.5)*.5&&inb(x,y)&&land[ix(x,y)]){reg[ix(x,y)]=5;ter[ix(x,y)]=CLIFF}}
rect(FX-23,FY+FH,FX+FW+22,FY+FH+7,ROCK,5);rect(FX-11,FY+12,FX-1,FY+24,ROCK,5);rect(FX+FW,FY+12,FX+FW+11,FY+24,ROCK,5);rect(FX-20,FY+17,FX-11,FY+19,ROCK,5);rect(FX+FW+10,FY+17,FX+FW+17,FY+19,ROCK,5);
for(let y=FY+FH;y<=FY+FH+9;y++)for(let x=FX-25;x<=FX+FW+25;x++)if(inb(x,y)&&reg[ix(x,y)]===5&&ter[ix(x,y)]===CLIFF)ter[ix(x,y)]=ROCK;
rect(FX+14,FY+FH,FX+36,FY+FH+6,CONC,5);rect(FX+19,FY+FH,FX+30,FY+FH+7,CONC,5);
for(let y=FY+FH;y<=FY+FH+7;y++)for(let x=FX+14;x<=FX+36;x++)pm[ix(x,y)]=1;
zones.push({x:FCX,y:FCY,rx:56,ry:44});
// snow ridges & cliffs
for(let k=0;k<ri(5,8);k++){let sx=ri(30,GW-30),sy=ri(30,GW-30),i0=ix(sx,sy);if(reg[i0]!==4)continue;const a=rr(0,6.28),len=ri(40,80),gp=ri(10,len-14);
for(let t=0;t<len;t++){if(t>=gp&&t<gp+11)continue;const x=Math.round(sx+Math.cos(a)*t+Math.sin(t*.13)*4),y=Math.round(sy+Math.sin(a)*t+Math.cos(t*.11)*4);disc(x,y,2.2,(xx,yy,i)=>{if(reg[i]===4&&(ter[i]===SNOW||ter[i]===ROCK))ter[i]=CLIFF})}}
for(let k=0;k<ri(20,34)*SC*SC;k++){const x=ri(20,GW-20),y=ri(20,GW-20);if(reg[ix(x,y)]===4)blob(x,y,rr(3,6),CLIFF,{only:new Set([SNOW,ROCK])})}
// lakes
const lakes=[];
for(let k=0,n=0;k<400&&n<ri(10,16);k++){const x=ri(30,GW-30),y=ri(30,GW-30),i=ix(x,y),rg=reg[i];if(!land[i]||dsea[i]<14||rg===5||rg===6||rg===1)continue;
if(zones.some(z=>Math.hypot(x-z.x,y-z.y)<z.rx+8))continue;n++;
if(rg===4){const r=rr(6,11);blob(x,y,r,ICE,{nz:.35,only:new Set([SNOW,ROCK])});lakes.push([x,y,r+2])}
else{const r=rr(3.5,7);blob(x,y,r*1.5,SHALLOW,{nz:.5,only:new Set([JGRASS,GRASS,MUD,SAND,DIRT])});blob(x,y,r,WATER,{nz:.4});lakes.push([x,y,r*1.5+1])}}
// rivers: from inland to the coast with meander
for(let k=0;k<ri(3,5);k++){let a=rr(0,6.28),rad=GW*rr(.16,.3);const pts=[];let x=H+Math.cos(a)*rad,y=H+Math.sin(a)*rad;if(zones.some(z=>Math.hypot(x-z.x,y-z.y)<z.rx+6))continue;
for(let s=0;s<300;s++){pts.push([x,y]);const wob=(vn(s*.07,k*9)-.5)*1.6;x+=Math.cos(a+wob)*2.4;y+=Math.sin(a+wob)*2.4;if(!inb(Math.round(x),Math.round(y))||!land[ix(Math.round(x),Math.round(y))])break;if(zones.some(z=>Math.hypot(x-z.x,y-z.y)<z.rx*.8)){a+=.5}}
const sub=pts.filter((p,i)=>i%5===0);if(sub.length<4)continue;const c=curve(sub);c.forEach((p,kk)=>{const wob=(vn(kk*.05,p[0]*.1)-.5)*2;disc(p[0]+wob,p[1],3.0,(xx,yy,i)=>{if(!land[i]&&dland[i]>2)return;if(reg[i]===5||reg[i]===6)return;const d=Math.hypot(xx-p[0]-wob,yy-p[1]);if(d<=1.7){if(ter[i]!==PLANK&&ter[i]!==CLIFF)ter[i]=WATER}else if(D.SOFTLAND[ter[i]])ter[i]=SHALLOW})})}
// ---------- toolkit: statics, buildings ----------
const COLS={palm:[-3,-4,6,4],jtree:[-4,-5,8,5],jbig:[-14,-8,28,9],pine:[-3,-4,6,4],dead:[-3,-4,6,4],rockL:[-9,-7,18,7],rockM:[-6,-5,12,5],spire:[-5,-5,10,5],log:[-14,-5,28,5],boat:[-13,-7,26,7],tent:[-12,-9,24,9],crate:[-6,-6,12,6],barrel:[-4,-5,8,5],cart:[-9,-6,18,6],pump:[-4,-5,8,5],lamp:[-2,-3,4,3],radio:[-9,-8,18,8],light:[-13,-9,26,9],pillar:[-4,-5,8,5],altar:[-9,-6,18,6],fire:[-5,-3,10,3],chest:[-6,-5,12,5],stump:[-5,-4,10,4],dish:[-8,-5,16,5],drill:[-12,-8,24,8],sign:[-3,-2,6,2],tank:[-16,-30,32,30],post:[-2,-2,4,2]};
function put(k,x,y,v,id,extra){const o=Object.assign({k,x,y,v:v||0,id:id||null},extra||{});statics.push(o);let c=COLS[k];
if(k==='car'){c=(v&1)?[-8,-13,16,26]:[-14,-8,28,16]}
if(k.slice(0,2)==='p_'&&!o.nocol)c=[-8,-14,16,14];
if(c&&!o.nocol)colliders.push({x:x+c[0],y:y+c[1],w:c[2],h:c[3]});
const px=(x/8)|0,py=(y/8)|0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(px+a>=0&&py+b>=0&&px+a<S8&&py+b<S8)tk[(py+b)*S8+px+a]=1;return o}
const cp=(k,cx,cy,v,id,e)=>put(k,cx*C,cy*C,v,id,e);
const light=(x,y,r,col,o)=>lights.push(Object.assign({x,y,r,col:col||'warm'},o||{}));
const note=(id,cx,cy,nid,label)=>inter.push({kind:'note',id,note:nid,x:cx*C,y:cy*C,r:22,label:label||'Read'});
let TIER=1;const TM=[0,1,1.7,2.6,4];
function stamp(b){const rows=b.rows,h=rows.length,w=rows[0].length,bid=buildings.length+1;
const bd={id:bid,name:b.name,x0:b.x0,y0:b.y0,w,h,roof:b.roof,facade:[],cells:[],lightBid:bid,tier:b.tier||TIER,site:b.site||null};buildings.push(bd);
let ni=0;
for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ch=rows[y][x];if(ch===' ')continue;const gx=b.x0+x,gy=b.y0+y;if(!inb(gx,gy))continue;const i=ix(gx,gy);
inn[i]=bid;pm[i]=2;occ[i]=1;reg[i]=b.region||reg[i];bd.cells.push([gx,gy]);
const isDoor='DdZLXo'.indexOf(ch)>=0;
if(ch==='#'||ch==='W'){ter[i]=b.wall;if(ch==='W')dec[i]=1;continue}
ter[i]=b.floor;
if(isDoor){if(ch==='o')continue;const wl=c=>c!==undefined&&(c==='#'||c==='W'||'DdZLXo'.indexOf(c)>=0);const hz=wl(rows[y][x-1])&&wl(rows[y][x+1]);
const kind=ch==='L'?'locked':ch==='X'?'exit':ch==='Z'?'sec':'wood';const dr={cx:gx,cy:gy,x:gx*C,y:gy*C,kind,open:false,locked:ch==='L'||ch==='X',orient:hz?'h':'v',bid,pair:null,id:'d'+doors.length};
const prev=doors[doors.length-1];if(prev&&prev.bid===bid&&prev.kind===kind&&prev.cy===gy&&prev.cx===gx-1){prev.pair=dr;dr.pair=prev}
doors.push(dr);colliders.push({x:dr.x,y:dr.y,w:C,h:C,door:dr});continue}
if(PROP[ch]||ch==='n'){const key=x+','+y;const px=gx*C+8,py=gy*C+16;
if(ch==='n'){const nid=(b.noteAt&&b.noteAt[key])||(b.notes&&b.notes[ni++]);if(nid)note(bid+':'+key,gx+.5,gy+.5,nid,'Read');continue}
const id=bid+':'+key;const o=put('p_'+PROP[ch],px,py,0,LOOT[ch]?id:null,{cell:true});
if(LOOT[ch]){const L=LOOT[ch];inter.push({kind:'loot',id,x:px,y:py-6,r:24,label:ch==='c'?'Open chest':ch==='S'?'Search shelf':ch==='k'?'Search locker':'Search crate',coins:Math.round((L[0]+U.hash(gx,gy,9)*(L[1]-L[0]))*TM[b.tier||TIER]),tier:b.tier||TIER,chest:ch==='c',ref:o})}
if(ch==='P'||ch==='R'){const nid=(b.noteAt&&b.noteAt[key])||(b.notes&&b.notes[ni++]);inter.push({kind:ch==='R'?'release':'terminal',id,note:nid,x:px,y:py-6,r:24,label:ch==='R'?'Use control console':'Use terminal'})}}
}
for(let x=0;x<w;x++)if(rows[h-1][x]!==' ')bd.facade.push(b.x0+x);
bd.roofKind=b.roof;
(b.lights||[]).forEach(l=>light((b.x0+l[0])*C+8,(b.y0+l[1])*C+8,l[2]||70,l[3]||'warm',{bid,k:l[4]||1}));
return bd}
// procedural building interior
function mkBuilding(w,h,kind){const g=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>(x===0||y===0||x===w-1||y===h-1)?'#':'.'));
const dx=Math.floor(w/2);g[h-1][dx]='D';if(w>=11)g[h-1][dx-1]='D';
for(let x=2;x<w-2;x+=3)if(g[0][x]==='#')g[0][x]='W';for(let x=2;x<w-2;x+=4)if(g[h-1][x]==='#'&&Math.abs(x-dx)>2)g[h-1][x]='W';for(let y=2;y<h-2;y+=3){g[y][0]='W';g[y][w-1]='W'}
let part=-1;if(w>=10&&kind!=='ware'&&kind!=='lab'&&rnd()<.7){part=Math.floor(w*(.4+rnd()*.2));for(let y=1;y<h-1;y++)g[y][part]='#';g[Math.floor(h/2)][part]='d';g[h-3][part]='d'}
const sets={house:'BBTSKFNvSK',shop:'SSSKCKFSn',gas:'SKKCFSn',cabin:'BSKFTBn',hut:'BKSTK',lab:'PbbgKSkrP',ware:'KKKxxSKkc',mine:'KxxkgSc',bunker:'KkkcSxKb',cave:'cKxn'};
const set=sets[kind]||sets.house;const pf=kind==='ware'?.55:.4;let nn=0;
for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(g[y][x]!=='.')continue;const ring=(x===1||y===1||x===w-2||y===h-2||x===part-1||x===part+1);if(!ring)continue;if(y>=h-2&&Math.abs(x-dx)<=2)continue;if(part>0&&Math.abs(x-part)<=1&&(y===Math.floor(h/2)||y===h-3||Math.abs(y-Math.floor(h/2))<=1||y>=h-4))continue;
if(rnd()<pf){let c=set[(rnd()*set.length)|0];if(c==='n'){if(nn>=1)continue;nn++}g[y][x]=c}}
if(!nn){const cx=1,cy=1;if(g[cy][cx]==='.')g[cy][cx]='n'}
return g.map(r=>r.join(''))}
const ROOF={1:{t:'thatch'},2:{t:'shingle'},3:{t:'flat'},4:{t:'snow'},6:{t:'rock'}};
const WALLS={house:[W_BRICK,F_WOOD],shop:[W_BRICK,F_WOOD],gas:[W_CONC,F_TILE],cabin:[W_WOOD,F_WOOD],hut:[W_WOOD,F_WOOD],lab:[W_METAL,F_METAL],ware:[W_CONC,F_TILE],mine:[W_STONE,F_STONE],bunker:[W_CONC,F_TILE],cave:[W_STONE,F_STONE]};
function mkRoof(kind,rg){if(kind==='lab')return{t:'metal'};if(kind==='ware'||kind==='gas')return{t:'flat',c:'#6b6d72'};if(kind==='mine'||kind==='bunker'||kind==='cave')return{t:'rock'};if(rg===4)return{t:'snow'};if(rg===1)return{t:'thatch'};return{t:'shingle',c:pick(PAL)}}
function building(name,x0,y0,kind,w,h,rg,tier,siteId,rows){rows=rows||mkBuilding(w,h,kind);const wl=WALLS[kind]||WALLS.house;
if(rg===4&&kind==='house'){}
const b=stamp({name,x0,y0,rows,wall:wl[0],floor:wl[1],roof:mkRoof(kind,rg),region:rg,tier,site:siteId,noteAt:null,notes:[pick(NOTE_BY[kind]||NOTE_BY.house)],lights:[[Math.floor(rows[0].length/2),Math.floor(rows.length/2),Math.max(60,rows[0].length*5),kind==='lab'?'cool':'warm']]});
if(rg===3||kind==='lab'){}return b}
// ---------- site placement ----------
const FLAT=new Set([SAND,WETSAND,GRASS,JGRASS,DIRT,SNOW,ROCK,BASALT,ASH,MUD]);
function spotOk(x,y,w,h,rg,m,dmin){for(let yy=y-m;yy<y+h+m;yy++)for(let xx=x-m;xx<x+w+m;xx++){if(!inb(xx,yy))return false;const i=ix(xx,yy);if(!land[i]||occ[i]||pm[i]||!FLAT.has(ter[i])||dsea[i]<dmin)return false;if(reg[i]===5)return false;if(rg&&reg[i]!==rg&&yy>=y&&yy<y+h&&xx>=x&&xx<x+w)return false}return true}
function findSpot(rg,w,h,o){o=o||{};const m=o.margin===undefined?3:o.margin,dmin=o.dmin===undefined?(rg===1?2:6):o.dmin;
for(let t=0;t<(o.tries||1500);t++){let x,y;if(o.near){x=Math.round(o.near[0]+rr(-o.rad,o.rad))-(w>>1);y=Math.round(o.near[1]+rr(-o.rad,o.rad))-(h>>1)}else{x=ri(14,GW-14-w);y=ri(14,GW-14-h)}
if(!inb(x,y)||!inb(x+w,y+h))continue;if(zones.some(z=>Math.hypot(x+w/2-z.x,y+h/2-z.y)<(z.rx===30?27:z.rx-6)))continue;
if(lakes.some(l=>Math.hypot(x+w/2-l[0],y+h/2-l[1])<l[2]+Math.max(w,h)/2))continue;
if(spotOk(x,y,w,h,rg,m,dmin)){for(let yy=y-m;yy<y+h+m;yy++)for(let xx=x-m;xx<x+w+m;xx++)occ[ix(xx,yy)]=1;return[x,y]}}return null}
const nodes=[];const addNode=(x,y,tag,rg)=>{nodes.push({x,y,tag,rg});return nodes.length-1};
let siteSeq=0;
function addSite(type,name,cx,cy,rad,rg,tier,o){o=o||{};const s={id:'s'+(siteSeq++),type,name,x:cx*C,y:cy*C,r:rad*C,region:rg,tier,secret:!!o.secret,en:[],cleared:false,loot:0,xp:o.xp||(10+tier*15)};sites.push(s);
pois.push({id:s.id,name,x:s.x,y:s.y,r:s.r,type:o.poiType||type,xp:s.xp,secret:!!o.secret,tier,site:s.id});return s}
const EN_BY={1:['jackal'],2:['jackal','raider'],3:['infected','raider'],4:['wolf','raider'],6:['imp','raider'],5:['sentry']};
function wantEnemies(s,type,n,rad,inside){if(n>0)spawnReq.push({site:s.id,type,n,x:s.x/C,y:s.y/C,rad,inside:!!inside});}
// spawn / landing camp
const sp=coastPt(aS,10);const CAMP=[Math.round(sp[0]),Math.round(sp[1])];
function dock(a,len){const p=coastPt(a,0),dx=Math.cos(a),dy=Math.sin(a);const cells=[];for(let t=-4;t<=len;t++){for(let w=-1;w<=1;w++){const x=Math.round(p[0]+dx*t-dy*w),y=Math.round(p[1]+dy*t+dx*w);if(inb(x,y)&&reg[ix(x,y)]!==5){ter[ix(x,y)]=PLANK;pm[ix(x,y)]=1;occ[ix(x,y)]=1;cells.push([x,y])}}}
return{land:[Math.round(p[0]-dx*5),Math.round(p[1]-dy*5)],end:[p[0]+dx*len,p[1]+dy*len],dir:[dx,dy]}}
const D0=dock(aS,9);
const cx0=D0.land[0],cy0=D0.land[1];
// camp is inland of the dock
const CAMPX=Math.round(cx0-D0.dir[0]*7),CAMPY=Math.round(cy0-D0.dir[1]*7);
disc(CAMPX,CAMPY,9,(x,y,i)=>{occ[i]=1;if(land[i]&&FLAT.has(ter[i])&&ter[i]!==WETSAND)ter[i]=SAND;pm[i]=1});
cp('fire',CAMPX,CAMPY,0,'campfire');light(CAMPX*C,CAMPY*C-4,110,'warm',{k:1,flick:1});
cp('tent',CAMPX-5,CAMPY-2,0);cp('tent',CAMPX+5,CAMPY-3,1);cp('crate',CAMPX+4,CAMPY+3,0,'camp_crate1');cp('barrel',CAMPX-4,CAMPY+3,0);cp('log',CAMPX-2,CAMPY+2,0);
inter.push({kind:'loot',id:'camp_crate1',x:(CAMPX+4)*C,y:(CAMPY+3)*C-6,r:26,label:'Search crate',coins:14,tier:0,ref:statics.find(s=>s.id==='camp_crate1')});
cp('sign',CAMPX+1,CAMPY-5,0,'camp_sign');inter.push({kind:'note',id:'camp_sign',note:'camp_log',x:(CAMPX+1)*C,y:(CAMPY-5)*C,r:28,label:'Read'});
cp('boat',D0.end[0]+D0.dir[1]*3,D0.end[1]-D0.dir[0]*3,0);
npcs.push({id:'marlow',name:'Marlow',x:(CAMPX+2)*C,y:(CAMPY-2)*C,face:2,pal:'marlow',lines:[
"Easy, easy. Another one the tide brought in. Name's Marlow. Sit by the fire.",
"This island is a patchwork of dead places. Camps, cabins, whole towns. Everything of value got left behind when the people did.",
"Raid them. Crack the crates, search the shelves, and bring what you find back to a boat. Loot only counts once you're off the island. Fall out there and it's gone.",
"Boats wait at the docks. Stand on the glowing ring a few seconds and I'll haul you out. Keep your head down. Not everything out there is dead, and not everything dead stays that way."]});
inter.push({kind:'npc',id:'marlow',x:(CAMPX+2)*C,y:(CAMPY-2)*C,r:34,label:'Talk to Marlow'});
const spawnPt={x:CAMPX*C+4,y:(CAMPY+5)*C};
const S0=addSite('camp','Landing Camp',CAMPX,CAMPY,16,1,0,{poiType:'camp',xp:0});S0.safe=true;
extracts.push({id:'x0',name:'Landing Dock',x:Math.round(D0.end[0]-D0.dir[0]*3)*C,y:Math.round(D0.end[1]-D0.dir[1]*3)*C,r:44});
addNode(CAMPX,CAMPY+6,'camp',1);
// extra extraction docks
for(let k=0;k<2;k++){let best=null;for(let t=0;t<12;t++){const a=aS+(k?1:-1)*rr(1.6,2.5);const p=coastPt(a,0),x=Math.round(p[0]),y=Math.round(p[1]);if(reg[ix(x,y)]===1||reg[ix(x,y)]===5||reg[ix(x,y)]===6)continue;best=a;break}
if(best===null)best=aS+(k?1:-1)*2.2;const d=dock(best,9);const ex=Math.round(d.end[0]-d.dir[0]*3),ey=Math.round(d.end[1]-d.dir[1]*3);
extracts.push({id:'x'+(k+1),name:k?'East Pier':'West Pier',x:ex*C,y:ey*C,r:44});
const lx=Math.round(d.land[0]-d.dir[0]*3),ly=Math.round(d.land[1]-d.dir[1]*3);
for(let q=-1;q<=1;q++){const x=lx+Math.round(-d.dir[1]*q*2),y=ly+Math.round(d.dir[0]*q*2);if(inb(x,y)&&land[ix(x,y)]&&inn[ix(x,y)]===0)cp(q===0?'crate':'barrel',x,y,0)}
cp('boat',Math.round(d.end[0]+d.dir[1]*3)+0.5,Math.round(d.end[1])+0.5,k+1);
const sidx=addSite('dock',extracts[k+1].name,lx,ly,12,reg[ix(lx,ly)]||2,0,{poiType:'dock',xp:15});sidx.safe=true;
addNode(lx,ly,'dock',reg[ix(lx,ly)]||2)}
// hub
{let hx=Math.round(CAMPX+(H-CAMPX)*.5),hy=Math.round(CAMPY+(H-CAMPY)*.5);for(let t=0;t<40&&zones.some(z=>Math.hypot(hx-z.x,hy-z.y)<z.rx);t++){hx+=Math.round((hx-H)*.15+rr(-3,3));hy+=Math.round((hy-H)*.15+rr(-3,3))}
disc(hx,hy,7,(x,y,i)=>{if(land[i]&&FLAT.has(ter[i]))ter[i]=DIRT;pm[i]=1;occ[i]=1});cp('sign',hx+1,hy+1,0,'hub_sign');inter.push({kind:'note',id:'hub_sign',note:'ruin_signpost',x:(hx+1)*C,y:(hy+1)*C,r:28,label:'Read signpost'});
addNode(hx,hy,'hub',reg[ix(hx,hy)]);addSite('cross','The Crossroads',hx,hy,10,reg[ix(hx,hy)]||2,0,{poiType:'cross',xp:15}).safe=true}
// facility
{const fb=stamp({name:'Station Omega',x0:FX,y0:FY,rows:FAC,wall:W_METAL,floor:F_METAL,roof:{t:'rock'},region:5,tier:4,noteAt:{'18,29':'fac_term1','3,14':'fac_term2','3,6':'fac_term3','40,9':'fac_term4','37,25':'fac_term5','28,3':'fac_ctrl','32,3':'fac_term3','30,26':'fac_term1','22,31':'fac_term1'}});
[[2,9,13,15],[2,21,13,26],[2,2,13,7],[17,2,32,6]].forEach(r=>{for(let y=r[1];y<=r[3];y++)for(let x=r[0];x<=r[2];x++){const i=ix(FX+x,FY+y);if(ter[i]===F_METAL)ter[i]=F_TILE}});
for(let y=0;y<FH;y++)for(let x=0;x<FW;x++)if(FAC[y][x]!=='#'&&FAC[y][x]!=='W'&&(x%8===4)&&(y%6===2||y%6===5)){const i=ix(FX+x,FY+y);if(D.FLOORT[ter[i]])light((FX+x)*C+8,(FY+y)*C+8,66,'cool',{bid:fb.id,k:1})}
for(let x=22;x<=27;x++)light((FX+x)*C,(FY+17)*C,90,'teal',{bid:fb.id,k:.8});
put('tank',(FX+25)*C,(FY+19)*C,0,'tank',{});inter.push({kind:'note',id:'core',note:'fac_core',x:(FX+25)*C,y:(FY+20)*C,r:34,label:'Inspect chamber'});emitters.push({k:'steam',x:(FX+25)*C,y:(FY+17)*C});
for(const row of ['vault']){}
const s=addSite('facility','Station Omega',FCX,FY+FH-4,34,5,4,{xp:120});s.safe=false;
wantEnemies(s,'sentry',ri(9,12),0,true);
addNode(FX+25,FY+FH+8,'fac',5);
addSite('lab','Central Chamber',FX+25,FY+19,12,5,4,{poiType:'lab',xp:60}).sub=true;
addSite('lab','Control Room',FX+25,FY+3,10,5,4,{poiType:'lab',xp:50}).sub=true;
addSite('lab','Secret Grotto',FX-6,FY+18,8,5,4,{poiType:'secret',xp:80,secret:true}).sub=true;
// secret grotto paths out the sides
nodes.push({x:FX-20,y:FY+18,tag:'grotto',rg:5,secretPath:true});nodes.push({x:FX+FW+16,y:FY+18,tag:'grotto2',rg:5,secretPath:true})}
// volcano props / mining camp
{cp('cart',VX+2,VY+8,0);cp('drill',VX-3,VY+13,0);cp('barrel',VX+5,VY+12,0);cp('barrel',VX+6,VY+13,1);cp('crate',VX-8,VY+17,0,'mine_crate');cp('tent',VX+4,VY+16,0);
inter.push({kind:'loot',id:'mine_crate',x:(VX-8)*C,y:(VY+17)*C-6,r:26,label:'Search crate',coins:60,tier:3,ref:statics.find(s=>s.id==='mine_crate')});
cp('sign',VX-1,VY+19,0,'mine_sign');inter.push({kind:'note',id:'mine_sign',note:'mine_note',x:(VX-1)*C,y:(VY+19)*C,r:28,label:'Read whiteboard'});
const s=addSite('mine','Mining Camp',VX,VY+13,16,6,3,{xp:50});wantEnemies(s,'imp',ri(4,6),9);wantEnemies(s,'raider',3,9);
disc(VX,VY-9,8,(x,y,i)=>{if(ter[i]===LAVA&&(x+y)%5===0)light(x*C+8,y*C+8,55,'lava',{k:.75,flick:1})});
const s2=addSite('crater','Volcanic Crater',VX,VY-6,16,6,3,{poiType:'lab',xp:40});wantEnemies(s2,'imp',ri(5,8),12);
addNode(VX,VY+26,'vol',6);addNode(VX-26,VY,'vol2',6);
// lava bridges
const bridgeRail=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=ix(x,y);const was=ter[i];ter[i]=PLANK;pm[i]=1;if(was===LAVA){if(y===y0)rails.push({x:x*C,y:y*C,w:C,h:3});if(y===y1)rails.push({x:x*C,y:(y+1)*C-3,w:C,h:3})}}};
bridgeRail(VX-14,VY+1,VX-2,VY+3);bridgeRail(VX+2,VY+1,VX+14,VY+3)}
return finish();
// ---- continued in finish (hoisted below)
function finish(){
return CI._procFinish({seed,GW,N,C,WORLD,H,SC,rnd,vn,fbm,rr,ri,pick,ter,reg,inn,dec,pm,land,occ,brg,dsea,dland,inb,ix,statics,buildings,doors,inter,pois,lights,emitters,colliders,npcs,rails,sites,spawnReq,extracts,tk,S8,zones,lakes,nodes,aS,CAMPX,CAMPY,spawnPt,VX,VY,FCX,FCY,FX,FY,FW,FH,
rect,disc,blob,curve,put,cp,light,note,stamp,mkBuilding,building,findSpot,addNode,addSite,wantEnemies,EN_BY,SITE_NAMES,hospital,PAL,FLAT,TM,setTier:t=>{TIER=t}})}
};
})();

(function(){
const CI=globalThis.CI,U=CI.U,D=CI.D,T=D.T;
const {DEEP,WATER,SHALLOW,SAND,WETSAND,GRASS,JGRASS,DIRT,SNOW,ICE,ROCK,BASALT,ASH,LAVA,CLIFF,ROAD,CONC,PLANK,F_WOOD,F_TILE,F_METAL,F_STONE,W_WOOD,W_BRICK,W_CONC,W_METAL,W_STONE,MUD}=T;
CI._procFinish=function(K){
const {seed,GW,N,C,WORLD,H,SC,rnd,vn,fbm,rr,ri,pick,ter,reg,inn,dec,pm,land,occ,brg,dsea,inb,ix,statics,buildings,doors,inter,pois,lights,emitters,colliders,npcs,rails,sites,spawnReq,extracts,tk,S8,zones,lakes,nodes,CAMPX,CAMPY,spawnPt,VX,VY,rect,disc,blob,curve,put,cp,light,stamp,mkBuilding,building,findSpot,addNode,addSite,wantEnemies,EN_BY,SITE_NAMES,hospital,PAL,FLAT,TM,setTier}=K;
const S_=sites;
const lootAt=(id,cx,cy,tier,o)=>{o=o||{};const ob=o.ref;inter.push({kind:'loot',id,x:cx*C,y:cy*C-6,r:26,label:o.label||'Search crate',coins:Math.round(rr(8,26)*TM[tier]),tier,chest:!!o.chest,secret:!!o.secret,ref:ob})};
const crate=(site,i,cx,cy,tier,k)=>{const id=site.id+':c'+i;const o=cp(k||'crate',cx,cy,0,id);lootAt(id,cx,cy,tier,{ref:o,chest:k==='chest',label:k==='chest'?'Open chest':'Search crate'});return o};
const rgOf=(x,y)=>reg[ix(Math.max(0,Math.min(GW-1,Math.round(x))),Math.max(0,Math.min(GW-1,Math.round(y))))];
const NOTES_OUT=['house_note','shop_note','cabin_note','gas_note','hut_note','outpost_log'];
const scaleN=(n)=>Math.max(1,Math.round(n*SC*SC));
const types={1:['jackal'],2:['jackal','raider'],3:['infected','raider'],4:['wolf','raider'],6:['imp','raider']};
function enemiesFor(s,rg,tier,rad,extra){const pr=types[rg]||['raider'];const main=pr[0],sec=pr[1];const n=ri(2,3)+tier;wantEnemies(s,main,n,rad);if(sec&&rnd()<.8)wantEnemies(s,sec,ri(1,2)+(tier>2?1:0),rad)}
// ---------- camps ----------
function camp(rg,tier){const sp=findSpot(rg,18,16,{margin:2});if(!sp)return;const cx=sp[0]+9,cy=sp[1]+8;const s=addSite('camp',pick(SITE_NAMES.camp),cx,cy,12,rg,tier,{poiType:'camp'});
cp('fire',cx,cy,0,s.id+'f');light(cx*C,cy*C-4,100,'warm',{k:.8,flick:1,night:0});
const nt=ri(2,3);for(let i=0;i<nt;i++){const a=i/nt*6.28+rr(0,1);cp('tent',cx+Math.cos(a)*5.5,cy+Math.sin(a)*4.4,i&1)}
const nc=ri(3,5);for(let i=0;i<nc;i++){const a=rr(0,6.28),r=rr(3,7);crate(s,i,cx+Math.cos(a)*r,cy+Math.sin(a)*r*.8,tier,(i===0&&rnd()<.3)?'chest':'crate')}
for(let i=0;i<ri(2,4);i++){const a=rr(0,6.28);cp('barrel',cx+Math.cos(a)*7,cy+Math.sin(a)*6,0)}cp('log',cx-3,cy+2.5,0);
if(rnd()<.6)cp('sign',cx,cy+8.5,0,s.id+'sg')&&inter.push({kind:'note',id:s.id+'sg',note:pick(NOTES_OUT),x:cx*C,y:(cy+8.5)*C,r:26,label:'Read'});
addNode(cx,cy+10,'site',rg);enemiesFor(s,rg,tier,7);return s}
// ---------- cabins ----------
function cabin(rg,tier){const kind=rg===1?'hut':'cabin';const w=kind==='hut'?ri(6,8):ri(8,10),h=kind==='hut'?5:ri(6,7);const sp=findSpot(rg,w+2,h+4,{margin:2});if(!sp)return;
const s=addSite(kind,pick(kind==='hut'?SITE_NAMES.hut:SITE_NAMES.cabin),sp[0]+w/2,sp[1]+h/2,10,rg,tier,{poiType:'hut'});
const b=building(s.name,sp[0]+1,sp[1],kind,w,h,rg,tier,s.id);const cx=sp[0]+1+Math.floor(w/2);
if(rnd()<.7)crate(s,0,cx+3,sp[1]+h+1.5,tier);if(rnd()<.6)cp('barrel',cx-3,sp[1]+h+1.5,0);if(rnd()<.4){cp('fire',cx+5,sp[1]+h+2,1);}
addNode(cx,sp[1]+h+2,'site',rg);wantEnemies(s,types[rg]?types[rg][0]:'raider',ri(1,2),6);if(rnd()<.5)wantEnemies(s,types[rg]?types[rg][rg===1?0:1]||types[rg][0]:'raider',1,0,true);return s}
// ---------- outposts ----------
function outpost(rg,tier){const w=14,h=ri(8,10);const sp=findSpot(rg,w+4,h+6,{margin:2});if(!sp)return;const s=addSite('outpost',pick(SITE_NAMES.outpost),sp[0]+w/2+2,sp[1]+h/2,14,rg,tier,{poiType:'lab'});
const b=building(s.name,sp[0]+2,sp[1],'lab',w,h,rg,tier,s.id);const cx=sp[0]+2+Math.floor(w/2);
cp('dish',sp[0]+w+3,sp[1]+h-1,0);cp('barrel',cx-4,sp[1]+h+2,0);crate(s,0,cx+4,sp[1]+h+2,tier);if(rnd()<.5)crate(s,1,cx+6,sp[1]+h+2.5,tier);
addNode(cx,sp[1]+h+3,'site',rg);wantEnemies(s,'raider',ri(3,4),9);wantEnemies(s,'raider',ri(2,3),0,true);if(rg===4)wantEnemies(s,'wolf',2,10);return s}
// ---------- ruins ----------
function ruins(tier){const sp=findSpot(2,17,16,{margin:2,dmin:10});if(!sp)return;const x0=sp[0]+2,y0=sp[1]+1;const s=addSite('ruins',pick(SITE_NAMES.ruins),x0+6,y0+5.5,14,2,tier,{poiType:'ruin'});
rect(x0,y0,x0+12,y0+10,F_STONE,2);[[x0,y0,x0+12,y0],[x0,y0+10,x0+12,y0+10],[x0,y0,x0,y0+10],[x0+12,y0,x0+12,y0+10]].forEach(r=>rect(r[0],r[1],r[2],r[3],W_STONE));
[[4,0],[5,0],[8,0],[9,0],[7,10],[6,10],[0,5],[12,5],[12,6],[0,4]].forEach(p=>{if(ter[ix(x0+p[0],y0+p[1])]===W_STONE)ter[ix(x0+p[0],y0+p[1])]=F_STONE});
for(let y=y0-1;y<=y0+11;y++)for(let x=x0-1;x<=x0+13;x++){pm[ix(x,y)]=2;occ[ix(x,y)]=1}
cp('pillar',x0+2,y0+2,0);cp('pillar',x0+10,y0+2,1);cp('pillar',x0+2,y0+8,0);cp('pillar',x0+10,y0+8,2);cp('altar',x0+6,y0+5,0,s.id+'al');
crate(s,0,x0+6,y0+8.2,tier,'chest');if(rnd()<.6)crate(s,1,x0+3,y0+5,tier);
cp('sign',x0+6.5,y0+12.2,0,s.id+'sg');inter.push({kind:'note',id:s.id+'sg',note:'ruin_tablet',x:(x0+6.5)*C,y:(y0+12.2)*C,r:28,label:'Read tablet'});
addNode(x0+6,y0+13,'site',2);wantEnemies(s,'raider',ri(3,4),9);wantEnemies(s,'jackal',ri(2,3),11);return s}
// ---------- secret bunker ----------
function bunker(tier){const rg=pick([2,4,3,6]);const w=ri(8,9),h=7;const sp=findSpot(rg,w+2,h+3,{margin:3,dmin:10});if(!sp)return;const s=addSite('bunker',pick(SITE_NAMES.bunker),sp[0]+w/2+1,sp[1]+h/2,9,rg,tier,{poiType:'secret',secret:true,xp:90});
building(s.name,sp[0]+1,sp[1],'bunker',w,h,rg,tier,s.id);wantEnemies(s,rg===4?'wolf':'raider',2,0,true);wantEnemies(s,'raider',ri(1,2),6);
const cx=sp[0]+1+Math.floor(w/2);crate(s,0,cx+3,sp[1]+h+1.5,tier,'chest');return s}
// ---------- hidden clearing ----------
function clearing(){const sp=findSpot(2,12,12,{margin:2,dmin:14});if(!sp)return;const cx=sp[0]+6,cy=sp[1]+6;const s=addSite('clearing','Hidden Clearing',cx,cy,9,2,3,{poiType:'secret',secret:true,xp:80});
blob(cx,cy,5,GRASS,{nz:.3});cp('stump',cx-1,cy+.5,0);crate(s,0,cx+2,cy-1,3,'chest');
inter.push({kind:'note',id:s.id+'n',note:'clearing_note',x:cx*C,y:(cy+3)*C,r:26,label:'Read notebook'});wantEnemies(s,'jackal',2,6);return s}
// ---------- towns ----------
let hospPlaced=false;
function town(){let W0=ri(58,70),H0=50;let sp=findSpot(3,W0,H0,{margin:2,dmin:8,tries:2500});if(!sp){W0=46;H0=50;sp=findSpot(3,W0,H0,{margin:2,dmin:8,tries:2500});}if(!sp)return null;
const x0=sp[0],y0=sp[1];const yA=y0+17,yB=yA+22,xc=x0+Math.floor(W0/2);const tier=ri(2,3);
const s=addSite('town',pick(SITE_NAMES.town),x0+W0/2,y0+H0/2,Math.max(W0,H0)*.55,3,tier,{poiType:'town',xp:60});
const street=(yt)=>{rect(x0+1,yt,x0+W0-2,yt+5,ROAD,3);rect(x0+1,yt-1,x0+W0-2,yt-1,CONC);rect(x0+1,yt+6,x0+W0-2,yt+6,CONC);for(let x=x0+2;x<x0+W0-2;x++){if(x%4<2)dec[ix(x,yt+2)]=2;for(let y=yt-1;y<=yt+6;y++)pm[ix(x,y)]=1}};
street(yA);street(yB);rect(xc,yA-9,xc+4,yB+7,ROAD,3);rect(xc-1,yA-9,xc-1,yB+7,CONC);rect(xc+5,yA-9,xc+5,yB+7,CONC);for(let y=yA-9;y<=yB+7;y++){if(y%4<2)dec[ix(xc+2,y)]=3;for(let x=xc-1;x<=xc+5;x++)pm[ix(x,y)]=1}
// re-pave crossing
rect(xc,yA,xc+4,yA+5,ROAD,3);rect(xc,yB,xc+4,yB+5,ROAD,3);for(let y=yA;y<=yA+5;y++){dec[ix(xc+2,y)]=0}for(let y=yB;y<=yB+5;y++)dec[ix(xc+2,y)]=0;
for(let y=yA;y<=yA+5;y++){dec[ix(xc-3,y)]=4;dec[ix(xc-2,y)]=4}
const bl=[];
const row=(yt,first)=>{let x=x0+2;while(x<x0+W0-10){if(x>=xc-2&&x<=xc+6){x=xc+8;continue}
let w=ri(8,12),h=ri(6,9),kind='house',name='House';const r=rnd();
if(first&&!hospPlaced&&x>x0+3&&rnd()<.35&&x+23<xc-2){const yb=yt-1-15;const b=stamp({name:'Abandoned Hospital',x0:x,y0:yb,rows:hospital,wall:W_CONC,floor:F_TILE,roof:{t:'flat',h:true},region:3,tier:Math.min(4,tier+1),site:s.id,noteAt:{'13,9':'hospital_sign','9,13':'hospital_sign','20,10':'hospital_log'},lights:[[3,2,70,'cool'],[10,2,70,'cool'],[17,2,70,'cool'],[5,11,70,'cool'],[16,11,70,'cool']]});bl.push(b);hospPlaced=true;
const hs=addSite('hospital','Abandoned Hospital',x+11,yb+7,14,3,tier+1,{poiType:'hospital',xp:50});hs.sub=true;wantEnemies(hs,'infected',ri(4,6),0,true);x+=24;continue}
if(r<.15){kind='shop';name='Corner Store';w=ri(11,13);h=9}else if(r<.22){kind='gas';name='Gas Station';w=ri(10,12);h=8}else if(r<.36&&w>=10){kind='ware';name='Warehouse';w=ri(12,14);h=8}
if(x+w>x0+W0-3)break;const yb=yt-1-h;const b=building(name,x,yb,kind,w,h,3,tier,s.id);bl.push(b);
if(kind==='gas'){cp('pump',x+2,yt+.1,0);cp('pump',x+w-2,yt+.1,1)}if(rnd()<.45)cp('barrel',x+w+.6,yt-1.4,0);if(rnd()<.35)cp('crate',x-.8,yt-1.4,0);
x+=w+ri(2,4)}};
row(yA,true);row(yB,false);
for(let i=0;i<ri(7,11);i++){const yt=rnd()<.5?yA:yB,x=ri(x0+3,x0+W0-5);if(x>xc-4&&x<xc+8)continue;cp('car',x,yt+(rnd()<.5?1.5:4.3),ri(0,3)*2,'car'+s.id+i)}
for(let x=x0+4;x<x0+W0-4;x+=11){for(const yt of[yA,yB]){cp('lamp',x,yt+6.6,0);light(x*C,(yt+6.6)*C-24,70,'sodium',{k:.9,night:1})}}
for(let i=0;i<5;i++){const x=ri(x0+3,x0+W0-4),y=pick([yA+7.5,yB+7.5,yB+10]);cp(pick(['barrel','crate','rockM']),x,y,0)}
if(rnd()<.8)cp('radio',x0+W0-3,y0+3,0,s.id+'rad'),light((x0+W0-3)*C,(y0+3)*C-100,80,'red',{k:.9,blink:1});
addNode(x0+1,yA+3,'town',3);addNode(x0+W0-2,yA+3,'town',3);addNode(xc+2,yA-8,'town',3);addNode(xc+2,yB+8,'town',3);addNode(x0+1,yB+3,'town',3);addNode(x0+W0-2,yB+3,'town',3);
const grp=nodes.length-6;for(let k=grp;k<nodes.length;k++)nodes[k].grp='t'+s.id;
s.buildingIds=bl.map(b=>b.id);wantEnemies(s,'infected',ri(10,15),W0*.45);wantEnemies(s,'infected',ri(4,6),0,true);wantEnemies(s,'raider',ri(2,4),W0*.4);
bl.filter(b=>b.name==='Gas Station'||b.name==='Corner Store').slice(0,2).forEach(b=>{const q=addSite('shop',b.name,b.x0+b.w/2,b.y0+b.h/2,8,3,tier,{poiType:b.name==='Gas Station'?'gas':'shop',xp:20});q.sub=true});
return s}
// ---------- run placement ----------
const placeN=(n,fn)=>{let k=0,tries=0;while(k<n&&tries<n*4){tries++;if(fn())k++}};
const tierOf=(rg)=>({1:1,2:2,3:2,4:2,6:3}[rg]||2);
const nTowns=Math.max(2,Math.round(4*SC*SC));for(let i=0;i<nTowns;i++)town();
placeN(scaleN(3),()=>cabin(1,1));placeN(scaleN(2),()=>camp(1,1));
placeN(scaleN(6),()=>camp(2,2));placeN(scaleN(5),()=>cabin(2,2));placeN(scaleN(3),()=>ruins(2));placeN(scaleN(2),()=>clearing());
placeN(scaleN(3),()=>camp(3,2));
placeN(scaleN(5),()=>camp(4,2));placeN(scaleN(6),()=>cabin(4,2));placeN(scaleN(3),()=>outpost(4,3));
placeN(scaleN(2),()=>camp(6,3));placeN(scaleN(1),()=>outpost(6,3));placeN(scaleN(1),()=>outpost(3,2));
placeN(scaleN(4),()=>bunker(3));
// treasure dig spots
const digs=[];for(let t=0;t<600&&digs.length<scaleN(12);t++){const x=ri(14,GW-14),y=ri(14,GW-14),i=ix(x,y);if(!land[i]||occ[i]||pm[i]||inn[i]||!FLAT.has(ter[i])||reg[i]===5||reg[i]===6||dsea[i]<3)continue;if(tk[((y*16/8)|0)*S8+((x*16/8)|0)])continue;digs.push([x,y]);const id='dig'+digs.length;inter.push({kind:'dig',id,x:x*C+8,y:y*C+8,r:22,label:'Dig here',coins:Math.round(rr(18,50)*TM[ri(1,3)]),tier:2});cp('dig',x+.5,y+.5,0,id,{nocol:true})}
// ---------- network (Kruskal) ----------
const real=nodes.filter(n=>!n.secretPath),secret=nodes.filter(n=>n.secretPath);
const par=real.map((_,i)=>i);const find=a=>{while(par[a]!==a){par[a]=par[par[a]];a=par[a]}return a};const uni=(a,b)=>{a=find(a);b=find(b);if(a===b)return false;par[a]=b;return true};
const gmap={};real.forEach((n,i)=>{if(n.grp){if(gmap[n.grp]!==undefined)uni(i,gmap[n.grp]);else gmap[n.grp]=i}});
const edges=[];for(let i=0;i<real.length;i++)for(let j=i+1;j<real.length;j++){if(real[i].grp&&real[i].grp===real[j].grp)continue;edges.push([Math.hypot(real[i].x-real[j].x,real[i].y-real[j].y),i,j])}
edges.sort((a,b)=>a[0]-b[0]);const chosen=[];for(const e of edges){if(uni(e[1],e[2]))chosen.push(e)}
const deg=real.map(()=>0);chosen.forEach(e=>{deg[e[1]]++;deg[e[2]]++});
for(const e of edges){if(chosen.length>=real.length*1.25)break;if(e[0]<45*SC+30&&!chosen.some(c=>c[1]===e[1]&&c[2]===e[2])&&rnd()<.08&&deg[e[1]]<3&&deg[e[2]]<3){chosen.push(e);deg[e[1]]++;deg[e[2]]++}}
const inZone=(z,x,y,k)=>Math.pow((x-z.x)/(z.rx*k),2)+Math.pow((y-z.y)/(z.ry*k),2)<1;
function route(ax,ay,bx,by,w,t,o){o=o||{};let pts=[[ax,ay],[bx,by]];
for(const z of zones){if(inZone(z,ax,ay,1.2)||inZone(z,bx,by,1.2))continue;let hit=false;for(let k=1;k<30;k++){const p=[ax+(bx-ax)*k/30,ay+(by-ay)*k/30];if(inZone(z,p[0],p[1],1)){hit=true;break}}
if(hit){const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,R=Math.max(z.rx,z.ry)+10;const cand=[1,-1].map(s=>[z.x+nx*s*R,z.y+ny*s*R]);const len=c=>Math.hypot(c[0]-ax,c[1]-ay)+Math.hypot(c[0]-bx,c[1]-by);const c=len(cand[0])<len(cand[1])?cand[0]:cand[1];pts=[[ax,ay],c,[bx,by]]}}
if(pts.length===2){const mx=(ax+bx)/2,my=(ay+by)/2,L=Math.hypot(bx-ax,by-ay),off=rr(-.12,.12)*L;pts=[[ax,ay],[mx-(by-ay)/(L||1)*off,my+(bx-ax)/(L||1)*off],[bx,by]]}
const c=curve(pts,.6);c.forEach(p=>{disc(p[0],p[1],w/2,(x,y,i)=>{if(inn[i])return;const cur=ter[i];
if(cur===CLIFF||(cur===ROCK&&o.carve)){ter[i]=o.cliffT||DIRT;pm[i]=1;return}
if(D.SOFTLAND[cur]||cur===ROCK){ter[i]=t;pm[i]=1;return}
if(cur===WATER||cur===SHALLOW||cur===LAVA||cur===DEEP&&land[i]){ter[i]=PLANK;pm[i]=1;brg[i]=1}})})}
chosen.forEach(e=>{const a=real[e[1]],b=real[e[2]];const big=a.tag==='camp'||b.tag==='camp'||a.tag==='hub'||b.tag==='hub'||a.tag==='fac'||b.tag==='fac';const paved=a.tag==='fac'||b.tag==='fac';
route(a.x,a.y,b.x,b.y,paved?5:big?4.2:3.2,paved?ROAD:DIRT,{})});
secret.forEach(n=>{let bn=null,bd=1e9;real.forEach(r=>{const d=Math.hypot(r.x-n.x,r.y-n.y);if(d<bd){bd=d;bn=r}});route(n.x,n.y,bn.x,bn.y,2.4,ROCK,{carve:true,cliffT:ROCK})});
// bridge rails
const liq=t=>t===WATER||t===SHALLOW||t===LAVA||t===DEEP;
for(let i=0;i<N;i++)if(brg[i]){const x=i%GW,y=(i/GW)|0;
if(inb(x,y-1)&&liq(ter[i-GW]))rails.push({x:x*C,y:y*C,w:C,h:3});if(inb(x,y+1)&&liq(ter[i+GW]))rails.push({x:x*C,y:(y+1)*C-3,w:C,h:3});
if(inb(x-1,y)&&liq(ter[i-1]))rails.push({x:x*C,y:y*C,w:3,h:C});if(inb(x+1,y)&&liq(ter[i+1]))rails.push({x:(x+1)*C-3,y:y*C,w:3,h:C})}
// ---------- vegetation ----------
const clear=new Uint8Array(N);
for(let i=0;i<N;i++)if(pm[i]){const x=i%GW,y=(i/GW)|0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(inb(x+dx,y+dy))clear[ix(x+dx,y+dy)]=1}
const RC=[[],[],[],[],[],[],[]];for(let i=0;i<N;i++)if(land[i]&&!clear[i]&&!inn[i]&&!occ[i]&&RC[reg[i]])RC[reg[i]].push(i);
const set=a=>new Set(a);
function scatter(R,dens,minR,terrs,pickf,gate,maxTry){const cells=RC[R];if(!cells.length)return 0;const n=Math.round(cells.length*dens),m8=Math.ceil(minR/8);let placed=0;
for(let t=0,mt=maxTry||n*9;t<mt&&placed<n;t++){const i=cells[(rnd()*cells.length)|0];if(!terrs.has(ter[i])||clear[i])continue;const cx=(i%GW)+rnd(),cy=((i/GW)|0)+rnd();
if(gate&&gate(cx,cy)<rnd())continue;const px=cx*C,py=cy*C,ax=(px/8)|0,ay=(py/8)|0;let bad=false;
for(let b=-m8;b<=m8&&!bad;b++)for(let a=-m8;a<=m8;a++){const X=ax+a,Y=ay+b;if(X>=0&&Y>=0&&X<S8&&Y<S8&&tk[Y*S8+X]){bad=true;break}}
if(bad)continue;const o=pickf(cx,cy,i);if(!o)continue;put(o[0],px,py,o[1]);placed++}return placed}
const gate=(sx,th)=>(x,y)=>Math.max(0,Math.min(1,(fbm(x*sx+7,y*sx+3,3)-th)*4));const rv=n=>(rnd()*n)|0;
scatter(1,.016,26,set([SAND,GRASS]),(x,y,i)=>ter[i]===SAND&&dsea[i]<4?null:['palm',rv(3)],gate(.05,.33));scatter(1,.01,12,set([GRASS,SAND]),()=>['bush',0]);scatter(1,.005,24,set([SAND]),(x,y,i)=>dsea[i]>=2&&dsea[i]<7?['rockM',rv(3)]:null);scatter(1,.0008,40,set([SAND]),(x,y,i)=>dsea[i]>=2?['log',0]:null);
scatter(2,.085,17,set([JGRASS,GRASS]),()=>{const r=rnd();return['jtree',r<.35?0:r<.7?1:r<.92?2:3]},gate(.05,.38));
scatter(2,.0003,70,set([JGRASS]),()=>['jbig',0]);scatter(2,.05,10,set([JGRASS,GRASS]),()=>['bush',1+rv(2)],gate(.06,.34));scatter(2,.004,26,set([JGRASS,MUD]),()=>['rockM',3+rv(2)]);scatter(2,.0018,44,set([JGRASS]),()=>['log',1]);
scatter(3,.012,30,set([GRASS,DIRT]),()=>['jtree',rv(2)]);scatter(3,.018,10,set([GRASS,DIRT]),()=>['bush',1]);scatter(3,.003,30,set([GRASS]),()=>['rockM',rv(3)]);
scatter(4,.07,17,set([SNOW,ROCK]),()=>['pine',rv(4)],gate(.05,.35));scatter(4,.005,24,set([SNOW,ROCK]),()=>['rockM',5+rv(2)]);scatter(4,.004,14,set([SNOW]),()=>['bush',3]);
scatter(6,.016,28,set([BASALT,ASH]),()=>['dead',rv(2)]);scatter(6,.03,16,set([BASALT,ASH]),()=>['spire',rv(3)]);scatter(6,.009,22,set([BASALT,ASH]),()=>['rockM',7+rv(2)]);scatter(6,.003,40,set([ASH]),()=>['bush',4]);
scatter(5,.004,30,set([ROCK]),()=>['rockM',5+rv(2)]);
// ---------- enemy spawns ----------
const spawns=[];let eid=0;const tkAt=(x,y)=>{const ax=(x/8)|0,ay=(y/8)|0;return tk[ay*S8+ax]};
const siteById={};sites.forEach(s=>siteById[s.id]=s);
const okPos=(x,y)=>{const cx=Math.floor(x/C),cy=Math.floor(y/C);if(!inb(cx,cy))return false;const i=ix(cx,cy),t=ter[i];if(D.SOLID[t]||D.LIQUID[t]||t===LAVA||t===PLANK&&false)return false;if(tkAt(x,y))return false;return Math.hypot(x-spawnPt.x,y-spawnPt.y)>420};
const regCells={};
for(const rq of spawnReq){const s=siteById[rq.site];for(let k=0;k<rq.n;k++){let pos=null;
for(let t=0;t<60&&!pos;t++){let x,y;
if(rq.inside){const ids=s.buildingIds||buildings.filter(b=>b.site===s.id).map(b=>b.id);if(!ids.length)break;const b=buildings[pick(ids)-1];const c=pick(b.cells);x=c[0]*C+8;y=c[1]*C+8;if(inn[ix(c[0],c[1])]!==b.id||!D.FLOORT[ter[ix(c[0],c[1])]]||tkAt(x,y))continue}
else{const a=rr(0,6.28),r=Math.sqrt(rnd())*rq.rad*C;x=rq.x*C+Math.cos(a)*r;y=rq.y*C+Math.sin(a)*r;if(inn[ix(Math.floor(x/C),Math.floor(y/C))])continue}
if(okPos(x,y))pos=[x,y]}
if(pos)spawns.push({id:eid++,type:rq.type,x:pos[0],y:pos[1],site:rq.site,tier:s.tier,inside:!!rq.inside})}}
// wild fauna
const wild=(rg,type,per,terrs)=>{const cells=RC[rg];const n=Math.round(cells.length/per);for(let t=0,k=0;t<n*8&&k<n;t++){const i=cells[(rnd()*cells.length)|0];const x=((i%GW)+rnd())*C,y=(((i/GW)|0)+rnd())*C;if(terrs&&!terrs.has(ter[i]))continue;if(!okPos(x,y)||dsea[i]<4)continue;spawns.push({id:eid++,type,x,y,site:null,tier:rg===6?3:rg===4?2:rg===3?2:1,inside:false});k++}};
wild(1,'jackal',2600,null);wild(2,'jackal',1900,null);wild(2,'raider',9000,null);wild(4,'wolf',1700,null);wild(3,'infected',1300,null);wild(6,'imp',1500,set([BASALT,ASH]));wild(4,'raider',9000,null);
// ---------- collision & world object ----------
const SOL=new Uint8Array(N);for(let i=0;i<N;i++)SOL[i]=D.SOLID[ter[i]];
rails.forEach(r=>colliders.push(r));
const CB=64,NB=Math.ceil(WORLD/CB)+1,cbuck=new Array(NB*NB);
colliders.forEach(c=>{for(let by=Math.floor(c.y/CB);by<=Math.floor((c.y+c.h)/CB);by++)for(let bx=Math.floor(c.x/CB);bx<=Math.floor((c.x+c.w)/CB);bx++){if(bx<0||by<0||bx>=NB||by>=NB)continue;(cbuck[by*NB+bx]=cbuck[by*NB+bx]||[]).push(c)}});
extracts.forEach(z=>light(z.x,z.y-10,110,'teal',{k:.9}));
const W={seed,GW,CELL:C,WORLD,ter,reg,inn,dec,pm,SOL,statics,buildings,doors,inter,pois,lights,emitters,colliders,npcs,rails,dsea,land,sites,extracts,enemySpawns:spawns,
spawn:spawnPt,volcano:{x:VX,y:VY}};
W.blocked=function(x0,y0,x1,y1){if(x0<0||y0<0||x1>WORLD||y1>WORLD)return true;
const cx0=Math.floor(x0/C),cx1=Math.floor((x1-.001)/C),cy0=Math.floor(y0/C),cy1=Math.floor((y1-.001)/C);
for(let y=cy0;y<=cy1;y++)for(let x=cx0;x<=cx1;x++)if(SOL[y*GW+x])return true;
for(let by=Math.floor(y0/CB);by<=Math.floor(y1/CB);by++)for(let bx=Math.floor(x0/CB);bx<=Math.floor(x1/CB);bx++){const l=cbuck[by*NB+bx];if(!l)continue;
for(let k=0;k<l.length;k++){const c=l[k];if(x0<c.x+c.w&&x1>c.x&&y0<c.y+c.h&&y1>c.y&&!(c.door&&c.door.open))return true}}return false};
W.cell=(x,y)=>ix(Math.max(0,Math.min(GW-1,Math.floor(x/C))),Math.max(0,Math.min(GW-1,Math.floor(y/C))));
const CS=256,NC=Math.ceil(WORLD/CS),sb=Array.from({length:NC*NC},()=>[]);statics.forEach(s=>{const cx=Math.min(NC-1,Math.max(0,Math.floor(s.x/CS))),cy=Math.min(NC-1,Math.max(0,Math.floor(s.y/CS)));sb[cy*NC+cx].push(s)});
W.sbuckets=sb;W.NC=NC;W.CS=CS;
return W}
})();

(function(){
const CI=globalThis.CI,U=CI.U;
const M=CI.Meta={};
M.ITEMS={
medkit:{name:'Medkit',price:60,desc:'Heals 60 HP.',heal:60,key:1},
bandage:{name:'Bandage',price:20,desc:'Heals 25 HP.',heal:25,key:2},
stim:{name:'Stim',price:70,desc:'+40% speed for 10 seconds.',speed:10,key:3},
ammo:{name:'Ammo Pack',price:30,desc:'12 pistol rounds.',ammo:12},
vest:{name:'Kevlar Vest',price:110,desc:'Starts the raid with 60 armor.',armor:60},
keycard:{name:'Facility Keycard',price:0,desc:'Opens the vault in Station Omega.',loot:true}};
M.SHOP_ITEMS=['bandage','medkit','stim','ammo','vest'];
M.WEAPONS={
fists:{name:'Fists',price:0,dmg:5,cd:.42,range:20,arc:2.0,desc:'Better than nothing.'},
club:{name:'Wooden Club',price:0,dmg:9,cd:.5,range:25,arc:2.0,desc:'Solid and starter-friendly.'},
knife:{name:'Combat Knife',price:140,dmg:6,cd:.26,range:21,arc:1.7,desc:'Very fast, short reach.'},
machete:{name:'Machete',price:260,dmg:13,cd:.5,range:29,arc:2.2,desc:'Wide arc, strong swing.'},
spear:{name:'Spear',price:340,dmg:12,cd:.62,range:42,arc:1.0,desc:'Long reach, narrow arc.'},
sledge:{name:'Sledgehammer',price:520,dmg:26,cd:1.0,range:30,arc:2.0,desc:'Slow and devastating.',knock:70},
pistol:{name:'Pistol',price:420,dmg:15,cd:.34,ranged:true,speed:300,desc:'Uses ammo. Hold fire at range.'}};
M.CLASSES={
scavenger:{name:'Scavenger',price:0,desc:'Finds 20% more coins in containers.',hp:100,spd:1,dmg:1,rdmg:1,loot:1.2,heal:1,sta:1,color:'#d8b050'},
brawler:{name:'Brawler',price:450,desc:'+30 HP and +25% melee damage, a bit slower.',hp:130,spd:.96,dmg:1.25,rdmg:1,loot:1,heal:1,sta:1,color:'#d8503a'},
ranger:{name:'Ranger',price:600,desc:'+30% pistol damage, faster, starts with 12 free rounds.',hp:90,spd:1.08,dmg:1,rdmg:1.3,loot:1,heal:1,sta:1,ammo:12,color:'#5aa86a'},
medic:{name:'Medic',price:560,desc:'Healing items +50%, slowly regenerates out of combat.',hp:100,spd:1,dmg:1,rdmg:1,loot:1,heal:1.5,sta:1,regen:1.1,color:'#6ad0c0'},
runner:{name:'Runner',price:520,desc:'+12% speed and 60% more stamina.',hp:85,spd:1.12,dmg:1,rdmg:1,loot:1,heal:1,sta:1.6,color:'#e8a040'}};
M.TRACKS={vit:{name:'Vitality',desc:'+12 max HP per level'},pow:{name:'Power',desc:'+8% damage per level'},agi:{name:'Agility',desc:'+4% speed and +10% stamina per level'}};
M.MAXLV=5;M.upCost=lv=>90+85*lv;
M.SKINS=[
{id:'castaway',name:'Castaway',price:0,rar:'common',o:{shirt:1,pants:'#3a4658',pack:'#7a5a34'}},
{id:'ranger',name:'Ranger Green',price:180,rar:'common',o:{shirtHex:'#4a7a48',pants:'#4a4030',pack:'#5a4a2a'}},
{id:'sandstorm',name:'Sandstorm',price:180,rar:'common',o:{shirtHex:'#c8a468',pants:'#6a5a40',pack:'#8a6a3a'}},
{id:'crimson',name:'Crimson Raider',price:380,rar:'rare',o:{shirtHex:'#a82a2a',pants:'#2a2a30',pack:'#3a1a1a'}},
{id:'parka',name:'Arctic Parka',price:420,rar:'rare',o:{shirtHex:'#e8eef2',pants:'#5a6a82',pack:'#8aa0b8',white:true}},
{id:'midnight',name:'Midnight Ops',price:620,rar:'epic',o:{shirtHex:'#22262e',pants:'#14161c',pack:'#2a2e38',hairHex:'#c8ccd4'}},
{id:'ember',name:'Ember Runner',price:700,rar:'epic',o:{shirtHex:'#ff7a30',pants:'#2a1a14',pack:'#a82a14',hairHex:'#ffd060'}},
{id:'ghost',name:'Ghost Suit',price:900,rar:'epic',o:{shirtHex:'#b8c0c8',pants:'#8a929a',pack:'#6a727a',hairHex:'#e8ecf0'}},
{id:'gold',name:'Golden Elite',price:1600,rar:'legendary',o:{shirtHex:'#f2c040',pants:'#7a5a14',pack:'#c8941c',hairHex:'#fff0a0'}}];
M.RAR={common:'#9db4b8',rare:'#5aa0ff',epic:'#b86aff',legendary:'#ffb040'};
M.ENEMY={
jackal:{name:'Jackal',hp:22,dmg:7,spd:80,aggro:150,range:15,cd:.9,coins:[2,8],xp:6,r:7,drops:{bandage:.08,ammo:.04}},
wolf:{name:'Wolf',hp:40,dmg:11,spd:94,aggro:190,range:17,cd:.9,coins:[6,16],xp:12,r:8,drops:{bandage:.1,ammo:.05}},
infected:{name:'Infected',hp:44,dmg:9,spd:46,aggro:130,range:15,cd:1.0,coins:[5,14],xp:10,r:7,drops:{bandage:.12,medkit:.03}},
raider:{name:'Raider',hp:58,dmg:11,spd:62,aggro:210,range:17,cd:.9,coins:[14,36],xp:18,r:8,drops:{ammo:.18,bandage:.15,medkit:.05,stim:.05},gun:true},
imp:{name:'Cinder Imp',hp:32,dmg:9,spd:58,aggro:190,range:140,cd:2.1,coins:[10,24],xp:16,r:7,ranged:true,proj:'fire',drops:{stim:.08,medkit:.04}},
sentry:{name:'Sentry Drone',hp:95,dmg:12,spd:36,aggro:220,range:170,cd:1.3,coins:[30,70],xp:34,r:8,ranged:true,proj:'laser',drops:{keycard:.35,medkit:.15,ammo:.2},hover:true}};
M.rank=xp=>{let l=1,n=100;while(xp>=n){xp-=n;l++;n=100+60*l}return{lv:l,cur:xp,need:n}};
// ---- profile ----
M.defaultProfile=()=>({v:2,t:0,name:'Survivor',bank:120,stash:{bandage:2,medkit:0,stim:0,ammo:0,vest:0},classes:['scavenger'],cls:'scavenger',up:{scavenger:{vit:0,pow:0,agi:0}},skins:['castaway'],skin:'castaway',look:{skin:0,hair:1,style:0},weapons:['fists','club'],weapon:'club',stats:{runs:0,extracts:0,deaths:0,kills:0,banked:0,xp:0,best:0}});
M.sanitize=p=>{const d=M.defaultProfile();if(!p||typeof p!=='object')return d;const o=Object.assign(d,p);o.stash=Object.assign(d.stash,p.stash||{});o.stats=Object.assign(d.stats,p.stats||{});o.look=Object.assign(d.look,p.look||{});o.up=p.up||d.up;if(!o.classes||!o.classes.length)o.classes=['scavenger'];if(!o.skins||!o.skins.length)o.skins=['castaway'];if(!o.weapons||!o.weapons.length)o.weapons=['fists','club'];
if(!M.CLASSES[o.cls]||!o.classes.includes(o.cls))o.cls='scavenger';if(!M.WEAPONS[o.weapon]||!o.weapons.includes(o.weapon))o.weapon='club';if(!M.SKINS.some(s=>s.id===o.skin)||!o.skins.includes(o.skin))o.skin='castaway';
o.bank=Math.max(0,Math.floor(+o.bank||0));for(const c of o.classes)o.up[c]=Object.assign({vit:0,pow:0,agi:0},o.up[c]||{});return o};
M.stats=(prof)=>{const c=M.CLASSES[prof.cls],u=prof.up[prof.cls]||{vit:0,pow:0,agi:0};return{hp:c.hp+12*u.vit,spd:c.spd*(1+.04*u.agi),dmg:c.dmg*(1+.08*u.pow),rdmg:c.rdmg*(1+.08*u.pow),sta:c.sta*(1+.1*u.agi),loot:c.loot,heal:c.heal,regen:c.regen||0}};
M.outfit=(prof)=>{const s=M.SKINS.find(x=>x.id===prof.skin)||M.SKINS[0];return Object.assign({skin:prof.look.skin,hair:prof.look.hair,style:prof.look.style},s.o)};
// persistence (db per-user when available, localStorage always)
const Save=M.Save={uid:null,db:null,mode:'local',pending:null};
Save.local=()=>{try{const t=localStorage.getItem('ci_profile2');return t?JSON.parse(t):null}catch(e){return null}};
Save.init=async function(){let prof=Save.local();const cl=globalThis.claude;
if(cl&&cl.use){try{const user=await Promise.race([cl.use('user'),new Promise(r=>setTimeout(()=>r(null),4000))]);const db=await Promise.race([cl.use('db'),new Promise(r=>setTimeout(()=>r(null),4000))]);
if(user&&db&&user.id){const id=await user.id();if(id){Save.uid=id;Save.db=db;const ref=db.doc('data/users/'+id+'/profile');Save.ref=ref;
const snap=await Promise.race([ref.get(),new Promise(r=>setTimeout(()=>r(null),5000))]);const remote=snap&&snap.exists?(typeof snap.data==='function'?snap.data():snap.data):null;
if(remote&&(!prof||(remote.t||0)>=(prof.t||0)))prof=remote;Save.mode='account'}}}catch(e){}}
return M.sanitize(prof)};
Save.write=function(prof){prof.t=Date.now();try{localStorage.setItem('ci_profile2',JSON.stringify(prof))}catch(e){}
if(Save.ref){clearTimeout(Save.timer);Save.timer=setTimeout(()=>{try{Save.ref.set(JSON.parse(JSON.stringify(prof))).catch(()=>{})}catch(e){}},600)}};
})();

(function(){
const CI=globalThis.CI,U=CI.U,D=CI.D,T=D.T,SP=CI.Sprites,TR=CI.Terrain;
const LCOL={warm:[255,184,104],cool:[196,224,255],teal:[110,255,228],sodium:[255,198,118],lava:[255,104,40],red:[255,60,44],ice:[170,220,255],beam:[255,240,190]};
CI.Renderer=function(W,canvas){
const R=this;R.W=W;R.cv=canvas;R.ctx=canvas.getContext('2d');R.chunks={};R.zoomPref=0;
R.buf=U.mkCanvas(8,8);R.bctx=R.buf.getContext('2d');R.lm=U.mkCanvas(8,8);R.lctx=R.lm.getContext('2d');R.vig=U.mkCanvas(8,8);
R.amb=[200,215,235];R.parts=[];R.lsp={};R.items=[];R.noParticles=false;
for(const k in LCOL){const c=U.mkCanvas(128,128),x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64),col=LCOL[k];g.addColorStop(0,`rgba(${col},1)`);g.addColorStop(.35,`rgba(${col},.55)`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(0,0,128,128);R.lsp[k]=c}
R.resize=function(w,h){const z=R.zoomPref||U.clamp(Math.round(h/300),2,4);R.zoom=z;R.VW=Math.ceil(w/z);R.VH=Math.ceil(h/z);R.cv.width=w;R.cv.height=h;
for(const c of[R.buf,R.lm,R.vig]){c.width=R.VW;c.height=R.VH}R.bctx=R.buf.getContext('2d');R.lctx=R.lm.getContext('2d');
const v=R.vig.getContext('2d'),g=v.createRadialGradient(R.VW/2,R.VH/2,Math.min(R.VW,R.VH)*.38,R.VW/2,R.VH/2,Math.max(R.VW,R.VH)*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(8,10,20,.5)');v.fillStyle=g;v.fillRect(0,0,R.VW,R.VH)};
R.NC=W.NC;R.frame=0;R.nchunks=0;
R.chunk=function(cx,cy){const k=cy*R.NC+cx;let c=R.chunks[k];if(!c){c=R.chunks[k]=TR.chunk(W,cx,cy);R.nchunks++}c.used=R.frame;return c};
R.evict=function(){if(R.nchunks<90)return;const ks=Object.keys(R.chunks).sort((a,b)=>R.chunks[a].used-R.chunks[b].used);for(let i=0;i<ks.length-60;i++){delete R.chunks[ks[i]];R.nchunks--}};
R.prefetch=function(camX,camY){const x0=Math.floor((camX-256)/256),x1=Math.floor((camX+R.VW+256)/256),y0=Math.floor((camY-256)/256),y1=Math.floor((camY+R.VH+256)/256);
for(let y=Math.max(0,y0);y<=Math.min(R.NC-1,y1);y++)for(let x=Math.max(0,x0);x<=Math.min(R.NC-1,x1);x++)if(!R.chunks[y*R.NC+x]){R.chunk(x,y);return}};
function bump(p,c){return Math.max(0,1-Math.abs(p-c)/.27)}
R.draw=function(S){R.frame++;if(R.frame%120===0)R.evict();
const b=R.bctx,t=S.time,camX=S.camX,camY=S.camY,VW=R.VW,VH=R.VH,GW=W.GW;b.imageSmoothingEnabled=false;
b.fillStyle='#0e4a7a';b.fillRect(0,0,VW,VH);
const cx0=Math.max(0,Math.floor(camX/256)),cx1=Math.min(R.NC-1,Math.floor((camX+VW)/256)),cy0=Math.max(0,Math.floor(camY/256)),cy1=Math.min(R.NC-1,Math.floor((camY+VH)/256));
const ph=(t*.42)%1;
for(let y=cy0;y<=cy1;y++)for(let x=cx0;x<=cx1;x++){const ch=R.chunk(x,y);b.drawImage(ch.cv,x*256-camX,y*256-camY)}
for(let y=cy0;y<=cy1;y++)for(let x=cx0;x<=cx1;x++){const ch=R.chunk(x,y);if(ch.foams){for(let k=0;k<3;k++){b.globalAlpha=.12+.8*bump(ph,.12+k*.3);if(b.globalAlpha>.02)b.drawImage(ch.foams[k],x*256-camX,y*256-camY,256,256)}b.globalAlpha=1}}
// liquid shimmer
const gx0=Math.max(0,camX>>4),gx1=Math.min(GW-1,(camX+VW)>>4),gy0=Math.max(0,camY>>4),gy1=Math.min(GW-1,(camY+VH)>>4);
for(let gy=gy0;gy<=gy1;gy++)for(let gx=gx0;gx<=gx1;gx++){const tt=W.ter[gy*GW+gx];
if(tt<=2){const h=U.hash(gx,gy,8),p=(t*.7+h*9)%2.4;if(p<.3){b.fillStyle=tt===2?'rgba(255,255,255,.75)':'rgba(190,235,255,.6)';b.fillRect(gx*16+((h*11)|0)-camX,gy*16+((h*7+3)|0)-camY,3,1);if(p<.15)b.fillRect(gx*16+((h*5)|0)+4-camX,gy*16+((h*13)|0)-camY+5,2,1)}}
else if(tt===T.LAVA){const h=U.hash(gx,gy,9);for(let k=0;k<2;k++){const p=(t*.9+h*7+k*1.3)%2;if(p<.5){b.fillStyle=p<.25?'#ffd45a':'#ff9a2e';b.fillRect(gx*16+((U.hash(gx,gy,k)*13)|0)-camX,gy*16+((U.hash(gx,gy,k+3)*13)|0)-camY,2,1)}}}}
if(W.extracts)for(const z of W.extracts){if(z.x<camX-90||z.x>camX+VW+90||z.y<camY-90||z.y>camY+VH+90)continue;const sx=z.x-camX,sy=z.y-camY,pulse=.5+.5*Math.sin(t*3);const act=S.extractZone===z;
b.save();b.translate(sx,sy);b.scale(1,.62);b.fillStyle=`rgba(80,230,214,${.1+.07*pulse+(act?.1:0)})`;b.beginPath();b.arc(0,0,z.r,0,7);b.fill();b.strokeStyle=`rgba(150,255,240,${.5+.3*pulse})`;b.lineWidth=2;b.setLineDash([6,5]);b.lineDashOffset=-t*14;b.beginPath();b.arc(0,0,z.r-2,0,7);b.stroke();
if(act&&S.extractP>0){b.setLineDash([]);b.lineWidth=4;b.strokeStyle='#ffe27a';b.beginPath();b.arc(0,0,z.r-8,-1.57,-1.57+6.283*S.extractP);b.stroke()}b.restore();
b.fillStyle='rgba(150,255,240,.55)';b.fillRect(sx-1,sy-46-pulse*3,2,46);b.fillStyle='#e8fffa';b.fillRect(sx-2,sy-50-pulse*3,4,4)}
// collect depth items
const it=R.items;it.length=0;const op=S.opened;
const sx0=Math.max(0,cx0-1),sx1=Math.min(R.NC-1,cx1+1),sy0=Math.max(0,cy0-1),sy1=Math.min(R.NC-1,cy1+1);
for(let y=sy0;y<=sy1;y++)for(let x=sx0;x<=sx1;x++){const l=W.sbuckets[y*R.NC+x];for(let i=0;i<l.length;i++){const s=l[i];if(s.x<camX-90||s.x>camX+VW+90||s.y<camY-20||s.y>camY+VH+170)continue;it.push([s.y+(s.k==='dig'?-30:0),0,s])}}
W.buildings.forEach(bd=>{if(bd.x0*16>camX+VW||(bd.x0+bd.w)*16<camX||bd.y0*16>camY+VH||(bd.y0+bd.h)*16<camY)return;if(bd.alpha===undefined)bd.alpha=1;if(bd.alpha<.02)return;if(!bd.rf)bd.rf=TR.roof(W,bd);it.push([bd.rf.sortY,1,bd])});
W.doors.forEach(d=>{if(d.x>camX-16&&d.x<camX+VW&&d.y>camY-16&&d.y<camY+VH)it.push([d.y+16,2,d])});
if(S.npcs)S.npcs.forEach(n=>it.push([n.y,3,n]));
if(S.player)it.push([S.player.y,4,S.player]);
const inV=(x,y)=>x>camX-40&&x<camX+VW+40&&y>camY-30&&y<camY+VH+70;
if(S.enemies)for(const e of S.enemies)if(inV(e.x,e.y))it.push([e.y,5,e]);
if(S.peers)for(const q of S.peers)if(inV(q.x,q.y))it.push([q.y,6,q]);
if(S.drops)for(const q of S.drops)if(inV(q.x,q.y))it.push([q.y+2,7,q]);
if(S.projs)for(const q of S.projs)if(inV(q.x,q.y))it.push([q.y+9,8,q]);
it.sort((a,c)=>a[0]-c[0]);
for(let i=0;i<it.length;i++){const e=it[i],o=e[2];
switch(e[1]){
case 0:{const v=(o.id&&op[o.id])?1:o.v;const sp=SP.get(o.k,v),dx=Math.round(o.x-sp.ax-camX),dy=Math.round(o.y-sp.ay-camY);
if(o.k==='fire'){b.drawImage(sp.cv,dx,dy);const fl=Math.sin(t*14+o.x)*1.5;b.fillStyle='#e8541c';b.fillRect(dx+10,dy+2+fl*.3,8,9);b.fillStyle='#ff9a2e';b.fillRect(dx+11,dy+1+fl*.4,6,8);b.fillStyle='#ffe27a';b.fillRect(dx+12,dy+4,4,5);b.fillStyle='#ffd45a';b.fillRect(dx+13+Math.round(Math.sin(t*9)),dy-2-Math.round(Math.abs(fl)),2,3);break}
if(o.k==='tank'){b.drawImage(sp.cv,dx,dy);const k=.5+.5*Math.sin(t*2);b.fillStyle=`rgba(120,255,235,${.12+.12*k})`;b.fillRect(dx+6,dy+22,32,58);for(let q=0;q<7;q++){const yy=((t*18+q*13)%56);b.fillStyle='rgba(220,255,250,.8)';b.fillRect(dx+10+((q*9)%24),dy+78-yy,1,1)}break}
if(sp.sway){const h=Math.round(sp.cv.height*(sp.top||.5)),off=Math.round(Math.sin(t*1.3+o.x*.07)*sp.sway*1.4);b.drawImage(sp.cv,0,h,sp.cv.width,sp.cv.height-h,dx,dy+h,sp.cv.width,sp.cv.height-h);b.drawImage(sp.cv,0,0,sp.cv.width,h,dx+off,dy,sp.cv.width,h)}else b.drawImage(sp.cv,dx,dy);break}
case 1:{const rf=o.rf;b.globalAlpha=o.alpha;b.drawImage(rf.cv,rf.ox-camX,rf.oy-camY);b.globalAlpha=1;break}
case 2:drawDoor(b,o,camX,camY,t);break;
case 3:drawChar(b,S.sheets[o.pal],o.x,o.y,o.face||0,0,camX,camY);break;
case 4:{const p=o;if(p.hurt&&((t*12)|0)%2)b.globalAlpha=.55;drawChar(b,S.sheets.player,p.x,p.y,p.dir,p.frame,camX,camY);b.globalAlpha=1}break;case 5:drawEnemy(b,o,camX,camY,t);break;case 6:drawPeer(b,o,camX,camY,t);break;case 7:drawDrop(b,o,camX,camY,t);break;case 8:drawProj(b,o,camX,camY,t)}}
// slashes, sparks, texts
if(S.slashes)for(const q of S.slashes){const k=q.t/.16;b.save();b.translate(q.x-camX,q.y-camY);b.rotate(q.a);b.strokeStyle=`rgba(255,255,255,${.85*(1-k)})`;b.lineWidth=3;b.beginPath();b.arc(0,0,q.range*(.7+.3*k),-q.arc/2,q.arc/2);b.stroke();b.restore()}
if(S.fx)for(const f of S.fx){if(f.k==='muzzle'){b.fillStyle='#fff3b0';b.fillRect(Math.round(f.x-camX-2),Math.round(f.y-camY-2),4,4)}else{b.globalAlpha=1-f.t*2;b.fillStyle=f.c||'#fff';b.fillRect(Math.round(f.x-camX),Math.round(f.y-camY),2,2);b.globalAlpha=1}}
R.updateParticles(S,camX,camY);
for(const q of R.parts){const x=Math.round(q.x-camX),y=Math.round(q.y-camY);b.globalAlpha=Math.min(1,q.life/q.max*2);b.fillStyle=q.c;b.fillRect(x,y,q.s,q.s)}b.globalAlpha=1;
if(S.texts){b.font='8px "Pixelify Sans",monospace';b.textAlign='center';for(const q of S.texts){b.globalAlpha=Math.min(1,(.9-q.t)*2.5);b.lineWidth=2;b.strokeStyle='#14100e';b.strokeText(q.s,Math.round(q.x-camX),Math.round(q.y-camY));b.fillStyle=q.c;b.fillText(q.s,Math.round(q.x-camX),Math.round(q.y-camY))}b.globalAlpha=1}
// lighting
R.lighting(S,camX,camY,t);
b.globalCompositeOperation='multiply';b.drawImage(R.lm,0,0);b.globalCompositeOperation='source-over';b.drawImage(R.vig,0,0);
if(S.hurt){b.fillStyle=`rgba(220,40,20,${.18+.1*Math.sin(t*14)})`;b.fillRect(0,0,VW,VH)}
const c=R.ctx;c.imageSmoothingEnabled=false;c.drawImage(R.buf,0,0,VW*R.zoom,VH*R.zoom)};
function drawEnemy(b,e,camX,camY,t){const sh=SP.enemy(e.type),fr=(e.anim|0)%2,hv=e.def&&e.def.hover||e.type==='imp'?Math.sin(t*4+e.x)*1.5:0;const x=Math.round(e.x-camX),y=Math.round(e.y-camY);
if(e.dead){const k=Math.min(1,e.deadT/.5);b.globalAlpha=1-k;b.save();b.translate(x,y);b.rotate(k*1.2*(e.face||1));b.drawImage(sh.cv,fr*sh.FW,0,sh.FW,sh.FH,-sh.ax,-sh.ay,sh.FW,sh.FH);b.restore();b.globalAlpha=1;return}
b.fillStyle='rgba(10,20,15,.3)';b.fillRect(x-5,y-1,10,3);
if(e.flash>0)b.filter='brightness(3)';
b.save();b.translate(x,Math.round(y+(hv?-4+hv:0)));if(e.face<0)b.scale(-1,1);b.drawImage(sh.cv,fr*sh.FW,0,sh.FW,sh.FH,-sh.ax,-sh.ay,sh.FW,sh.FH);b.restore();b.filter='none';
if(e.hp<e.max){const w=14,top=y-sh.ay-4;b.fillStyle='#14100e';b.fillRect(x-w/2-1,top-1,w+2,4);b.fillStyle='#5a1a14';b.fillRect(x-w/2,top,w,2);b.fillStyle='#e5483c';b.fillRect(x-w/2,top,Math.max(0,w*e.hp/e.max),2)}}
function drawPeer(b,q,camX,camY,t){drawChar(b,q.sheet,q.x,q.y,q.dir,q.frame,camX,camY);b.font='8px "Pixelify Sans",monospace';b.textAlign='center';b.lineWidth=2;b.strokeStyle='#14100e';const x=Math.round(q.x-camX),y=Math.round(q.y-camY-32);b.strokeText(q.name,x,y);b.fillStyle='#7ee8d8';b.fillText(q.name,x,y)}
function drawDrop(b,d,camX,camY,t){const sp=d.k==='coin'?SP.coin():SP.itemIcon(d.id),bob=Math.sin(t*5+d.x)*1.2;b.fillStyle='rgba(10,20,15,.3)';b.fillRect(Math.round(d.x-camX-3),Math.round(d.y-camY+1),6,2);b.drawImage(sp.cv,Math.round(d.x-camX-sp.ax),Math.round(d.y-camY-sp.ay+bob))}
function drawProj(b,q,camX,camY,t){const x=Math.round(q.x-camX),y=Math.round(q.y-camY);if(q.kind==='fire'){b.fillStyle='#ff9a2e';b.fillRect(x-2,y-2,5,5);b.fillStyle='#ffe27a';b.fillRect(x-1,y-1,3,3)}else if(q.kind==='laser'){b.fillStyle='#ff4a3a';b.fillRect(x-2,y-1,5,3);b.fillStyle='#fff';b.fillRect(x-1,y,3,1)}else{b.fillStyle='#fff3b0';b.fillRect(x-1,y-1,3,3)}}
function drawChar(b,sh,x,y,dir,fr,camX,camY){if(!sh)return;b.fillStyle='rgba(10,20,15,.3)';b.fillRect(Math.round(x-camX-5),Math.round(y-camY-1),10,3);b.fillRect(Math.round(x-camX-4),Math.round(y-camY-2),8,1);b.drawImage(sh.cv,fr*sh.FW,dir*sh.FH,sh.FW,sh.FH,Math.round(x-camX-sh.ax),Math.round(y-camY-sh.ay),sh.FW,sh.FH)}
const DC={wood:['#4a2e18','#7a4e2a','#a87848'],sec:['#2a3844','#566a7e','#7ae0d6'],locked:['#3a1a1a','#6a2a2a','#e04a3a'],exit:['#4a4020','#8a7a2a','#e8c040']};
function drawDoor(b,d,camX,camY,t){const c=DC[d.kind==='exit'&&!d.locked?'wood':d.kind],x=d.x-camX,y=d.y-camY;
if(d.orient==='h'){if(d.open){b.fillStyle=c[0];b.fillRect(x,y+2,3,12);b.fillStyle=c[1];b.fillRect(x+1,y+2,1,12);b.fillRect(x+13,y+2,3,12);b.fillStyle=c[0];b.fillRect(x+13,y+2,3,1)}
else{b.fillStyle=c[0];b.fillRect(x,y,16,16);b.fillStyle=c[1];b.fillRect(x+1,y+1,14,14);b.fillStyle=c[2];b.fillRect(x+1,y+1,14,2);if(d.kind==='wood'){b.fillStyle=c[0];b.fillRect(x+7,y+1,1,14);b.fillStyle='#d8c070';b.fillRect(x+10,y+8,2,2)}else{b.fillStyle=c[0];b.fillRect(x+7,y+1,2,14);b.fillStyle=c[2];b.fillRect(x+3,y+7,2,2);b.fillRect(x+11,y+7,2,2)}}}
else{if(d.open){b.fillStyle=c[0];b.fillRect(x+6,y+12,4,4);b.fillStyle=c[1];b.fillRect(x+6,y+12,3,3)}else{b.fillStyle=c[0];b.fillRect(x+3,y-4,10,20);b.fillStyle=c[1];b.fillRect(x+4,y-3,8,18);b.fillStyle=c[2];b.fillRect(x+4,y-3,8,2);b.fillStyle=c[0];b.fillRect(x+7,y-3,2,18);if(d.kind!=='wood'){b.fillStyle=c[2];b.fillRect(x+5,y+6,2,2);b.fillRect(x+9,y+6,2,2)}}}}
R.lighting=function(S,camX,camY,t){const l=R.lctx,VW=R.VW,VH=R.VH,a=R.amb;l.globalCompositeOperation='source-over';l.fillStyle=`rgb(${a[0]|0},${a[1]|0},${a[2]|0})`;l.fillRect(0,0,VW,VH);l.globalCompositeOperation='lighter';
for(const L of W.lights){if(L.x<camX-L.r||L.x>camX+VW+L.r||L.y<camY-L.r-120||L.y>camY+VH+L.r)continue;let k=L.k||1;
if(L.bid){const bd=W.buildings[L.bid-1];k*=1-(bd.alpha===undefined?1:bd.alpha)}if(L.flick)k*=.82+.18*Math.sin(t*13+L.x*.3)*Math.sin(t*7.3+L.y);if(L.blink)k*=Math.sin(t*3)>.55?1:.12;if(L.night)k*=.35;
if(L.beam){const ang=t*.7,x=L.x-camX,y=L.y-camY;l.save();l.translate(x,y);l.rotate(ang);const g=l.createLinearGradient(0,0,260,0);g.addColorStop(0,'rgba(255,240,190,.55)');g.addColorStop(1,'rgba(255,240,190,0)');l.fillStyle=g;l.beginPath();l.moveTo(0,0);l.lineTo(260,-26);l.lineTo(260,26);l.closePath();l.fill();l.rotate(Math.PI);l.fill();l.restore();k*=.8}
if(k<.03)continue;l.globalAlpha=Math.min(1,k);const r=L.r;l.drawImage(R.lsp[L.col],L.x-camX-r,L.y-camY-r,r*2,r*2)}
l.globalAlpha=1;
if(S.player&&S.player.torch){const p=S.player;l.globalAlpha=.5;l.drawImage(R.lsp.warm,p.x-camX-40,p.y-camY-48,80,80);l.globalAlpha=1}};
R.updateParticles=function(S,camX,camY){const dt=S.dt||.016,P=R.parts,VW=R.VW,VH=R.VH,rg=S.region|0;
for(let i=P.length-1;i>=0;i--){const q=P[i];q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.w){q.x+=Math.sin(S.time*2+q.y*.05)*.2}if(q.life<=0)P.splice(i,1)}
if(R.noParticles||P.length>260||S.menu&&rg===0)return;const sp=(c,vx,vy,life,s,w)=>P.push({x:camX+Math.random()*VW,y:camY+Math.random()*VH,vx,vy,life,max:life,c,s,w});
if(rg===4&&Math.random()<dt*70)P.push({x:camX+Math.random()*(VW+60),y:camY-4,vx:-8+Math.random()*-10,vy:18+Math.random()*16,life:7,max:7,c:'#ffffff',s:Math.random()<.3?2:1,w:1});
else if(rg===6&&Math.random()<dt*34)P.push({x:camX+Math.random()*VW,y:camY+VH+4,vx:Math.random()*8-3,vy:-14-Math.random()*20,life:5,max:5,c:Math.random()<.5?'#ff9a3a':'#ffd45a',s:1,w:1});
else if(rg===2&&Math.random()<dt*9)sp(Math.random()<.5?'#d8ff8a':'#fff6a0',Math.random()*6-3,Math.random()*6-3,4+Math.random()*3,2,1);
else if(rg===1&&Math.random()<dt*6)sp('#fffbe8',6+Math.random()*6,-1,3,1,1);
else if(rg===3&&Math.random()<dt*7)sp('#c8c4b8',Math.random()*5,-2,4,1,1);
if(S.emit)for(const e of W.emitters){if(e.k!=='smoke')continue;if(e.x<camX-30||e.x>camX+VW+30||e.y<camY-40||e.y>camY+VH+60)continue;if(Math.random()<dt*.9)P.push({x:e.x+Math.random()*6-3,y:e.y,vx:3+Math.random()*5,vy:-10-Math.random()*8,life:3.6,max:3.6,c:'rgba(70,64,72,.7)',s:3,w:1})}};
R.setAmbient=function(tgt,dt){const k=Math.min(1,dt*1.8);for(let i=0;i<3;i++)R.amb[i]+=(tgt[i]-R.amb[i])*k};
};
})();

(function(){
const CI=globalThis.CI,U=CI.U,D=CI.D,T=D.T,SP=CI.Sprites,M=CI.Meta;
const sheetCache={};
CI.sheetFor=function(o){const k=JSON.stringify(o);return sheetCache[k]||(sheetCache[k]=SP.charSheet(Object.assign({pack:'#7a5a34'},o)))};
CI.Game=function(W,opts){
const G=this;G.W=W;G.prof=opts.prof;G.st=M.stats(G.prof);G.loadout=opts.loadout||{items:{},weapon:G.prof.weapon};G.net=opts.net||null;G.solo=!G.net;
G.sheets={player:CI.sheetFor(M.outfit(G.prof)),marlow:CI.sheetFor({skin:1,hair:4,shirt:2,style:0,white:true,pants:'#4a4030',pack:false})};
const C=16;
// enemy buckets
const BS=512,NB=Math.ceil(W.WORLD/BS)+1,sbk=Array.from({length:NB*NB},()=>[]);
W.enemySpawns.forEach(s=>{s.alive=true;s.hp=null;s.inst=null;sbk[Math.floor(s.y/BS)*NB+Math.floor(s.x/BS)].push(s)});
// reset world state in case the same world object is replayed
W.doors.forEach(d=>{d.open=false;d.locked=d.kind==='locked'||d.kind==='exit'});W.buildings.forEach(b=>b.alpha=1);
const L=G.loadout.items;
const ammoFromItems=(L.ammo||0)*12+(G.st&&M.CLASSES[G.prof.cls].ammo||0);
G.player={x:W.spawn.x,y:W.spawn.y,vx:0,vy:0,dir:0,frame:0,anim:0,hp:G.st.hp,max:G.st.hp,armor:(L.vest||0)>0?60:0,en:100,hurt:false,moving:false,sprint:false,exhausted:false,lastHurt:-99,atkCd:0,stim:0,knx:0,kny:0,flash:0};
G.inv={medkit:L.medkit||0,bandage:L.bandage||0,stim:L.stim||0,keycard:0};G.ammo=ammoFromItems;G.weapon=G.loadout.weapon||'club';
G.run={coins:0,kills:0,xp:0,found:0,secrets:0,start:0};
G.opened={};G.discovered={camp:true};G.regionsSeen={1:true};G.read={};G.flags={release:false,met:false};G.time=0;G.dialog=null;G.toasts=[];G.banners=[];G.region=1;G.locName='Landing Camp';G.inside=0;G.prompt=null;
G.enemies=[];G.projs=[];G.drops=[];G.fx=[];G.texts=[];G.slashes=[];G.over=false;G.result=null;G.extractP=0;G.extractZone=null;G.shake=0;G.peers=[];G.fogDirty=true;
G.say=(a,b,k)=>G.banners.push({a,b,k,t:0});
G.toast=(m)=>{G.toasts.push({m,t:0})};
G.say('Tropical Beach','Where the tide left you.','region');
G.toast('Raid abandoned places. Loot only counts once you extract at a dock.');
const emit=(t,d)=>{if(G.net&&G.net.emit)G.net.emit(t,d)};
G.addXP=(n)=>{G.run.xp+=n};
const dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
// ---------- helpers ----------
function los(x0,y0,x1,y1){const n=5;for(let i=1;i<n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;if(W.blocked(x-1,y-1,x+1,y+1))return false}return true}
function tryMove(e,dx,dy,hw,hh){let nx=e.x+dx;if(W.blocked(nx-hw,e.y-hh,nx+hw,e.y))nx=e.x;e.x=nx;let ny=e.y+dy;if(W.blocked(e.x-hw,ny-hh,e.x+hw,ny))ny=e.y;e.y=ny;return nx!==e.x-dx||ny!==e.y-dy}
G.text=(x,y,s,c)=>G.texts.push({x,y,s,c:c||'#fff',t:0});
G.streak=0;G.hurt=function(d,sx,sy){const p=G.player;if(G.over||p.inv>0)return;p.inv=.55;if(p.armor>0){const a=Math.min(p.armor,d*.6);p.armor-=a;d-=a}
p.hp-=d;p.lastHurt=G.time;p.flash=.25;G.shake=Math.max(G.shake,3);G.text(p.x,p.y-24,Math.round(d),'#ff6a5a');G.extractP=0;
if(sx!==undefined){const l=Math.hypot(p.x-sx,p.y-sy)||1;p.knx=(p.x-sx)/l*120;p.kny=(p.y-sy)/l*120}
if(p.hp<=0)G.die()};
G.die=function(){if(G.over)return;G.over=true;const lost=G.run.coins;G.result={type:'dead',coins:0,lost,kills:G.run.kills,xp:G.run.xp,time:G.time,items:{}}};
G.finishExtract=function(){if(G.over)return;G.over=true;G.run.xp+=25;const items=Object.assign({},G.inv);items.ammo=Math.floor(G.ammo/12);delete items.keycard;
G.result={type:'extract',coins:G.run.coins,kills:G.run.kills,xp:G.run.xp,time:G.time,items,found:G.run.found,secrets:G.run.secrets}};
// ---------- inventory ----------
G.useItem=function(k){const it=M.ITEMS[k],p=G.player;if(!it||G.over||(G.inv[k]||0)<=0)return;
if(it.heal){if(p.hp>=p.max-.5){G.toast('Already at full health.');return}G.inv[k]--;const h=Math.round(it.heal*G.st.heal);p.hp=Math.min(p.max,p.hp+h);G.text(p.x,p.y-26,'+'+h,'#7bd88f');G.toast(it.name+' used (+'+h+' HP)')}
else if(it.speed){G.inv[k]--;p.stim=it.speed;G.toast('Stim active: faster for '+it.speed+'s')}};
function giveItem(k,n){n=n||1;if(k==='ammo'){G.ammo+=12*n;G.toast('+'+12*n+' rounds');return}G.inv[k]=(G.inv[k]||0)+n;G.toast('Found '+M.ITEMS[k].name)}
// ---------- combat ----------
G.attack=function(aim){const p=G.player,w=M.WEAPONS[G.weapon]||M.WEAPONS.fists;if(p.atkCd>0||G.over||G.dialog)return;
let wp=w;if(w.ranged&&G.ammo<=0){G.toast('Out of ammo. Bashing with the pistol.');wp=Object.assign({},M.WEAPONS.fists,{dmg:4})}
p.combo=(G.time-(p.lastAtk||-9)<wp.cd+.55)?((p.combo||0)+1)%3:0;p.lastAtk=G.time;const fin=p.combo===2&&!wp.ranged;if(!wp.ranged){const lx=Math.cos(aim)*34,ly=Math.sin(aim)*34;p.knx=(p.knx||0)+lx;p.kny=(p.kny||0)+ly}p.atkCd=wp.cd*(fin?1.1:.85);p.dir=Math.abs(Math.cos(aim))>Math.abs(Math.sin(aim))?(Math.cos(aim)<0?1:2):(Math.sin(aim)<0?3:0);
for(const e of G.enemies)if(!e.dead&&dist(e.x,e.y,p.x,p.y)<230)e.alert=6;
if(wp.ranged){G.ammo--;const dm=wp.dmg*G.st.rdmg;G.projs.push({x:p.x+Math.cos(aim)*8,y:p.y-8+Math.sin(aim)*8,vx:Math.cos(aim)*wp.speed,vy:Math.sin(aim)*wp.speed,life:.75,dmg:dm,from:'p',kind:'bullet'});G.fx.push({x:p.x+Math.cos(aim)*10,y:p.y-8+Math.sin(aim)*10,t:0,k:'muzzle'});G.shake=Math.max(G.shake,1)}
else{G.slashes.push({x:p.x,y:p.y-8,a:aim,t:0,range:wp.range,arc:wp.arc});const cx=p.x,cy=p.y-8;let hit=0;
for(const e of G.enemies){if(e.dead)continue;const dx=e.x-cx,dy=e.y-4-cy,d=Math.hypot(dx,dy);if(d>wp.range+e.def.r)continue;let da=Math.abs(Math.atan2(dy,dx)-aim);if(da>Math.PI)da=Math.PI*2-da;if(da>wp.arc/2+.2&&d>e.def.r+4)continue;
const crit=fin||Math.random()<.12;const dmg=wp.dmg*1.35*G.st.dmg*(fin?1.5:1)*(crit?1.5:1)*(.9+Math.random()*.2);hitEnemy(e,dmg,crit,Math.cos(aim),Math.sin(aim),(wp.knock||40)*(fin?1.8:1));hit++}
if(hit)G.shake=Math.max(G.shake,fin?3:1.5)}};
function hitEnemy(e,dmg,crit,kx,ky,kn){e.hp-=dmg;e.flash=.14;e.alert=8;e.kx=kx*(kn||40);e.ky=ky*(kn||40);G.text(e.x,e.y-e.def.r*2-8,Math.round(dmg)+(crit?'!':''),crit?'#ffd060':'#fff');
if(e.hp<=0)killEnemy(e,true)}
function killEnemy(e,byMe){if(e.dead)return;e.dead=true;e.deadT=0;e.sp.alive=false;const def=e.def;
if(byMe){G.run.kills++;{const p=G.player;G.streak=(G.time-(G.lastKill||-99)<6)?(G.streak||0)+1:1;G.lastKill=G.time;const h=Math.min(8,2+G.streak);if(p.hp<p.max){p.hp=Math.min(p.max,p.hp+h);G.text(p.x,p.y-30,'+'+h,'#7bd88f')}if(G.streak>=3)G.text(e.x,e.y-26,G.streak+'x streak','#ffb040')}G.run.xp+=def.xp;emit('kill',{id:e.sp.id});
const c=Math.round((def.coins[0]+Math.random()*(def.coins[1]-def.coins[0]))*(1+.25*(e.sp.tier-1)));if(c>0)G.drops.push({k:'coin',v:c,x:e.x,y:e.y-4,t:0,vx:(Math.random()-.5)*40,vy:-20});
for(const k in def.drops)if(Math.random()<def.drops[k]*(1+.2*(e.sp.tier-1)))G.drops.push({k:'item',id:k,x:e.x+(Math.random()-.5)*10,y:e.y-2,t:0,vx:(Math.random()-.5)*40,vy:-20})}
for(let i=0;i<8;i++)G.fx.push({x:e.x,y:e.y-6,vx:(Math.random()-.5)*80,vy:(Math.random()-.8)*70,t:0,k:'spark',c:def.proj?'#ff9a2e':'#b04a3a'});
if(e.sp.site){const s=W.sites.find(q=>q.id===e.sp.site);if(s&&!s.cleared&&!W.enemySpawns.some(q=>q.site===s.id&&q.alive)){s.cleared=true;G.toast(s.name+' cleared  +'+(10+s.tier*8)+' XP');G.run.xp+=10+s.tier*8}}}
// ---------- enemy management ----------
function activate(s){const def=M.ENEMY[s.type];const m=1+.22*(s.tier-1);const e={sp:s,type:s.type,def,x:s.x,y:s.y,hx:s.x,hy:s.y,hp:s.hp==null?def.hp*m*.7:s.hp,max:def.hp*m*.7,face:1,cd:1+Math.random(),flash:0,alert:0,anim:Math.random()*4,wt:0,wx:s.x,wy:s.y,dead:false,kx:0,ky:0,dm:(1+.12*(s.tier-1))*.55,wind:0,gun:def.gun&&((s.id*7)%3===0)};s.inst=e;G.enemies.push(e)}
G.remote=function(topic,d,peer){if(!d)return;
if(topic==='kill'){const s=W.enemySpawns[d.id];if(s&&s.id===d.id&&s.alive){s.alive=false;if(s.inst&&!s.inst.dead){s.inst.dead=true;s.inst.deadT=0}}}
else if(topic==='open'){G.opened[d.id]=true}
else if(topic==='door'){const dr=W.doors.find(q=>q.id===d.id);if(dr){dr.open=!!d.open;if(dr.pair)dr.pair.open=dr.open}}};
let scanT=0;
function manageEnemies(dt){const p=G.player;scanT-=dt;
if(scanT<=0){scanT=.3;const bx=Math.floor(p.x/BS),by=Math.floor(p.y/BS);for(let y=by-2;y<=by+2;y++)for(let x=bx-2;x<=bx+2;x++){if(x<0||y<0||x>=NB||y>=NB)continue;for(const s of sbk[y*NB+x]){if(!s.alive||s.inst)continue;if(dist(s.x,s.y,p.x,p.y)<680&&G.enemies.length<110)activate(s)}}}
for(let i=G.enemies.length-1;i>=0;i--){const e=G.enemies[i];
if(e.dead){e.deadT+=dt;if(e.deadT>.5){G.enemies.splice(i,1);e.sp.inst=null}continue}
if(dist(e.x,e.y,p.x,p.y)>1050){e.sp.hp=e.hp;e.sp.inst=null;G.enemies.splice(i,1);continue}
updEnemy(e,dt)}}
function updEnemy(e,dt){const p=G.player,def=e.def,px=p.x,py=p.y-4;e.cd-=dt;e.flash-=dt;e.alert-=dt;e.anim+=dt*6;
const dx=px-e.x,dy=py-e.y,d=Math.hypot(dx,dy)||1;
if(e.kx||e.ky){tryMove(e,e.kx*dt*6,e.ky*dt*6,5,4);e.kx*=Math.max(0,1-dt*9);e.ky*=Math.max(0,1-dt*9);if(Math.abs(e.kx)<2)e.kx=0;if(Math.abs(e.ky)<2)e.ky=0}
const safe=dist(e.x,e.y,W.spawn.x,W.spawn.y)<230;
const aware=!G.over&&!safe&&(d<def.aggro||e.alert>0)&&!(e.type==='infected'&&d>def.aggro*1.8&&e.alert<=0);
const sp=def.spd*.85*(e.sp.tier>2?1.05:1);let vx=0,vy=0;
if(aware){e.face=dx>=0?1:-1;
if(def.ranged){const keep=def.range*.6;if(d<keep*.7){vx=-dx/d;vy=-dy/d}else if(d>def.range*.85){vx=dx/d;vy=dy/d}else{vx=-dy/d*.5;vy=dx/d*.5}
if(e.cd<=0&&d<def.range&&los(e.x,e.y-6,px,py-4)){e.cd=def.cd*(.9+Math.random()*.3);const sp2=def.proj==='laser'?230:120,a=Math.atan2(py-4-(e.y-8),px-e.x);G.projs.push({x:e.x,y:e.y-8,vx:Math.cos(a)*sp2,vy:Math.sin(a)*sp2,life:2.2,dmg:def.dmg*e.dm,from:'e',kind:def.proj})}}
else if(e.gun&&d<150&&d>50&&los(e.x,e.y-6,px,py-4)){vx=0;vy=0;if(e.cd<=0){e.cd=1.7;const a=Math.atan2(py-4-(e.y-8),px-e.x);G.projs.push({x:e.x,y:e.y-8,vx:Math.cos(a)*190,vy:Math.sin(a)*190,life:1.2,dmg:def.dmg*.8*e.dm,from:'e',kind:'bullet'})}}
else{if(e.wind>0){e.wind-=dt;if(e.wind<=0){e.cd=def.cd*1.3;if(dist(e.x,e.y,px,py)<=def.range+9)G.hurt(def.dmg*e.dm,e.x,e.y);else G.text(e.x,e.y-20,'miss','#9db4b8')}}else{if(d>def.range-2){vx=dx/d;vy=dy/d}if(d<=def.range+3&&e.cd<=0){e.wind=.4;G.text(e.x,e.y-e.def.r*2-12,'!','#ffd060')}}}
const mv=Math.hypot(vx,vy);if(mv>0)tryMove(e,vx*sp*dt,vy*sp*dt,5,4)}
else{e.wt-=dt;if(e.wt<=0){e.wt=2+Math.random()*3;if(Math.random()<.6){e.wx=e.hx+(Math.random()-.5)*90;e.wy=e.hy+(Math.random()-.5)*90}else{e.wx=e.x;e.wy=e.y}}
const wx=e.wx-e.x,wy=e.wy-e.y,wd=Math.hypot(wx,wy);if(wd>3){tryMove(e,wx/wd*sp*.35*dt,wy/wd*sp*.35*dt,5,4);e.face=wx>=0?1:-1}}}
// ---------- main update ----------
G.update=function(dt,inp){
if(G.over){G.time+=0;return}
G.time+=dt;const p=G.player;p.atkCd-=dt;p.flash-=dt;p.stim=Math.max(0,p.stim-dt);G.shake*=Math.max(0,1-dt*10);
for(const q of G.toasts)q.t+=dt;G.toasts=G.toasts.filter(q=>q.t<3.4);for(const q of G.banners)q.t+=dt;G.banners=G.banners.filter(q=>q.t<4.2);
G.inside=W.inn[W.cell(p.x,p.y-2)];
W.buildings.forEach(b=>{if(b.x0*C>p.x+500||(b.x0+b.w)*C<p.x-500||b.y0*C>p.y+400||(b.y0+b.h)*C<p.y-400)return;const tgt=G.inside===b.id?0:1;b.alpha+=(tgt-b.alpha)*Math.min(1,dt*7)});
G.updateNpcFacing();
if(G.dialog){if(inp.pressed.e||inp.pressed.enter){const d=G.dialog;if(d.lines&&d.idx<d.lines.length-1){d.idx++}else{if(d.onClose)d.onClose();G.dialog=null}}p.vx*=.8;p.vy*=.8;p.moving=false;p.frame=0;sideSystems(dt);return}
let ax=(inp.down.d||inp.down.right?1:0)-(inp.down.a||inp.down.left?1:0),ay=(inp.down.s||inp.down.down?1:0)-(inp.down.w||inp.down.up?1:0);const il=Math.hypot(ax,ay);if(il>0){ax/=il;ay/=il}
const tcell=W.ter[W.cell(p.x,p.y-1)];let mult=1,acc=950,fric=1300;
switch(tcell){case T.SHALLOW:mult=.62;break;case T.SNOW:mult=.92;break;case T.MUD:mult=.74;break;case T.SAND:mult=.96;break;case T.WETSAND:mult=.9;break;case T.DIRT:case T.ROAD:case T.CONC:case T.PLANK:mult=1.06;break;case T.ICE:acc=170;fric=55;break}
const wantSprint=inp.down.shift&&il>0&&!p.exhausted&&p.en>0;p.sprint=wantSprint;
const speed=108*mult*G.st.spd*(p.stim>0?1.4:1)*(wantSprint?1.6:1);
const tx=ax*speed,ty=ay*speed;let dx=tx-p.vx,dy=ty-p.vy;const dl=Math.hypot(dx,dy),rate=(il>0?acc:fric)*dt;
if(dl>rate){dx=dx/dl*rate;dy=dy/dl*rate}p.vx+=dx;p.vy+=dy;
const kv=Math.hypot(p.knx||0,p.kny||0);const vxx=p.vx+(p.knx||0),vyy=p.vy+(p.kny||0);if(kv>1){p.knx*=Math.max(0,1-dt*10);p.kny*=Math.max(0,1-dt*10)}
const sp2=Math.hypot(vxx,vyy),steps=Math.max(1,Math.ceil(sp2*dt/3)),sdt=dt/steps,HW=5,HH=6;
for(let s=0;s<steps;s++){let nx=p.x+vxx*sdt;if(W.blocked(nx-HW,p.y-HH,nx+HW,p.y)){let ok=false;for(const off of[-3,3,-2,2]){if(Math.abs(ay)<.01&&!W.blocked(nx-HW,p.y+off*.5-HH,nx+HW,p.y+off*.5)){p.y+=off*.5*Math.min(1,sdt*30);ok=false;break}}if(!ok){p.vx=0;nx=p.x}}p.x=nx;
let ny=p.y+vyy*sdt;if(W.blocked(p.x-HW,ny-HH,p.x+HW,ny)){for(const off of[-3,3]){if(Math.abs(ax)<.01&&!W.blocked(p.x+off-HW,ny-HH,p.x+off+HW,ny)){p.x+=off*Math.min(1,sdt*30);break}}p.vy=0;ny=p.y}p.y=ny}
p.moving=Math.hypot(p.vx,p.vy)>6;
// dodge roll
p.inv=Math.max(0,(p.inv||0)-dt);p.dcd=Math.max(0,(p.dcd||0)-dt);
if(inp.pressed.q&&p.dcd<=0&&(p.dash||0)<=0&&!G.over){let dxx=ax,dyy=ay;if(!il){const a=p.dir===1?Math.PI:p.dir===2?0:p.dir===3?-Math.PI/2:Math.PI/2;dxx=Math.cos(a);dyy=Math.sin(a)}p.dash=.2;p.dcd=.9;p.inv=.35;p.dvx=dxx*300;p.dvy=dyy*300;for(let i=0;i<5;i++)G.fx.push({x:p.x,y:p.y-2,vx:(Math.random()-.5)*40,vy:(Math.random()-.5)*40,t:0,k:'spark',c:'#b8d8e8'})}
if(p.dash>0){p.dash-=dt;p.knx=p.dvx;p.kny=p.dvy}
// aim + attack
let aim=null;if(inp.aim){aim=Math.atan2(inp.aim.y-(p.y-8),inp.aim.x-p.x)}
const firing=inp.down.mouse||inp.down.space||inp.down.j;
if(il>0&&!firing&&!(inp.aim&&inp.aimFresh)){if(Math.abs(ax)>Math.abs(ay)+.2)p.dir=ax<0?1:2;else if(Math.abs(ay)>.2)p.dir=ay<0?3:0}
if(firing){let a=aim;if(a===null||!inp.aimFresh)a=p.dir===1?Math.PI:p.dir===2?0:p.dir===3?-Math.PI/2:Math.PI/2;G.attack(a)}
if(inp.pressed['1'])G.useItem('medkit');if(inp.pressed['2'])G.useItem('bandage');if(inp.pressed['3'])G.useItem('stim');
if(p.moving){p.anim+=dt*(5+Math.hypot(p.vx,p.vy)*.06)*(wantSprint?1.2:1);p.frame=[0,1,2,3][Math.floor(p.anim)%4]}else{p.frame=0;p.anim=0}
const sta=G.st.sta;if(wantSprint&&p.moving){p.en=Math.max(0,p.en-15/sta*dt);if(p.en<=0)p.exhausted=true}else p.en=Math.min(100,p.en+(p.moving?9:17)*dt);if(p.exhausted&&p.en>25)p.exhausted=false;
// lava heat
const gx=Math.floor(p.x/16),gy=Math.floor((p.y-4)/16);let hot=false;
for(let y=gy-1;y<=gy+1;y++)for(let x=gx-1;x<=gx+1;x++){if(x<0||y<0||x>=W.GW||y>=W.GW)continue;if(W.ter[y*W.GW+x]===T.LAVA){const cx=Math.max(x*16,Math.min(p.x,x*16+16)),cy=Math.max(y*16,Math.min(p.y-4,y*16+16));if(Math.hypot(p.x-cx,p.y-4-cy)<15)hot=true}}
p.hurt=hot||p.flash>0;if(hot){p.hp-=9*dt;p.lastHurt=G.time;G.extractP=0;if(!G.warnedHeat||G.time-G.warnedHeat>6){G.toast('The lava is scorching you. Back away!');G.warnedHeat=G.time}if(p.hp<=0)G.die()}
else if(G.time-p.lastHurt>5){p.hp=Math.min(p.max,p.hp+(.6+(G.st.regen||0))*dt)}
sideSystems(dt);
// interaction
G.prompt=null;let best=null,bd=1e9;const px=p.x,py=p.y-8;
const test=(it,x,y,r,label)=>{const d=Math.hypot(px-x,py-y);if(d<r&&d<bd){bd=d;best={it,label}}};
for(const it of W.inter){if(Math.abs(it.x-px)>60||Math.abs(it.y-py)>60)continue;if((it.kind==='loot'||it.kind==='dig')&&G.opened[it.id])continue;test(it,it.x,it.y,it.r,it.label)}
for(const d of W.doors){if(Math.abs(d.x+8-px)>40||Math.abs(d.y+8-py)>40)continue;test({kind:'door',door:d},d.x+8,d.y+8,24,d.locked?(d.kind==='locked'?(G.inv.keycard>0?'Use keycard':'Locked door'):d.kind==='exit'?'Sealed door':'Locked'):d.open?'Close door':'Open door')}
G.prompt=best;if(best&&inp.pressed.e)G.interact(best.it)};
function sideSystems(dt){const p=G.player;
manageEnemies(dt);
// projectiles
for(let i=G.projs.length-1;i>=0;i--){const q=G.projs[i];q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;let rm=q.life<=0||W.blocked(q.x-1,q.y-1,q.x+1,q.y+1)&&!W.doors.some(d=>d.open&&q.x>d.x&&q.x<d.x+16&&q.y>d.y&&q.y<d.y+16);
if(!rm&&q.from==='p'){for(const e of G.enemies){if(e.dead)continue;if(Math.hypot(e.x-q.x,e.y-6-q.y)<e.def.r+3){hitEnemy(e,q.dmg*(.9+Math.random()*.2),false,q.vx/300,q.vy/300,50);rm=true;break}}}
else if(!rm&&q.from==='e'&&!G.over){if(Math.hypot(p.x-q.x,p.y-6-q.y)<7){G.hurt(q.dmg,q.x-q.vx*.1,q.y-q.vy*.1);rm=true}}
if(rm)G.projs.splice(i,1)}
// drops
for(let i=G.drops.length-1;i>=0;i--){const d=G.drops[i];d.t+=dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.vx*=Math.max(0,1-dt*5);d.vy+=120*dt;if(d.vy>0&&d.t>.25){d.vy=0;d.vx=0}
const dd=Math.hypot(p.x-d.x,p.y-6-d.y);if(d.t>.35&&dd<22){const k=Math.min(1,dt*10);d.x+=(p.x-d.x)*k;d.y+=(p.y-6-d.y)*k}
if(d.t>.35&&dd<9&&!G.over){if(d.k==='coin'){G.run.coins+=d.v;G.text(p.x,p.y-26,'+'+d.v,'#f2c040')}else giveItem(d.id);G.drops.splice(i,1)}else if(d.t>120)G.drops.splice(i,1)}
for(const f of G.fx){f.t+=dt;if(f.vx!==undefined){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=160*dt}}G.fx=G.fx.filter(f=>f.t<(f.k==='muzzle'?.08:.5));
for(const s of G.slashes)s.t+=dt;G.slashes=G.slashes.filter(s=>s.t<.16);
for(const t of G.texts){t.t+=dt;t.y-=18*dt}G.texts=G.texts.filter(t=>t.t<.9);
// region / discovery
const ci=W.cell(p.x,p.y-2);let rg=W.reg[ci];if(rg===0||W.ter[ci]<=2)rg=G.region;if(rg!==G.region)G.region=rg;
if(rg&&!G.regionsSeen[rg]){G.regionsSeen[rg]=true;const r=D.REGIONS[rg];G.say(r.name,r.desc,'region');G.addXP(20)}
let loc=D.REGIONS[G.region].name;
for(const o of W.pois){const d=Math.hypot(p.x-o.x,p.y-o.y);if(d<o.r){if(!G.discovered[o.id]){G.discovered[o.id]=true;if(o.secret)G.run.secrets++;G.run.found++;G.say(o.secret?'SECRET FOUND':'DISCOVERED',o.name,o.secret?'secret':'poi');if(o.xp)G.addXP(o.xp);G.fogPoi=true}loc=o.name}}
G.locName=loc;
// extraction
let zone=null;for(const z of W.extracts)if(dist(p.x,p.y,z.x,z.y)<z.r){zone=z;break}G.extractZone=zone;
if(zone&&!G.over){G.extractP+=dt/5;if(G.extractP>=1)G.finishExtract()}else G.extractP=Math.max(0,G.extractP-dt*1.5)}
G.updateNpcFacing=function(){const p=G.player;W.npcs.forEach(n=>{const dx=p.x-n.x,dy=p.y-n.y;if(Math.hypot(dx,dy)<90)n.face=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0)})};
function overlapsPlayer(d){const p=G.player;return p.x+5>d.x&&p.x-5<d.x+16&&p.y>d.y&&p.y-6<d.y+16}
G.toggleDoor=function(d,remote){d.open=!d.open;if(d.pair)d.pair.open=d.open;emit('door',{id:d.id,open:d.open})};
const hash=(s)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return((h>>>0)%10000)/10000};
G.interact=function(it){const p=G.player;
switch(it.kind){
case 'door':{const d=it.door;if(d.locked){if(d.kind==='locked'){if(G.inv.keycard>0){G.inv.keycard--;d.locked=false;if(d.pair)d.pair.locked=false;G.toast('Keycard accepted. The vault door unlocks.');return}G.dialog={title:'Vault Door',text:'Sealed. The panel wants a facility keycard. Sentry drones inside carry them.'}}
else G.dialog={title:'Emergency Exit',text:G.inside===d.bid?'The bolts are thrown. A sticker reads: RELEASE FROM CONTROL ROOM.':'Locked from the inside. There has to be a release somewhere in there.'};return}
if(d.open&&(overlapsPlayer(d)||(d.pair&&overlapsPlayer(d.pair)))){G.toast('Something is in the way.');return}G.toggleDoor(d);return}
case 'note':case 'terminal':{const n=D.NOTES[it.note];if(!n)return;G.dialog={title:n.title,text:n.text};if(!G.read[it.id]){G.read[it.id]=true;G.addXP(3)}return}
case 'loot':{if(G.opened[it.id])return;G.opened[it.id]=true;emit('open',{id:it.id});const c=Math.round(it.coins*G.st.loot);G.run.coins+=c;G.addXP(it.secret?20:2);G.text(p.x,p.y-26,'+'+c,'#f2c040');
const t=it.tier||1,h=hash(it.id+'#'+(W.seed||0));
if(h<.2+.04*t)giveItem('ammo');else if(h<.38+.03*t)giveItem('bandage');else if(h<.46+.04*t)giveItem('medkit');else if(h<.5+.02*t)giveItem('stim');
if(it.chest&&hash(it.id+'v')<.35)giveItem('medkit');
G.toast('Found '+c+' coins');return}
case 'dig':{if(G.opened[it.id])return;G.opened[it.id]=true;emit('open',{id:it.id});const c=Math.round(it.coins*G.st.loot);G.run.coins+=c;G.addXP(6);G.toast('You dug up '+c+' coins');return}
case 'release':{if(!G.flags.release){G.flags.release=true;W.doors.forEach(d=>{if(d.kind==='exit')d.locked=false});G.addXP(30);G.toast('Emergency exit unlocked');G.dialog={title:D.NOTES.fac_ctrl.title,text:D.NOTES.fac_ctrl.text}}else G.dialog={title:D.NOTES.fac_ctrl_done.title,text:D.NOTES.fac_ctrl_done.text};return}
case 'npc':{const n=W.npcs.find(q=>q.id===it.id);G.dialog={title:n.name,lines:n.lines,idx:0,text:''};return}}};
G.nearestUndiscovered=function(){const p=G.player;let best=null,bd=1e9;for(const s of W.sites){if(s.safe||s.sub||G.discovered[s.id]||s.secret)continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<bd){bd=d;best=s}}return best?{s:best,d:bd}:null};
G.nearestExtract=function(){const p=G.player;let best=null,bd=1e9;for(const z of W.extracts){const d=Math.hypot(z.x-p.x,z.y-p.y);if(d<bd){bd=d;best=z}}return{z:best,d:bd}};
G.objective=function(){const m=d=>Math.round(d/8)+' m';if(G.run.coins>=40){const e=G.nearestExtract();return 'Extract with '+G.run.coins+' coins. Nearest dock: '+e.z.name+', '+m(e.d)}const n=G.nearestUndiscovered();if(n)return 'Find loot. Nearest unexplored: '+n.s.name+', '+m(n.d);return 'Everything marked is explored. Hunt secrets or extract.'};
};
})();

(function(){
const CI=globalThis.CI,U=CI.U,D=CI.D,T=D.T,SP=CI.Sprites,M=CI.Meta;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// ====================== HUD + maps (one per run) ======================
CI.HUD=function(W,G){
const ui=this;
const base=U.mkCanvas(W.GW,W.GW),bx=base.getContext('2d'),img=bx.createImageData(W.GW,W.GW);
const hexs=D.REGIONS.map(r=>{const h=r.map;return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]});
for(let i=0;i<W.GW*W.GW;i++){const t=W.ter[i],n=U.hash(i%W.GW,(i/W.GW)|0,3);let c;
if(t===T.DEEP)c=[16,70,112];else if(t===T.WATER)c=[26,100,150];else if(t===T.SHALLOW)c=[60,150,180];
else if(t===T.LAVA)c=[255,120,40];else if(t===T.ICE)c=[170,215,240];else if(t===T.ROAD||t===T.CONC)c=[70,74,84];
else if(t===T.PLANK)c=[130,92,56];else if(t===T.CLIFF)c=[88,84,88];
else if(W.inn[i]){c=W.SOL[i]?[44,40,48]:[120,104,92]}
else{const r=hexs[W.reg[i]]||hexs[1];c=t===T.DIRT?[r[0]*.8+30,r[1]*.7+20,r[2]*.6+10]:t===T.SAND||t===T.WETSAND?[226,206,150]:r.slice();const s=.9+n*.2;c=[c[0]*s,c[1]*s,c[2]*s]}
img.data[i*4]=c[0];img.data[i*4+1]=c[1];img.data[i*4+2]=c[2];img.data[i*4+3]=255}
bx.putImageData(img,0,0);
const mask=U.mkCanvas(W.GW,W.GW),mx=mask.getContext('2d'),exp=U.mkCanvas(W.GW,W.GW),ex=exp.getContext('2d');
let lastP=null;const reveal=(cx,cy,r)=>{mx.fillStyle='#fff';mx.beginPath();mx.arc(cx+.5,cy+.5,r,0,7);mx.fill()};
ui.updateFog=()=>{const p=G.player,cx=Math.floor(p.x/16),cy=Math.floor(p.y/16);if(lastP===cx+','+cy&&!G.fogPoi)return;lastP=cx+','+cy;G.fogPoi=false;reveal(cx,cy,17);
ex.globalCompositeOperation='source-over';ex.clearRect(0,0,W.GW,W.GW);ex.drawImage(base,0,0);ex.globalCompositeOperation='destination-in';ex.drawImage(mask,0,0);ex.globalCompositeOperation='source-over'};
const cen=D.REGIONS.map(()=>[0,0,0]);for(let i=0;i<W.GW*W.GW;i++){const r=W.reg[i];if(r>0&&!W.inn[i]){cen[r][0]+=i%W.GW;cen[r][1]+=(i/W.GW)|0;cen[r][2]++}}
const mm=$('mm'),mc=mm.getContext('2d');
const drawMap=(c,size,ox,oy,span,full)=>{const s=size/span;c.imageSmoothingEnabled=false;c.fillStyle='#07131c';c.fillRect(0,0,size,size);c.drawImage(exp,ox,oy,span,span,0,0,size,size);
const p=G.player,px=(p.x/16-ox)*s,py=(p.y/16-oy)*s;
for(const o of W.pois){if(!G.discovered[o.id])continue;const x=(o.x/16-ox)*s,y=(o.y/16-oy)*s;if(x<0||y<0||x>size||y>size)continue;const k=full?4:2;c.fillStyle='#05101a';c.fillRect(x-k-1,y-k-1,2*k+2,2*k+2);c.fillStyle=o.secret?'#3fd0c0':'#ffb067';c.fillRect(x-k,y-k,2*k,2*k)}
for(const z of W.extracts){const x=(z.x/16-ox)*s,y=(z.y/16-oy)*s;if(x<0||y<0||x>size||y>size)continue;const k=full?5:3;c.fillStyle='#05101a';c.fillRect(x-k-1,y-k-1,2*k+2,2*k+2);c.fillStyle='#a0fff0';c.fillRect(x-k,y-k,2*k,2*k)}
if(G.peers)for(const q of G.peers){const x=(q.x/16-ox)*s,y=(q.y/16-oy)*s;if(x<0||y<0||x>size||y>size)continue;c.fillStyle='#7ee8d8';c.fillRect(x-2,y-2,5,5)}
if(full){c.font='600 13px "Pixelify Sans",monospace';c.textAlign='center';for(let r=1;r<=6;r++){if(!G.regionsSeen[r]||!cen[r][2])continue;const x=cen[r][0]/cen[r][2]*s,y=cen[r][1]/cen[r][2]*s;const nm=D.REGIONS[r].name.toUpperCase();c.lineWidth=4;c.strokeStyle='rgba(5,16,26,.85)';c.strokeText(nm,x,y);c.fillStyle='#f1e3bd';c.fillText(nm,x,y)}}
const bl=(G.time*3|0)%2;c.fillStyle='#05101a';c.fillRect(px-4,py-4,8,8);c.fillStyle=bl||full?'#ff4a3a':'#ffd0c8';c.fillRect(px-3,py-3,6,6);
if(!full){c.strokeStyle='#2c5666';c.lineWidth=2;c.strokeRect(1,1,size-2,size-2)}};
ui.hideMM=false;
ui.drawMinimap=()=>{if(ui.hideMM)return;const span=80,p=G.player;const ox=U.clamp(p.x/16-span/2,0,W.GW-span),oy=U.clamp(p.y/16-span/2,0,W.GW-span);drawMap(mc,152,ox,oy,span,false)};
const bm=$('bigmap'),bc=bm.getContext('2d');ui.drawBigMap=()=>drawMap(bc,500,0,0,W.GW,true);
ui.buildLegend=()=>{let h='<h3>THE ISLAND</h3>';for(let r=1;r<=6;r++){const seen=G.regionsSeen[r];h+=`<div class="lg ${seen?'':'off'}"><i class="sw" style="background:${D.REGIONS[r].map}"></i>${seen?D.REGIONS[r].name:'Undiscovered'}</div>`}
const sec=W.pois.filter(o=>o.secret),f=sec.filter(o=>G.discovered[o.id]).length,pl=W.pois.filter(o=>!o.secret&&o.site&&!(W.sites.find(s=>s.id===o.site)||{}).safe),pf=pl.filter(o=>G.discovered[o.id]).length;
h+=`<div class="lg"><i class="sw" style="background:#ffb067"></i>Sites ${pf}/${pl.length}</div><div class="lg"><i class="sw" style="background:#3fd0c0"></i>Secrets ${f}/${sec.length}</div><div class="lg"><i class="sw" style="background:#a0fff0"></i>Extraction docks</div><div class="lg"><i class="sw" style="background:#ff4a3a"></i>You</div><div style="color:var(--dim);font-size:12px;margin-top:4px">Seed <b>${W.seed}</b>. Press <kbd>M</kbd> to close.</div>`;$('legend').innerHTML=h};
// hud
const fmt=U.fmtTime;let lastObj='',hb='';
const hotbar=$('hotbar');
function slotHTML(){return''}
ui.hud=()=>{const p=G.player;
$('hp').lastChild.firstChild.style.width=Math.max(0,p.hp/p.max*100)+'%';$('ar').lastChild.firstChild.style.width=Math.min(100,p.armor/60*100)+'%';$('en').lastChild.firstChild.style.width=p.en+'%';
$('runcoins').textContent=G.run.coins+' loot';$('kills').textContent=G.run.kills+' kills';
const o=G.objective();if(o!==lastObj){lastObj=o;$('objt').textContent=o}
const rn=D.REGIONS[G.region].name;if($('regn').textContent!==rn)$('regn').textContent=rn;const ln=G.locName===rn?'':G.locName;if($('locn').textContent!==ln)$('locn').textContent=ln;
$('clock').textContent=fmt(G.time);
const pr=$('prompt');if(G.prompt&&!G.dialog){pr.classList.remove('hidden');$('promptt').textContent=G.prompt.label}else pr.classList.add('hidden');
const dl=$('dialog');if(G.dialog){dl.classList.remove('hidden');const d=G.dialog;$('dlgt').textContent=d.title;$('dlgp').textContent=d.lines?d.lines[d.idx]:d.text}else dl.classList.add('hidden');
const ex=$('exbar');if(G.extractZone&&!G.over){ex.classList.remove('hidden');$('ext').textContent=G.run.coins>0?'EXTRACTING WITH '+G.run.coins+' LOOT. HOLD STILL':'EXTRACTING. HOLD STILL';$('exfill').style.width=(G.extractP*100)+'%'}else ex.classList.add('hidden');
const w=M.WEAPONS[G.weapon]||M.WEAPONS.fists;const key=[G.weapon,G.ammo,G.inv.medkit,G.inv.bandage,G.inv.stim,G.inv.keycard].join();
if(key!==hb){hb=key;hotbar.innerHTML='';const mk=(label,icon,count,k)=>{const d=document.createElement('div');d.className='slot px'+(count===0?' empty':'');const cv=document.createElement('canvas');cv.width=8;cv.height=8;if(icon){cv.getContext('2d').drawImage(SP.itemIcon(icon).cv,0,0)}d.appendChild(cv);d.insertAdjacentHTML('beforeend',`<b>${k}</b><i>${count}</i>`);hotbar.appendChild(d)};
const wd=document.createElement('div');wd.className='slot wp px';wd.innerHTML=`<span>${esc(w.name)}</span><span style="color:var(--dim);font-size:11px">${w.ranged?G.ammo+' rounds':G.ammo?G.ammo+' ammo':''}</span>`;hotbar.appendChild(wd);
mk('','medkit',G.inv.medkit,'1');mk('','bandage',G.inv.bandage,'2');mk('','stim',G.inv.stim,'3');if(G.inv.keycard)mk('','keycard',G.inv.keycard,'K')}
const bn=G.banners[0],be=$('banner');if(bn){if(be._o!==bn){be._o=bn;be.className=bn.k==='secret'?'secret':'';be.style.animation='none';void be.offsetWidth;be.style.animation='';be.innerHTML=`<small>${bn.k==='region'?'ENTERING':esc(bn.a)}</small><h2>${esc(bn.k==='region'?bn.a:bn.b)}</h2><p>${bn.k==='region'?esc(bn.b):''}</p>`}be.classList.remove('hidden')}else{be.classList.add('hidden');be._o=null}
const tc=$('toasts');for(const t of G.toasts){if(!t.el){t.el=document.createElement('div');t.el.className='toast px';t.el.textContent=t.m;tc.appendChild(t.el)}}
for(const c of Array.from(tc.children)){if(!G.toasts.some(t=>t.el===c))c.remove()}};
ui.clear=()=>{$('toasts').innerHTML='';const b=$('banner');b._o=null;b.classList.add('hidden');hotbar.innerHTML='';hb=''};
ui.show=(menu,hud,map,pause)=>{$('menu').classList.toggle('hidden',!menu);$('hud').classList.toggle('hidden',!hud);$('mapov').classList.toggle('hidden',!map);$('pause').classList.toggle('hidden',!pause)};
};
// ====================== Menus ======================
CI.Menu=function(ctx){
const mn=this,prof=ctx.prof,save=()=>{M.Save.write(prof);refreshProfile()};
const sheet=$('sheet'),card=$('card');
mn.settings={particles:true,minimap:true,zoom:0};
try{const s=JSON.parse(localStorage.getItem('ci_set')||'null');if(s)Object.assign(mn.settings,s)}catch(e){}
mn.pack=prof.pack||null;
function refreshProfile(){const r=M.rank(prof.stats.xp);const mnm=$('mname');if(mnm&&document.activeElement!==mnm)mnm.value=prof.name==='Survivor'?'':prof.name;$('prk').textContent=prof.name+'  Rank '+r.lv;$('pbk').textContent=prof.bank+' coins';$('psv').textContent='Progress saved in this browser only'}
mn.refresh=refreshProfile;
{const nm=$('mname');if(nm){nm.value=prof.name==='Survivor'?'':prof.name;nm.oninput=()=>{const v=nm.value.replace(/[^A-Za-z0-9 _-]/g,'').slice(0,14);if(v!==nm.value)nm.value=v;prof.name=v.trim()||'Survivor';M.Save.write(prof);refreshProfile()}}}
mn.close=()=>{sheet.classList.add('hidden');card.innerHTML='';card.classList.remove('wide');mn.cur=null;if(mn.afterClose){const f=mn.afterClose;mn.afterClose=null;f()}};
mn.open=(name,arg)=>{mn.cur=name;card.classList.toggle('wide',name==='shop'||name==='prep'||name==='lobby'||name==='locker');SCREENS[name](arg);sheet.classList.remove('hidden');const b=card.querySelector('.main');if(b&&document.activeElement===document.body)b.focus({preventScroll:true})};
const btn=(id,cls,label,fn)=>`<button class="${cls}" data-act="${id}">${label}</button>`;
const bindActs=(map)=>{card.querySelectorAll('[data-act]').forEach(b=>{b.onclick=()=>{const f=map[b.dataset.act];if(f)f(b.dataset)}})};
function drawPrev(cv,o){const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);const s=CI.sheetFor(Object.assign({pack:'#7a5a34'},o));c.drawImage(s.cv,0,0,16,26,cv.width/2-32,cv.height-104+2,64,104)}
const autoPack=()=>{const o={bandage:Math.min(2,prof.stash.bandage||0),medkit:Math.min(1,prof.stash.medkit||0),stim:0,ammo:0,vest:0};if(prof.weapon==='pistol')o.ammo=Math.min(1,prof.stash.ammo||0);if((prof.stash.vest||0)>0)o.vest=1;return o};
const packTotal=p=>Object.keys(p).reduce((a,k)=>a+(p[k]||0),0);
function validPack(){const p=mn.pack||autoPack();const o={};for(const k of M.SHOP_ITEMS)o[k]=Math.max(0,Math.min(p[k]||0,prof.stash[k]||0));return o}
mn.getLoadout=()=>({items:validPack(),weapon:prof.weapon});
mn.takeLoadout=()=>{const lo=mn.getLoadout();for(const k in lo.items)prof.stash[k]-=lo.items[k];mn.pack=null;save();return lo};
const SCREENS={
prep(arg){const mp=arg&&arg.mp;const pk=validPack();mn.pack=pk;const st=M.stats(prof);const cls=M.CLASSES[prof.cls];
card.innerHTML=`<h2>${mp?'LOADOUT':'PREPARE RAID'}</h2><div class="tabs">${prof.classes.map(c=>`<button class="tab ${c===prof.cls?'on':''}" data-act="cls" data-c="${c}">${M.CLASSES[c].name}</button>`).join('')}</div>
<p>${esc(cls.desc)}<br><span class="dim">HP ${Math.round(st.hp)} / Speed ${Math.round(st.spd*100)}% / Melee ${Math.round(st.dmg*100)}% / Ranged ${Math.round(st.rdmg*100)}%</span></p>
<div class="tabs">${prof.weapons.map(w=>`<button class="tab ${w===prof.weapon?'on':''}" data-act="wp" data-w="${w}">${M.WEAPONS[w].name}</button>`).join('')}</div>
<p class="dim">${esc(M.WEAPONS[prof.weapon].desc)} Damage ${M.WEAPONS[prof.weapon].dmg}.</p>
<h2 style="font-size:15px">BACKPACK <span class="dim" id="pk">${packTotal(pk)}/8</span></h2>
<div class="grid">${M.SHOP_ITEMS.map(k=>`<div class="it"><div class="row"><h4>${M.ITEMS[k].name}</h4><span class="dim">stash ${prof.stash[k]||0}</span></div><p>${M.ITEMS[k].desc}</p><div class="row"><button class="sm" data-act="dec" data-k="${k}">-</button><b id="n_${k}">${pk[k]||0}</b><button class="sm" data-act="inc" data-k="${k}">+</button></div></div>`).join('')}</div>
<p class="warn">Everything in the backpack is lost if you die. Buy more in the Shop.</p>
${mp?'':`<div class="opt"><span>World seed (optional)</span><input class="tx" id="seed" maxlength="10" placeholder="random" style="width:140px"></div>`}
<div class="btns" style="width:100%;flex-direction:row;flex-wrap:wrap">${mp?btn('done','btn main','Save Loadout'):btn('go','btn main','Deploy to Island')}${btn('close','btn','Back')}</div>`;
const upd=()=>{$('pk').textContent=packTotal(mn.pack)+'/8';M.SHOP_ITEMS.forEach(k=>{$('n_'+k).textContent=mn.pack[k]||0})};
bindActs({cls:d=>{prof.cls=d.c;save();mn.pack=null;SCREENS.prep(arg)},wp:d=>{prof.weapon=d.w;save();SCREENS.prep(arg)},
inc:d=>{if((mn.pack[d.k]||0)<(prof.stash[d.k]||0)&&packTotal(mn.pack)<8){mn.pack[d.k]=(mn.pack[d.k]||0)+1;upd()}},dec:d=>{if((mn.pack[d.k]||0)>0){mn.pack[d.k]--;upd()}},
go:()=>{const sd=$('seed').value.trim();let seed=0;if(sd){seed=/^\d+$/.test(sd)?(+sd>>>0):[...sd].reduce((a,c)=>(Math.imul(a,31)+c.charCodeAt(0))>>>0,7)}else seed=(Math.random()*4294967295)>>>0;prof.pack=null;const lo=mn.takeLoadout();mn.close();ctx.deploy({seed:seed||1,loadout:lo,mp:false})},
done:()=>{prof.pack=mn.pack;save();mn.close()},close:()=>mn.close()})},
shop(arg){const tab=(arg&&arg.tab)||'gear';
const tabs=['gear','weapons','classes','skins'].map(t=>`<button class="tab ${t===tab?'on':''}" data-act="tab" data-t="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('');
let body='';
if(tab==='gear')body=`<p class="dim">Single-raid supplies. Carry them in, use them, or lose them if you fall.</p><div class="grid">${M.SHOP_ITEMS.map(k=>{const it=M.ITEMS[k];return`<div class="it"><div class="row"><h4>${it.name}</h4><span class="price">${it.price}</span></div><p>${it.desc}</p><div class="row"><span class="own">In stash: ${prof.stash[k]||0}</span><button class="sm buy" data-act="buy" data-k="${k}" ${prof.bank<it.price?'disabled':''}>Buy</button></div></div>`}).join('')}</div>`;
else if(tab==='weapons')body=`<p class="dim">Weapons are permanent. Pick one in your loadout before each raid.</p><div class="grid">${Object.keys(M.WEAPONS).filter(k=>k!=='fists').map(k=>{const w=M.WEAPONS[k],own=prof.weapons.includes(k);return`<div class="it"><div class="row"><h4>${w.name}</h4>${own?'<span class="own">Owned</span>':`<span class="price">${w.price}</span>`}</div><p>${w.desc}</p><p>Damage ${w.dmg} / ${w.ranged?'ranged':'melee'}</p>${own?'':`<button class="sm buy" data-act="buyw" data-k="${k}" ${prof.bank<w.price?'disabled':''}>Buy</button>`}</div>`}).join('')}</div>`;
else if(tab==='classes')body=`<p class="dim">Buy classes, then upgrade each class separately. Upgrades are permanent.</p><div class="grid">${Object.keys(M.CLASSES).map(k=>{const c=M.CLASSES[k],own=prof.classes.includes(k),u=prof.up[k]||{vit:0,pow:0,agi:0};
return`<div class="it" style="border-color:${c.color}"><div class="row"><h4 style="color:${c.color}">${c.name}</h4>${own?'<span class="own">Owned</span>':`<span class="price">${c.price}</span>`}</div><p>${c.desc}</p>
${own?Object.keys(M.TRACKS).map(t=>{const lv=u[t];return`<div class="row"><span style="font-size:12px" title="${M.TRACKS[t].desc}">${M.TRACKS[t].name}</span><span class="pips">${Array.from({length:M.MAXLV},(_,i)=>`<i class="pip ${i<lv?'on':''}"></i>`).join('')}</span>${lv>=M.MAXLV?'<span class="own">MAX</span>':`<button class="sm buy" data-act="up" data-k="${k}" data-t="${t}" ${prof.bank<M.upCost(lv)?'disabled':''}>${M.upCost(lv)}</button>`}</div>`}).join(''):`<button class="sm buy" data-act="buyc" data-k="${k}" ${prof.bank<c.price?'disabled':''}>Buy class</button>`}</div>`}).join('')}</div>`;
else body=`<p class="dim">Outfits are cosmetic only. They never change stats.</p><div class="grid">${M.SKINS.map(s=>{const own=prof.skins.includes(s.id);return`<div class="it" style="border-color:${M.RAR[s.rar]}"><div class="row"><h4>${s.name}</h4>${own?'<span class="own">'+(prof.skin===s.id?'Equipped':'Owned')+'</span>':`<span class="price">${s.price}</span>`}</div><span class="rarity" style="color:${M.RAR[s.rar]}">${s.rar}</span><canvas class="pv" width="64" height="104" data-skin="${s.id}"></canvas>${own?(prof.skin===s.id?'':`<button class="sm" data-act="eq" data-k="${s.id}">Equip</button>`):`<button class="sm buy" data-act="buys" data-k="${s.id}" ${prof.bank<s.price?'disabled':''}>Buy</button>`}</div>`}).join('')}</div>`;
card.innerHTML=`<div class="row2"><h2>SHOP</h2><span class="price" style="font-size:18px">${prof.bank} coins</span></div><div class="tabs">${tabs}</div>${body}<div class="btns" style="width:100%">${btn('close','btn','Back')}</div>`;
card.querySelectorAll('canvas[data-skin]').forEach(cv=>{const s=M.SKINS.find(x=>x.id===cv.dataset.skin);drawPrev(cv,Object.assign({skin:prof.look.skin,hair:prof.look.hair,style:prof.look.style},s.o))});
const re=()=>{save();SCREENS.shop({tab})};
bindActs({tab:d=>SCREENS.shop({tab:d.t}),close:()=>mn.close(),
buy:d=>{const it=M.ITEMS[d.k];if(prof.bank>=it.price){prof.bank-=it.price;prof.stash[d.k]=(prof.stash[d.k]||0)+1;re()}},
buyw:d=>{const w=M.WEAPONS[d.k];if(prof.bank>=w.price&&!prof.weapons.includes(d.k)){prof.bank-=w.price;prof.weapons.push(d.k);re()}},
buyc:d=>{const c=M.CLASSES[d.k];if(prof.bank>=c.price&&!prof.classes.includes(d.k)){prof.bank-=c.price;prof.classes.push(d.k);prof.up[d.k]={vit:0,pow:0,agi:0};re()}},
up:d=>{const u=prof.up[d.k],lv=u[d.t],c=M.upCost(lv);if(lv<M.MAXLV&&prof.bank>=c){prof.bank-=c;u[d.t]++;re()}},
buys:d=>{const s=M.SKINS.find(x=>x.id===d.k);if(prof.bank>=s.price&&!prof.skins.includes(s.id)){prof.bank-=s.price;prof.skins.push(s.id);prof.skin=s.id;re()}},
eq:d=>{prof.skin=d.k;re()}})},
locker(){const L=prof.look;const row=(k,name,n)=>`<div class="opt"><span>${name}</span><span class="cyc"><button class="sm" data-act="cy" data-k="${k}" data-d="-1">&lsaquo;</button><span style="min-width:36px;text-align:center">${k==='style'?(L.style?'Long':'Short'):L[k]+1}</span><button class="sm" data-act="cy" data-k="${k}" data-d="1">&rsaquo;</button></span></div>`;
card.innerHTML=`<h2>LOCKER</h2><div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start"><canvas class="pv" id="lp" width="64" height="104"></canvas><div style="flex:1;min-width:200px;display:flex;flex-direction:column;gap:10px">
<div class="opt"><span>Name</span><input class="tx" id="nm" maxlength="14" value="${esc(prof.name)}" style="width:150px"></div>${row('skin','Skin tone')}${row('hair','Hair color')}${row('style','Hair style')}</div></div>
<div class="grid">${prof.skins.map(id=>{const s=M.SKINS.find(x=>x.id===id);return`<button class="tab ${id===prof.skin?'on':''}" data-act="eq" data-k="${id}" style="text-align:left">${s.name}<br><span class="rarity" style="color:${id===prof.skin?'#06211e':M.RAR[s.rar]}">${s.rar}</span></button>`}).join('')}</div>
<div class="btns" style="width:100%">${btn('close','btn main','Done')}</div>`;
drawPrev($('lp'),M.outfit(prof));
$('nm').oninput=e=>{prof.name=e.target.value.replace(/[^A-Za-z0-9 _-]/g,'').slice(0,14)||'Survivor';save()};
bindActs({cy:d=>{const tot={skin:4,hair:6,style:2}[d.k];L[d.k]=(L[d.k]+ +d.d+tot)%tot;save();SCREENS.locker()},eq:d=>{prof.skin=d.k;save();SCREENS.locker()},close:()=>mn.close()})},
set(){const S=mn.settings;card.innerHTML=`<h2>SETTINGS</h2><div class="opt"><span>Ambient particles</span><button class="sm ${S.particles?'on':''}" data-act="p">${S.particles?'On':'Off'}</button></div><div class="opt"><span>Minimap</span><button class="sm ${S.minimap?'on':''}" data-act="m">${S.minimap?'On':'Off'}</button></div><div class="opt"><span>Pixel zoom</span><span class="cyc">${['Auto',2,3,4].map(z=>`<button class="sm ${S.zoom===(z==='Auto'?0:z)?'on':''}" data-act="z" data-z="${z==='Auto'?0:z}">${z}</button>`).join('')}</span></div><div class="btns" style="width:100%">${btn('close','btn main','Done')}</div>`;
const ap=()=>{try{localStorage.setItem('ci_set',JSON.stringify(S))}catch(e){}ctx.settings(S);SCREENS.set()};
bindActs({p:()=>{S.particles=!S.particles;ap()},m:()=>{S.minimap=!S.minimap;ap()},z:d=>{S.zoom=+d.z;ap()},close:()=>mn.close()})},
cred(){card.innerHTML=`<h2>ABOUT CHAOS ISLAND</h2><p>A top-down raid and extract game. Every deployment generates a new, huge island from a seed. Loot abandoned camps, cabins, towns and bunkers, fight what lives there, and get to a dock before you fall.</p><p class="dim">Loot only counts once you extract. Coins you bank buy supplies, weapons, classes, upgrades and outfits.</p><p class="dim">Multiplayer is peer-to-peer: the lobby creator is the host and everyone connects straight to them, so the host needs to keep the tab open. Enemies are simulated on each player's own machine, so they can look slightly different between players. Progress is saved in this browser.</p><p class="dim">All art is drawn by code. Names and lore are original.</p><div class="btns" style="width:100%">${btn('close','btn main','Close')}</div>`;bindActs({close:()=>mn.close()})},
lobby(){const N=CI.Net;const inLobby=!!N.code;
if(!N.ok){card.innerHTML=`<h2>MULTIPLAYER LOBBIES</h2><p>The multiplayer library (peerjs.min.js) did not load. Check that the file is in the same folder as index.html and that you are online.</p><p class="dim">Solo raids still work everywhere.</p><div class="btns" style="width:100%">${btn('close','btn main','Back')}</div>`;bindActs({close:()=>mn.close()});return}
const info=()=>({name:prof.name,cls:M.CLASSES[prof.cls].name,outfit:M.outfit(prof)});
if(!inLobby){
card.innerHTML=`<h2>MULTIPLAYER LOBBIES</h2><p class="dim">Status: ${N.status()}. Create a lobby and send the 4-letter code to your friends, or type a friend's code below. Up to 6 players share one seeded island, see each other, and share kills, opened containers and doors. Everyone extracts and banks on their own.</p>
<div class="opt"><span>Username</span><input class="tx" id="lnm" maxlength="14" placeholder="Pick a username" value="${esc(prof.name==='Survivor'?'':prof.name)}" style="width:170px"></div>
<div class="btns" style="width:100%;flex-direction:row;flex-wrap:wrap">${btn('create','btn main','Create Lobby')}</div>
<div class="opt"><input class="tx" id="jc" maxlength="4" placeholder="CODE" style="width:110px;text-transform:uppercase">${btn('joinc','sm buy','Join by code')}</div>
<p class="warn" id="lerr">${esc(N.err||'')}</p><div class="btns" style="width:100%;flex-direction:row;flex-wrap:wrap">${btn('test','btn','Test connection')}${btn('close','btn','Back')}</div>`;
const lnm=$('lnm');lnm.oninput=()=>{const v=lnm.value.replace(/[^A-Za-z0-9 _-]/g,'').slice(0,14);if(v!==lnm.value)lnm.value=v;prof.name=v.trim()||'Survivor';M.Save.write(prof);refreshProfile()};
const go=async(fn)=>{if(N.busy)return;N.busy=true;N.err='';try{await fn()}catch(e){N.err=e.message||'Something went wrong.'}N.busy=false;if(mn.cur==='lobby')SCREENS.lobby()};
bindActs({test:async()=>{if(N.busy)return;N.busy=true;const e=$('lerr');e.textContent='Testing connection to the matchmaking server...';const r=await N.test();N.busy=false;const e2=$('lerr');if(e2)e2.textContent=r.msg},create:()=>go(async()=>{await N.create(info())}),joinc:()=>go(async()=>{const r=await N.join($('jc').value,info());if(r.running)ctx.startMP(N.seed)}),close:()=>mn.close()});
N.onChange=()=>{if(mn.cur==='lobby'&&!N.busy&&!document.activeElement.matches('input'))SCREENS.lobby()};return}
const pl=N.players();
card.innerHTML=`<h2>LOBBY ${esc(N.code)}</h2><p>Share this code with friends: <b style="font-size:22px;letter-spacing:.2em;color:var(--teal)">${esc(N.code)}</b><br><span class="dim">Island seed ${N.seed}. ${N.host?'You are the host.':'Waiting for the host to deploy.'}</span></p>
<div class="plist">${pl.map(p=>`<div class="pl"><span>${esc(p.name)}${p.me?' (you)':''}${p.host?' <span class="dim">host</span>':''}</span><span class="dim">${esc(p.cls)} / ${p.st==='run'?'in raid':'in lobby'}</span></div>`).join('')}</div>
<p class="dim">You deploy with your current class, weapon and backpack.</p>
<div class="btns" style="width:100%;flex-direction:row;flex-wrap:wrap">${N.host?btn('start','btn main','Deploy Everyone'):btn('join','btn main','Join Raid Now')}${btn('pack','btn','Loadout')}${btn('leave','btn','Leave Lobby')}</div><p class="warn" id="lerr">${esc(N.err||'')}</p>`;
bindActs({start:()=>{N.start();ctx.startMP(N.seed)},join:()=>ctx.startMP(N.seed),pack:()=>{mn.afterClose=()=>mn.open('lobby');mn.open('prep',{mp:true})},leave:async()=>{await N.leave();SCREENS.lobby()}});
N.onChange=()=>{if(mn.cur==='lobby'&&!N.busy)SCREENS.lobby()}}};
$('bDeploy').onclick=()=>mn.open('prep');$('bShop').onclick=()=>mn.open('shop');$('bLocker').onclick=()=>mn.open('locker');$('bSet').onclick=()=>mn.open('set');$('bCred').onclick=()=>mn.open('cred');$('bLobby').onclick=()=>mn.open('lobby');
mn.openSettings=()=>mn.open('set');
refreshProfile();
};
})();

(function(){
if(typeof document==='undefined')return;
const CI=globalThis.CI,U=CI.U,D=CI.D,M=CI.Meta,Net=CI.Net;
const $=id=>document.getElementById(id);
const cv=$('game');
let W,R,G=null,hud=null,menu=null,prof=null,mode='boot',last=performance.now(),cam={x:0,y:0},frame=0,timeAcc=0,tourT=0,tour=[],menuW=null,resultShown=false,inRunMP=false,netT=0,peerT=0;
const settings={particles:true,minimap:true,zoom:0};
const layer=(m,h,mp,p)=>{$('menu').classList.toggle('hidden',!m);$('hud').classList.toggle('hidden',!h);$('mapov').classList.toggle('hidden',!mp);$('pause').classList.toggle('hidden',!p)};
function setWorld(seed){W=CI.generate(seed);R=new CI.Renderer(W,cv);R.noParticles=!settings.particles;R.zoomPref=settings.zoom;resize()}
function resize(){if(!R)return;const r=cv.getBoundingClientRect();R.resize(Math.max(320,Math.round(r.width)),Math.max(240,Math.round(r.height)))}
addEventListener('resize',resize);
const KM={w:'w',a:'a',s:'s',d:'d',arrowup:'up',arrowdown:'down',arrowleft:'left',arrowright:'right',shift:'shift',e:'e',' ':'space',enter:'enter',m:'m',escape:'escape',p:'escape',j:'j',q:'q','1':'1','2':'2','3':'3'};
const inp={down:{},pressed:{},aim:null,aimFresh:false};let aimT=0;
addEventListener('keydown',ev=>{if(ev.target&&ev.target.tagName==='INPUT'){if(ev.key==='Escape')ev.target.blur();return}
const k=KM[ev.key.toLowerCase()];if(!k)return;const tag=ev.target&&ev.target.tagName;if((k==='space'||k==='enter')&&tag==='BUTTON'&&mode!=='play')return;
if(mode==='play'||k.startsWith('arrow')||k==='space')ev.preventDefault();
if(!ev.repeat&&!inp.down[k])inp.pressed[k]=true;inp.down[k]=true});
addEventListener('keyup',ev=>{const k=KM[ev.key.toLowerCase()];if(k)inp.down[k]=false});
addEventListener('blur',()=>{inp.down={}});
cv.addEventListener('mousedown',e=>{if(e.button===0){inp.down.mouse=true;mouseTo(e)}else if(e.button===2){inp.pressed.q=true}});addEventListener('mouseup',e=>{if(e.button===0)inp.down.mouse=false});
cv.addEventListener('mousemove',mouseTo);cv.addEventListener('contextmenu',e=>e.preventDefault());
function mouseTo(e){if(!R||mode!=='play')return;const r=cv.getBoundingClientRect();inp.mx=(e.clientX-r.left)/R.zoom;inp.my=(e.clientY-r.top)/R.zoom;aimT=performance.now()}
// ---- menu tour
function buildTour(){const s=menuW.sites.filter(x=>!x.sub);const pts=[[menuW.spawn.x,menuW.spawn.y]];const rest=s.map(x=>[x.x,x.y]);let cur=pts[0];while(rest.length&&pts.length<14){let bi=0,bd=1e9;rest.forEach((p,i)=>{const d=Math.hypot(p[0]-cur[0],p[1]-cur[1])+Math.random()*900;if(d<bd){bd=d;bi=i}});cur=rest.splice(bi,1)[0];pts.push(cur)}tour=pts}
function tourPos(t){let acc=0;const n=tour.length;for(let i=0;i<n*3;i++){const a=tour[i%n],b=tour[(i+1)%n],len=Math.hypot(b[0]-a[0],b[1]-a[1]),dur=Math.max(4,len/80);if(t<acc+dur){const f=(t-acc)/dur,s=f*f*(3-2*f);return[a[0]+(b[0]-a[0])*s,a[1]+(b[1]-a[1])*s]}acc+=dur}tourT=0;return tour[0]}
// ---- runs
function loadingOverlay(on){const sh=$('sheet'),c=$('card');if(on){c.innerHTML='<h2>GENERATING ISLAND...</h2><p class="dim">Placing towns, camps and trouble.</p>';sh.classList.remove('hidden')}else{sh.classList.add('hidden');c.innerHTML=''}}
function startRun(o){loadingOverlay(true);setTimeout(()=>{try{
const seed=o.seed>>>0||1;setWorld(seed);inRunMP=!!o.mp;
G=new CI.Game(W,{prof,loadout:o.loadout,net:o.mp?Net:null});hud=new CI.HUD(W,G);hud.hideMM=!settings.minimap;$('mmwrap').classList.toggle('hidden',!settings.minimap);hud.clear();hud.updateFog();
cam.x=NaN;resultShown=false;mode='play';layer(false,true,false,false);$('mpinfo').classList.toggle('hidden',!o.mp);
prof.stats.runs++;M.Save.write(prof);menu.refresh();
if(o.mp){Net.onEvent=(t,d,m)=>G&&G.remote(t,d,m);Net.markRun();Net.setPos({n:prof.name,o:M.outfit(prof),cls:M.CLASSES[prof.cls].name,st:'run'})}
}catch(e){console.error(e);loadingOverlay(false);mode='menu';layer(true,false,false,false)}loadingOverlay(false)},40)}
function backToMenu(){mode='menu';G=null;hud=null;layer(true,false,false,false);$('mpinfo').classList.add('hidden');$('result').classList.add('hidden');menuW&&(W=menuW,R=new CI.Renderer(W,cv),R.noParticles=!settings.particles,R.zoomPref=settings.zoom,resize());menu.refresh();if(Net.room){Net.room.presence({st:'lobby'}).catch(()=>{});Net.running=false}}
function showResult(){resultShown=true;const r=G.result,st=prof.stats;st.xp+=r.xp;st.kills+=r.kills;const rc=$('rcard');
if(r.type==='extract'){prof.bank+=r.coins;st.extracts++;st.banked+=r.coins;if(r.coins>st.best)st.best=r.coins;for(const k in r.items)if(M.ITEMS[k]&&r.items[k]>0)prof.stash[k]=(prof.stash[k]||0)+r.items[k];
const back=Object.keys(r.items).filter(k=>r.items[k]>0&&M.ITEMS[k]).map(k=>r.items[k]+' '+M.ITEMS[k].name).join(', ')||'nothing';
rc.innerHTML=`<p class="big good">EXTRACTED</p><p>The boat pulls away with <b style="color:var(--gold)">${r.coins} coins</b> of loot, now in your bank.</p><div class="ctl"><span class="dim">Kills</span><span>${r.kills}</span><span class="dim">Sites found</span><span>${r.found||0} (${r.secrets||0} secret)</span><span class="dim">Rank XP</span><span>+${r.xp}</span><span class="dim">Time</span><span>${U.fmtTime(r.time)}</span><span class="dim">Supplies returned</span><span>${back}</span></div><div class="btns" style="width:100%"><button class="btn main" id="rm">Back to Camp</button></div>`}
else{st.deaths++;rc.innerHTML=`<p class="big bad">RAID FAILED</p><p>You went down. <b style="color:var(--red)">${r.lost} coins</b> of loot and everything in your backpack are gone.</p><div class="ctl"><span class="dim">Kills</span><span>${r.kills}</span><span class="dim">Rank XP kept</span><span>+${r.xp}</span><span class="dim">Time</span><span>${U.fmtTime(r.time)}</span></div><div class="btns" style="width:100%"><button class="btn main" id="rm">Back to Camp</button></div>`}
M.Save.write(prof);$('result').classList.remove('hidden');layer(false,false,false,false);$('rm').onclick=backToMenu;$('rm').focus()}
// ---- loop
function loop(now){requestAnimationFrame(loop);if(mode==='boot')return;let dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;timeAcc+=dt;frame++;
let S;
if(mode==='menu'){tourT+=dt;const p=tourPos(tourT);cam.x=U.clamp(p[0]-R.VW/2,0,W.WORLD-R.VW);cam.y=U.clamp(p[1]-R.VH/2,0,W.WORLD-R.VH);
const rg=W.reg[W.cell(p[0],p[1])]||1;R.setAmbient(D.REGIONS[rg].amb,dt);
S={camX:Math.round(cam.x),camY:Math.round(cam.y),time:timeAcc,dt,player:null,npcs:W.npcs,sheets:{player:CI.sheetFor({skin:0,hair:1,shirt:1,style:0}),marlow:CI.sheetFor({skin:1,hair:4,shirt:2,style:0,white:true,pants:'#4a4030',pack:false})},opened:{},region:rg,menu:true,emit:true};R.prefetch(S.camX,S.camY);R.draw(S)}
else if(G){
const sheetOpen=!$('sheet').classList.contains('hidden');
const paused=mode!=='play';
if(inp.pressed.escape&&!G.over){if(mode==='play'&&!sheetOpen){mode='pause';layer(false,true,false,true)}else if(mode==='map'){mode='play';layer(false,true,false,false)}else if(mode==='pause'){if(sheetOpen)menu.close();else{mode='play';layer(false,true,false,false)}}}
else if(inp.pressed.m&&!G.over&&(mode==='play'||mode==='map')){if(mode==='play'){mode='map';hud.buildLegend();layer(false,true,true,false)}else{mode='play';layer(false,true,false,false)}}
inp.aim=null;inp.aimFresh=false;if(R&&inp.mx!==undefined&&performance.now()-aimT<4000){inp.aim={x:cam.x+inp.mx,y:cam.y+inp.my};inp.aimFresh=true}
if(mode==='play'){G.update(dt,inp);hud.updateFog();
if(inRunMP){netT+=dt;peerT+=dt;if(netT>.1){netT=0;const p=G.player;Net.setPos({x:Math.round(p.x),y:Math.round(p.y),d:p.dir,f:p.frame,hp:Math.round(p.hp)})}if(peerT>.08){peerT=0;G.peers=Net.remotePlayers();const n=G.peers.length+1;$('mpinfo').textContent='Lobby '+(Net.code||'')+': '+n+' raider'+(n>1?'s':'')}}}
if(G.over&&!resultShown)showResult();
const p=G.player;const tx=p.x-R.VW/2,ty=p.y-12-R.VH/2;
if(Number.isNaN(cam.x)){cam.x=tx;cam.y=ty}else{const k=1-Math.pow(.0005,dt);cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k}
cam.x=U.clamp(cam.x,-40,W.WORLD-R.VW+40);cam.y=U.clamp(cam.y,-40,W.WORLD-R.VH+40);
R.setAmbient(D.REGIONS[G.region].amb,dt);
const sh=G.shake>.2?G.shake:0;
S={camX:Math.round(cam.x+(Math.random()-.5)*sh),camY:Math.round(cam.y+(Math.random()-.5)*sh),time:timeAcc,dt:paused?0:dt,player:p,npcs:W.npcs,sheets:G.sheets,opened:G.opened,region:G.region,emit:true,hurt:false,
enemies:G.enemies,drops:G.drops,projs:G.projs,peers:G.peers,fx:G.fx,texts:G.texts,slashes:G.slashes,extractZone:G.extractZone,extractP:G.extractP};
R.prefetch(S.camX,S.camY);R.draw(S);
if(mode!=='menu'&&!G.over){hud.hud();if(frame%2===0)hud.drawMinimap();if(mode==='map')hud.drawBigMap()}}
inp.pressed={}}
// ---- boot
(async function(){
const ctx={deploy:o=>startRun(o),startMP:seed=>{const lo=menu.takeLoadout();menu.close();startRun({seed,loadout:lo,mp:true})},settings:s=>{Object.assign(settings,s);if(R){R.noParticles=!s.particles;R.zoomPref=s.zoom;resize()}if(hud){hud.hideMM=!s.minimap;$('mmwrap').classList.toggle('hidden',!s.minimap)}},prof:null};
Net.init();
prof=M.sanitize(M.Save.local());ctx.prof=prof;
$('bResume').onclick=()=>{mode='play';layer(false,true,false,false)};
$('bPSet').onclick=()=>menu.openSettings();
$('bQuit').onclick=()=>{if(G&&!G.over){G.die();G.result.lost=G.run.coins}};
menu=new CI.Menu(ctx);Object.assign(settings,menu.settings);
$('mapov').addEventListener('click',()=>{});
menuW=null;const seed0=(Math.random()*4294967295)>>>0;menuW=CI.generate(seed0);W=menuW;R=new CI.Renderer(W,cv);R.noParticles=!settings.particles;R.zoomPref=settings.zoom;resize();buildTour();
mode='menu';last=performance.now();requestAnimationFrame(loop);
M.Save.init().then(r=>{if(M.Save.mode==='account'&&r&&(r.t||0)>(prof.t||0)){for(const k of Object.keys(prof))delete prof[k];Object.assign(prof,r);try{menu.refresh()}catch(e){}}else{try{menu.refresh()}catch(e){}}}).catch(()=>{});
globalThis.CI_DEBUG={get W(){return W},get G(){return G},get R(){return R},get mode(){return mode},prof,menu,startRun,Net,hud:()=>hud}})();
})();

