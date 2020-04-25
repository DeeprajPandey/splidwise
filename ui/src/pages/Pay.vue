<template>
  <div class="q-pa-xl" style ="max-width: 600px">

    <q-form
      @submit = "onSubmit"
      @reset = "resetData"
      class="q-gutter-md full-width"
      align = "center"
    >
      <q-input
        filled type = "email"
        v-model = "request.debtor" align = "center"
        placeholder = "Debtor's User Id" hint = "Email ID"
        lazy-rules
        :rules = "[ val => val && val.length > 0 || 'Please type a valid email ID']"
      />

      <q-input
        filled type="number"
        v-model="request.amount" align ="center"
        placeholder="Amount" hint="Amount cannot be negative"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type a valid amount',
          val => val > 0 || 'Please type a valid amount'
        ]"
      />

      <q-input
      v-model="request.description" align = "center"
      placeholder="Description" hint="What are you paying for?" :dense="dense" />

      <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->

      <div>
        <q-btn label="Submit" type="submit" color="primary" class="q-ml-lg"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-lg" />
      </div>
    </q-form>
    <p>{{ request.amount }}</p>

  </div>
</template>

<script>
export default {
  data () {
    return {
      request: {
        debtor: "",
        amount: null,
        description: ""
      },
      response: {

      }
    }
  },
  methods: {
    // makePayment() {}
    resetData() {
      this.request.debtor = "",
      this.request.amount = null,
      this.request.description = ""
    }
  }
}
</script>