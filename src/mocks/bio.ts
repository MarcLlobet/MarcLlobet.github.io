import type { Bio } from "../services";

export const mockBio = "Test bio";

export const mockGetGithubUserData: { queryId: string; data: Bio } = {
  queryId: "123",
  data: { bio: mockBio },
};
