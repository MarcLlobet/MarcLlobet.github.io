/**
 * const filteredRepositories
 * filtered (includes username)
 */
const filteredRepositories: string[] = [
  'MarcLlobet.github.io',
]

/**
 * const archivedRepositories
 * archived will be filtered out
 */
const archivedRepositories: string[] = [
  'generator-react-and-friends',
  'Polite-cue-class',
  'codeasily',
  'hugo-good-looking',
]

type RepositoryReview = {
  name: string, 
  hasDemo: boolean, 
  hasImage: boolean, 
  comments?: string
}

const repositoryReview: RepositoryReview[] = [
  {
    name: 'users-by-colors', 
    hasDemo: true, 
    hasImage: true
  },
  {
    name: 'calendar-scheduling-ui', 
    hasDemo: true, 
    hasImage: true
  },
  {
    name: 'adventofcode', 
    hasDemo: true, 
    hasImage: true,
  },
  {
    name: 'accordion-progress', 
    hasDemo: true, 
    hasImage: true
  },
  {
    name: 'pet-manager', 
    hasDemo: true, 
    hasImage: true, 
    comments: 'demo could be improved'
  },
  {
    name: 'vanilla-documents', 
    hasDemo: true, 
    hasImage: true, 
    comments: 'demo could be improved'
  },
  {
    name: 'ts-only', 
    hasDemo: true, 
    hasImage: true, 
    comments: 'visual demo only'
  },
  {
    name: 'semantic-git', 
    hasDemo: true, 
    hasImage: true, 
    comments: 'visual demo only'
  },
  {
    name: 'atlesdevidessecretes', 
    hasDemo: true, 
    hasImage: true
  },
  {
    name: 'fluency-report', 
    hasDemo: true, 
    hasImage: true,
  },
  {
    name: 'scss-helpers', 
    hasDemo: true, 
    hasImage: true
  },
  {
    name: 'image-gallery', 
    hasDemo: true,
    hasImage: true
  },
  {
    name: 'wordle-app', 
    hasDemo: true, 
    hasImage: true,
  },
];

const pendingRepositories = repositoryReview.filter(repo => 
  !!repo.comments
);

console.table(repositoryReview.map(({name, topics})=> [name, topics]));