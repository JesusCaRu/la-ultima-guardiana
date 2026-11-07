import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const canvas=document.querySelector('#world'), fallback=document.querySelector('#fallback');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sections=[...document.querySelectorAll('.chapter')], dots=[...document.querySelectorAll('.chapters a')];
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const i=sections.indexOf(e.target);dots.forEach((d,j)=>d.classList.toggle('active',i===j));}},{threshold:.35});sections.forEach(s=>observer.observe(s));
try {
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.1,100);camera.position.z=14;
 scene.add(new THREE.HemisphereLight(0xc5e5dc,0x292019,2.2));
 function light(color,power,x,y,z){const l=new THREE.DirectionalLight(color,power);l.position.set(x,y,z);scene.add(l)}
 light(0xffe2ab,4,-4,4,7);light(0x64e0d0,3,4,0,-3);light(0xaac6ff,2,5,-3,5);light(0xff4b3b,3.2,6,1,4);
 const blue=new THREE.Group(),red=new THREE.Group(),reborn=new THREE.Group();scene.add(blue,red,reborn);reborn.scale.setScalar(.001);
 const swords=[];
 function load(url,brokenUrl,root,side){const loader=new GLTFLoader();loader.load(url,gltf=>{const whole=gltf.scene;const center=new THREE.Box3().setFromObject(whole).getCenter(new THREE.Vector3());whole.position.sub(center);root.add(whole);
  loader.load(brokenUrl,brokenGltf=>{const pieces=brokenGltf.scene;pieces.position.sub(center);const base=pieces.getObjectByName('Fractura_Base'),tip=pieces.getObjectByName('Fractura_Punta');if(!base||!tip){console.error('No se encontraron las piezas modeladas en Blender');return}pieces.visible=false;root.add(pieces);swords.push({whole,pieces,base,tip,side,tipOrigin:tip.position.clone()})},undefined,()=>{fallback.hidden=false});
 },undefined,()=>{fallback.hidden=false})}load('./espada_guardian.glb','./fractura_guardian.glb',blue,-1);load('./espada_carmesi.glb','./fractura_carmesi.glb',red,1);
 new GLTFLoader().load('./espada_renacida.glb',gltf=>{const object=gltf.scene;object.position.sub(new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3()));reborn.add(object)},undefined,()=>{fallback.hidden=false});
 const haloGeometry=new THREE.BufferGeometry(),haloData=[];for(let i=0;i<120;i++){const a=i/120*Math.PI*2,r=1.75+(i%3)*.13;haloData.push(Math.cos(a)*r,Math.sin(a)*r,0)}haloGeometry.setAttribute('position',new THREE.Float32BufferAttribute(haloData,3));const haloMat=new THREE.PointsMaterial({color:0xe5c382,size:.035,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});const halo=new THREE.Points(haloGeometry,haloMat);halo.position.z=-1;scene.add(halo);
 // Each collision sends a short fan of glowing particles away from the contact point.
 const sparkCount=80,sparkData=new Float32Array(sparkCount*3),vel=[];for(let i=0;i<sparkCount;i++){const angle=(i/sparkCount)*Math.PI*2+Math.random()*.3,speed=.8+Math.random()*3;vel.push([Math.cos(angle)*speed,Math.sin(angle)*speed,(Math.random()-.5)*1.4])}
 const sparkGeo=new THREE.BufferGeometry();sparkGeo.setAttribute('position',new THREE.BufferAttribute(sparkData,3));const sparkMat=new THREE.PointsMaterial({color:0xffb450,size:.085,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});const sparks=new THREE.Points(sparkGeo,sparkMat);scene.add(sparks);
 const flash=new THREE.PointLight(0xff9a39,0,8);flash.position.set(0,1,1);scene.add(flash);
 const trailsData=new Float32Array(sparkCount*6),trailsGeo=new THREE.BufferGeometry();trailsGeo.setAttribute('position',new THREE.BufferAttribute(trailsData,3));const trailsMat=new THREE.LineBasicMaterial({color:0xffa343,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});scene.add(new THREE.LineSegments(trailsGeo,trailsMat));
 const afterLight=new THREE.PointLight(0x75c5c4,0,12);afterLight.position.set(-2,1,4);scene.add(afterLight);const afterRed=new THREE.PointLight(0xfb4430,0,12);afterRed.position.set(2,1,4);scene.add(afterRed);
 const positions=new Float32Array(300);for(let i=0;i<100;i++){positions[i*3]=(Math.random()-.5)*18;positions[i*3+1]=(Math.random()-.5)*12;positions[i*3+2]=(Math.random()-.5)*8}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const particles=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xb9a675,size:.025,transparent:true,opacity:.5,depthWrite:false}));scene.add(particles);
 function resize(){camera.aspect=innerWidth/innerHeight;camera.position.z=innerWidth<700?19:14;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}addEventListener('resize',resize);resize();
 const el=id=>document.getElementById(id);let current=scrollY,breakStarted=null,openedAt=null;const blueBounds=new THREE.Box3(),redBounds=new THREE.Box3(),baseBounds=new THREE.Box3(),tipBounds=new THREE.Box3(),tempBounds=new THREE.Box3();
 function visibleBounds(root,box){box.makeEmpty();root.traverse(o=>{if(!o.isMesh||!o.visible)return;let p=o.parent;while(p&&p!==root){if(!p.visible)return;p=p.parent}if(o.geometry){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();tempBounds.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);box.union(tempBounds)}});return box}
 // Poses are sampled from the actual section positions, including three beats within the duel.
 function frames(){let d=el('duelo').offsetTop,h=el('duelo').offsetHeight,o=el('origen').offsetTop,c=el('carmesi').offsetTop;return [
  {at:0,b:[0,-1.4,-.1,-.2,1.05],r:[7,0,.2,.5,.01]},
  {at:o,b:[2.5,-.25,.12,.42,1.1],r:[7,0,.2,.5,.01]},
  {at:o+(c-o)*.46,b:[4.4,-.6,.65,1.55,.01],r:[7,-1,-.8,1.8,.01]},
  {at:o+(c-o)*.65,b:[-7,-1,-.4,1,.01],r:[4.8,-1,-.65,1.4,.28]},
  {at:c,b:[-7,-1,-.4,1,.01],r:[-2.5,-.25,-.18,-.35,1.08]},
  {at:c+(d-c)*.48,b:[-5,-.7,-.55,1.0,.38],r:[2.6,-.3,.25,.5,.88]},
  {at:d,b:[-3,-.3,-.48,.2,.88],r:[3,-.3,.48,-.2,.88]},
  {at:d+h*.2,b:[-1.3,-.55,-.75,0,.95],r:[1.3,-.55,.75,0,.95]},
  {at:d+h*.29,b:[-2.5,-.05,.35,.55,.9],r:[2.25,-.4,-.24,-.45,.94]},
  {at:d+h*.43,b:[-1.3,-.55,-.75,0,.95],r:[1.3,-.55,.75,0,.95]},
  {at:d+h*.53,b:[-2.4,-.4,.3,-.3,.94],r:[2.6,.05,-.4,.4,.88]},
  {at:d+h*.68,b:[-1.3,-.55,-.75,0,.95],r:[1.3,-.55,.75,0,.95]},
  {at:el('ruptura').offsetTop,b:[-1.3,-.55,-.75,0,.95],r:[1.3,-.55,.75,0,.95]},
  {at:el('ruptura').offsetTop+innerHeight*.75,b:[-2,-.9,-.25,0,.92],r:[2,-.9,.25,0,.92]},
  {at:el('legado').offsetTop,b:[-2.4,-1.3,-.18,0,.92],r:[2.4,-1.3,.18,0,.92]}
 ]}
 function apply(group,p,mobile,t){const drift=reduce?0:Math.sin(t*.00065+(group===red?1.4:0));group.position.set(p[0]*(mobile?.53:1),p[1]+(mobile?1.3:0)+drift*.065,0);group.rotation.set(.08,p[3]+drift*.045,p[2]+drift*.012);group.scale.setScalar(Math.max(.001,p[4])*(mobile?.78:1))}
 function tick(t){requestAnimationFrame(tick);if(openedAt===null)openedAt=t;current=reduce?scrollY:THREE.MathUtils.lerp(current,scrollY,.075);const f=frames();let i=0;while(i<f.length-2&&current>f[i+1].at)i++;const a=f[i],b=f[i+1],ratio=THREE.MathUtils.smoothstep((current-a.at)/Math.max(1,b.at-a.at),0,1);const blend=k=>a[k].map((v,j)=>THREE.MathUtils.lerp(v,b[k][j],ratio));const mobile=innerWidth<700;apply(blue,blend('b'),mobile,t);apply(red,blend('r'),mobile,t);
  if(!reduce&&current<innerHeight*.4){const reveal=Math.exp(-(t-openedAt)/800);blue.position.y-=reveal*1.5;blue.rotation.z-=reveal*.38;blue.rotation.y+=reveal*.7}
  const breaking=THREE.MathUtils.smoothstep((current-el('ruptura').offsetTop)/(innerHeight*1.35),0,1);const reunion=THREE.MathUtils.smoothstep((current-(el('legado').offsetTop-innerHeight*.55))/(innerHeight*.55),0,1);
  let contactY=mobile?2.3:.8;
  if(breaking>.01&&breakStarted===null)breakStarted=t;if(breaking<.005)breakStarted=null;const live=reduce?0:Math.sin(t*.0007);for(const sword of swords){const broken=breaking>.003;sword.whole.visible=!broken;sword.pieces.visible=broken;const separation=THREE.MathUtils.smoothstep(breaking,.03,1);sword.tip.position.copy(sword.tipOrigin);sword.tip.position.x+=sword.side*separation*.45;sword.tip.position.y+=separation*.58+live*.015*separation;sword.tip.rotation.z=-sword.side*separation*.12+live*.006*separation}
  // Conservative bounds provide a visible contact constraint for the whole swords, including guards and loose pieces.
  if(swords.length===2&&current>=el('carmesi').offsetTop+(el('duelo').offsetTop-el('carmesi').offsetTop)*.38){blue.updateMatrixWorld(true);red.updateMatrixWorld(true);visibleBounds(blue,blueBounds);visibleBounds(red,redBounds);const overlap=blueBounds.max.x-redBounds.min.x;if(overlap>-.025){const correction=(overlap+.025)/2;blue.position.x-=correction;red.position.x+=correction}contactY=Math.min(blueBounds.max.y,redBounds.max.y)-.12;
  }
  // The broken weapons withdraw while a single new one rises from their light.
  blue.position.x-=reunion*(mobile?2:3);red.position.x+=reunion*(mobile?2:3);blue.scale.multiplyScalar(Math.max(.001,1-reunion));red.scale.multiplyScalar(Math.max(.001,1-reunion));
  const idle=reduce?0:Math.sin(t*.00075);reborn.position.set(0,(mobile?1.65:.5)-(1-reunion)*2+idle*.08*reunion,0);reborn.rotation.set(.08,(1-reunion)*1.35+idle*.16,-.13*(1-reunion)+idle*.018);reborn.scale.setScalar(Math.max(.001,reunion*(mobile?.87:1.02)));halo.position.y=reborn.position.y;halo.rotation.z=reduce?0:t*.00017;haloMat.opacity=reunion*.55;
  afterLight.intensity=breaking*(2.8+(reduce?0:.4*Math.sin(t*.0011)));afterRed.intensity=breaking*(3+(reduce?0:.45*Math.sin(t*.0009)));
  const duel=el('duelo'),impacts=[duel.offsetTop+duel.offsetHeight*.2,duel.offsetTop+duel.offsetHeight*.43,duel.offsetTop+duel.offsetHeight*.68,el('ruptura').offsetTop+innerHeight*.04];let age=-1;for(const impact of impacts){const a=(current-impact)/(innerHeight*.28);if(a>=0&&a<=1)age=a}const energy=age<0||reduce?0:Math.pow(1-age,1.6);sparkMat.opacity=energy;trailsMat.opacity=energy*.7;flash.intensity=energy*22;flash.position.y=contactY;for(let j=0;j<sparkCount;j++){const x=vel[j][0]*age*.8,y=contactY+vel[j][1]*age*.8-age*age*.8,z=1+vel[j][2]*age;sparkData[j*3]=x;sparkData[j*3+1]=y;sparkData[j*3+2]=z;trailsData.set([x,y,z,x-vel[j][0]*.045,y-vel[j][1]*.045,z],j*6)}sparkGeo.attributes.position.needsUpdate=true;trailsGeo.attributes.position.needsUpdate=true;
  if(!reduce){particles.rotation.y=t*.00006;particles.position.y=Math.sin(t*.00035)*.25}renderer.render(scene,camera)}requestAnimationFrame(tick);
}catch(error){console.error(error);fallback.hidden=false}






