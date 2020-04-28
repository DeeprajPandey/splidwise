<template>
  <q-pull-to-refresh @refresh="reload">
  <q-page class="q-pa-lg bg-grey-3 column">
    <div class="q-pa-md" 
    v-if="response.lent_money_to.length > 0">
      <q-list class="rounded-borders bg-white" bordered separator>
        <q-expansion-item expand-separator
        v-for="debtor_arr in response.lent_money_to"
        :key="debtor_arr[0]"
        @show="debitState(debtor_arr[0])">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="perm_identity" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label overline>{{ debtor_arr[1].toUpperCase() }}</q-item-label>
          </q-item-section>

          <q-item-section class="desktop-only">{{ debtor_arr[0] }}</q-item-section>
        </template>
        <div class="q-pa-md">
        <div class="row mobile-only" style="margin-top: -2.5vh">
          <div class="col"></div>
          <div class="col"><q-item-section style="color: grey" >{{ debtor_arr[0] }}</q-item-section></div>
        </div>
        </div>
        </q-expansion-item>
      </q-list>
    </div>
    <div class="q-pa-md" 
    v-if="response.owes_money_to.length > 0">
      <q-list class="rounded-borders bg-white" bordered separator>
        <q-expansion-item expand-separator
        v-for="creditor_arr in response.owes_money_to"
        :key="creditor_arr[0]"
        @show="creditState(creditor_arr[0])">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="perm_identity" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label overline>{{ creditor_arr[1].toUpperCase() }}</q-item-label>
          </q-item-section>

          <q-item-section class="desktop-only">{{ creditor_arr[0] }}</q-item-section>
        </template>
        <div class="q-pa-md">
        <div class="row mobile-only" style="margin-top: -2.5vh">
          <div class="col"></div>
          <div class="col"><q-item-section style="color: grey" >{{ creditor_arr[0] }}</q-item-section></div>
        </div>
        </div>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
  </q-pull-to-refresh>
</template>

<script>
import { axiosInstance } from 'boot/axios'
export default {
  data() {
    return {
      user: "user1@protonmail.com",
      response: {
        owes_money_to: [],
        lent_money_to: []
      },
      dummy_response: {
        // will include lent_money_to[], owes_money_to[]
        data: {
          "name": "Fettered Einstein",
          "lent_money_to": [["debtor_uid1","Festered Darwin",2], ["debtor_uid54","Excited Kafka",1], ["debtor_uid7","Triumphant Curie",5]],
          "owes_money_to": [["creditor_uid4","Goofy Euclid"],["creditor_uid1","Reverent Snyder"], ["creditor_uid30","Pensive Rosalind"]]
        },
        message: "User data read successfully."
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      axiosInstance.post(`/${this.user}/getUser`, {
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
    debitState(debtor) {
      axiosInstance.post(`/${this.user}/getAmountOwed`, {
        "creditor": this.user,
        "debtor": debtor
      })
      .then(response => {
        return response.data
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
    creditState(creditor) {
      axiosInstance.post(`/${this.user}/getAmountOwed`, {
        "debtor": this.user,
        "creditor": creditor
      })
      .then(response => {
        return response.data
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
    reload(done) {
      this.loadData();
      done();
    }
  }
}
</script>
