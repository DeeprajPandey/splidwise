<template>
  <q-page class= "bg-grey-3 bg-grey-3 column">
    <h5 class="q-mt-md row justify-center">Dashboard</h5>
    <div class="q-pa-md" 
    v-if="dummy_response.data.lent_money_to.length > 0">
      <h6>
        Users who owe you
      </h6>
      <q-list bordered class="rounded-borders bg-white">
        <q-expansion-item
        v-for="debtor_arr in dummy_response.data.lent_money_to"
          :key="debtor_arr[0]"
          clickable v-ripple>
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar icon="face" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{ debtor_arr[1].toUpperCase() }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ debtor_arr[0] }}</q-item-label>
            </q-item-section>

          </template>

          <q-card>
            <q-card-section>
              <p><u>Total Amount: {{dummy_response.amount.amount_owed}}</u></p>
              <p><u>Details</u></p>
              <pre>
              Payment ID: {{dummy_response.info.pmtID[0]}}
              Amount: {{dummy_response.info.amount[0]}}
              Approved: {{dummy_response.info.approved[0]}}
              Description: {{dummy_response.info.description[0]}}
              Timestamp: {{dummy_response.info.timestamp[0]}} </pre>

            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator />
      </q-list>
    </div>
    <div class="q-pa-md" 
    v-if="dummy_response.data.owes_money_to.length > 0">
      <h6>
        Users who have paid for you
      </h6>
      <q-list bordered class="rounded-borders bg-white">
        <q-expansion-item
        v-for="creditor_arr in dummy_response.data.owes_money_to"
          :key="creditor_arr[0]"
          clickable v-ripple>
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar icon="face" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label overline>{{ creditor_arr[1].toUpperCase() }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ creditor_arr[0] }}</q-item-label>
            </q-item-section>

          </template>

          <q-card>
            <q-card-section>
              <p><u>Total Amount: {{dummy_response.amount.unapproved_amount}}</u></p>
              <p><u>Details</u></p>
              <pre>
              Payment ID: {{dummy_response.info.pmtID[1]}}
              Amount: {{dummy_response.info.amount[1]}}
              Approved: {{dummy_response.info.approved[1]}}
              Description: {{dummy_response.info.description[1]}}
              Timestamp: {{dummy_response.info.timestamp[1]}} </pre>
              <br/>
              <pre>
              Payment ID: {{dummy_response.info.pmtID[2]}}
              Amount: {{dummy_response.info.amount[2]}}
              Approved: {{dummy_response.info.approved[2]}}
              Description: {{dummy_response.info.description[2]}}
              Timestamp: {{dummy_response.info.timestamp[2]}} </pre>

            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />
      </q-list>
    </div>
    <br/>
  </q-page>
</template>

<script>
import { axiosInstance } from 'boot/axios'
export default {
  data() {
    return {
      request_login: {
        user: "",
        passw_hash: ""
      },
      response: {
        owes_money_to: [],
        lent_money_to: [],
      },
      dummy_response: {
        // will include lent_money_to[], owes_money_to[]
        data: {
          "name": "Fettered Einstein",
          "lent_money_to": [["debtor_uid1","Festered Darwin",2], ["debtor_uid54","Excited Kafka",1], ["debtor_uid7","Triumphant Curie",5]],
          "owes_money_to": [["creditor_uid4","Goofy Euclid"],["creditor_uid1","Reverent Snyder"], ["creditor_uid30","Pensive Rosalind"]]
        },
        amount:{
          // "creditor":[["creditor_uid1"],["creditor_uid4"],["creditor_uid30"]],
          // "debtor":["debtor_uid1","debtor_uid7","debtor_uid54"],
          // "amount_owed":["5000", "100", "490"],
          // "unapproved_amount":["800", "300", "20"]
          "amount_owed": 5000,
          "unapproved_amount": 300

        },
        info:{
          "pmtID":[1, 1, 2],
          "amount":[5000, 100, 200],
          "approved": ["True", "False", "False"],
          "description":["Paid at dhaba", "Tuck shop", "Dinner"],
          "timestamp": ["915148800","915146700", "915986700"]
        },
        message: "User data read successfully."
      }
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    loadData() {
      axiosInstance.post('/user1@protonmail.com/getUser', {
        "passw_hash": "hello"
      })
      .then(response => {
        this.response = response.data.data;
        this.$q.notify({
          color: 'neutral',
          position: 'bottom',
          timeout: 500,
          message: `${response.data.message}`,
          icon: 'info',
          actions: [{ icon: 'close', color: 'white' }]
        });
      })
      .catch(err => {
        console.log(err.response);
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: `[${err.response.status}] ${err.response.data.error}`,
          icon: 'report_problem'
        });
      })
    },
    getAmountOwed(user, creditor, debtor) {
      axiosInstance.post(`/${user}/getAmountOwed`, {
        "creditor": creditor,
        "debtor": debtor
      })
      .then(response => {
        return response.data
      })
    }
  }
}
</script>
