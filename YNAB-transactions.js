// Creates and sends a transaction to YNAB. 
function prepareTransaction(budgetName, accountName, transactionDate, payAmount, payeeName, transactionMemo, categoryName) {
  var accessToken = PropertiesService.getScriptProperties().getProperty('accessToken') // Your YNAB Personal Access Token, retrieved from your Script Properties Service. Must first follow instructions for YNAB-config.gs.
  if (typeof (budgetName) === 'undefined') budgetName = PropertiesService.getScriptProperties().getProperty('budgetName') // The name of your budget. Will use the budget name configued in the Script Properties Service if value is not passed.
  if (typeof (accountName) === 'undefined') accountName = PropertiesService.getScriptProperties().getProperty('accountName') // The name of your credit card. Will use the default account configued in YNAB-config.gs if value is not passed.
  if (typeof (transactionDate) === 'undefined') transactionDate = new Date() // The date of your transaction. Will use today's date if value is not passed.
  if (typeof (transactionMemo) === 'undefined') transactionMemo = 'Entered by Google Apps Script' // The info to put in the transaction memo. Will use value entered here if a value is not passed.
  if (typeof (categoryName) === 'undefined') categoryName = 'Uncategorized' // The category of your transaction. Will default to value here if a value is not passed.

  // YNAB API settings
  var url = 'https://api.youneedabudget.com/v1'
  var headers = {
    "Authorization": "Bearer " + accessToken,
    "Content-Type": "application/json; charset=utf-8"
  }

  // Set budget URL
  if (budgetName === 'last-used') {
    var budgetUrl = url + '/budgets/' + 'last-used'
  }
  else {
    // Get all budgets, find our budget by name
    var budgets = JSON.parse(UrlFetchApp.fetch(url + '/budgets', { 'headers': headers })).data.budgets
    var budget = findObjectByKey(budgets, 'name', budgetName)
    var budgetUrl = url + '/budgets/' + budget.id
  }

  // Get all accounts in the budget, find our credit card account by name
  var accountsUrl = budgetUrl + '/accounts'
  var accounts = JSON.parse(UrlFetchApp.fetch(accountsUrl, { 'headers': headers })).data.accounts
  var account = findObjectByKey(accounts, 'name', accountName)

  // Get all categories in the budget
  var categoryUrl = budgetUrl + '/categories'
  var categoryGroups = JSON.parse(UrlFetchApp.fetch(categoryUrl, { 'headers': headers })).data.category_groups

  // Iterate through each category group, check if our category is in the category group, by name
  categoryGroups.forEach(function (categoryGroup) {
    var category = findObjectByKey(categoryGroup.categories, 'name', categoryName)
    if (category) {

      // Record a transaction
      sendTransaction(account.id, payAmount, transactionDate, payeeName, category.id, transactionMemo, budgetUrl, headers)
    }
  })
}


// Record a transaction
function sendTransaction(accountId, payAmount, transactionDate, payeeName, categoryId, transactionMemo, budgetUrl, headers) {
  var transactionData = {
    'transaction': {
      'account_id': accountId,
      'date': Utilities.formatDate(transactionDate, 'America/New_York', 'yyyy-MM-dd'),
      'amount': ((payAmount) * 1000).toString(),
      'payee_name': payeeName,
      'category_id': categoryId,
      'memo': transactionMemo,
      'cleared': 'uncleared',
      'approved': false
    }
  }

  var options = {
    'method': 'post',
    'payload': JSON.stringify(transactionData),
    'headers': headers
  }

  var transactionUrl = budgetUrl + '/transactions'
  var result = UrlFetchApp.fetch(transactionUrl, options)
}


// Function to find objects in an array of objects by key value
function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}