import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

type File = {
  name: string;
  file: string;
  script: string;
};

const dataFiles: File[] = [
  {
    name: "GitHub repositories",
    file: "app/public/data/github-repos.json",
    script: "tsx scripts/get-github-repos.ts",
  },
  {
    name: "GitHub bio",
    file: "app/public/data/github-bio.json",
    script: "tsx scripts/get-github-bio.ts",
  },
  {
    name: "Codepen pens",
    file: "app/public/data/codepen-pens.json",
    script: "tsx scripts/get-codepen-pens.ts",
  },
];

const getFilesToFetch = (): File[] => {
  const fileByDoesExist = Map.groupBy(dataFiles, ({ file }) =>
    existsSync(file),
  );

  if (fileByDoesExist.get(true)?.length === dataFiles.length) {
    return [];
  }

  return fileByDoesExist.get(false) ?? [];
};

const filesToFetch = getFilesToFetch();

if (filesToFetch.length === 0) {
  console.log("✓ Fetched data already exist");
  process.exit(0);
}

filesToFetch.forEach(({ name, script }) => {
  try {
    execSync(script, { stdio: "inherit" });
    console.log(`✓ Fetched ${name} data successfully.`);
  } catch (error) {
    console.error(`⚠ Failed to fetch ${name} data:`, error);
  }
});
