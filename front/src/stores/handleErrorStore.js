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
    //if error occurs, shows the toast notification with error info during 4 seconds
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