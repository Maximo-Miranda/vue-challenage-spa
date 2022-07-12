<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon v-if="is_authenticated" @click="drawer = !drawer" ></v-app-bar-nav-icon>
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        Marketplace
      </div>

      <v-spacer></v-spacer>

      <v-btn
        v-if="!is_authenticated"
        :to="{name: 'login'}"
        text
        class="mr-2"
      >
        <span class="mr-2">Iniciar Sesion</span>
        <!-- <v-icon>mdi-open-in-new</v-icon> -->
      </v-btn>

       <v-btn
        v-if="!is_authenticated"
        :to="{name: 'register'}"
        text
      >
        <span class="mr-2">Registrase</span>
        <!-- <v-icon>mdi-open-in-new</v-icon> -->
      </v-btn>

      <v-btn
        v-if="is_authenticated"
        text
        @click="logout"
      >
        <span class="mr-2">Salir</span>
        <!-- <v-icon>mdi-open-in-new</v-icon> -->
      </v-btn>

    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

           <v-navigation-drawer v-model="drawer" absolute temporary>

            <v-list-item>
                <v-list-item-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>Maximo Miranda</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense>

                <v-list-item :to="{name: 'product'}" link>

                    <v-list-item-icon>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Inventario</v-list-item-title>
                    </v-list-item-content>

                </v-list-item>

            </v-list>

        </v-navigation-drawer>

  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    is_authenticated: false
  }),
  mounted() {
    this.validateAuth()
  },
  methods: {
    validateAuth() {
      if(localStorage.getItem('_token')){
        this.is_authenticated = true
      }
    },
    logout() {
      localStorage.removeItem('_token')
      window.location.href = "/login"
    }
  }
};
</script>
