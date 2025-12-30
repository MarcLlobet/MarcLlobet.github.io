import type { FetchBioResponse } from "../services";

export const mockBio = "Test bio";

export const mockGetGithubUserData: FetchBioResponse = {
  user: {
    bio: mockBio,
  },
};
