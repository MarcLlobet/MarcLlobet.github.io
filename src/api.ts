import type { Endpoints } from "@octokit/types";
import { API_USERNAME, githubApi } from "./githubApi";

const GET_README_ENDPOINT = 'GET /repos/{owner}/{repo}/readme';
type ReadmeResponse = Endpoints[typeof GET_README_ENDPOINT]["response"];

const GET_REPOS_ENDPOINT = 'GET /users/{username}/repos';
type ReposResponse = Endpoints[typeof GET_REPOS_ENDPOINT]["response"];

type Readme = ReadmeResponse['data'] & {
  decodedContent: string,
}

export type Project = ReposResponse['data'][number] & {
  preview: string
  readme: Readme | null
}

const getGithubSocialPreview = (repositoryName: string) => `https://opengraph.githubassets.com/1/${API_USERNAME}/${repositoryName}`;

const decodeBase64 = (base64: string) => {
  const binary = atob(base64.replace(/[\r\n]/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

const fetchReadme = async (repositoryName: string) : Promise<Readme> => {
  const { data: readme }: ReadmeResponse = await githubApi.request<typeof GET_README_ENDPOINT>(GET_README_ENDPOINT, {
    owner: API_USERNAME,
    repo: repositoryName,
  });

  const decodedBase64 = decodeBase64(readme.content);

  const { data: decodedContent } = await githubApi.request('POST /markdown', {
    text: decodedBase64,
  });

  return { 
    ...readme, 
    decodedContent 
  };
};

export const fetchProjects = async (): Promise<Project[]> => {
  const { data: repos }: ReposResponse = await githubApi.request<typeof GET_REPOS_ENDPOINT>(GET_REPOS_ENDPOINT, {
    type: 'owner',
    username: API_USERNAME,
    visibility: 'public',
  });
  
  const readmes = await Promise.allSettled(repos.map(repo => fetchReadme(repo.name)));

  console.log({repos, readmes})

  const updatedRepos = repos.map<Project>((repo, index) => ({
    ...repo,
    preview: getGithubSocialPreview(repo.name),
    readme: readmes[index].status === 'fulfilled' ? readmes[index].value : null,
  }));

  return updatedRepos;
};