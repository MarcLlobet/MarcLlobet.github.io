import { useEffect, useState } from 'react'
import { fetchProjects, type Project } from './api'

const ProjectWapper = ({children}) => (
  <div style={{
    width: '60ch',
    padding: '1rem',
  }}>
    {children}
  </div>
)

function App() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetchProjects().then(fetchedProjects => {
      setProjects(fetchedProjects)
    })
  }, [])

  return (
    <ProjectWapper>
    {projects.map(project => (
    <div key={project.id}>
      <h4>{project.name}</h4>
      <p>{project.description}</p>
      <img src={project.preview} alt={`Preview of ${project.name} repository`} style={{maxWidth: '100%'}} />
      <p>
      {project.homepage && (<><span>
          <a href={project.homepage} target='_blank' rel="noopener noreferrer">
            Link
          </a>
        </span>&nbsp;</>)
      }
      <span>
        <a href={project.html_url} target='_blank' rel="noopener noreferrer">
          Github
        </a>
      </span>
      &nbsp;
      <span>{project.language}</span>
      </p>
    </div>
  ))}
  </ProjectWapper>
  )
}

export default App
