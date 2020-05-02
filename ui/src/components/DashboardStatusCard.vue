<template>
  <q-dialog v-model="cardState" @hide="closeCard">
    <q-card class="my-card" flat bordered>
      <q-img
        :src="randomIllustration"/>

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
            <i
              v-if="finance_state.amount_owed > 0">
              {{ finance_state.debtor_name }} owe {{ finance_state.creditor_name }} &#x20B9;{{ finance_state.amount_owed }}/-
            </i>
            <i
              v-else>
              Clear
            </i>
          </span>
          <span
          v-else>
            <i
              v-if="finance_state.amount_owed > 0">
              {{ finance_state.debtor_name }} owes {{ finance_state.creditor_name }} &#x20B9;{{ finance_state.amount_owed }}/-
            </i>
            <i
              v-else>
              Clear
            </i>
          </span>
        </div>
        <div class="text-caption text-grey-7 q-pt-sm">
          <span
            v-if="finance_state.debtor_name === 'You'">
            <i
              v-if="finance_state.amount_owed > 0">
              Username: {{ finance_state.creditor }}<br/>
              Note this username to pay {{ finance_state.creditor_name.split(' ')[0] }} back.
            </i>
          </span>
          <span
            v-else>
            <i
              v-if="finance_state.amount_owed > 0">
              Share your username with them so they can make a payment on your behalf.
            </i>
          </span>
          <br/><br/>
          <span
            v-if="finance_state.debtor_name === 'You'">
            <i
              v-if="finance_state.unapproved_amount_by_debtor > 0">
              <q-icon name="warning" class="text-orange" style="font-size: 1.5em;"/>
              {{ finance_state.creditor_name.split(' ')[0] }} paid <strong>&#x20B9;{{ finance_state.unapproved_amount_by_debtor }}</strong> for you which was not included in these calculations.<br/>
              Approve these payments in `Approve Payments` to include them.
            </i>
          </span>
          <span
            v-else>
            <i
              v-if="finance_state.unapproved_amount_by_debtor > 0">
              <q-icon name="warning" class="text-orange" style="font-size: 1.5em;"/>
              You paid <strong>&#x20B9;{{ finance_state.unapproved_amount_by_debtor }}</strong> which was not included in these calculations because
              {{ finance_state.debtor_name.split(' ')[0] }} has not approved the payments you made.
            </i>
          </span>
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
            If the status is clear then your credit history with this user has cancelled each other and there's no pending amount. For more information on how to use the app, check the help section.
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DashboardStatusCard',

  props: {
    card: Boolean,
    finance_state: Object
  },

  computed: {
    randomIllustration() {
      let r = (Math.floor(Math.random() * 5) + 1).toString();
      return `statics/undraw_${r}.svg`;
    }
  },

  data() {
    return {
      expanded: false,
      cardState: null
    }
  },

  methods: {
    closeCard() {
      this.$emit('cardClosed', false);
    }
  },

  watch: {
    card(newval) {
      this.cardState = newval;
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
