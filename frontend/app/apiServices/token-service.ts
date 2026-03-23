import Cookies from "js-cookie";
export const TokenService = {
  getCookie: () => Cookies.get("access_token"),

  setCookie: (token: string) => {
    Cookies.set("access_token", token, {
      path: "/",
      sameSite: "lax",
      secure:
        typeof window !== "undefined"
          ? window.location.protocol === "https:"
          : false,
    });
  },

  removeCookie: () => {
    Cookies.remove("access_token", { path: "/" });
  },
};
