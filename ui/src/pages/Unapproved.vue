<template>
  <q-page>
    <h5>Unapproved Payments</h5>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      // request body for /getUnapprovedPayments
      request_all: {
        debtor: "",
        creditor: ""
      },
      response_all: {
        // includes array of unapproved pmt objects
        data: {},
        message: ""
      },
      // request body for /approvePayment
      request_approve: {
        debtor: "",
        creditor: "",
        payment_obj: {}
      },
      response_approve: {
        data: {},
        message: ""
      }
    }
  }

}
</script>
