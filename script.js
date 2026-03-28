const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const list = document.getElementById('list');
const balance = document.getElementById('balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateUI() {
  list.innerHTML = '';
  let total = 0;

  transactions.forEach((t, index) => {
    total += t.amount;

    const li = document.createElement('li');

    li.innerHTML = `
      <div class="transaction-info">
        <span>${t.text}</span>
        <small>${t.category}</small>
      </div>

      <span class="amount" style="color:${t.amount < 0 ? 'red' : 'lightgreen'}">
        ₹${t.amount}
      </span>

      <button class="delete-btn" onclick="removeTransaction(${index})">X</button>
    `;

    list.appendChild(li);
  });

  balance.innerText = total;

  localStorage.setItem('transactions', JSON.stringify(transactions));

  updateChart();
  showInsight();
}

function removeTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const transaction = {
    text: text.value,
    amount: +amount.value,
    category: category.value
  };

  transactions.push(transaction);

  text.value = '';
  amount.value = '';

  updateUI();
});

function updateChart() {
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const ctx = document.getElementById('chart').getContext('2d');

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, Math.abs(expense)],
      }]
    }
  });
}

function showInsight() {
  let expense = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  if (expense < -10000) {
    alert("⚠️ Warning: You are spending too much!");
  }
}

updateUI();
