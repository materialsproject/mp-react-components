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
import './assets/styles.css';
import '../node_modules/bulma/css/bulma.min.css';
import '../node_modules/bulma-tooltip/dist/css/bulma-tooltip.min.css';
import { MaterialsExplorer } from './pages/MaterialsExplorer';
import { MoleculesExplorer } from './pages/MoleculesExplorer';
import { XasApp } from './pages/XasApp';
import { CrystalStructureViewer } from './pages/CrystalStructureViewer';
import { BatteryExplorer } from './pages/BatteryExplorer';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Publications } from './pages/Publications';
import { Sandbox } from './pages/Sandbox';
import { SynthesisExplorer } from './pages/SynthesisExplorer';
import { MPContribsSearch } from './pages/MPContribsSearch';
import { CatalystExplorer } from './pages/CatalystExplorer';

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

ReactDOM.render(
  <>
    <Router>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <span className="navbar-item">
              <Link to="/materials">Materials</Link>
            </span>
            <span className="navbar-item">
              <Link to="/molecules">Molecules</Link>
            </span>
            <span className="navbar-item">
              <Link to="/batteries">Batteries</Link>
            </span>
            <span className="navbar-item">
              <Link to="/xas">X-Ray Absorption Spectra</Link>
            </span>
            <span className="navbar-item">
              <Link to="/crystal">Crystal Structure</Link>
            </span>
            <span className="navbar-item">
              <Link to="/synthesis">Synthesis</Link>
            </span>
            <span className="navbar-item">
              <Link to="/publications">Publications</Link>
            </span>
            <span className="navbar-item">
              <Link to="/contribs">Contributions</Link>
            </span>
            <span className="navbar-item">
              <Link to="/catalysts">Catalysts</Link>
            </span>
            <span className="navbar-item">
              <Link to="/sandbox">Sandbox</Link>
            </span>
          </div>
        </div>
      </nav>
      <section className="p-3">
        <Switch>
          <Route path="/materials">
            <MaterialsExplorer />
          </Route>
          <Route path="/molecules">
            <MoleculesExplorer />
          </Route>
          <Route path="/batteries">
            <BatteryExplorer />
          </Route>
          <Route path="/crystal">
            <CrystalStructureViewer />
          </Route>
          <Route path="/synthesis">
            <SynthesisExplorer />
          </Route>
          <Route path="/xas">
            <XasApp />
          </Route>
          <Route path="/publications">
            <Publications />
          </Route>
          <Route path="/contribs">
            <MPContribsSearch />
          </Route>
          <Route path="/catalysts">
            <CatalystExplorer />
          </Route>
          <Route path="/sandbox">
            <Sandbox />
          </Route>
          <Route path="/">
            <MaterialsExplorer />
          </Route>
        </Switch>
      </section>
    </Router>
  </>,

  mountNode
);
console.log('RUNNING in', process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
