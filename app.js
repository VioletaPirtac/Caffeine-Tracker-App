(function(){
  const LIMIT = 400;
  const totalEl = document.getElementById('total');
  const progressEl = document.getElementById('progress');
  const messageEl = document.getElementById('message');
  const calendarEl = document.getElementById('calendar');
  const monthLabel = document.getElementById('monthLabel');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');

  // History stored as { 'YYYY-MM-DD': number }
  const HISTORY_KEY = 'caffeine_history_v1';
  function readHistory(){
    try{ return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}'); }catch(e){return {}};
  }
  function writeHistory(h){
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  }

  // currently selected date (YYYY-MM-DD)
  let selectedDate = (new Date()).toISOString().slice(0,10);
  let cursor = new Date(); // used for month view

  function getTotal(){
    const h = readHistory();
    return Number(h[selectedDate] || 0);
  }

  function setTotalForSelected(v){
    const h = readHistory();
    h[selectedDate] = Number(v);
    writeHistory(h);
  }

  function updateUI(){
    const total = getTotal();
    totalEl.textContent = total;
    const pct = Math.min(100, Math.round((total / LIMIT) * 100));
    progressEl.style.width = pct + '%';
    progressEl.setAttribute('aria-valuenow', Math.min(total, LIMIT));

    progressEl.classList.remove('green','orange','red');
    if(total < LIMIT * 0.6) progressEl.classList.add('green');
    else if(total < LIMIT) progressEl.classList.add('orange');
    else progressEl.classList.add('red');

    if(total === 0) messageEl.textContent = "You're good to go.";
    else if(total < LIMIT * 0.6) messageEl.textContent = 'Light — well under the limit.';
    else if(total < LIMIT) messageEl.textContent = "Caution — approaching the 400mg limit.";
    else messageEl.textContent = 'Limit exceeded — consider stopping caffeine for today.';
  renderCalendar();
  }

  function add(amount){
  const total = getTotal() + amount;
  setTotalForSelected(total);
    updateUI();
  }

  function reset(){
  setTotalForSelected(0);
    updateUI();
  }

  document.getElementById('espresso').addEventListener('click', ()=> add(60));
  document.getElementById('americano').addEventListener('click', ()=> add(150));
  document.getElementById('cappuccino').addEventListener('click', ()=> add(80));
  document.getElementById('reset').addEventListener('click', reset);

  // date helpers and calendar rendering
  function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
  function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }

  function formatMonthLabel(d){
    return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }

  function renderCalendar(){
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    monthLabel.textContent = formatMonthLabel(cursor);
    calendarEl.innerHTML = '';

    // day-of-week headers
    const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    weekdays.forEach(h => {
      const el = document.createElement('div'); el.className='day disabled'; el.innerHTML = `<div class="date">${h}</div>`; calendarEl.appendChild(el);
    });

    const firstWeekday = start.getDay();
    // fill blanks before first day
    for(let i=0;i<firstWeekday;i++){
      const el = document.createElement('div'); el.className='day disabled'; calendarEl.appendChild(el);
    }

    const history = readHistory();
    for(let d=1; d<=end.getDate(); d++){
      const dt = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      const key = dt.toISOString().slice(0,10);
      const amt = Number(history[key] || 0);
      const pct = Math.min(100, Math.round((amt / LIMIT) * 100));

      const el = document.createElement('div'); el.className='day';
      if(key === selectedDate) el.style.borderColor = '#94a3b8';
      el.innerHTML = `<div class="date">${d}</div><div class="amt">${amt} mg</div>`;

      // color indicator background
      if(amt >= LIMIT) el.style.boxShadow = 'inset 0 0 0 999px rgba(239,68,68,0.06)';
      else if(amt >= LIMIT * 0.6) el.style.boxShadow = 'inset 0 0 0 999px rgba(245,158,11,0.06)';
      else if(amt > 0) el.style.boxShadow = 'inset 0 0 0 999px rgba(52,211,153,0.06)';

      el.addEventListener('click', ()=>{
        selectedDate = key;
        updateUI();
      });

      calendarEl.appendChild(el);
    }
  }

  prevMonthBtn.addEventListener('click', ()=>{ cursor.setMonth(cursor.getMonth()-1); renderCalendar(); });
  nextMonthBtn.addEventListener('click', ()=>{ cursor.setMonth(cursor.getMonth()+1); renderCalendar(); });


  // initialize
  updateUI();
})();
