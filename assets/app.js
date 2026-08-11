(() => {

  // v5.0 shared breadcrumb navigation and traveler experience.
  const pageName = (location.pathname.split('/').pop() || 'index.html').split('?')[0];

  // v7.0 FINAL — simple, dependable menu.
  const simpleMenuLinks = [
    ['index.html','Home'],['today.html','Today'],['itinerary.html','Daily guide'],['companion.html','Companion'],
    ['reservations.html','Reservations'],['hotels.html','Stays'],['map.html','Maps'],
    ['venice.html','Venice'],['lake-como.html','Lake Como'],['lake-maggiore.html','Lake Maggiore'],
    ['milan.html','Milan'],['more-destinations.html','More destinations'],['practical.html','Practical'],['emergency.html','Emergency pack']
  ];
  const currentFile = (location.pathname.split('/').pop() || 'index.html').split('?')[0];

  document.querySelectorAll('.topbar').forEach((siteHeader) => {
    const inner = siteHeader.querySelector('.topbar-inner');
    if (!inner) return;
    const brand = inner.querySelector('.brand');
    if (brand) brand.innerHTML = 'THE TRAVELER’S COMPANION <small>September 2026 Edition</small>';

    let button = inner.querySelector('.menu-toggle');
    if (!button) {
      button = document.createElement('button');
      button.className = 'menu-toggle';
      button.type = 'button';
      inner.appendChild(button);
    }
    button.textContent = 'Menu';
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-controls','simple-site-menu');
    button.setAttribute('aria-label','Open menu');

    inner.querySelectorAll('.publication-nav,.nav,.simple-site-menu').forEach(node => node.remove());
    const menu = document.createElement('nav');
    menu.id = 'simple-site-menu';
    menu.className = 'simple-site-menu';
    menu.setAttribute('aria-label','Site menu');
    menu.hidden = true;
    menu.innerHTML = `<div class="simple-menu-inner">${simpleMenuLinks.map(([file,label]) =>
      `<a href="${file}"${file===currentFile?' aria-current="page"':''}>${label}</a>`
    ).join('')}</div>`;
    inner.appendChild(menu);

    const close = (restoreFocus=false) => {
      menu.hidden = true;
      button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label','Open menu');
      button.textContent = 'Menu';
      document.body.classList.remove('simple-menu-open');
      if (restoreFocus) button.focus({preventScroll:true});
    };
    const open = () => {
      menu.hidden = false;
      button.setAttribute('aria-expanded','true');
      button.setAttribute('aria-label','Close menu');
      button.textContent = 'Menu';
      document.body.classList.add('simple-menu-open');
      menu.querySelector('a')?.focus({preventScroll:true});
    };

    close();
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      menu.hidden ? open() : close(true);
    });
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) close();
    });
    document.addEventListener('click', (event) => {
      if (!menu.hidden && !inner.contains(event.target)) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) close(true);
    });
    window.addEventListener('pageshow', () => close());
    window.addEventListener('pagehide', () => close());
    window.addEventListener('orientationchange', () => close());
  });

  const crumbMap = {
    'index.html': ['Home'],
    'itinerary.html': ['Trip', 'Daily guide'],
    'today.html': ['Trip', 'Trip mode'],
    'my-trip.html': ['Trip', 'My trip'],
    'reservations.html': ['Trip', 'Reservations'],
    'companion.html': ['Trip', 'Companion'],
    'map.html': ['Trip', 'Maps'],
    'hotels.html': ['Trip', 'Stays'],
    'hotel-routes.html': ['Trip', 'Stays', 'Around your stays'],
    'practical.html': ['Trip', 'Practical'],
    'readiness.html': ['Trip', 'Trip readiness'],
    'help.html': ['Trip', 'Help'],
    'emergency.html': ['Trip', 'Emergency pack'],
    'venice.html': ['Destinations', 'Venice'],
    'verona.html': ['More destinations', 'Verona & Lake Garda'],
    'lake-como.html': ['Destinations', 'Lake Como'],
    'lake-maggiore.html': ['Destinations', 'Lake Maggiore'],
    'milan.html': ['Destinations', 'Milan'],
    'piedmont.html': ['More destinations', 'Piedmont'],
    'more-destinations.html': ['More destinations'],
    'dolomites.html': ['More destinations', 'Dolomites'],
    'cinque-terre.html': ['More destinations', 'Cinque Terre']
  };
  const hrefFor = {
    'Home':'index.html','Trip':'itinerary.html','Daily guide':'itinerary.html','Trip mode':'today.html','My trip':'my-trip.html',
    'Reservations':'reservations.html','Companion':'companion.html','Trip readiness':'readiness.html','Maps':'map.html','Stays':'hotels.html','Around your stays':'hotel-routes.html','Practical':'practical.html','Emergency pack':'emergency.html','Help':'help.html',
    'Destinations':'index.html#destinations','More destinations':'more-destinations.html','Venice':'venice.html','Verona & Lake Garda':'verona.html',
    'Lake Como':'lake-como.html','Lake Maggiore':'lake-maggiore.html','Milan':'milan.html','Piedmont':'piedmont.html','Dolomites':'dolomites.html','Cinque Terre':'cinque-terre.html'
  };
  const labels = crumbMap[pageName];
  const header = document.querySelector('.topbar');
  if (labels && header && pageName !== 'index.html') {
    const old = document.querySelector('.site-breadcrumbs');
    old?.remove();
    const nav = document.createElement('nav');
    nav.className = 'site-breadcrumbs';
    nav.setAttribute('aria-label','Breadcrumb');
    const all = ['Home', ...labels.filter(label => label !== 'Home')];
    nav.innerHTML = `<div class="breadcrumb-inner">${all.map((label,index) => {
      const current = index === all.length - 1;
      return `${index ? '<span class="crumb-separator" aria-hidden="true">›</span>' : ''}${current ? `<span aria-current="page">${label}</span>` : `<a href="${hrefFor[label] || 'index.html'}">${label}</a>`}`;
    }).join('')}</div>`;
    header.insertAdjacentElement('afterend',nav);
  }


  // v8.0.0 — self-contained Companion integration.
  if (!document.querySelector('.journey-switcher')) {
    const journeyNav = document.createElement('nav');
    journeyNav.className = 'journey-switcher';
    journeyNav.setAttribute('aria-label', 'Switch journey companion');
    journeyNav.innerHTML = `<a href="companion/istanbul/index.html">Istanbul</a><a href="companion/cruise/index.html">Cruise</a><a href="venice.html">Venice</a><a class="primary" href="index.html">Northern Italy</a>`;
    document.body.appendChild(journeyNav);
  }

  document.querySelectorAll('.travel-dock').forEach(d=>d.remove());
  const utilityDock=document.createElement('nav');
  utilityDock.className='travel-dock universal-tools-dock';
  utilityDock.setAttribute('aria-label','Traveler tools');
  utilityDock.innerHTML=`<a href="companion/index.html"><strong>Trip Hub</strong></a><a href="today.html">Today</a><a href="map.html">Map</a><a href="hotels.html">Stays</a><a href="companion/index.html#dashboard-quick">More</a>`;
  document.body.appendChild(utilityDock);

  if (!document.querySelector('.back-to-top')) {
    const topButton=document.createElement('button');
    topButton.type='button'; topButton.className='back-to-top'; topButton.setAttribute('aria-label','Back to top'); topButton.textContent='↑ Top';
    document.body.appendChild(topButton);
    const updateTop=()=>topButton.classList.toggle('visible',window.scrollY>650);
    topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll',updateTop,{passive:true}); updateTop();
  }

  // Make existing chapter-spread lightboxes keyboard and screen-reader friendly.
  const zoomableImages = document.querySelectorAll('.spread img, .page-spread img');
  zoomableImages.forEach((image) => {
    image.setAttribute('role', 'button');
    image.setAttribute('tabindex', '0');
    image.setAttribute('aria-label', `View larger: ${image.alt || 'chapter image'}`);
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        image.click();
      }
    });
  });

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const closeButton = lightbox.querySelector('button');
    let returnFocus = null;

    const syncLightboxState = () => {
      const open = lightbox.classList.contains('open');
      lightbox.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('lightbox-open', open);
      if (open) {
        returnFocus = document.activeElement;
        closeButton?.focus({ preventScroll: true });
      } else if (returnFocus instanceof HTMLElement) {
        returnFocus.focus({ preventScroll: true });
        returnFocus = null;
      }
    };

    new MutationObserver(syncLightboxState).observe(lightbox, {
      attributes: true,
      attributeFilter: ['class']
    });
    syncLightboxState();
  }



  const tripDays = [
    {date:'2026-08-31',label:'Monday, August 31',title:'Venice arrival',summary:'Remain aboard Viking overnight at Marghera and prepare for disembarkation.',overnight:'Viking ship · Marghera',travel:'Arrival day',priority:'Confirm Fusina disembarkation details',guide:'venice.html',timeline:[['Arrival','Settle aboard and confirm tomorrow’s disembarkation instructions.'],['Evening','Keep the first night easy and organize luggage for the transfer into Venice.']],checklist:['Confirm disembarkation time','Charge phones and battery packs','Keep hotel address accessible'],bookings:['Viking ship · Marghera']},
    {date:'2026-09-01',label:'Tuesday, September 1',title:'Disembark and enter Venice',summary:'Transfer from Fusina, check in at Hotel Al Sotoportego, then begin with a gentle Cannaregio walk.',overnight:'Hotel Al Sotoportego · Venice',travel:'Fusina → central Venice',priority:'Smooth luggage transfer and check-in',guide:'venice.html',timeline:[['Morning','Disembark at Fusina and transfer into Venice.'],['Afternoon','Check in after 3:00 PM and explore Cannaregio.'],['Evening','Dinner close to the hotel and an uncrowded evening walk.']],checklist:['Hotel confirmation ready','Confirm transfer method','Carry essentials separately'],bookings:['Hotel Al Sotoportego · check-in from 3:00 PM']},
    {date:'2026-09-02',label:'Wednesday, September 2',title:'A full Venice day',summary:'Use the morning for headline sights and the afternoon for quieter sestieri.',overnight:'Hotel Al Sotoportego · Venice',travel:'Walking and vaporetto',priority:'Start early before the largest crowds',guide:'venice.html',timeline:[['Early morning','San Marco before the day-trippers arrive.'],['Afternoon','Choose Dorsoduro, Castello or a lagoon excursion.'],['Evening','Return to favorite canals after sunset.']],checklist:['Vaporetto pass or tickets','Water and sun protection','Dinner plan'],bookings:[]},
    {date:'2026-09-03',label:'Thursday, September 3',title:'Venice to Lake Como',summary:'Collect the car and drive west. Verona works as an optional lunch-and-stroll stop.',overnight:'Lake Front Apartment · Lenno',travel:'Venice → Como · optional Verona',priority:'Protect arrival time at the Lenno apartment',guide:'lake-como.html',timeline:[['Morning','Leave Venice and collect the rental car.'],['Midday','Optional Verona lunch stop; skip it if timing feels tight.'],['Afternoon','Continue to Lenno and check in after 3:00 PM.']],checklist:['Rental car documents','Host contact saved','Avoid leaving luggage visible in Verona'],bookings:['Lake Front Apartment · check-in 3:00 PM']},
    {date:'2026-09-04',label:'Friday, September 4',title:'Central Lake Como',summary:'Make this the main ferry day for Bellagio, Varenna and one villa.',overnight:'Lake Front Apartment · Lenno',travel:'Ferries and walking',priority:'Use the clearest forecast for the ferry circuit',guide:'lake-como.html',timeline:[['Morning','Start from the central lake before queues build.'],['Midday','Bellagio or Varenna lunch.'],['Afternoon','Villa visit and lakeside promenade.']],checklist:['Check ferry timetable','Comfortable shoes','Light layer for the boat'],bookings:[]},
    {date:'2026-09-05',label:'Saturday, September 5',title:'A flexible Como day',summary:'Choose a second ferry circuit, Villa Carlotta, a scenic drive or a slower local day.',overnight:'Lake Front Apartment · Lenno',travel:'Flexible',priority:'Match the plan to weather and energy',guide:'lake-como.html',timeline:[['Morning','Choose the best remaining villa or village.'],['Afternoon','Slow lakeside lunch or scenic drive.'],['Evening','Pack lightly for tomorrow’s transfer.']],checklist:['Review weather','Refuel if needed','Confirm Stresa parking'],bookings:[]},
    {date:'2026-09-06',label:'Sunday, September 6',title:'Lake Como to Stresa',summary:'Move west to Lake Maggiore and settle into the Stresa apartment.',overnight:'Il Dipinto Sul Lago · Stresa',travel:'Lenno → Stresa',priority:'Arrive with time to park and orient',guide:'lake-maggiore.html',timeline:[['Morning','Check out by 10:00 AM.'],['Midday','Scenic transfer west with a relaxed lunch stop.'],['Afternoon','Check in, park and walk the Stresa lakefront.']],checklist:['Check out by 10:00 AM','Stresa booking details','Garage instructions'],bookings:['Il Dipinto Sul Lago · check-in September 6']},
    {date:'2026-09-07',label:'Monday, September 7',title:'Borromean Islands',summary:'Use the clearest day for Isola Bella, Isola Madre and Isola dei Pescatori.',overnight:'Il Dipinto Sul Lago · Stresa',travel:'Boat and walking',priority:'Start with the island you care about most',guide:'lake-maggiore.html',timeline:[['Morning','Boat to Isola Bella before peak traffic.'],['Midday','Lunch on Isola dei Pescatori.'],['Afternoon','Isola Madre or return to Stresa.']],checklist:['Check boat schedule','Garden tickets','Sun protection'],bookings:[]},
    {date:'2026-09-08',label:'Tuesday, September 8',title:'Stresa or Piedmont',summary:'Choose a second Lake Maggiore day or commit to the wine-country drive.',overnight:'Il Dipinto Sul Lago · Stresa',travel:'Local lake day or Piedmont road trip',priority:'Decide based on weather and driving appetite',guide:'piedmont.html',timeline:[['Morning','Choose Stresa relaxation or depart early for Piedmont.'],['Midday','Lake lunch or winery-country lunch.'],['Evening','Return early enough to pack for Milan.']],checklist:['Cancel Urban Hive without penalty only before today’s deadline if plans changed','Confirm Milan parking/arrival','Pack for final city stay'],bookings:['Urban Hive free-cancellation deadline · September 8']},
    {date:'2026-09-09',label:'Wednesday, September 9',title:'Stresa to Milan',summary:'Travel to Milan, check in at Urban Hive and use the afternoon for Brera.',overnight:'Urban Hive Milano · Brera',travel:'Stresa → Milan',priority:'Make parking and check-in simple',guide:'milan.html',timeline:[['Morning','Leave Stresa and drive toward Milan.'],['Afternoon','Check in from 3:00 PM at Urban Hive.'],['Evening','Brera walk and aperitivo close to the hotel.']],checklist:['Urban Hive Expedia confirmation','Confirm car return or parking','Keep LIN departure plan visible'],bookings:['Urban Hive Milano · check-in from 3:00 PM']},
    {date:'2026-09-10',label:'Thursday, September 10',title:'A full Milan day',summary:'Brera, Duomo and one major museum or shopping district—then pack early.',overnight:'Urban Hive Milano · Brera',travel:'Walking and metro',priority:'Protect the early bedtime before LIN',guide:'milan.html',timeline:[['Morning','Duomo terraces and Galleria before crowds peak.'],['Afternoon','Choose Brera, Castello or The Last Supper if reserved.'],['Evening','Early dinner, pack and confirm the pre-dawn taxi.']],checklist:['Online check-in for KL1612','Confirm taxi pickup','Set two alarms','Keep passports and flight documents together'],bookings:['Urban Hive Milano · final night']},
    {date:'2026-09-11',label:'Friday, September 11',title:'Depart Milan Linate',summary:'Leave Urban Hive before dawn for KLM KL1612 at 6:40 AM.',overnight:'Flight home',travel:'Urban Hive → LIN → AMS',priority:'Be at LIN with ample time',guide:'practical.html#departure',timeline:[['Before dawn','Taxi or prearranged car from Urban Hive to LIN.'],['6:40 AM','KL1612 departs Milan Linate.'],['8:30 AM','Scheduled arrival in Amsterdam.']],checklist:['Passports','Phones and chargers','All bags checked','Hotel room sweep'],bookings:['KLM KL1612 · LIN 6:40 AM → AMS 8:30 AM']}
  ];


  // v5.1 concierge intelligence: compact, trip-specific action guidance.
  const conciergeByDate = {
    '2026-08-31':{start:'On arrival',startNote:'Keep the evening deliberately light.',arrival:'Viking · Marghera',arrivalNote:'Confirm tomorrow’s Fusina instructions.',food:'Dinner aboard',foodNote:'Avoid adding a complicated transfer.',weather:'Indoor ship evening',weatherNote:'Organize luggage and documents.'},
    '2026-09-01':{start:'After disembarkation',startNote:'Keep luggage transfer as the first priority.',arrival:'Hotel after 3 PM',arrivalNote:'Hotel Al Sotoportego · Cannaregio.',food:'Dinner near hotel',foodNote:'Choose an easy first-night table.',weather:'Churches + bacari',weatherNote:'Cannaregio works well in showers.'},
    '2026-09-02':{start:'Before 8 AM',startNote:'Reach San Marco before peak crowds.',arrival:'San Marco first',arrivalNote:'Then move toward quieter sestieri.',food:'Cicchetti lunch',foodNote:'Reserve dinner only if it matters.',weather:'Dorsoduro museums',weatherNote:'Use Accademia or Peggy Guggenheim.'},
    '2026-09-03':{start:'Early morning',startNote:'Car collection and westbound transfer.',arrival:'Lenno after 3 PM',arrivalNote:'Protect apartment check-in timing.',food:'Verona only if easy',foodNote:'Skip the stop if traffic slips.',weather:'Direct to Lenno',weatherNote:'Make Verona optional, not obligatory.'},
    '2026-09-04':{start:'First useful ferry',startNote:'Use the clearest forecast window.',arrival:'Bellagio or Varenna',arrivalNote:'Choose one priority villa.',food:'Lakeside lunch',foodNote:'Eat before the busiest ferry return.',weather:'Villa interiors',weatherNote:'Shorten the ferry circuit.'},
    '2026-09-05':{start:'Flexible morning',startNote:'Let energy and weather decide.',arrival:'One unhurried highlight',arrivalNote:'Avoid trying to repeat everything.',food:'Long local lunch',foodNote:'Stay close to Lenno if tired.',weather:'Villa Carlotta',weatherNote:'Gardens can wait for a dry interval.'},
    '2026-09-06':{start:'Check out by 10',startNote:'Load the car and leave calmly.',arrival:'Stresa afternoon',arrivalNote:'Park before exploring the promenade.',food:'Transfer-day lunch',foodNote:'Choose easy parking over prestige.',weather:'Early Stresa check-in',weatherNote:'Use the waterfront between showers.'},
    '2026-09-07':{start:'First island boat',startNote:'Begin with the island you value most.',arrival:'Isola Bella',arrivalNote:'Then Pescatori and Madre as energy allows.',food:'Pescatori lunch',foodNote:'Confirm service before committing.',weather:'Palace interiors',weatherNote:'Reduce garden time if rain is steady.'},
    '2026-09-08':{start:'Decision by breakfast',startNote:'Lake day or Piedmont—do not split both.',arrival:'Stresa or Langhe',arrivalNote:'Driving appetite is the deciding factor.',food:'Book winery lunch',foodNote:'Only if choosing Piedmont.',weather:'Lake towns + cafés',weatherNote:'Keep the day local in poor visibility.'},
    '2026-09-09':{start:'Comfortable morning',startNote:'Avoid Milan’s busiest arrival period.',arrival:'Urban Hive after 3 PM',arrivalNote:'Brera is the evening anchor.',food:'Brera aperitivo',foodNote:'Keep dinner walkable from the hotel.',weather:'Brera galleries',weatherNote:'Use covered central Milan sights.'},
    '2026-09-10':{start:'Duomo opening',startNote:'Front-load the major sight.',arrival:'Back to hotel early',arrivalNote:'Pack before dinner.',food:'Early final dinner',foodNote:'Protect sleep before LIN departure.',weather:'Museums + Galleria',weatherNote:'Keep the route compact and central.'},
    '2026-09-11':{start:'About 3:45–4:00 AM',startNote:'Prearranged car from Urban Hive.',arrival:'LIN by about 4:40 AM',arrivalNote:'KL1612 departs at 6:40 AM.',food:'Airport coffee',foodNote:'Do not rely on a full hotel breakfast.',weather:'No change needed',weatherNote:'Road transfer is short; leave buffer.'}
  };
  const actionLinksByGuide={
    'venice.html':[['Hotel route','hotel-routes.html#venice'],['Venice guide','venice.html'],['Reservations','reservations.html']],
    'lake-como.html':[['Around the stay','hotel-routes.html#como'],['Lake Como guide','lake-como.html'],['Maps','map.html']],
    'lake-maggiore.html':[['Around the stay','hotel-routes.html#stresa'],['Lake Maggiore guide','lake-maggiore.html'],['Maps','map.html']],
    'piedmont.html':[['Piedmont option','piedmont.html'],['Stresa alternative','lake-maggiore.html'],['Reservations','reservations.html']],
    'milan.html':[['Urban Hive route','hotel-routes.html#milan'],['Milan guide','milan.html'],['Departure plan','practical.html#departure']],
    'practical.html#departure':[['Departure playbook','practical.html#departure'],['Reservations','reservations.html'],['Trip readiness','readiness.html']]
  };

  const parseLocalDate = value => { const [y,m,d]=value.split('-').map(Number); return new Date(y,m-1,d); };
  const tripStart=parseLocalDate(tripDays[0].date), tripEnd=parseLocalDate(tripDays[tripDays.length-1].date);
  const todayNow=new Date(); todayNow.setHours(0,0,0,0);
  const actualIndex=tripDays.findIndex(day=>day.date===`${todayNow.getFullYear()}-${String(todayNow.getMonth()+1).padStart(2,'0')}-${String(todayNow.getDate()).padStart(2,'0')}`);
  let selectedIndex=actualIndex>=0?actualIndex:(todayNow<tripStart?0:tripDays.length-1);

  function renderTripDay(index){
    selectedIndex=Math.max(0,Math.min(tripDays.length-1,index)); const day=tripDays[selectedIndex];
    const set=(sel,val)=>{const el=document.querySelector(sel); if(el) el.textContent=val};
    set('[data-today-date]',day.label);set('[data-today-title]',day.title);set('[data-today-summary]',day.summary);set('[data-today-overnight]',day.overnight);set('[data-today-travel]',day.travel);set('[data-today-priority]',day.priority);
    const guide=document.querySelector('[data-today-guide]'); if(guide) guide.href=day.guide;
    const concierge=conciergeByDate[day.date]||{}; [['start','start'],['arrival','arrival'],['food','food'],['weather','weather']].forEach(([key,attr])=>{set(`[data-concierge-${attr}]`,concierge[key]||'Flexible');set(`[data-concierge-${attr}-note]`,concierge[key+'Note']||'');});
    const actions=document.querySelector('[data-today-actions]'); if(actions){const links=actionLinksByGuide[day.guide]||[['Open guide',day.guide],['Maps','map.html'],['Reservations','reservations.html']];actions.innerHTML=links.map(([label,href],i)=>`<a class="${i===0?'primary':''}" href="${href}">${label}</a>`).join('');}
    const timeline=document.querySelector('[data-today-timeline]'); if(timeline) timeline.innerHTML=day.timeline.map(([time,text])=>`<article><span>${time}</span><p>${text}</p></article>`).join('');
    const bookings=document.querySelector('[data-today-bookings]'); if(bookings) bookings.innerHTML=day.bookings.length?day.bookings.map(x=>`<div class="today-booking"><strong>${x}</strong></div>`).join(''):'<p class="empty-state">No fixed reservation entered for this day.</p>';
    const checklist=document.querySelector('[data-today-checklist]'); if(checklist){ checklist.innerHTML=day.checklist.map((x,i)=>`<label><input type="checkbox" data-check="${i}"><span>${x}</span></label>`).join(''); const saved=JSON.parse(localStorage.getItem(`nitc-check-${day.date}`)||'[]'); checklist.querySelectorAll('input').forEach((el,i)=>{el.checked=!!saved[i];el.addEventListener('change',()=>{localStorage.setItem(`nitc-check-${day.date}`,JSON.stringify([...checklist.querySelectorAll('input')].map(x=>x.checked)))})}) }
    const notes=document.querySelector('[data-today-notes]'); if(notes){notes.value=localStorage.getItem(`nitc-notes-${day.date}`)||'';notes.oninput=()=>{localStorage.setItem(`nitc-notes-${day.date}`,notes.value);set('[data-today-save-status]','Saved on this device.')}}
    const select=document.querySelector('[data-today-select]'); if(select) select.value=day.date;
    const tomorrow=tripDays[selectedIndex+1]; set('[data-tomorrow-title]',tomorrow?tomorrow.title:'Journey complete');set('[data-tomorrow-summary]',tomorrow?tomorrow.summary:'Your itinerary ends here. Safe travels.'); const tl=document.querySelector('[data-tomorrow-link]');if(tl)tl.href=tomorrow?'today.html?date='+tomorrow.date:'itinerary.html';
    history.replaceState(null,'',`today.html?date=${day.date}`);
  }

  const daySelect=document.querySelector('[data-today-select]');
  if(daySelect){daySelect.innerHTML=tripDays.map(d=>`<option value="${d.date}">${d.label.replace(/^[^,]+, /,'')} · ${d.title}</option>`).join(''); const requested=new URLSearchParams(location.search).get('date'); const idx=requested?tripDays.findIndex(d=>d.date===requested):selectedIndex; renderTripDay(idx>=0?idx:selectedIndex); daySelect.addEventListener('change',()=>renderTripDay(tripDays.findIndex(d=>d.date===daySelect.value))); document.querySelectorAll('[data-day-shift]').forEach(b=>b.addEventListener('click',()=>renderTripDay(selectedIndex+Number(b.dataset.dayShift))));}

  const networkLabel=document.querySelector('[data-network-label]'), networkDot=document.querySelector('[data-network-dot]');
  function updateNetwork(){if(networkLabel)networkLabel.textContent=navigator.onLine?'Online · offline copy ready after first visit':'Offline mode · saved guide available';if(networkDot)networkDot.classList.toggle('offline',!navigator.onLine)}
  updateNetwork();addEventListener('online',updateNetwork);addEventListener('offline',updateNetwork);
  const countdown=document.querySelector('[data-trip-countdown]'); if(countdown){const days=Math.ceil((tripStart-todayNow)/86400000);countdown.textContent=actualIndex>=0?`Trip day ${actualIndex+1} of ${tripDays.length}`:(todayNow<tripStart?`${days} days until departure`:'Trip dates have passed');}

  const homeTitle=document.querySelector('[data-home-trip-title]');
  if(homeTitle){const d=tripDays[selectedIndex];document.querySelector('[data-home-trip-date]').textContent=actualIndex>=0?d.label:'August 31 — September 11, 2026';homeTitle.textContent=actualIndex>=0?d.title:(todayNow<tripStart?'Your September journey is ready.':'Your trip archive is ready.');document.querySelector('[data-home-trip-summary]').textContent=actualIndex>=0?d.summary:'Open Trip Mode to preview any day, review bookings and save private notes offline.';document.querySelector('[data-home-trip-link]').href=`today.html?date=${d.date}`;}


  // v7.0.1 — device-only Emergency Pack fields.
  document.querySelectorAll('[data-emergency-field]').forEach(field=>{
    const key='nitc-emergency-'+field.dataset.emergencyField;
    field.value=localStorage.getItem(key)||'';
    field.addEventListener('input',()=>localStorage.setItem(key,field.value));
  });
  document.querySelectorAll('[data-emergency-check]').forEach(box=>{
    const key='nitc-emergency-check-'+box.dataset.emergencyCheck;
    box.checked=localStorage.getItem(key)==='1';
    box.addEventListener('change',()=>localStorage.setItem(key,box.checked?'1':'0'));
  });
  document.querySelector('[data-print-pack]')?.addEventListener('click',()=>window.print());
  document.querySelector('[data-clear-emergency]')?.addEventListener('click',()=>{
    if(!confirm('Clear all editable Emergency Pack fields stored on this device?')) return;
    document.querySelectorAll('[data-emergency-field]').forEach(field=>{localStorage.removeItem('nitc-emergency-'+field.dataset.emergencyField);field.value='';});
    document.querySelectorAll('[data-emergency-check]').forEach(box=>{localStorage.removeItem('nitc-emergency-check-'+box.dataset.emergencyCheck);box.checked=false;});
  });

  if('serviceWorker' in navigator){navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}
})();


// v4.4 persistent travel desk
(() => {
  const drawer=document.getElementById('travelDrawer');
  const more=document.querySelector('.dock-more');
  const close=document.querySelector('.drawer-close');
  const scrim=document.querySelector('.drawer-scrim');
  const setOpen=(open)=>{
    if(!drawer||!more||!scrim)return;
    drawer.classList.toggle('open',open);
    drawer.setAttribute('aria-hidden',String(!open));
    more.setAttribute('aria-expanded',String(open));
    scrim.hidden=!open;
    document.body.classList.toggle('drawer-open',open);
    if(open) close?.focus({preventScroll:true});
  };
  more?.addEventListener('click',()=>setOpen(!drawer.classList.contains('open')));
  close?.addEventListener('click',()=>setOpen(false));
  scrim?.addEventListener('click',()=>setOpen(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
  const page=(location.pathname.split('/').pop()||'index.html').split('?')[0];
  document.querySelectorAll('.travel-dock a,.drawer-links a,.simple-site-menu a').forEach(a=>{
    if((a.getAttribute('href')||'').split('?')[0]===page)a.setAttribute('aria-current','page');
  });
  const syncConnection=()=>{
    const online=navigator.onLine;
    document.querySelectorAll('.connection-dot').forEach(el=>{el.classList.toggle('online',online);el.classList.toggle('offline',!online)});
    document.querySelectorAll('[data-connection-label]').forEach(el=>el.textContent=online?'Online · external map links available':'Offline · saved guide remains available');
  };
  addEventListener('online',syncConnection);addEventListener('offline',syncConnection);syncConnection();
})();


// v4.7 trip-readiness persistence
(() => {
  const items=[...document.querySelectorAll('[data-ready-item]')];
  if(!items.length) return;
  const update=()=>{
    const done=items.filter(i=>i.checked).length;
    document.querySelector('[data-readiness-count]').textContent=`${done} of ${items.length} complete`;
    document.querySelector('[data-readiness-bar]').style.width=`${Math.round(done/items.length*100)}%`;
    localStorage.setItem('nitc-readiness',JSON.stringify(Object.fromEntries(items.map(i=>[i.dataset.readyItem,i.checked]))));
  };
  let saved={}; try{saved=JSON.parse(localStorage.getItem('nitc-readiness')||'{}')}catch{}
  items.forEach(i=>{i.checked=!!saved[i.dataset.readyItem];i.addEventListener('change',update)});
  const notes=document.querySelector('[data-readiness-notes]');
  if(notes){notes.value=localStorage.getItem('nitc-readiness-notes')||'';notes.addEventListener('input',()=>{localStorage.setItem('nitc-readiness-notes',notes.value);document.querySelector('[data-readiness-status]').textContent='Saved on this device.'})}
  update();


  // v5.0 traveler experience layer: reading progress, page-to-page navigation, and quick jump.
  const pageOrder = [
    ['index.html','Home'],['today.html','Today'],['itinerary.html','Daily guide'],['companion.html','Companion'],['my-trip.html','My trip'],['reservations.html','Reservations'],
    ['readiness.html','Trip readiness'],['hotels.html','Stays'],['hotel-routes.html','Around your stays'],['map.html','Maps'],['practical.html','Practical'],
    ['venice.html','Venice'],['lake-como.html','Lake Como'],['lake-maggiore.html','Lake Maggiore'],['milan.html','Milan'],
    ['more-destinations.html','More destinations'],['dolomites.html','Dolomites'],['cinque-terre.html','Cinque Terre'],['verona.html','Verona & Lake Garda'],['piedmont.html','Piedmont'],['help.html','Help']
  ];

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden','true');
  progress.innerHTML = '<span></span>';
  document.body.prepend(progress);
  const progressBar = progress.firstElementChild;
  const updateProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progressBar.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
  };
  addEventListener('scroll', updateProgress, {passive:true});
  addEventListener('resize', updateProgress, {passive:true});
  updateProgress();

  if (pageName !== 'index.html' && document.querySelector('main')) {
    const idx = pageOrder.findIndex(([file]) => file === pageName);
    if (idx >= 0) {
      const nav = document.createElement('nav');
      nav.className = 'chapter-stepper';
      nav.setAttribute('aria-label','Continue through the companion');
      const prev = pageOrder[idx-1], next = pageOrder[idx+1];
      nav.innerHTML = `${prev ? `<a class="step-prev" href="${prev[0]}"><small>Previous</small><strong>← ${prev[1]}</strong></a>` : '<span></span>'}${next ? `<a class="step-next" href="${next[0]}"><small>Continue</small><strong>${next[1]} →</strong></a>` : '<a class="step-next" href="index.html"><small>Return</small><strong>Home →</strong></a>'}`;
      document.querySelector('main').insertAdjacentElement('afterend', nav);
    }
  }

})();


// v7.0 RC3 — accessibility and resilience polish
(() => {
  document.documentElement.classList.add('js');
  const live=document.createElement('div');
  live.className='sr-only'; live.setAttribute('aria-live','polite'); live.setAttribute('aria-atomic','true');
  document.body.appendChild(live);
  const announce=(message)=>{live.textContent='';setTimeout(()=>{live.textContent=message},30)};
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
    }
  });
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error',()=>{img.classList.add('image-unavailable');img.alt=img.alt||'Image unavailable';},{once:true});
  });
  addEventListener('online',()=>announce('Internet connection restored'));
  addEventListener('offline',()=>announce('Offline mode. Saved guide pages remain available'));
})();
