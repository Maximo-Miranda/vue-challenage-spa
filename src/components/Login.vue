<template>
   
        <v-container fill-height>
            <v-layout align-center justify-center>
     
                <v-col cols="col-xs12 col-sm-8 col-md-6">
                    <v-card :loading="loading" class="elevation-12">
                        
                        <ValidationObserver v-slot="{ invalid, pristine, passes }">
                            <form @submit.prevent="passes(login)">
                                <v-toolbar dark color="primary">
                                    Inicio de sesión
                                </v-toolbar>
                                
                                <v-card-text>
                                        <ValidationProvider name="email" rules="required" v-slot="{ errors }">
                                
                                            <v-text-field label="Email" 
                                                v-model="credential.email"
                                                :error-messages="errors[0]"
                                            ></v-text-field>

                                        </ValidationProvider>
                                       
                                        <ValidationProvider name="password" rules="required" v-slot="{ errors }">

                                            <v-text-field label="Contraseña" 
                                                v-model="credential.password"
                                                :error-messages="errors[0]"
                                                :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"  
                                                :type="showPassword ? 'text' : 'password'"
                                                @click:append="showPassword = !showPassword"
                                            ></v-text-field>

                                        </ValidationProvider>                            
                                    
                                </v-card-text>                        

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="pristine || invalid" color="primary" :loading="loading" type="submit">Iniciar</v-btn>
                                </v-card-actions>

                            </form>

                        </ValidationObserver>

                    </v-card>

                </v-col>   
         
            </v-layout>
        </v-container>
</template>

<script>
export default {
  name: 'login-component',
  data: () => ({
    host: 'https://shielded-thicket-57523.herokuapp.com',
    credential: {
        email: '',
        password: ''
    },
    showPassword: false,
    loading: false,
  }),
  methods: {

    async login() {

            try {		

                this.loading = !this.loading
                
                const response = await this.axios.post(this.host+'/login', {
                    email: this.credential.email,
                    password: this.credential.password
                })

                localStorage.setItem('_token', response.data.data.token)
                this.loading = !this.loading
                //this.$router.push({name: 'product'})
                window.location.href = "/product"

            } catch (err) {
                
                this.loading = !this.loading

                let message = 'Error interno del servidor.'

                if(err.response){
                    if(err.response.status == 400){
                          message = 'Credenciales invalidas.'
                    }
                } else {
                    message = err
                }

                this.$swal.fire({
                    type: 'error',
                    title: 'Opps...',
                    text: message
                })
            }
           
        }

  }

};
</script>