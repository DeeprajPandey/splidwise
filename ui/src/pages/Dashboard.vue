<template>
  <q-pull-to-refresh @refresh="reload">
  <q-page class="q-pa-lg bg-grey-3 column">
    <div>from store: {{ uname }} </div>
    <div class="q-pa-md" 
    v-if="lent_money_to.length > 0">
      <q-list class="rounded-borders bg-white" bordered separator>
        
        <DashboardItem
          v-for="(debtor_arr, index) in lent_money_to"
          :key="index"
          :user-arr="debtor_arr"
          type="credit"
          @addedAmounts="displayAmount"></DashboardItem>

      </q-list>
    </div>
    <div class="q-pa-md" 
    v-if="owes_money_to.length > 0">
      <q-list class="rounded-borders bg-white" bordered separator>

        <DashboardItem
          v-for="(creditor_arr, index) in owes_money_to"
          :key="index"
          :user-arr="creditor_arr"
          type="debit"
          @addedAmounts="displayAmount"></DashboardItem>

      </q-list>
    </div>

    <DashboardStatusCard
      :card="card"
      :finance_state="finance_state"
      @cardClosed="handleClose"></DashboardStatusCard>
  </q-page>
  </q-pull-to-refresh>
</template>

<script>
import { axiosInstance } from 'boot/axios'
import { mapGetters, mapActions } from 'vuex'
import DashboardStatusCard from 'components/DashboardStatusCard'
import DashboardItem from 'components/DashboardItem'

export default {
  created() {
    if (this.$route.query.u) {
      this.setProfileImg(this.$route.query.url);
      this.loadData(this.$route.query.u);
    } else {
      this.loadData(this.uname);
    }
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
    DashboardStatusCard,
    DashboardItem
  },

  methods: {
    ...mapActions('user_info', [
      'setUserData', 'setProfileImg', 'updateLentArr', 'updateOwesArr'
    ]),

    displayAmount(finance_from_item) {
      // triggered after child component has calculated amounts
      this.finance_state = finance_from_item;
      this.card = true;
    },

    handleClose(newval) {
      this.card = newval;
    },

    loadData(username) {
      if (!username) {
        // if the user is not logged in, store will give us empty string
        console.log('User not logged in');
        return;
      }
      axiosInstance.post(`/${username}/getUser`, {
        "passw_hash": "hello"
      })
      .then(response => {
        this.setUserData({
          username: username,
          name: response.data.data.name
        });
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
        if (err.response.status == 401) {
          this.$router.push('/');
        }
      })
    },
    reload(done) {
      this.loadData(this.uname);
      done();
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
