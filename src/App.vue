<template>
  <v-app>
    <router-view>

    </router-view>
      <router-view name="chat">

      </router-view>
  </v-app>
</template>

<script>
    export default {
      name: 'app'
    }
</script>