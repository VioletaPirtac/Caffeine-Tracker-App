(function(){
  const LIMIT = 400;
  const totalEl = document.getElementById('total');
  const progressEl = document.getElementById('progress');
  const messageEl = document.getElementById('message');

  const getTotal = () => Number(localStorage.getItem('caffeine_total') || 0);
  const setTotal = (v) => {
    localStorage.setItem('caffeine_total', String(v));
  };

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
  }

  function add(amount){
    const total = getTotal() + amount;
    setTotal(total);
    updateUI();
  }

  function reset(){
    setTotal(0);
    updateUI();
  }

  document.getElementById('espresso').addEventListener('click', ()=> add(60));
  document.getElementById('americano').addEventListener('click', ()=> add(150));
  document.getElementById('cappuccino').addEventListener('click', ()=> add(80));
  document.getElementById('reset').addEventListener('click', reset);

  // initialize
  updateUI();
})();
