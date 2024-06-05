<template>
  <v-app>
    <v-row style="padding: 50px">
      <v-col cols="3">
        <v-card
          color="#385F73"
          dark
        >
          <v-card-title class="text-h5">
            All
          </v-card-title>
          <v-card-actions>
            <v-btn text style="font-size: 32px">
              {{all}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card
          color="blue"
          dark
        >
          <v-card-title class="text-h5">
            Pending
          </v-card-title>


          <v-card-actions>
            <v-btn text style="font-size: 32px">
              
            {{pending}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card
          color="orange"
          dark
        >
          <v-card-title class="text-h5">
            Released
          </v-card-title>

          <v-card-actions>
            <v-btn text style="font-size: 32px">
              {{release}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card
          color="green"
          dark
        >
          <v-card-title class="text-h5">
            Returned
          </v-card-title>

          <v-card-actions>
            <v-btn text style="font-size: 32px">
              {{returned}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card
          color="red"
          dark
        >
          <v-card-title class="text-h5">
            Declined
          </v-card-title>

          <v-card-actions>
            <v-btn text style="font-size: 32px">
              {{declined}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-container fluid style="padding-left: 50px; padding-right: 50px">
      <v-row>
        <v-col cols="4">
          <v-select
            @input="filterStatus"
            :items="['All', 'Pending', 'Released', 'Returned']"
            label="Filter by status"
            v-model="status"
          ></v-select>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>Borrow List</v-card-title>
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
        <v-card v-if="assetDetail && assetDetail.product_table">
          <v-card-title class="text-h5 grey lighten-2">
            Preview Details
          </v-card-title>


          <v-tabs
            v-model="tab"
            background-color="blue"
            centered
            dark
            icons-and-text
          >
            <v-tabs-slider></v-tabs-slider>

            <v-tab href="#tab-1">
              Details
            </v-tab>

            <v-tab href="#tab-2">
              Student details
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
              <v-card flat>
                <v-card-text>
                  <v-text-field
                    label="Status"
                    :value="assetDetail.status"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    v-if="assetDetail.timeReleased"
                    label="Date / Time Released"
                    :value="`${assetDetail.dateReleased} ${assetDetail.timeReleased}`"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    v-if="assetDetail.timeReturned"
                    label="Date / Time Returned"
                    :value="`${assetDetail.dateReturned} ${assetDetail.timeReturned}`"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Room"
                    :value="assetDetail.room"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Code"
                    :value="assetDetail.product_table.product_code"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Name"
                    :value="assetDetail.product_table.product_name"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Description"
                    :value="assetDetail.product_table.product_description"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Category"
                    :value="assetDetail.product_table.product_category"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Available Quantity"
                    :value="assetDetail.product_table.product_quantity"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Borrow Quantity"
                    :value="assetDetail.quantity"
                    readonly
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item value="tab-2">
              <v-card flat>
                <v-card-text>
                  <v-img
                    :src="`http://localhost:1337${assetDetail.user.schoolId}`"
                  ></v-img>
                  <v-text-field
                    label="Name"
                    :value="assetDetail.user.name"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Email"
                    :value="assetDetail.user.email"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Course"
                    :value="assetDetail.user.course"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    label="Department"
                    :value="assetDetail.user.department"
                    readonly
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider></v-divider>

          <v-card-actions v-if="$auth.user.user_role === 'admin'">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="assetDetail.status === 'Released' || assetDetail.status === 'Returned' || assetDetail.status === 'Declined'"
              color="primary"
              text
              @click="dialog2 = true"
            >
              Decline
            </v-btn>
            <v-btn
              color="primary"
              :disabled="assetDetail.status !== 'Pending' || assetDetail.status === 'Released'"
              text
              @click="action= 'Release'; dialog3 = true"
            >
              Release
            </v-btn>
            <v-btn
              color="primary"
              :disabled="assetDetail.status !== 'Released'"
              text
              @click="action= 'Return'; dialog3 = true"
            >
              Return
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
            <v-spacer></v-spacer>
            <v-btn
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
        v-model="dialog2"
        width="500"
      >
        <v-card v-if="assetDetail">
          <v-card-title class="text-h5 grey lighten-2">
            Enter Details
          </v-card-title>

          <br>

          <v-card-text>
            <v-textarea
              label="Remarks"
              v-model="remarks1"
            ></v-textarea>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="decline()"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog3"
        width="500"
      >
        <v-card v-if="assetDetail">
          <v-card-title class="text-h5 grey lighten-2">
            Enter Details
          </v-card-title>

          <br>

          <v-card-text>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="menu = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(date)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="time"
                  label="Time"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="time"
                full-width
                @click:minute="$refs.menu2.save(time)"
              ></v-time-picker>
            </v-menu>
            <v-textarea
              label="Remarks"
              v-model="remarks1"
            ></v-textarea>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="releaseOrReturn()"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>

    <v-snackbar top right color="green" v-model="snackbar">
      Successfully updated!

      <template v-slot:action="{ attrs }">
        <v-btn small icon v-bind="attrs" @click="snackbar = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "BorrowPage",
  layout: "borrow",
  data() {
    return {
      all: 0,
      pending: 0,
      declined: 0,
      release: 0,
      returned: 0,
      snackbar: false,
      tab: 'tab-1',
      assetDetail: {},
      dialog: false,
      dialog1: false,
      action: '',
      menu: false,
      date: null,
      menu2: false,
      time: null,
      dialog2: false,
      dialog3: false,
      valid: true,
      product_id: null,
      status: "",
      remarks: "",
      remarks1: "",
      product_code: "",
      product_name: "",
      product_description: "",
      category: "",
      quantity: 0,
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "user.name",
        },
        {
          text: "Item Name",
          value: "product_table.product_name",
          sortable: false,
        },
        {
          text: "Category",
          value: "product_table.product_category",
          sortable: false,
        },
        {
          text: "Quantity Available",
          value: "product_table.product_quantity",
          sortable: false,
        },
        {
          text: "Quantity Request",
          value: "quantity",
          sortable: false,
        },
        {
          text: "Status",
          value: "status",
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
    this.allDashboard()
    this.pendingDashboard()
    this.returnDashboard()
    this.releaseDashboard()
    this.declinedDashboard()
  },
  methods: {
    declinedDashboard () {
      let url = ''
      if(this.$auth.user.user_role === 'admin') {
        url = `/api/borrowed-tables?filters[status][$eq]=Declined&populate=*&sort=updatedAt:desc`
      } else {
        url = `/api/borrowed-tables?filters[status][$eq]=Declined&filters[user][id][$eq]=${this.$auth.user.id}&populate=*&sort=updatedAt:desc`
      }

      this.$axios.get(url).then((response) => {
        console.log('ress', response);
        this.declined = response.data.data.length;
      }).catch((error) => {
        console.log("error");
      });
    },
    releaseDashboard () {
      let url = ''
      if(this.$auth.user.user_role === 'admin') {
        url = `/api/borrowed-tables?filters[status][$eq]=Released&populate=*&sort=updatedAt:desc`
      } else {
        url = `/api/borrowed-tables?filters[status][$eq]=Released&filters[user][id][$eq]=${this.$auth.user.id}&populate=*&sort=updatedAt:desc`
      }

      this.$axios.get(url).then((response) => {
        console.log('ress', response);
        this.release = response.data.data.length;
      }).catch((error) => {
        console.log("error");
      });
    },
    returnDashboard () {
      let url = ''
      if(this.$auth.user.user_role === 'admin') {
        url = `/api/borrowed-tables?filters[status][$eq]=Returned&populate=*&sort=updatedAt:desc`
      } else {
        url = `/api/borrowed-tables?filters[status][$eq]=Returned&filters[user][id][$eq]=${this.$auth.user.id}&populate=*&sort=updatedAt:desc`
      }

      this.$axios.get(url).then((response) => {
        console.log('ress', response);
        this.returned = response.data.data.length;
      }).catch((error) => {
        console.log("error");
      });
    },
    pendingDashboard() {
      let url = ''
      if(this.$auth.user.user_role === 'admin') {
        url = `/api/borrowed-tables?filters[status][$eq]=Pending&populate=*&sort=updatedAt:desc`
      } else {
        url = `/api/borrowed-tables?filters[status][$eq]=Pending&filters[user][id][$eq]=${this.$auth.user.id}&populate=*&sort=updatedAt:desc`
      }

      this.$axios.get(url).then((response) => {
        console.log('ress', response);
        this.pending = response.data.data.length;
      }).catch((error) => {
        console.log("error");
      });
    },
    allDashboard () {
      let url = ''
      if(this.$auth.user.user_role === 'admin') {
        url = `/api/borrowed-tables?populate=*&sort=updatedAt:desc`
      } else {
        url = `/api/borrowed-tables?filters[user][id][$eq]=${this.$auth.user.id}&populate=*&sort=updatedAt:desc`
      }

      this.$axios.get(url).then((response) => {
        console.log('ress', response);
        this.all = response.data.data.length;
      }).catch((error) => {
        console.log("error");
      });
    },
    getProductList() {
      let url = ''
      if(this.$auth.user.user_role === 'admin') {
        url = `/api/borrowed-tables?populate=*&sort=updatedAt:desc`
      } else {
        url = `/api/borrowed-tables?filters[user][id][$eq]=${this.$auth.user.id}&populate=*&sort=updatedAt:desc`
      }

      this.$axios.get(url).then((response) => {
        console.log('ress', response);
        this.productList = response.data.data;
      }).catch((error) => {
        console.log("error");
      });
    },
    submit() {
      let payload = {
        data: {
          product_table: this.assetDetail.id,
          user: this.$auth.user.id,
          quantity: this.quantity,
          remarks: this.remarks,
          status: "Pending"
        },
      };

      this.$axios.post("/api/borrowed-tables", payload).then((response) => {
        this.snackbar = true
      }).catch((error) => {
        console.log(error);
      });
    },
    decline () {
      let payload = {
        data: {
          remarks: this.remarks1,
          status: "Declined"
        },
      };
      console.log('payloadpayload', payload)
      this.$axios.put(`/api/borrowed-tables/${this.assetDetail.id}`, payload).then((response) => {
        this.dialog = false
        this.dialog2 = false
        this.snackbar = true
        this.getProductList();
      }).catch((error) => {
        console.log(error);
      });
    },
    filterStatus () {
      let url = ''
      if(this.$auth.user.user_role === 'admin') {
        if (this.status === 'All') {
          url = `/api/borrowed-tables?populate=*`
        } else {
          url = `/api/borrowed-tables?filters[status][$eq]=${this.status}&populate=*`
        }
      } else {
        if (this.status === 'All') {
          url = `/api/borrowed-tables?filters[user][id][$eq]=${this.$auth.user.id}&populate=*`
        } else {
          url = `/api/borrowed-tables?filters[status][$eq]=${this.status}&filters[user][id][$eq]=${this.$auth.user.id}&populate=*`
        }
      }
      this.$axios
        .get(url)
        .then((response) => {
          console.log('ress', response);
          this.productList = response.data.data;
        })
        .catch((error) => {
          console.log("error");
        });
    },
    releaseOrReturn() {
      if (this.action === 'Release') {
        let payload = {
          data: {
            dateReleased: this.date,
            timeReleased: this.time,
            status: "Released"
          },
        };
        console.log('payloadpayload', payload)
        this.$axios
          .put(`/api/borrowed-tables/${this.assetDetail.id}`, payload)
          .then((response) => {
            let payload = {
              data: {
                product_quantity: this.assetDetail.product_table.product_quantity - this.assetDetail.quantity
              },
            };
            this.$axios
              .put(`/api/product-tables/${this.assetDetail.product_table.id}`, payload)
              .then((response) => {
                this.snackbar = true
                this.dialog = false
                this.dialog2 = false
                this.getProductList();
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (this.action === 'Return') {
        let payload = {
          data: {
            dateReturned: this.date,
            timeReturned: this.time,
            remarks: this.returned,
            status: "Returned"
          },
        };

        this.$axios
          .put(`/api/borrowed-tables/${this.assetDetail.id}`, payload)
          .then((response) => {
            let payload = {
              data: {
                product_quantity: this.assetDetail.product_table.product_quantity + this.assetDetail.quantity
              },
            };
            this.$axios
              .put(`/api/product-tables/${this.assetDetail.product_table.id}`, payload)
              .then((response) => {
                this.snackbar = true
                this.dialog = false
                this.dialog2 = false
                this.getProductList();
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      this.remarks1 = ""
      this.date = null
      this.time = null
      this.dialog = false
      this.dialog3 = false
    }
  },
}

  </script>