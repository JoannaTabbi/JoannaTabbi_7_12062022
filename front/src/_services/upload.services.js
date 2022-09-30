import Axios from "@/_interceptors/axios";

//upload image service

    function upload(file, uploadOptions) {
      let formData = new FormData();
  
      formData.append("file", file);
  
      return Axios.put("/auth", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        uploadOptions
      })
    }
  
  export const uploadServices = {
     upload
  }