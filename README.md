# Welcome
These set of scripts will allow you to enter YNAB transactions for Amazon, based on Amazon confirmation emails that you receive after purchase. You will have to label the emails based on the YNAB budget category and the scripts will take care of the rest...

I will attempt to update this guide and scripts based on feedback, questions, and issues I hear about.

# Prerequisites
- YNAB with YNAB API (see https://api.youneedabudget.com/)
- Google Apps Script (see https://www.google.com/script/start/)
- Labels set up in Gmail (see more information below)
- Amazon confirmation emails sent in plain text (visit https://www.amazon.com/gp/cpc/homepage?ref_=ya_d_l_comm_prefs#general)
- probably other stuff that I've missed....

# Instructions

## Google Apps Scripts set up
- create a project in Google Apps Script
- create three scripts named the same as my three: Gmail-parse, YNAB-config, and YNAB-transactions.
- Open YNAB-config and enter your YNAB access token, your default budget name, and the default account.
- Run the function setYNABProperties() within the YNAB-config script.

## Gmail Labels
- Create a parent label to nest all the other labels. I chose "Budget." If you choose something else, edit the third line in the YNAB-transactions script.
- Create labels underneath the Budget label for the common budget categories that match your Amazon purchases. For example, I created labels called: Pets, Groceries, and Gifts.
- Create a label where your processed emails will be moved to. I chose "Processed." If you choose something else, edit the fifth line in the YNAB-transaction script.

## Trigger
- Within your script project, create a timed trigger to run the function "processInbox." I set mine to run every hour.

## Action!
- When you get a confirmation email from Amazon, label it as "Pets" or whatever. Wait for the trigger. Then you should have a new YNAB transaction and your email should be moved to the "Processed" folder.

# Possible future efforts
- Allow splits
- Attempt to customize based on invoices (see discussion at https://support.youneedabudget.com/t/y4h890q/categorizing-amazon-purchases)
- How to handle gift card purchases (show up as $0 in the confirmation email)
