import { reactive } from "vue";

const storedUser = localStorage.getItem("user");

export const auth = reactive({
  user: storedUser ? JSON.parse(storedUser) : null,

  login(user) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout() {
    this.user = null;
    localStorage.removeItem("user");
  }
});
