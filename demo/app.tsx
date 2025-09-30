/**
 * Main app page for mp-react-component
 * Serves as a playground for testing and viewing components
 *
 * Experimental implementations of components are imported from the views directory
 * and rendered here.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles.less';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
//import './assets/fonts.css';
//import '../node_modules/bulma/css/bulma.min.css';
//import '../node_modules/bulma-tooltip/dist/css/bulma-tooltip.min.css';
import { CrystalStructureAnimationViewer } from '../src/pages/CrystalStructureAnimationViewer';
import { CrystalStructureViewer } from '../src/pages/CrystalStructureViewer';

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

ReactDOM.render(
  <>
    <Router>
      <div className="basic-navbar">
        <Link to="/crystal_animation">Crystal Animation</Link>
      </div>
      <section>
        <Switch>
          <Route path="/">
            <CrystalStructureViewer />
          </Route>
        </Switch>
      </section>
    </Router>
  </>,

  mountNode
);
console.log('RUNNING in', process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
