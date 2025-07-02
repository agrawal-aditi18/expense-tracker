document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalAmount = calculateTotal(); //🔸 This line calls a function (defined later) that adds up all the saved expenses and stores it in totalAmount.

  renderExpenses(); //🔸 This function (defined later) creates <li> elements for each expense and shows them on screen.

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();  //🔸 By default, submitting a form refreshes the page. This line prevents that so we can use JavaScript to handle everything smoothly.
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim()); //becz the value we got is stored in string format and that can also be in float that wahy we used parse int

    if (name !== "" && !isNaN(amount) && amount > 0) {
      //name empty not allowed, amount as string not allowed and -ve too
      const newExpense = {
        id: Date.now(),
        name: name, //can also write name only
        amount: amount,
      }; //id: Date.now() → creates a unique number based on current time (used to identify/delete expense)
      //name & amount are values from the form
      expenses.push(newExpense);
      saveExpensesTolocal();
      renderExpenses();
      updateTotal();

      //clear input
      expenseNameInput.value = "";
      expenseAmountInput.value = "";
      //This resets the form fields to empty so user can enter a new expense
    }
  });

  function renderExpenses() {
    expenseList.innerHTML = ""; //Clears the entire list on screen so we can rebuild it.
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${expense.name} - $${expense.amount}
        <button data-id="${expense.id}">Delete</button>
        `;
      expenseList.appendChild(li);
    });
  }

  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  } 
  //.reduce() → used to loop through and sum all the amounts 
  //Starts with 0, and adds each expense.amount one by one
  //Returns total sum

  function saveExpensesTolocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
  }

  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id")); //Gets the ID of the expense to be deleted.
      expenses = expenses.filter((expense) => expense.id !== expenseId); //Keeps all expenses except the one with matching ID (deletes it)

      saveExpensesTolocal();
      renderExpenses();
      updateTotal();
    }
  });
});
