import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectShowCase from './components/ProjectShowCase'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    projectList: [],
    selectItem: categoriesList[0].id,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {selectItem} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectItem}`
    const options = {method: 'GET'}
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelectItem = event => {
    this.setState({selectItem: event.target.value}, this.getData)
  }

  loadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {projectList} = this.state
    return (
      <div className="app-container">
        <ul className="question-container">
          {projectList.map(eachProject => (
            <ProjectShowCase details={eachProject} key={eachProject.id} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div className="fail-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
        className="image"
        alt="failure view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="paragraph">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  finalRender = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.failure:
        return this.failureView()
      case apiStatusConstants.inProgress:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    const {selectItem} = this.state
    return (
      <div>
        <nav className="nav-element">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="website-logo"
            alt="website logo"
          />
        </nav>
        <div className="mani=container">
          <ul className="select-container">
            <select
              className="select"
              value={selectItem}
              onChange={this.onChangeSelectItem}
            >
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.finalRender()}
        </div>
      </div>
    )
  }
}

export default App
