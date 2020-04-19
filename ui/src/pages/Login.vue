<template>
  <q-page>
    <h5>Login</h5>
    <p>Enter username, password</p>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      request: {
        username: "",
        password_hash: ""
      },
      response: {
        // response from /getUserData
        data: {
          "found": true,
          "info": {}
        },
        message: ""
      }
    }
  }
}
</script>
