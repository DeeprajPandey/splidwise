<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lFf" container style="height: 600px" class="shadow-2 rounded-borders">
      <q-header elevated>
        <q-toolbar>
          <q-avatar>
            <img src="statics/app-logo-128x128.png">
          </q-avatar>
          <q-toolbar-title>
            <strong>SpliDwise</strong> Guidelines
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <font size = "3" align="justify">
          <p>
           SpliDwise is an app for managing your expenses. It allows you and your colleagues to keep track of who owes who and helps you settle up with each other. 
          </p>
          <p>
           <b>App Features:</b>
          </p>
          <p>
            <b><u>Make Payment</u></b>
            <br/>
            You can add a new payment in this section. Write your debtor's email ID, the amount you have paid for them, and the payment description, then click submit. Once you have added a new payment, your debtor will be notified. 
          </p>
          <p>
            <b><u>
            Dashboard</u></b>
            <br/>
            This page allows you to view all the payments that you made on your friends' behalf and also the payments that your friends made for you. You can find two sections on the Dashboard. 
            <br/>
            <ul>
              <li> "Users who owe you": This section contains a list of all the users who owe you money. You can click on the user's name to see the payment details. The total amount you see for each user includes the sum of all the approved amounts you have paid for this user minus all the approved amounts that this user has paid for you. If you see a negative value, it simply means that the user has cleared all their debts and has made additional payments for you. Which means you are now in debt and are expected to pay them back. </li>
            
              <li> "Users who have paid for you": This section contains a list of all the users who you owe money to. You can click on the specific user's name to see the payment details. The total amount you see for each user includes only the amount that you have approved. To check if there are more valid payments that you have not approved yet, you may go to the Approve page. 
              </li>
            </ul>
          </p>
          <p>
            <b><u>Approve</u></b>
            <br/>
            Every time some user makes a payment on your behalf, you'll get notified and the payment details get added to this section. You can go to this section, check the payment details, and approve if it is a valid payment. 
          </p>
          <p>
            <b><u>Rules</u></b>
          <ol>
            <li>For any payment, your debtor must be a registered user. And the amount you add should always be greater than 0.</li>
            <li>You cannot pay for yourself.</li>
            <li>You can only see the payments on the dashboard which involves you, either when you are a creditor or debtor.</li>
            <li>You cannot unapprove an already approved payment.</li>
          </ol>

          </p>
        </font>

          <!-- place QPageScroller at end of page -->
          <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_up" color="accent" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
