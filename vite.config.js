// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        fallback: resolve(__dirname, "404/index.html"),
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login/index.html"),
        reset: resolve(__dirname, "reset/index.html"),
        venues: resolve(__dirname, "venues/index.html"),
        book: resolve(__dirname, "book/index.html"),
        admin: resolve(__dirname, "admin/index.html"),
        profile: resolve(__dirname, "profile/index.html"),
        block: resolve(__dirname, "block/index.html"),
        completedform: resolve(__dirname, "completedform/index.html"),
        contactus: resolve(__dirname, "contactus/index.html"),
        feedback: resolve(__dirname, "feedback/index.html"),
        register: resolve(__dirname, "register/index.html"),
        mobile: resolve(__dirname, "mobile/index.html"),
        management: resolve(__dirname, "management/index.html"),
        managementbook: resolve(__dirname, "managementbook/index.html"),
      },
    },
  },
});

// vite.config.js
