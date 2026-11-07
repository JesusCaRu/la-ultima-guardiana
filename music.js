// A quiet, original minor-key theme. Sound is opt-in to respect browser autoplay rules.
const button=document.querySelector('#music-toggle'), finale=document.querySelector('#legado');
let context, master, timer, enabled=false, inFinale=false, step=0;
const melody=[293.66,349.23,440,392,349.23,293.66,261.63,293.66,220,261.63,329.63,293.66,261.63,220,196,220];
const bass=[146.83,130.81,110,98];
function note(freq,when,duration,volume,type='sine'){
 const osc=context.createOscillator(),gain=context.createGain(),filter=context.createBiquadFilter();osc.type=type;osc.frequency.value=freq;filter.type='lowpass';filter.frequency.value=900;
 gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(volume,when+.12);gain.gain.exponentialRampToValueAtTime(.0001,when+duration);osc.connect(filter).connect(gain).connect(master);osc.start(when);osc.stop(when+duration+.05);
}
function playStep(){if(!enabled||!inFinale||!context)return;const now=context.currentTime+.03;note(melody[step%melody.length],now,1.9,.075,'triangle');if(step%4===0){const root=bass[Math.floor(step/4)%bass.length];note(root,now,4.3,.045);note(root*1.5,now,4,.02)}step++}
function update(){const playing=enabled&&inFinale&&context;if(context&&master)master.gain.setTargetAtTime(playing?.5:.0001,context.currentTime,.12);if(playing&&!timer){playStep();timer=setInterval(playStep,1100)}else if(!playing&&timer){clearInterval(timer);timer=null}}
button.addEventListener('click',async()=>{try{if(!context){context=new AudioContext();master=context.createGain();master.gain.value=.5;master.connect(context.destination)}await context.resume();enabled=!enabled;button.setAttribute('aria-pressed',String(enabled));button.textContent=enabled?'MÚSICA ACTIVADA · DESACTIVAR':'ACTIVAR MÚSICA DEL FINAL';update()}catch{button.textContent='SONIDO NO DISPONIBLE';button.disabled=true}});
new IntersectionObserver(entries=>{inFinale=entries[0].isIntersecting;update()},{threshold:.25}).observe(finale);
