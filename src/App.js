import React, {useState, useEffect} from 'react'
import { ThemeProvider } from 'styled-components'
import GlobalStyles from './style/GlobalStyles'
import theme from './style/theme'
import Landing from './components/page/Landing/Landing'
import Home from './components/page/Home/Home'
import Project from './components/page/Project/Project'
import Puzzle from './components/page/Puzzle/Puzzle'
import Calendar from './components/page/Calendar/Calendar'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

const App = () => {
  const [projectInfo, setProjectInfo] = useState({});

  const projectUp = (project) => {
    setProjectInfo(project)
  }

  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route path="/home" component={() => <Home projectUp={projectUp}/>}></Route>
          <Route path="/project" component={() => <Project projectInfo={projectInfo} projectUp={projectUp} />}></Route>
          <Route path="/puzzle" component={Puzzle}></Route>
          <Route path="/calendar" component={Calendar}></Route>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
