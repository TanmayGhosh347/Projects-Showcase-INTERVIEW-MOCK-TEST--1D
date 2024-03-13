import './index.css'

const ProjectShowCase = props => {
  const {details} = props
  const {name, imageUrl} = details
  return (
    <li className="app-list">
      <img src={imageUrl} className="picture" alt={name} />
      <p className="paragraph">{name}</p>
    </li>
  )
}

export default ProjectShowCase
