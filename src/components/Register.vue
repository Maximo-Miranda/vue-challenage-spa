<template>
   
        <v-container fill-height>
            <v-layout align-center justify-center>
     
                <v-col cols="col-xs12 col-sm-8 col-md-6">
                    <v-card :loading="loading" class="elevation-12">
                        
                        <ValidationObserver v-slot="{ invalid, pristine, passes }">
                            <form @submit.prevent="passes(store)">
                                <v-toolbar dark color="primary">
                                    Registrarse
                                </v-toolbar>
                                
                                <v-card-text>

                                        <ValidationProvider name="fistname" rules="required" v-slot="{ errors }">
                                
                                            <v-text-field label="Nombre" 
                                                v-model="account.firstname"
                                                :error-messages="errors[0]"
                                            ></v-text-field>

                                        </ValidationProvider>

                                        <ValidationProvider name="lastname" rules="required" v-slot="{ errors }">
                                
                                            <v-text-field label="Apellido" 
                                                v-model="account.lastname"
                                                :error-messages="errors[0]"
                                            ></v-text-field>

                                        </ValidationProvider>

                                        <ValidationProvider name="email" rules="required" v-slot="{ errors }">
                                
                                            <v-text-field label="Email" 
                                                v-model="account.email"
                                                :error-messages="errors[0]"
                                            ></v-text-field>

                                        </ValidationProvider>
                                       
                                        <ValidationProvider name="password" rules="required|password:confirmation" v-slot="{ errors }">

                                            <v-text-field label="Contraseña" 
                                                v-model="account.password"
                                                :error-messages="errors[0]"
                                                :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"  
                                                :type="showPassword ? 'text' : 'password'"
                                                @click:append="showPassword = !showPassword"
                                            ></v-text-field>

                                        </ValidationProvider>   
                                        
                                        <ValidationProvider vid="confirmation" name="repeat_password" rules="required" v-slot="{ errors }">

                                            <v-text-field label="Confirmar Contraseña" 
                                                v-model="account.repeat_password"
                                                :error-messages="errors[0]"
                                                :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"  
                                                :type="showPassword ? 'text' : 'password'"
                                                @click:append="showPassword = !showPassword"
                                            ></v-text-field>

                                        </ValidationProvider>
                                        
                                        <validation-provider v-slot="{ errors }" name="select" rules="required">
                                            <v-select
                                            v-model="account.account_type"
                                            :items="account_type"
                                            :error-messages="errors"
                                            label="Tipo de cuenta"
                                            required
                                            ></v-select>
                                        </validation-provider>
                                    
                                </v-card-text>                        

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="pristine || invalid" color="primary" :loading="loading" type="submit">Registrarse</v-btn>
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
  name: 'register-component',
  data: () => ({
    host: 'https://shielded-thicket-57523.herokuapp.com',
    account: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        repeat_password: '',
        account_type: 'Comprador'
    },
    account_type: [
        'Comprador',
        'Vendedor'
    ],
    showPassword: false,
    loading: false,
  }),
  methods: {

    async store() {

            try {		

                this.loading = !this.loading

                const accountType = this.account.account_type == 'Comprador' ? 'BUYER' : 'SELLER'
                
                await this.axios.post(this.host+'/register', {
                    firstname: this.account.firstname,
                    lastname: this.account.lastname,
                    email: this.account.email,
                    password: this.account.password,
                    repeat_password: this.account.repeat_password,
                    account_type: accountType
                })

                this.loading = !this.loading
                this.$router.push({name: 'login'})

            } catch (err) {
                
                this.loading = !this.loading

                let message = 'Error interno del servidor.'

                if(err.response){
                    if(err.response.status == 422){
                          message = 'Email no disponible'
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