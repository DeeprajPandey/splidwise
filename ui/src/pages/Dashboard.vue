<template>
  <q-pull-to-refresh @refresh="reload">
  <q-page class="q-pa-lg bg-grey-3 column">
    <div class="q-pa-md" 
    v-if="response.lent_money_to.length > 0">
      <q-list class="rounded-borders bg-white" bordered separator>
        <q-item clickable v-ripple
        v-for="debtor_arr in response.lent_money_to"
        :key="debtor_arr[0]"
        @click="debitState(debtor_arr[0], debtor_arr[1])">
          <q-item-section avatar>
            <q-avatar icon="perm_identity" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label overline>{{ debtor_arr[1].toUpperCase() }}</q-item-label>
          </q-item-section>

          <q-item-section class="desktop-only">{{ debtor_arr[0] }}</q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="q-pa-md" 
    v-if="response.owes_money_to.length > 0">
      <q-list class="rounded-borders bg-white" bordered separator>
        <q-item clickable v-ripple
        v-for="creditor_arr in response.owes_money_to"
        :key="creditor_arr[0]"
        @click="creditState(creditor_arr[0], creditor_arr[1])">
          <q-item-section avatar>
            <q-avatar icon="perm_identity" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label overline>{{ creditor_arr[1].toUpperCase() }}</q-item-label>
          </q-item-section>

          <q-item-section class="desktop-only">{{ creditor_arr[0] }}</q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-dialog v-model="card">
      <q-card class="my-card" flat bordered>
      <q-img
        :src="randomIllustration"
      />

      <q-card-section>
        <div class="text-overline">
          <span
          v-if="finance_state.debtor_name === 'You'">
            Debit Status
          </span>
          <span
          v-else>
            Credit Status
          </span>
        </div>
        <div class="text-h5 q-mt-sm q-mb-xs"
        :class="{ 'text-orange-9':(finance_state.debtor_name === 'You') ,'text-green-9':(finance_state.creditor_name === 'you') }">
          <span
          v-if="finance_state.debtor_name === 'You'">
            {{ finance_state.debtor_name }} owe {{ finance_state.creditor_name }} &#x20B9;{{ finance_state.amount_owed }}/-
          </span>
          <span
          v-else>
            {{ finance_state.debtor_name }} owes {{ finance_state.creditor_name }} &#x20B9;{{ finance_state.amount_owed }}/-
          </span>
        </div>
        <div class="text-caption text-grey q-pt-sm">
          <span
          v-if="finance_state.debtor_name === 'You'">
            Username: {{ finance_state.creditor }}<br/>
            Note this username to pay {{ finance_state.creditor_name.split(' ')[0] }} back.
          </span>
          <span
          v-else>
            Share your username with them so they can make a payment on your behalf.
          </span>
          <br/><br/>
          <i v-if="finance_state.unapproved_amount_by_creditor > 0">
            <q-icon name="warning" class="text-orange" style="font-size: 1.5em;"/>
            <span>You have paid <strong>&#x20B9;{{ finance_state.unapproved_amount_by_creditor }}</strong> which was not included in the calculations.</span><br/>
            <span
            v-if="finance_state.debtor_name === 'You'">
              {{ finance_state.creditor_name.split(' ')[0] }}
            </span>
            <span
            v-else>
              {{ finance_state.debtor_name.split(' ')[0] }}
            </span>
            has to approve these first as valid payments.</span>
          </i>
        </div>
      </q-card-section>

      <q-card-actions>
        <q-space />
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>

      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            For more information on how to use the app, check the help section.
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
    </q-dialog>
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
      finance_state: {
        creditor_name: '',
        debtor_name: ''
      },
      card: false,
      expanded: false,
    }
  },

  computed: {
    randomIllustration() {
      let r = (Math.floor(Math.random() * 5) + 1).toString();
      return `statics/undraw_${r}.svg`;
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
    debitState(debtor, name) {
      axiosInstance.post(`/${this.user}/getAmountOwed`, {
        "creditor": this.user,
        "debtor": debtor
      })
      .then(response => {
        this.finance_state = response.data.data;
        this.finance_state.creditor_name = "you";
        this.finance_state.debtor_name = name;
        this.card = true;
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
    creditState(creditor, name) {
      axiosInstance.post(`/${this.user}/getAmountOwed`, {
        "debtor": this.user,
        "creditor": creditor
      })
      .then(response => {
        this.finance_state = response.data.data;
        this.finance_state.debtor_name = "You";
        this.finance_state.creditor_name = name;
        this.card = true;
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
