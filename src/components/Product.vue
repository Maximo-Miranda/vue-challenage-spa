<template>
  <div>
    <h1 class="mb-5">Productos</h1>

    <v-row justify="end">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ma-6"
            v-if="role == 'SELLER' || role == 'ADMIN'"
            depressed
            color="primary"
            v-bind="attrs"
            v-on="on"
          >
            Crear
          </v-btn>
        </template>

        <v-card>
          <ValidationObserver v-slot="{ invalid, pristine, passes }">
            <form @submit.prevent="passes(createProduct)">
              <v-card-title>
                <span class="text-h5">Nuevo producto</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  
                    <ValidationProvider
                      name="name"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        label="Nombre"
                        v-model="product.name"
                        :error-messages="errors[0]"
                      ></v-text-field>
                    </ValidationProvider>

                    <ValidationProvider
                      name="sku"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        label="SKU"
                        v-model="product.sku"
                        :error-messages="errors[0]"
                      ></v-text-field>
                    </ValidationProvider>

                    <ValidationProvider
                      name="quantity"
                      rules="required|numeric"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        type="number"
                        label="Cantidad"
                        v-model="product.quantity"
                        :error-messages="errors[0]"
                      ></v-text-field>
                    </ValidationProvider>

                    <ValidationProvider
                      name="price"
                      rules="required|numeric"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        type="number"
                        label="Precio"
                        v-model="product.price"
                        :error-messages="errors[0]"
                      ></v-text-field>
                    </ValidationProvider>
                  
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Cerrar
                </v-btn>
                <v-btn
                  :disabled="pristine || invalid"
                  color="primary"
                  :loading="loading"
                  type="submit"
                  >Guardar</v-btn
                >
              </v-card-actions>
            </form>
          </ValidationObserver>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row class="mb-5">
        <v-text-field
          cols="12"
          md="3"
          label="Nombre"
          class="ma-1"
          v-model="nameFilter">
        </v-text-field>
        <v-text-field
          cols="12"
          md="3"
          label="SKU"
          class="ma-1"
          v-model="skuFilter">
        </v-text-field>
        <v-text-field
          cols="12"
          md="2"
          label="Precio minimo"
          class="ma-1"
          v-model="minPriceFilter">
        </v-text-field>
         <v-text-field
          cols="12"
          md="2"
          label="Precio maximo"
          class="ma-1"
          v-model="maxPriceFilter">
        </v-text-field>
    </v-row>
    <v-row justify="center">
      <v-btn class="mb-9" @click="getProducts" color="primary" text>Buscar</v-btn>
    </v-row>

    <v-card
      v-for="product in products"
      :key="product.id"
      class="mx-auto mb-2 elevation-2"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline mb-4">
            {{ product.sku }}
          </div>
          <v-list-item-title class="text-h5 mb-1">
            {{ product.name }}
          </v-list-item-title>
          <v-list-item-subtitle
            >Existencia: {{ product.quantity }}</v-list-item-subtitle
          >
        </v-list-item-content>

        <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
      </v-list-item>

      <v-card-actions>
        <v-btn outlined rounded text> ${{ product.price }} </v-btn>
      </v-card-actions>
    </v-card>
  </div>

</template>

<script>
import jwt_decode from "jwt-decode";

export default {
  name: "product-component",
  data: () => ({
    host: "https://shielded-thicket-57523.herokuapp.com",
    is_authenticated: false,
    role: "",
    token: "",
    products: [],
    dialog: false,
    product: {
      name: "",
      sku: "",
      price: 0,
      quantity: 0,
    },
    loading: false,
    nameFilter: '',
    skuFilter: '',
    minPriceFilter: '',
    maxPriceFilter: ''
  }),
  async mounted() {
    this.validateAuth();
    await this.getProducts();
  },
  methods: {
    validateAuth() {
      this.token = localStorage.getItem("_token");
      if (!this.token) {
        this.$router.push({ name: "login" });
        return;
      }

      const decode = jwt_decode(this.token);

      this.role = decode.role;
    },
    async getProducts() {
      try {

        let params = {}

        if(this.nameFilter != ''){
          params.name = this.nameFilter
        }

        if(this.skuFilter != ''){
          params.sku = this.skuFilter
        }

        if(this.minPriceFilter != ''){
          params.minprice = this.minPriceFilter
        }

        if(this.maxPriceFilter != ''){
          params.maxprice = this.maxPriceFilter
        }

        const config = {
          headers: {
            Authorization: "Bearer " + this.token,
          },
          params: params
        };

        const response = await this.axios.get(this.host + "/products", config);
        this.products = response.data.data;
      } catch (err) {
        let message = "Error interno del servidor.";

        this.$swal.fire({
          type: "error",
          title: "Opps...",
          text: message,
        });

        //window.location.href = "/login"
      }
    },
    async createProduct() {
      try {
        this.loading = !this.loading;

        const config = {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        };

        await this.axios.post(
          this.host + "/products",
          this.product,
          config
        );
        
        await this.getProducts()

        this.loading = !this.loading;
        this.dialog = false

        this.product.name = ''
        this.product.sku = ''
        this.product.price = 0
        this.product.quantity = 0

      } catch (err) {

        this.loading = !this.loading;

        let message = "Error interno del servidor.";

        this.$swal.fire({
          type: "error",
          title: "Opps...",
          text: message,
        });
      }
    },
  },
};
</script>