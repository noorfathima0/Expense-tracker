let incomeList = [];
let expenseList = [];

// Add Income
document.getElementById('add-income').addEventListener('click', () => {
    addTransaction('income');
});

// Add Expense
document.getElementById('add-expense').addEventListener('click', () => {
    addTransaction('expense');
});

function addTransaction(type) {
    const date = document.getElementById('transaction-date').value;
    const desc = document.getElementById('transaction-desc').value;
    const category = document.getElementById('transaction-category').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);

    if (!date || !desc || !category || isNaN(amount) || amount <= 0) {
        alert('Please enter valid transaction details.');
        return;
    }

    const transaction = { date, desc, category, amount };

    if (type === 'income') {
        incomeList.push(transaction);
    } else {
        expenseList.push(transaction);
    }

    displayTransactions();
    updateSummary();

    // Clear input fields
    document.getElementById('transaction-date').value = '';
    document.getElementById('transaction-desc').value = '';
    document.getElementById('transaction-category').value = '';
    document.getElementById('transaction-amount').value = '';
}

function displayTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    const allTransactions = [...incomeList, ...expenseList];
    allTransactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.textContent = `${transaction.date} - ${transaction.desc} - ${transaction.category}: $${transaction.amount.toFixed(2)}`;
        
        // Create Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTransaction(index);
        li.appendChild(editBtn);
        
        transactionList.appendChild(li);
    });
}

// Update summary
function updateSummary() {
    const totalIncome = incomeList.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenseList.reduce((sum, expense) => sum + expense.amount, 0);
    const netIncome = totalIncome - totalExpenses;

    document.getElementById('total-income').innerText = totalIncome.toFixed(2);
    document.getElementById('total-expenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('net-income').innerText = netIncome.toFixed(2);

    renderChart();
}

function getExpensesByCategory() {
    const categories = {};
    expenseList.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
    return categories;
}



function editTransaction(index) {
    const transaction = [...incomeList, ...expenseList][index];

    document.getElementById('transaction-date').value = transaction.date;
    document.getElementById('transaction-desc').value = transaction.desc;
    document.getElementById('transaction-category').value = transaction.category;
    document.getElementById('transaction-amount').value = transaction.amount;

    // Remove the transaction from its respective list for editing
    if (incomeList.includes(transaction)) {
        incomeList.splice(incomeList.indexOf(transaction), 1);
    } else {
        expenseList.splice(expenseList.indexOf(transaction), 1);
    }
    displayTransactions();
}

// Export transactions to PDF
document.getElementById('export-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Expense Tracker Data', 20, 20);
    doc.setFontSize(12);

    let y = 40;

    const allTransactions = [...incomeList, ...expenseList];

    allTransactions.forEach(transaction => {
        const line = `${transaction.date} - ${transaction.desc} - ${transaction.category}: $${transaction.amount.toFixed(2)}`;
        doc.text(line, 20, y);
        y += 10; // Move to the next line
    });

    doc.save('transactions.pdf');
});

// Import transactions from JSON
document.getElementById('import-data').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = JSON.parse(e.target.result);
            incomeList = data.income || [];
            expenseList = data.expenses || [];
            displayTransactions();
            updateSummary();
        };
        reader.readAsText(file);
    }
});
