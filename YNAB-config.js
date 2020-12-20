// Configure your personal settings for your YNAB account.
// Configure the private settings for your YNAB scripts. You only need to configure and run this one time unless you want to change the options.
function setYNABProperties() {
  
  var YNABProps = PropertiesService.getScriptProperties();
  
  // Delete and then set Script Properties
  YNABProps.deleteProperty('accessToken')
  YNABProps.setProperty('accessToken', '') // YNAB person access token. Visit: https://api.youneedabudget.com
  
  YNABProps.deleteProperty('budgetName')
  YNABProps.setProperty('budgetName', '') // Your default budget. Use 'last-used' if you want to auto-select the budget you last used.
  
  YNABProps.deleteProperty('accountName')
  YNABProps.setProperty('accountName', '') // The default account (e.g. cash, credit card name, bank account name)
  
  // For troubleshooting.
  // var data = YNABProps.getProperties();
  // for (var key in data) {
  //   Logger.log('Key: %s, Value: %s', key, data[key]);
  // }
  // YNABProps.deleteAllProperties();
  //  var data = YNABProps.getProperties();
}