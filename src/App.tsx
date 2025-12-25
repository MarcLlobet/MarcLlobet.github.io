import { useEffect, useState } from 'react'
import { fetchProjects, type Project } from './api'

function App() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetchProjects().then(fetchedProjects => {
      setProjects(fetchedProjects)
    })
  }, [])

  return projects.map(project => (
    <div key={project.id}>
      <h4>{project.name}</h4>
      <p>{project.description}</p>
      <p>{project.language}</p>
      {project.homepage && <p>
        <a href={project.homepage} target='_blank' rel="noopener noreferrer">
          {project.homepage}
        </a>
      </p>}
      <p>
        <a href={project.html_url} target='_blank' rel="noopener noreferrer">
          github: {project.html_url}
        </a>
      </p>
      {/* <div 
        style={{whiteSpace: "pre-wrap"}} 
        dangerouslySetInnerHTML={{ __html: project.readme?.decodedContent ?? ''}} /> */}
    </div>
  ))
}

export default App
