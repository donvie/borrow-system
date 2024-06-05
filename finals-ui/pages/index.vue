<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Asset List</v-card-title>
            <v-card-text>
              <v-data-table :items="productList" :headers="headers" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="assetDetail = item; dialog = true"
                  >
                    mdi-eye
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card v-if="assetDetail">
          <v-card-title class="text-h5 grey lighten-2">
            Preview Details
          </v-card-title>

          <br>

          <v-card-text>
            <v-text-field
              label="Code"
              :value="assetDetail.product_code"
              readonly
            ></v-text-field>
            <v-text-field
              label="Name"
              :value="assetDetail.product_name"
              readonly
            ></v-text-field>
            <v-text-field
              label="Description"
              :value="assetDetail.product_description"
              readonly
            ></v-text-field>
            <v-text-field
              label="Category"
              :value="assetDetail.product_category"
              readonly
            ></v-text-field>
            <v-text-field
              label="Available Quantity"
              :value="assetDetail.product_quantity"
              readonly
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-if="$auth.user.user_role === 'user'">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog1 = true"
            >
              Borrow now
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog1"
        width="500"
      >
        <v-card v-if="assetDetail">
          <v-card-title class="text-h5 grey lighten-2">
            Enter Details
          </v-card-title>

          <br>

          <v-card-text>
            <v-text-field
              label="Room"
              v-model="room"
            ></v-text-field>
            <v-text-field
              type="number"
              :rules="[(v) => !!v || 'Quantity is required']"
              v-model="quantity"
              label="Quantity"
            ></v-text-field>
            <v-textarea
              label="Remarks"
              v-model="remarks"
            ></v-textarea>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-checkbox
              v-model="checkbox"
              @click="checkbox ? termsAndCondition = true : null"
              label="Terms and Conditions"
            ></v-checkbox>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!checkbox"
              color="primary"
              text
              @click="submit()"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="termsAndCondition"
        width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Privacy Policy
          </v-card-title>

          <v-card-text><br>
            Terms and Conditions: <br><br>
            1. The Borrower should be a bona fide student or employee of SNC. A valid ID must be presented upon borrowing. <br>
            2. The Borrower's slip should be submitted at least two (2) working days before the date of use. <br>
            3. All equipment are checked and tested before issuing to Borrower to ensure functionality. <br>
            4. Borrowed equipment must be returned not later than one (1) working day after the specified return date. A P100.00 fee per equipment will be charged for every additional day until the equipment are returned.<br>
            5. In case of damage or loss due to negligence, mishandling or vandalism the Borrower will replace the equipment with the same or higher brand and model.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="termsAndCondition = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar top right color="green" v-model="snackbar">
        Successfully submitted!

        <template v-slot:action="{ attrs }">
          <v-btn small icon v-bind="attrs" @click="snackbar = false">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "IndexPage",
  layout: "user",
  data() {
    return {
      snackbar: false,
      assetDetail: {},
      termsAndCondition: false,
      checkbox: false,
      dialog: false,
      dialog1: false,
      valid: true,
      product_id: null,
      remarks: "",
      room: "",
      product_code: "",
      product_name: "",
      product_description: "",
      category: "",
      quantity: 0,
      search: "",
      headers: [
        {
          text: "Item Code",
          align: "start",
          sortable: false,
          value: "product_code",
        },
        {
          text: "Item Name",
          value: "product_name",
          sortable: false,
        },
        {
          text: "Item Description",
          value: "product_description",
          sortable: false,
        },
        {
          text: "Category",
          value: "product_category",
          sortable: false,
        },
        {
          text: "Quantity",
          value: "product_quantity",
          sortable: false,
        },
        { text: "", value: "actions", align: "end" },
      ],
      productCodeRules: [(v) => !!v || "Product Code is required"],
      productNameRules: [(v) => !!v || "Product Name is required"],
      productDescriptionRules: [(v) => !!v || "Product Description is required"],
      quantityRules: [(v) => !!v || "Quantity is required"],
      productCategoryRules: [(v) => !!v || "Category is required"],

      productList: [],
      update_record: {}
    };
  },

  mounted() {
    this.getProductList();
  },
  methods: {
    getProductList() {
      this.$axios
        .get("/api/product-tables")
        .then((response) => {
          console.log('ress', response);
          this.productList = response.data.data;
        })
        .catch((error) => {
          console.log("error");
        });
      },
      submit() {
        console.log('$auth.user', this.$auth.user)
        let payload = {
          data: {
            product_table: this.assetDetail.id,
            user: this.$auth.user.id,
            quantity: this.quantity,
            remarks: this.remarks,
            room: this.room,
            status: "Pending"
          },
        };
        console.log('payloadpayload', payload)
        this.$axios
          .post("/api/borrowed-tables", payload)
          .then((response) => {
            this.snackbar = true
            this.dialog = false
            this.dialog1 = false
            this.quantity = 0
            this.room = ''
            this.remarks = ''
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
}
</script>