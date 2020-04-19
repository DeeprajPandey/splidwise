<template>
  <q-page>
    <h5>Credit State with user: [u2]</h5>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      // request body for /getAmountOwed
      request: {
        creditor: "",
        debtor: ""
      },
      response: {
        // response from /getAmountOwed
        data: {},
        message: ""
      }
    }
  }

}
</script>
