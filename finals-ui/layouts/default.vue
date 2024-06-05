<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      color="#0277BD"
      dark
    >
      <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon>mdi-account</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ $auth.user.username }}({{ $auth.user.user_role }})</v-list-item-title>
          <v-list-item-subtitle>Logged In</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      </template>
  
      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logOut()">
            <v-icon left>mdi-logout</v-icon>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app elevation="0">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
    </v-app-bar>

    <v-main class="mt-2">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  middleware: ['auth', 'isBasic'],
  data () {
    return {
      selectedItem: 0,
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/",
        },
        {
          icon: "mdi-clipboard-list",
          title: "Borrow List",
          to: "/borrow",
        },
        
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "User Page",
    };
  },
  methods: {
    logOut() {
      this.$auth.logout()
      this.$router.push("/auth/login");
    }
  }
};
</script>

<style>
.border {
  margin-left: 8px;
  margin-right: 8px;
  background: #0d47a1;
  border-radius: 10px;
  text-decoration: none;
}
.v-list-item-group .v-list-item--active {
  color: white !important;
}
.theme--light.v-list-item--active .v-list-item__subtitle,
.theme--light.v-list-item .v-list-item__action-text {
  color: white !important;
}
</style>