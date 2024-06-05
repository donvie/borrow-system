<template>
  <div class="d-flex align-center justify-center" style="height: 100%; padding: 50px">
    <v-card width="450" class="mx-auto card-border" outlined><br>
      <v-img src="https://onepampanga.com/uploads/businesses/st-nicholas-college-of-business-and-technology/Logo/b9e7a14328350ab93acb98ce0a590eb0.jpg" max-height="150" contain></v-img>
      <br>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation class="mx-10 mb-10">
          <v-text-field
            v-model="username"
            :rules="[(v) => !!v || 'Username is required']"
            label="Username"
            prepend-inner-icon="mdi-account"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="name"
            :rules="[(v) => !!v || 'Name is required']"
            label="Name"
            prepend-inner-icon="mdi-account"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="department"
            :rules="[(v) => !!v || 'Department is required']"
            label="Department"
            prepend-inner-icon="mdi-account"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="course"
            :rules="[(v) => !!v || 'Course is required']"
            label="Course"
            prepend-inner-icon="mdi-account"
            outlined
            required
          ></v-text-field>
          <v-file-input
          
            prepend-icon=""
            prepend-inner-icon="mdi-account"
            accept="image/*"
            label="School ID"
            outlined
            v-model="file"
            :rules="fileRules"
          ></v-file-input>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            prepend-inner-icon="mdi-email"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            type="password"
            prepend-inner-icon="mdi-lock"
            outlined
            required
          ></v-text-field>
          <v-btn :disabled="!valid" color="primary" block @click="submit">
            Create Account
          </v-btn>

          <div class="mt-5">
            Already have an account?
            <NuxtLink to="/auth/login" class="nuxt-link">Sign In</NuxtLink>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar top right color="green" v-model="snackbar">
      Successfully created an account!

      <template v-slot:action="{ attrs }">
        <v-btn small icon v-bind="attrs" @click="snackbar = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  layout: "auth",
  data() {
    return {
      valid: true,
      snackbar: false,
      name: "",
      username: "",
      department: "",
      course: "",
      email: "",
      file: null,
      password: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [(v) => !!v || "Password is required"],
      fileRules: [(v) => !!v || "File is required"]
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          let formData = new FormData();
          formData.append("files", this.file);

          const uploadResponse = await this.$axios.post('api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          console.log('uploadResponse', uploadResponse);
          const uploadedFile = uploadResponse.data[0];
          const fileUrl = uploadedFile.url;

          console.log('File URL:', fileUrl);

          const userResponse = await this.$axios.post('api/auth/local/register', {
            username: this.username,
            email: this.email,
            password: this.password,
            department: this.department,
            course: this.course,
            name: this.name,
            user_role: 'user',
            schoolId: fileUrl
          });

          console.log('Well done!');
          console.log('User profile', userResponse.data.user);
          console.log('User token', userResponse.data.jwt);

          this.$refs.form.reset();
          this.snackbar = true;
        } catch (error) {
          console.log('An error occurred:', error.response);
          if (error.response && error.response.data && error.response.data.message) {
            alert(`Error: ${error.response.data.message}`);
          } else {
            alert('An unknown error occurred.');
          }
        }
      }
    },
  },
};
</script>
<style scoped>
.nuxt-link {
  text-decoration: none;
  padding-top: 5px;
}
.card-border {
  border-radius: 20px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.hr-sect {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: rgba(0, 0, 0, 0.9);
  margin: 8px 0;
}
.hr-sect::before,
.hr-sect::after {
  content: "";
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.15);
  height: 1px;
  font-size: 0;
  line-height: 0;
  margin: 0 8px;
}
</style>
