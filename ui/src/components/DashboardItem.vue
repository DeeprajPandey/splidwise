<template>
  <q-item clickable v-ripple
    @click="financeState(userArr[0], userArr[1])"
  >
    <q-item-section avatar>
      <q-avatar icon="perm_identity" color="primary" text-color="white" />
    </q-item-section>

    <q-item-section>
      <q-item-label overline>{{ userArr[1].toUpperCase() }}</q-item-label>
    </q-item-section>

    <q-item-section class="desktop-only">{{ userArr[0] }}</q-item-section>
  </q-item>
</template>

<script>
import { axiosInstance } from 'boot/axios'
export default {
  name: 'DashboardItem',
  
  props: {
    userArr: Array,
    type: String
  },


  data () {
    return {
      finance_state: {
        creditor_name: '',
        debtor_name: ''
      }
    }
  },


  methods: {
    financeState(user, name) {
      if (this.type === "debit") {
        this.debitState(user, name);
      }
      else if (this.type === "credit") {
        this.creditState(user, name)
      }
    },

    creditState(debtor, name) {
      axiosInstance.post(`/${this.$store.getters['user_info/uname']}/getAmountOwed`, {
        "creditor": this.$store.getters['user_info/uname'],
        "debtor": debtor
      })
      .then(response => {
        this.finance_state = response.data.data;
        this.finance_state.creditor_name = "you";
        this.finance_state.debtor_name = name;
        this.$q.notify({
          color: 'neutral',
          position: 'bottom',
          timeout: 500,
          message: `${response.data.message}`,
          icon: 'info',
          actions: [{ icon: 'close', color: 'white' }]
        });
        // emit an event so parent can display the card
        this.$emit('addedAmounts', this.finance_state)
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

    debitState(creditor, name) {
      axiosInstance.post(`/${this.$store.getters['user_info/uname']}/getAmountOwed`, {
        "debtor": this.$store.getters['user_info/uname'],
        "creditor": creditor
      })
      .then(response => {
        this.finance_state = response.data.data;
        this.finance_state.debtor_name = "You";
        this.finance_state.creditor_name = name;
        this.$q.notify({
          color: 'neutral',
          position: 'bottom',
          timeout: 500,
          message: `${response.data.message}`,
          icon: 'info',
          actions: [{ icon: 'close', color: 'white' }]
        });
        // emit an event so parent can display the card
        this.$emit('addedAmounts', this.finance_state)
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
  }
}
</script>