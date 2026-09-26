const tasks = [
  { title: 'Finish chemistry notes', description: 'Review the last chapter and turn your messy notes into a clean one-page summary.', tag: 'FOCUS', xp: 120, icon: '⚗', type: 'focus' },
  { title: 'Reply to Maya', description: 'Send the quick message you have been meaning to get back to.', tag: 'LIFE', xp: 70, icon: '✉', type: 'life' },
  { title: 'Outline history essay', description: 'Get your opening argument and three supporting points down on paper.', tag: 'FOCUS', xp: 150, icon: '✎', type: 'focus' },
  { title: 'Make a study playlist', description: 'Curate a few tracks that make your next deep-work session feel electric.', tag: 'CREATE', xp: 90, icon: '♫', type: 'creative' },
  { title: 'Plan tomorrow', description: 'Set yourself up for a smoother morning by choosing your top three priorities.', tag: 'LIFE', xp: 80, icon: '★', type: 'life' },
  { title: 'Organize your desk', description: 'Clear one small zone so your next study session has room to breathe.', tag: 'LIFE', xp: 75, icon: '⌂', type: 'life' },
  { title: 'Read 10 pages', description: 'Make a little progress on the book waiting on your nightstand.', tag: 'FOCUS', xp: 85, icon: '▤', type: 'focus' },
  { title: 'Sketch an idea', description: 'Spend ten minutes turning a thought into a rough visual or concept.', tag: 'CREATE', xp: 100, icon: '✦', type: 'creative' },
  { title: 'Pack your bag', description: 'Get tomorrow’s essentials ready now and make your morning easier.', tag: 'LIFE', xp: 60, icon: '◆', type: 'life' },
  { title: 'Review flashcards', description: 'Run through a quick set and find the few concepts that need another look.', tag: 'FOCUS', xp: 110, icon: '▣', type: 'focus' }
];
const storedXp = Number(localStorage.getItem('taskcade-xp'));
const storedTasksDone = Number(localStorage.getItem('taskcade-tasks-done'));
const storedStreak = Number(localStorage.getItem('taskcade-streak'));
const lastVisit = Number(localStorage.getItem('taskcade-last-visit'));
const dayInMs = 24 * 60 * 60 * 1000;
let streak = Number.isFinite(storedStreak) && storedStreak > 0 ? storedStreak : 1;
if(!Number.isFinite(lastVisit) || Date.now() - lastVisit >= dayInMs) streak += Number.isFinite(lastVisit) ? 1 : 0;
localStorage.setItem('taskcade-streak',streak);localStorage.setItem('taskcade-last-visit',Date.now());
let currentTask = null; let tasksDone = Number.isFinite(storedTasksDone) ? storedTasksDone : 0; let xp = Number.isFinite(storedXp) ? storedXp : 0; let isDropping = false; let clawPosition = 50;
const purchasedRewards = new Set();
const rewardCatalog = [
  { item:'focus-mode', cost:300, type:'BOOST', icon:'◎', art:'item-art-pink', title:'Focus Mode', description:'Double the calm for your next deep-work session.' },
  { item:'golden-ticket', cost:500, type:'COSMETIC', icon:'✹', art:'item-art-yellow', title:'Golden Ticket', description:'Add a rare collectible badge to your arcade shelf.' },
  { item:'extra-life', cost:750, type:'REWARD', icon:'♢', art:'item-art-cyan', title:'Extra Life', description:'Protect one missed drop and keep your mission run alive.' }
];
const $ = id => document.getElementById(id);
const pit = $('prize-pit');
const colors = ['pink','cyan','yellow','purple'];
function renderPrizes(){const positions=[5,17,29,41,53,65,77,11,35,59];pit.innerHTML='';tasks.forEach((task,i)=>{const prize=document.createElement('div');prize.className=`prize ${colors[i%4]}`;prize.style.left=`${positions[i%positions.length]}%`;prize.style.bottom=`${(i%3)*13}px`;prize.style.transform=`rotate(${[-7,4,-3,7,-5,6,-4,5,-6,3][i%10]}deg)`;prize.innerHTML=`<span>${task.icon}</span>`;prize.dataset.index=i;pit.appendChild(prize);});$('tasks-in-machine').textContent=tasks.length; }
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2600)}
function updateGoalUI(){const goal=500;const progress=Math.min(100,(xp/goal)*100);$('xp').textContent=xp;$('shop-xp').textContent=xp;$('tasks-done').textContent=tasksDone;$('streak').textContent=streak;$('goal-xp').textContent=xp;$('goal-progress').style.width=`${progress}%`;if(xp>=goal){$('goal-card')?.classList.add('goal-complete')}}
function setMission(task){currentTask=task;$('mission-icon').textContent=task.icon;$('mission-title').textContent=task.title;$('mission-description').textContent=task.description;$('mission-tag').textContent=task.tag;$('mission-xp').textContent=`+ ${task.xp} XP`;$('complete-task').disabled=false;}
function moveClaw(direction){if(isDropping)return;clawPosition=Math.max(8,Math.min(92,clawPosition+direction*5));$('claw-rig').style.left=`${clawPosition}%`;$('claw-control').setAttribute('aria-valuenow',clawPosition)}
function pickTask(){if(isDropping)return;if(!tasks.length){toast('Your prize pit is empty — add a task below!');return}isDropping=true;const rig=$('claw-rig');const clawX=clawPosition;const index=tasks.reduce((closest,task,i)=>Math.abs(parseFloat(pit.children[i].style.left)+5-clawX)<Math.abs(parseFloat(pit.children[closest].style.left)+5-clawX)?i:closest,0);const targetX=parseFloat(pit.children[index].style.left)+5;const hit=Math.abs(targetX-clawX)<=6;const task=tasks[index];$('pick-task').disabled=true;rig.classList.add('dropping');rig.style.setProperty('--drop','120px');$('claw-machine').classList.add('shake');setTimeout(()=>{if(hit){setMission(task);$('mission-card').classList.add('shake');toast('Mission acquired. You got this!')}else{toast('Missed! Line up the claw more carefully.')}} ,1000);setTimeout(()=>{rig.style.setProperty('--drop','0px');rig.classList.remove('dropping');$('pick-task').disabled=false;isDropping=false;$('claw-machine').classList.remove('shake')},1800)}
$('pick-task').addEventListener('click',pickTask);
document.addEventListener('keydown',event=>{if(['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName))return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveClaw(event.key==='ArrowLeft'?-1:1)}});
 $('complete-task').addEventListener('click',()=>{if(!currentTask)return;tasksDone++;xp+=currentTask.xp;localStorage.setItem('taskcade-xp',xp);localStorage.setItem('taskcade-tasks-done',tasksDone);updateGoalUI();tasks.splice(tasks.indexOf(currentTask),1);currentTask=null;$('mission-title').textContent='Mission cleared!';$('mission-description').textContent='Nice work. The arcade is ready when you are.';$('mission-tag').textContent='COMPLETE';$('mission-xp').textContent='SCORE +' + (tasksDone%3===0?'BONUS':'');$('complete-task').disabled=true;renderPrizes();toast('Task complete — +' + tasksDone + ' momentum!');});
$('skip-task').addEventListener('click',()=>{if(currentTask){toast('No worries — sending it back into the pit.');currentTask=null;$('mission-title').textContent='Ready when you are.';$('mission-description').textContent='Press the button to let the claw choose your next task.';$('complete-task').disabled=true}else toast('Grab a mission first!')});
 $('task-form').addEventListener('submit',e=>{e.preventDefault();const input=$('task-input');const title=input.value.trim();if(!title){input.focus();return}const type=$('task-type').value;const config={focus:['FOCUS',120,'⚡'],life:['LIFE',80,'♥'],creative:['CREATE',100,'✦'],school:['SCHOOL',130,'▣'],health:['HEALTH',100,'♥'],home:['HOME',75,'⌂'],social:['SOCIAL',90,'✉']}[type];tasks.push({title,description:'A fresh mission from your personal prize pit. Make it happen!',tag:config[0],xp:config[1],icon:config[2],type});input.value='';renderPrizes();toast('New prize added to the machine!')});
$('scroll-to-machine').addEventListener('click',()=>document.querySelector('.machine-section').scrollIntoView({behavior:'smooth'}));$('show-how').addEventListener('click',()=>document.querySelector('#how-it-works').scrollIntoView({behavior:'smooth'}));
function addNextReward(){const reward=rewardCatalog.shift();if(!reward)return;const card=document.createElement('article');card.className='shop-item new-item';card.innerHTML=`<div class="item-art ${reward.art}">${reward.icon}</div><div class="item-copy"><span class="item-type">${reward.type}</span><h3>${reward.title}</h3><p>${reward.description}</p><button class="buy-button" data-item="${reward.item}" data-cost="${reward.cost}">BUY FOR ${reward.cost} XP <span>↗</span></button></div>`;$('shop-grid').appendChild(card);attachBuyButton(card.querySelector('.buy-button'))}
function attachBuyButton(button){button.addEventListener('click',()=>{const cost=Number(button.dataset.cost);const item=button.dataset.item;if(purchasedRewards.has(item))return;if(xp<cost){toast(`You need ${cost-xp} more XP for this reward.`);return}xp-=cost;localStorage.setItem('taskcade-xp',xp);purchasedRewards.add(item);updateGoalUI();button.textContent='OWNED ✓';button.disabled=true;button.classList.add('purchased');addNextReward();toast('Reward unlocked — a new item entered the market!')})}
document.querySelectorAll('.buy-button').forEach(attachBuyButton);
renderPrizes();
updateGoalUI();
