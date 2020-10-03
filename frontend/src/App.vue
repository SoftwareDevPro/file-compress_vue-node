<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div
            class="wrapper mt-5 p-3"
            v-cloak
            @drop.prevent="addFile"
            @dragover.prevent
          >
            <h4>Drag & Drop File</h4>
            <ul class="list-group mt-5">
              <li v-for="(file, id) in files" :key="id" class="list-group-item">
                {{ file.name }}-({{ file.size | kb }} kb
                <button
                  class="btn btn-sm btn-danger mx-4"
                  @click="removeFile(file)"
                >
                  Remove
                </button>
              </li>
            </ul>
          </div>

          <button class="btn btn-primary my-4" @click="compressFile">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              v-if="loading"
              aria-hidden="true"
            ></span>
            Compress
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data: function () {
    return {
      loading: false,
      files: [],
    };
  },
  filters: {
    kb(val) {
      return Math.floor(val / 1024);
    },
  },
  methods: {
    removeFile(file) {
      this.files = this.files.filter((f) => {
        return f != file;
      });
    },
    addFile(e) {
      let files = e.dataTransfer.files;
      [...files].forEach((file) => {
        this.files.push(file);
        console.log(this.files);
      });
    },
    compressFile() {

      this.loading = true;
      
      let formdata = new FormData();
      
      formdata.append("file", this.files[0]);
      
      axios
        .post("http://localhost:4500/compress", formdata, {
          responseType: "blob",
        })
        .then((response) => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]));
          const fileLink = document.createElement("a");

          fileLink.href = fileURL;
          fileLink.setAttribute("download", `${this.files[0].name}.gz`);

          document.body.appendChild(fileLink);

          fileLink.click();

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background: lightslategray;
}

.wrapper {
  margin: 0 auto;
  width: 600px;
  height: 600px;
  border: 3px dotted black;
}

.wrapper h4 {
  text-align: center;
  font-family: sans-serif;
}
</style>
