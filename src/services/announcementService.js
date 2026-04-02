import { httpClient } from "./httpClient";

const ANNOUNCEMENT_ENDPOINT = "/api/v1/announcement";

export const announcementService = {
  /**
   * Fetches the latest announcement data.
   * @param {AbortSignal} [signal] - Optional AbortSignal.
   * @returns {Promise<Object>} The announcement data.
   */
  async getLatestAnnouncement(signal) {
    return httpClient.request(ANNOUNCEMENT_ENDPOINT, {
      method: "GET",
      signal,
    });
  },
};
