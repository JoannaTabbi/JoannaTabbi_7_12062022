import { defineStore } from "pinia";

export const useHandleErrorStore = defineStore('HandleErrorStore', {
state: () => {
    return {
        showToast: false,
        toastMessage: ""
    }
},
persist: true,
actions: {
    //shows the toast notification of the error during 4 seconds

    triggerToast(message) {
        this.showToast = true;
        this.toastMessage = message;
        setTimeout(
          () => ((this.showToast = false), (this.toastMessage = "")),
          4000
        );
      },
}

})