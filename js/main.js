// ===== GANTI DATA INI DENGAN MILIKMU =====
const CFG={wa:"628116719899",
 social:[
 {n:"Instagram",u:"https://instagram.com/zakkiahginting?rpxt=aTVjNTR2aWswZWZ5",p:"M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.200a3.200 3.200 0 1 1 0-6.400 3.200 3.200 0 0 1 0 6.400ZM17.300 5.500a1.200 1.200 0 1 0 0 2.400 1.200 1.200 0 0 0 0-2.400ZM7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 1.800A3.200 3.200 0 0 0 3.800 7v10A3.200 3.200 0 0 0 7 20.200h10a3.200 3.200 0 0 0 3.200-3.200V7A3.200 3.200 0 0 0 17 3.800Z"},
 {n:"Facebook",u:"https://facebook.com/share/1V5NR6NLTx/",p:"M13.500 22v-8.200h2.800l.4-3.300h-3.200V8.400c0-.9.300-1.600 1.600-1.600h1.700V3.900c-.3 0-1.300-.1-2.400-.1-2.400 0-4.100 1.500-4.100 4.200v2.500H7.500v3.300h2.800V22Z"},
],
 clues:[
  ["Bisnis ini bisa kamu mulai dari ponsel sendiri.","Petunjuk 1"],
  ["Modalnya dijelaskan terbuka, tanpa kejutan di belakang.","Petunjuk 2"],
  ["Sudah ada komunitas yang berjalan bersama.","Petunjuk 3"],
  ["Nama dan sistem lengkapnya kami ceritakan lewat chat.","Rahasia"]]};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const wa=t=>`https://wa.me/${CFG.wa}?text=${encodeURIComponent(t)}`;
$$('.wa-link').forEach(a=>{a.href=wa(a.dataset.msg);a.target="_blank";a.rel="noopener"});
const waIc='<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.600 15L2 22l5.200-1.400A10 10 0 1 0 12 2Z"/></svg>';
$('#soc').innerHTML=`<a class="big" href="${wa('Assalamualaikum saya mau ikut kelas Kuliah Sebulan Jadi Pengusaha Nama : asal : Usia : Pekerjaan : Bagaimana caranya ?')}" target="_blank" rel="noopener">${waIc}Chat WhatsApp sekarang</a>`+CFG.social.map(s=>`<a href="${s.u}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="${s.p}"/></svg>${s.n}</a>`).join('');
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),3000)}
// berkas petunjuk
$('#rows').innerHTML=CFG.clues.map((c,i)=>`<button class="row${i==3?' lock':''}"><span>${c[0]}</span><span class="bar">${c[1]}: ketuk untuk membuka</span></button>`).join('');
$$('.row').forEach((r,i)=>r.onclick=()=>{if(i<3){r.classList.add('open')}else{r.classList.add('open');setTimeout(()=>{window.open(wa('Halo, saya sudah baca petunjuknya dan penasaran dengan bisnisnya.'),'_blank','noopener')},700);toast('Membuka WhatsApp untuk jawaban lengkapnya...')}});
$('#form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);
window.open(wa(`Halo, saya ${f.get('nama')} dari ${f.get('kota')||'-'}.\nSaya penasaran karena: ${f.get('msg')||'ingin tahu lebih lanjut.'}`),'_blank','noopener')};
$('#theme').onclick=()=>{const r=document.documentElement,d=getComputedStyle(r).getPropertyValue('--bg').trim()==='#0C1713';r.dataset.theme=d?'light':'dark'};
