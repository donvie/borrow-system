<template>
  <v-app style="padding: 50px">
    <v-container fluid>
      <v-btn
        v-if="$auth.user.user_role === 'admin'"
        depressed
        @click="action='add'; assetDetail = {}; dialog = true"
        color="primary"
      >
        Add asset
      </v-btn>
      <v-btn
        v-if="$auth.user.user_role === 'admin'"
        depressed
        @click="scannerDialog = true;"
        color="primary"
      >
        Qr Scanner
      </v-btn>
      <br>
      <br>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Asset List</v-card-title>
            <v-card-text>
              <v-data-table :items="productList" :headers="headers" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    v-if="$auth.user.user_role === 'admin'"
                    class="mr-2"
                    color="blue"
                    @click="assetDetail = item; qrDialog = true; generateQRCode()"
                  >
                    mdi-qrcode
                  </v-icon>
                  <v-icon
                    small
                    v-if="$auth.user.user_role === 'admin'"
                    class="mr-2"
                    color="blue"
                    @click="action = 'edit'; assetDetail = item; dialog = true"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    small
                    class="mr-2"
                    v-if="$auth.user.user_role === 'admin'"
                    color="red"
                    @click="assetDetail = item; deleteProduct()"
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon
                    small
                    class="mr-2"
                    @click="action='view'; assetDetail = item; dialog = true"
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
              v-model="assetDetail.product_code"
              :readonly="action === 'view'"
            ></v-text-field>
            <v-text-field
              label="Name"
              v-model="assetDetail.product_name"
              :readonly="action === 'view'"
            ></v-text-field>
            <v-text-field
              label="Description"
              v-model="assetDetail.product_description"
              :readonly="action === 'view'"
            ></v-text-field>
            <v-text-field
              label="Category"
              v-model="assetDetail.product_category"
              :readonly="action === 'view'"
            ></v-text-field>
            <v-text-field
              label="Available Quantity"
              v-model="assetDetail.product_quantity"
              :readonly="action === 'view'"
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="action === 'view' && $auth.user.user_role === 'user'"
              color="primary"
              text
              @click="dialog1 = true"
            >
              Borrow now
            </v-btn>
            <v-btn
              v-if="action === 'edit' || action === 'add'"
              color="primary"
              text
              @click="action === 'edit' ? editProduct() : addProduct()"
            >
              {{action === 'edit' ? 'Edit' : 'Add'}}
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
            Terms and Conditions
          </v-card-title>
          <br>

          <v-card-text>
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

      <v-dialog
        v-model="qrDialog"
        width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Generate QRcode
          </v-card-title>

          <div class="qr-code-generator" align="center">
            <canvas ref="qrCanvas" style="display: none;"></canvas>
            <img style="height: 145px; width: 145px" v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code" /><br><br>
            <v-btn @click="downloadQRCode" color="primary" :disabled="!qrCodeDataUrl">Download QR Code</v-btn> <br><br>
          </div>
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

      <v-dialog
        v-model="scannerDialog"
        width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            QRCode Scanner
          </v-card-title>

          <div class="qr-code-generator" align="center">
             <video style="height: 100%; width: 100%" ref="videoElem"></video>
              <v-btn
                depressed
                @click="startQR()"
                color="primary"
              >
                Start
              </v-btn>
              <v-btn
                depressed
                @click="stopQR()"
                color="primary"
              >
                Stop
              </v-btn>
          </div>
          <br>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import QrScanner from 'qr-scanner';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';

export default {
  name: "IndexPage",
  layout: "user",
  data() {
    return {
      scannerDialog: false,
      qrDialog: false,
      qrCodeDataUrl: '',
      action: '',
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
    startQR(detectedCodes) {
      const videoElem = this.$refs.videoElem;
      const qrScanner = new QrScanner(
        videoElem,
        result => {
          console.log('decoded qr code:', result)
          let url = `/api/product-tables?filters[product_code][$eq]=${result.data}`

          this.$axios
            .get(url)
            .then((response) => {
              console.log('ress', response);
              // this.productList = response.data.data;
              this.scannerDialog = false
              this.action = 'view'
              this.assetDetail = response.data.data[0]
              this.dialog = true
            })
            .catch((error) => {
              console.log("error");
            });

        },
        { /* your options or returnDetailedScanResult: true if you're not specifying any other options */ },
      );
      qrScanner.start();
      // qrScanner.stop();
    },
    stopQR () {
      const videoElem = this.$refs.videoElem;
      const qrScanner = new QrScanner(
        videoElem,
        result => console.log('decoded qr code:', result),
        { /* your options or returnDetailedScanResult: true if you're not specifying any other options */ },
      );
      // qrScanner.start();
      qrScanner.stop();
      qrScanner.destroy();
      this.scannerDialog = false
      // qrScanner = null;
    },
    generateQRCode() {
      QRCode.toDataURL(this.assetDetail.product_code, { errorCorrectionLevel: 'H' })
        .then((url) => {
          this.qrCodeDataUrl = url;
          const canvas = this.$refs.qrCanvas;
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.src = url;
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          };
        })
        .catch((err) => {
          console.error(err);
        });
    },
    downloadQRCode() {
      if (!this.qrCodeDataUrl) return;
      const canvas = this.$refs.qrCanvas;
      canvas.toBlob((blob) => {
        saveAs(blob, 'qrcode.png');
      });
    },
    editProduct() {
      let payload = {
        data: {
          product_code: this.assetDetail.product_code,
          product_name: this.assetDetail.product_name,
          product_description: this.assetDetail.product_description,
          product_category: this.assetDetail.product_category,
          product_quantity: this.assetDetail.product_quantity,
        },
      };
      this.$axios.put(`/api/product-tables/${this.assetDetail.id}`, payload).then((response) => {
        this.dialog = false;
        this.getProductList();
      }).catch((error) => {
        console.log(error);
      });
    },
    addProduct() {
      let payload = {
        data: {
          product_code: this.assetDetail.product_code,
          product_name: this.assetDetail.product_name,
          product_description: this.assetDetail.product_description,
          product_category: this.assetDetail.product_category,
          product_quantity: this.assetDetail.product_quantity,
        },
      };
      this.$axios.post("/api/product-tables", payload).then((response) => {
        this.dialog = false;
        this.getProductList();
      }).catch((error) => {
        console.log(error);
      });
    },
    deleteProduct() {
      this.$axios.delete(`/api/product-tables/${this.assetDetail.id}`).then((response) => {
        this.getProductList();
      }).catch((error) => {
        console.log("error");
      });
    },
    getProductList() {
      this.$axios
        .get("/api/product-tables")
        .then((response) => {
          this.productList = response.data.data;
        })
        .catch((error) => {
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
          room: this.room,
          status: "Pending"
        },
      };
      this.$axios
        .post("/api/borrowed-tables", payload)
        .then((response) => {
          this.snackbar = true;
          this.dialog = false;
          this.dialog1 = false;
          this.quantity = 0;
          this.room = '';
          this.remarks = '';
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
}
</script>
