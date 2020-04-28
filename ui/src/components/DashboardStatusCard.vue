<template>
  <q-dialog v-model="card">
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
          <i v-if="finance_state.unapproved_amount > 0">
            <q-icon name="warning" class="text-orange" style="font-size: 1.5em;"/>
            <span>You have paid <strong>&#x20B9;{{ finance_state.unapproved_amount }}</strong> which was not included in the calculations.</span><br/>
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
</template>

<script>
  
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
