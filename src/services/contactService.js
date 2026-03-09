import { httpClient } from "./httpClient";

export const contactService = {
  store({ name, email, phone, content }) {
    return httpClient.request("/api/v1/contact/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        content,
      }),
    });
  },
};
