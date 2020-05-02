<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:60vw;max-width:500px;"
      >
    </p>
    <p class="text-faded">
      [404] You have discovered a new route...
    </p>
    <q-btn
      color="grey-9"
      style="colour: #;width:200px;"
      to="/"
      label="Go back"
    />
  </div>
</template>

<script >
export default {
  name: 'Error404'
}
</script>
