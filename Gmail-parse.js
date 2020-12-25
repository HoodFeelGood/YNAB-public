// Goes through inbox looking for order confirmation emails to process. Once processed, removes from inbox
function processInbox() {
  var toProcessParentLabel = 'Budget' // Create a "parent" label in Gmail. This is that label.
  var toProcessLabels = getChildrenLabels(toProcessParentLabel)
  var processedLabel = GmailApp.getUserLabelByName('Processed') // Create a label to indicate orders that have already been processed.

  // if there are emails labeled that need processing, go through them and build list of threads
  if (toProcessLabels) {
    for (var i = 0; i < toProcessLabels.length; i++) {
      var labelToProcess = GmailApp.getUserLabelByName(toProcessParentLabel + '/' + toProcessLabels[i])
      var threadsToProcess = labelToProcess.getThreads()

      // Go through the threads and process each one
      for (var j = 0; j < threadsToProcess.length; j++) {

        // Gather the message information
        var msg = threadsToProcess[j].getMessages()
        var from = msg[0].getFrom()
        var body = msg[0].getRawContent()

        // Parses information from the Amazon confirmation email
        var records = parseMessageData(from, body)

        // Create a YNAB transaction        
        var budgetName // Can enter one here. If not, it will use the one configured in YNAB-config.gs
        var accountName // Can enter one here. If not, it will use the one configured in YNAB-config.gs
        var transactionDate = msg[0].getDate() // Will get the date from the email.
        var payAmount = records[0].amount // The price parsed from the email.
        var payeeName = records[1] // Customize the name you want to use for the Payee.
        var transactionMemo = records[0].order // Will use the Amazon order # found in the email.
        var categoryName = toProcessLabels[i] // Will use the Gmail label name as the category.

        prepareTransaction(budgetName, accountName, transactionDate, payAmount, payeeName, transactionMemo, categoryName)

        // Switch labels. Removes the category label and replaces it with label set above.
        threadsToProcess[j].addLabel(processedLabel)
        threadsToProcess[j].removeLabel(labelToProcess)
        threadsToProcess[j].moveToArchive()
        threadsToProcess[j].markUnread()
      }
    }
  }
}


// Parse Amazon order confirmation emails
function parseMessageData(from, body) {

  switch (from) {
    case "\"Amazon.com\" <auto-confirm@amazon.com>":
      var regExOrder = /Order #\d{3}-\d{7}-\d{7}/
      var regExAmount = /Order Total: \$(\d+\.\d{2})/
      var payeeName = "Amazon"
      break

    case "\"Target.com\" <orders@service.target.com>":
      var regExOrder = /order #\d{13}/
      var regExAmount = /total:[\s\S]*?\$(\d+\.\d{2})/
      var payeeName = "Target"
      break

    default:
      Logger.log("From is " + from)
  }

  var record = {}

  // Look for "Order #" to get the order confirmation #
  var order = body.match(regExOrder)
  record.order = order[0]

  // Look for the price
  var amount = body.match(regExAmount)[1]
  record.amount = amount.replace(/[^\d.]/g, '') // only keeps digits and periods (.) (to remove $ sign and any commas)

  return [record, payeeName]
}

// Find all labels nested under the parent label
function getChildrenLabels(parentLabel) {
  var results = [];
  var labels = GmailApp.getUserLabels();
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].getName().startsWith(parentLabel + '/')) {
      results.push(labels[i].getName().slice(parentLabel.length + 1));
      Logger.log("label: " + labels[i].getName());
    }
  }
  return results
}