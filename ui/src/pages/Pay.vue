<template>
  <div class="q-pa-xl" style ="max-width: 600px">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md full-width"
      align = "center"
    >
      <q-input
        filled
        v-model="email"
        align ="center"
        label="Debtor's User Id *"
        hint="Email ID"
        type = "email"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type a valid email ID']"
      />

      <q-input
        filled
        type="number"
        v-model="amount"
        align ="center"
        label="Amount in Rs. *"
        hint="Amount cannot be negative"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type a valid amount',
          val => val > 0 || 'Please type a valid amount'
        ]"
      />

      <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->

      <div>
        <q-btn label="Submit" type="submit" color="primary" class="q-ml-lg"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-lg" />
      </div>
    </q-form>

  </div>
</template>