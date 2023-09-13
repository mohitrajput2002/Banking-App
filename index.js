// Load existing accounts from localStorage
const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

// Function to generate a random 16-digit account number
function generateAccountNumber() {
  const min = 100000000000;
  const max = 999999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to display account list in the "Stored Accounts" section
function displayAccounts() {
  const accountList = document.getElementById("accountList");
  accountList.innerHTML = "";

  accounts.forEach((account, index) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.innerHTML = `
      <strong>Account Number: ${account.accountNumber}</strong><br>
      Account Holder: ${account.accountHolderName}<br>
      Account Type: ${account.accountType}<br>
      Balance: ₹${account.balance.toFixed(2)}
      <button class="btn btn-sm btn-warning ml-2 float-right" onclick="editAccount(${index})">Edit</button>
      <button class="btn btn-sm btn-danger ml-2 float-right" onclick="deleteAccount(${index})">Delete</button>
    `;
    accountList.appendChild(listItem);
  });
}

// Function to save accounts in localStorage
function saveAccounts() {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

// Function to populate the "Account Number" dropdown
function populateAccountNumbers() {
  const accountNumberSelect = document.getElementById("accountNumber");
  accountNumberSelect.innerHTML =
    '<option value="">Select Account Number</option>';

  accounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.accountNumber;
    option.textContent = account.accountNumber;
    accountNumberSelect.appendChild(option);
  });
}

// Event listener for the transaction type dropdown
document
  .getElementById("transactionType")
  .addEventListener("change", function () {
    const transactionType = this.value;
    const balanceField = document.getElementById("balance");
    const accountTypeField = document.getElementById("accountType");
    const accountNumberField = document.getElementById("accountNumber");

    // Hide or show fields based on the selected transaction type
    balanceField.style.display =
      transactionType !== "Withdraw" ? "block" : "none";
    accountTypeField.style.display =
      transactionType !== "Withdraw" ? "block" : "none";
    accountNumberField.style.display =
      transactionType === "Withdraw" ? "block" : "none";

    if (transactionType === "Withdraw") {
      populateAccountNumbers();
    }
  });

// Function to perform transactions (Deposit, Withdraw, Check Balance)
function performTransaction() {
  const transactionType = document.getElementById("transactionType").value;
  const resultElement = document.getElementById("result");

  try {
    if (transactionType === "Withdraw") {
      const accountNumber = document.getElementById("accountNumber").value;
      const selectedAccount = accounts.find(
        (account) => account.accountNumber === accountNumber
      );

      if (!selectedAccount) {
        throw "Account not found.";
      }

      const withdrawalAmount = parseFloat(
        document.getElementById("balance").value
      );
      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        throw "Invalid withdrawal amount.";
      }

      if (selectedAccount.balance < withdrawalAmount) {
        throw "Insufficient balance.";
      }

      selectedAccount.balance -= withdrawalAmount;

      resultElement.innerHTML = `Withdrawn ₹${withdrawalAmount.toFixed(
        2
      )} from ${selectedAccount.accountType} account for ${
        selectedAccount.accountHolderName
      }. New Balance: ₹${selectedAccount.balance.toFixed(2)}`;
    } else if (transactionType === "Deposit") {
      const accountType = document.getElementById("accountType").value;
      const accountHolderName =
        document.getElementById("accountHolderName").value;
      const balance = parseFloat(document.getElementById("balance").value);

      if (isNaN(balance) || balance <= 0) {
        throw "Invalid deposit amount.";
      }

      const accountNumber = generateAccountNumber();
      accounts.push({ accountNumber, accountHolderName, accountType, balance });

      resultElement.innerHTML = `Deposited ₹${balance.toFixed(
        2
      )} into ${accountType} account for ${accountHolderName}. Account Number: ${accountNumber}`;
    } else if (transactionType === "CheckBalance") {
      const accountNumber = document.getElementById("accountNumber").value;
      const selectedAccount = accounts.find(
        (account) => account.accountNumber === accountNumber
      );

      if (!selectedAccount) {
        throw "Account not found.";
      }

      resultElement.innerHTML = `Balance for ${
        selectedAccount.accountHolderName
      }'s ${
        selectedAccount.accountType
      } account is ₹${selectedAccount.balance.toFixed(2)}.`;
    } else {
      throw "Invalid transaction type.";
    }

    saveAccounts();
    displayAccounts();
  } catch (error) {
    resultElement.innerHTML = `<span class="text-danger">Error: ${error}</span>`;
  } finally {
    // Clear form fields
    document.getElementById("accountHolderName").value = "";
    document.getElementById("balance").value = "";
    document.getElementById("transactionType").value = "Deposit";
  }
}

// Function to edit an account
function editAccount(index) {
  const account = accounts[index];
  document.getElementById("accountHolderName").value =
    account.accountHolderName;
  document.getElementById("accountType").value = account.accountType;
  document.getElementById("balance").value = account.balance;
  document.getElementById("transactionType").value = "Deposit"; // Reset transaction type
  accounts.splice(index, 1);
  saveAccounts();
  displayAccounts();
}

// Function to delete an account
function deleteAccount(index) {
  accounts.splice(index, 1);
  saveAccounts();
  displayAccounts();
}

// Initialize the account list on page load
window.onload = function () {
  displayAccounts();
};
