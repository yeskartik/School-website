// Global script for AVN Inter College site
document.addEventListener('DOMContentLoaded', function(){
  // Load navbar and footer
  const loadComponent = (selector, url, fallbackHtml, onComplete) => {
    fetch(url).then(r=>r.text()).then(html=>{
      const el = document.getElementById(selector);
      if(el){el.innerHTML = html;}
      onComplete && onComplete();
    }).catch(()=>{
      const el = document.getElementById(selector);
      if(el){
        el.innerHTML = fallbackHtml;
      }
      onComplete && onComplete();
    });
  };

  const navFallback = `
    <nav class="navbar navbar-expand-lg navbar-light sticky-top" id="mainNav">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.html">
          <span class="logo-placeholder">A.V.N.</span>
          <div class="ms-2">
            <div class="school-name">A.V.N. Inter College</div>
            <div class="school-sub">Jethwara, Pratapgarh</div>
          </div>
        </a>
      </div>
    </nav>
  `;

  const footerFallback = `
    <footer class="site-footer py-5">
      <div class="container text-center text-white">
        <p><strong>A.V.N. Inter College</strong></p>
        <p>Uttar Pradesh, Jethwara, Pratapgarh - 230129</p>
        <p><small>Loading footer failed. Please open this page from the site's root folder.</small></p>
      </div>
    </footer>
  `;

  loadComponent('navbar', './components/navbar.html', navFallback, attachNavHandlers);
  loadComponent('footer', './components/footer.html', footerFallback, ()=>{
    const copyYear = document.getElementById('copyYear');
    if(copyYear) copyYear.textContent = new Date().getFullYear();
  });

  // Loading screen
  const removeLoader = ()=>{
    const loader = document.getElementById('loadingScreen');
    if(loader){loader.style.opacity = '0'; setTimeout(()=>loader.remove(),600);}  
    AOS && AOS.refresh();
  };

  window.addEventListener('load', removeLoader);
  setTimeout(removeLoader, 2000);

  // Theme handling (default to light for visibility)
  const themeKey = 'avn-theme';
  const savedTheme = localStorage.getItem(themeKey) || 'light';
  if(savedTheme === 'dark') document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode');

  function attachNavHandlers(){
    const toggle = document.getElementById('darkModeToggle');
    if(toggle){
      toggle.checked = document.body.classList.contains('dark-mode');
      toggle.addEventListener('change', ()=>{
        if(toggle.checked){document.body.classList.add('dark-mode');localStorage.setItem(themeKey,'dark')} else {document.body.classList.remove('dark-mode');localStorage.setItem(themeKey,'light')}
      });
    }
    // Navbar smooth scroll for anchors
    document.querySelectorAll('a.nav-link').forEach(a=>{
      if(a.hash){a.addEventListener('click', (e)=>{e.preventDefault();document.querySelector(a.hash)?.scrollIntoView({behavior:'smooth'})})}
    });
  }

  // Back to top
  const topBtn = document.createElement('button'); topBtn.className='back-to-top'; topBtn.innerHTML='↑';
  topBtn.style.display='none'; document.body.appendChild(topBtn);
  topBtn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll', ()=>{topBtn.style.display=window.scrollY>300?'flex':'none'});

  // WhatsApp button
  const wa = document.createElement('a'); wa.href='https://wa.me/919838533690'; wa.target='_blank'; wa.className='whatsapp-btn'; wa.innerHTML='<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(wa);

  // Animated counters
  function runCounters(){
    document.querySelectorAll('.counter').forEach(el=>{
      const target = +el.dataset.target||+el.textContent;
      let cur = 0; const step = Math.ceil(target/120);
      const id = setInterval(()=>{cur+=step; if(cur>=target){el.textContent=target;clearInterval(id)} else el.textContent=cur},12);
    });
  }
  runCounters();

  // Notice ticker simple rotation
  const ticker = document.querySelector('.notice-ticker .items');
  if(ticker){
    // duplicate for infinite scroll
    ticker.innerHTML += ticker.innerHTML;
  }

  // Simple gallery lightbox
  document.body.addEventListener('click', (e)=>{
    const t = e.target.closest('.gallery-item');
    if(t){
      const url = t.dataset.src;
      const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
      document.getElementById('lightboxImage').src = url; modal.show();
    }
  });

  // Search bar (simple client-side focus)
  window.avnSearch = function(q){ alert('Search UI placeholder: "'+q+'" — integrate as needed'); }

  // Event countdown
  const countdownEl = document.getElementById('eventCountdown');
  if(countdownEl){
    const targetDate = new Date(countdownEl.dataset.target);
    const iv = setInterval(()=>{
      const diff = targetDate - new Date();
      if(diff<=0){countdownEl.textContent='Event started';clearInterval(iv);return}
      const d = Math.floor(diff/86400000); const h = Math.floor(diff%86400000/3600000); const m = Math.floor(diff%3600000/60000); const s = Math.floor(diff%60000/1000);
      countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
    },1000);
  }

  // Initialize AOS if present
  if(window.AOS) AOS.init({duration:800,once:true});
});
