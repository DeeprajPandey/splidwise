<template>
  <q-page class="q-pa-lg bg-grey-3 column">
    <h5 class="q-mt-none">
      Dashboard
    </h5>
    <h6>Users who owe you</h6>
    <br/>
    <q-list class="bg-white" bordered separator>
      <q-item
      v-for="debtor_arr in response2.lent_money_to"
      :key="debtor_arr[0]"
      clickable v-ripple>
        <q-item-section>
          <q-item-label overline>{{ debtor_arr[1].toUpperCase() }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ debtor_arr[0] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <br/>

    <h6>Users who have paid for you</h6>
    <br/>
    <q-list class="bg-white" bordered separator>
      <q-item
      v-for="creditor_arr in response_dashboard.data.owes_money_to"
      :key="creditor_arr[0]"
      clickable v-ripple>
        <q-item-section>
          <q-item-label overline>{{ creditor_arr[1].toUpperCase() }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ creditor_arr[0] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>    
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
      response_dashboard: {
        // will include lent_money_to[], owes_money_to[]
        data: {
          "name": "Fettered Einstein",
          "lent_money_to": [["debtor_uid1","Festered Darwin",2], ["debtor_uid54","Excited Kafka",1], ["debtor_uid7","Triumphant Curie",5]],
          "owes_money_to": [["creditor_uid4","Goofy Euclid"],["creditor_uid1","Reverent Snyder"], ["creditor_uid30","Pensive Rosalind"]]
        },
        message: "User data read successfully."
      },
      response2: {}
    }
  },
  methods: {
    loadData() {
      axiosInstance.post('/user2@gmail.com/getUser', {
        "passw_hash": "hello"
      }).then(response => {
        console.log(response.data);
        this.response2 = response.data.data
      })
    }
  }
}
</script>
