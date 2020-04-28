<template>
  <q-pull-to-refresh @refresh="reload">
  <q-page class="q-pa-lg bg-grey-3 column">
    <div>from store: {{ uname }} </div>
    <div class="q-pa-md" 
    v-if="lent_money_to.length > 0">
      <q-list class="rounded-borders bg-white" bordered separator>
        
        <dashboard-item
          v-for="(debtor_arr, index) in lent_money_to"
          :key="index"
          :user-arr="debtor_arr"
          type="debit"
          @addedAmounts="displayAmount"></dashboard-item>

      </q-list>
    </div>
    <div class="q-pa-md" 
    v-if="owes_money_to.length > 0">
      <q-list class="rounded-borders bg-white" bordered separator>

        <dashboard-item
          v-for="(creditor_arr, index) in owes_money_to"
          :key="index"
          :user-arr="creditor_arr"
          type="credit"
          @addedAmounts="displayAmount"></dashboard-item>

      </q-list>
    </div>

    <status-card
      :card="card"
      :finance_state="finance_state"
      @cardClosed="handleClose"></status-card>

  </q-page>
  </q-pull-to-refresh>
</template>

<script>
import { axiosInstance } from 'boot/axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  mounted() {
    this.loadData()
  },

  data() {
    return {
      finance_state: {
        creditor_name: '',
        debtor_name: ''
      },
      card: false,
      expanded: false,
    }
  },

  computed: {
    ...mapGetters('user_info', [
      'uname', 'lent_money_to', 'owes_money_to'
    ])
  },

  components: {
    'status-card': require('components/DashboardStatusCard.vue').default,
    'dashboard-item': require('components/DashboardItem.vue').default
  },

  methods: {
    ...mapActions('user_info', [
      'updateLentArr', 'updateOwesArr'
    ]),

    displayAmount(finance_from_item) {
      // triggered after child component has calculated amounts
      this.finance_state = finance_from_item;
      this.card = true;
    },

    handleClose(newval) {
      this.card = newval;
    },

    loadData() {
      axiosInstance.post(`/${this.$store.getters['user_info/uname']}/getUser`, {
        "passw_hash": "hello"
      })
      .then(response => {
        this.updateLentArr(response.data.data.lent_money_to);
        this.updateOwesArr(response.data.data.owes_money_to);
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
    reload(done) {
      this.loadData();
      done();
    }
  }
}
</script>
