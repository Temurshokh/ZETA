// Expenses Tool Logic
let expenses = JSON.parse(localStorage.getItem('zeta_expenses')) || [];
let currentCategory = 'ovqat';

// Handle category selection
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat;
    });
});

function addExpense() {
    const amountInput = document.getElementById('exp-amount');
    const noteInput = document.getElementById('exp-note');
    const amount = parseFloat(amountInput.value);
    const note = noteInput.value.trim() || currentCategory;

    if (!amount || amount <= 0) {
        alert('Iltimos, to\'g\'ri summa kiriting');
        return;
    }

    const newExpense = {
        id: Date.now(),
        amount,
        note,
        category: currentCategory,
        date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
    };

    expenses.unshift(newExpense);
    saveExpenses();
    renderExpenses();
    
    // Clear inputs
    amountInput.value = '';
    noteInput.value = '';

    // Add XP if exists
    if (window.giveXP) window.giveXP(5);
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses();
    renderExpenses();
}

function clearHistory() {
    if (confirm('Barcha harajatlar o\'chirilsinmi?')) {
        expenses = [];
        saveExpenses();
        renderExpenses();
    }
}

function saveExpenses() {
    localStorage.setItem('zeta_expenses', JSON.stringify(expenses));
}

function renderExpenses() {
    const historyList = document.getElementById('exp-history');
    const totalDisplay = document.getElementById('total-expense');
    
    // Update Total
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalDisplay.innerText = total.toLocaleString();

    // Render List
    historyList.innerHTML = '';
    if (expenses.length === 0) {
        historyList.innerHTML = '<div class="text-center" style="color: var(--text-muted); padding: 2rem;">Hali harajatlar yo\'q</div>';
        return;
    }

    expenses.forEach(e => {
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.innerHTML = `
            <div class="expense-info">
                <h4>${e.note}</h4>
                <span>${e.date} • ${getCatEmoji(e.category)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="expense-val">-${e.amount.toLocaleString()}</span>
                <i class="fas fa-trash delete-btn" onclick="deleteExpense(${e.id})"></i>
            </div>
        `;
        historyList.appendChild(item);
    });
}

function getCatEmoji(cat) {
    const icons = {
        'ovqat': '🍕',
        'transport': '🚗',
        'shoppng': '🛍',
        'kommunal': '🏠',
        'boshqa': '✨'
    };
    return icons[cat] || '💰';
}

// Initial Render
document.addEventListener('DOMContentLoaded', renderExpenses);
