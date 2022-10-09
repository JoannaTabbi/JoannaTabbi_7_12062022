import Axios from "@/_interceptors/axios";
import exportFromJSON from "export-from-json";

//upload image service

function uploadFiles(formData) {

  return Axios.put("/auth/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

// parse data in order to download it

function excelParser() {
  function exportDataFromJSON(data, newFileName, fileExportType) {
    if (!data) return;
    try {
      const fileName = newFileName || "exported-data";
      const exportType = exportFromJSON.types[fileExportType || "txt"];
      exportFromJSON({
        data,
        fileName,
        exportType
      });
    } catch (e) {
      throw new Error("Parsing failed!");
    }
  }
  return {
    exportDataFromJSON
  };
};

export const loadServices = {
  uploadFiles,
  excelParser
}