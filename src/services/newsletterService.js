import { httpClient } from "./httpClient";

export const newsletterService = {
  /**
   * Subscribes an email to the newsletter.
   * @param {string} email
   */
  async subscribe(email) {
    return httpClient.request("/api/v1/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  /**
   * Unsubscribes an email from the newsletter.
   * @param {string} email
   */
  async unsubscribe(email) {
    return httpClient.request("/api/v1/newsletter/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
