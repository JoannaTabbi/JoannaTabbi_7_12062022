import Axios from "@/_interceptors/axios";

//upload image service

    function uploadFiles(formData) {
  
      return Axios.put("/auth/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    }
  
  export const uploadServices = {
     uploadFiles
  }