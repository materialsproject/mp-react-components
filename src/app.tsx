/**
 *
 *  App bootstrapping. See index.html
 *
 *  This is just a playground app. The real package entrypoint is in index.ts
 *
 */
import * as React from 'react';

import { Component, useState } from 'react';

import * as ReactDOM from 'react-dom';
import './styles.less';
import { SelectableTable } from './periodic-table/table-state';
import { TableFilter } from './periodic-table/periodic-filter/table-filter';
import { StandalonePeriodicComponent } from './periodic-table/periodic-element/standalone-periodic-component';
import { useElements } from './periodic-table/periodic-table-state/table-store';
import { PeriodicContext } from './periodic-table/periodic-table-state/periodic-selection-context';
import { TableLayout } from './periodic-table/periodic-table-component/periodic-table.component';
import Simple3DSceneComponent from './crystal-toolkit-components/components-v2/Simple3DScene/Simple3DSceneComponent.react';
import {
  AnimationStyle,
  Renderer
} from './crystal-toolkit-components/components-v2/Simple3DScene/constants';
import { scene, scene2 } from './crystal-toolkit-components/components-v2/scene/mike';
import { s2, s3, s4 } from './crystal-toolkit-components/components-v2/scene/simple-scene';
import ExportableGrid from './search-page/exportable-grid';

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);
import katex from 'katex';
import GridWithContext from './search-page/exportable-grid';
import { Sidebar } from './navigation/sidebar';
import MTGridWithContext, {
  MtMaterialTable,
  MtPrintViewContext
} from './search-page/exportable-grid-v2';
import { Scrollspy } from './navigation/Scrollspy';
import '../node_modules/bulma/css/bulma.min.css';
import { ElementsInput } from './search-page/ElementsInput/ElementsInput';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { SearchFilters } from './search-page/SearchFilters';

const latexify = (string, options) => {
  const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[\s\S]+?\$/g;
  const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;

  const stripDollars = stringToStrip =>
    stringToStrip[0] === '$' && stringToStrip[1] !== '$'
      ? stringToStrip.slice(1, -1)
      : stringToStrip.slice(2, -2);

  const getDisplay = stringToDisplay =>
    stringToDisplay.match(blockRegularExpression) ? 'block' : 'inline';

  const renderLatexString = (s, t) => {
    let renderedString;
    try {
      // returns HTML markup
      renderedString = katex.renderToString(
        s,
        t === 'block' ? Object.assign({ displayMode: true }, options) : options
      );
    } catch (err) {
      console.error('couldn`t convert string', s);
      return s;
    }
    return renderedString;
  };

  const result: any[] = [];

  const latexMatch = string.match(regularExpression);
  const stringWithoutLatex = string.split(regularExpression);

  if (latexMatch) {
    stringWithoutLatex.forEach((s, index) => {
      result.push({
        string: s,
        type: 'text'
      });
      if (latexMatch[index]) {
        result.push({
          string: stripDollars(latexMatch[index]),
          type: getDisplay(latexMatch[index])
        });
      }
    });
  } else {
    result.push({
      string,
      type: 'text'
    });
  }

  const processResult = resultToProcess => {
    const newResult = resultToProcess.map(r => {
      if (r.type === 'text') {
        return r.string;
      }
      return <span dangerouslySetInnerHTML={{ __html: renderLatexString(r.string, r.type) }} />;
    });

    return newResult;
  };

  // Returns list of spans with latex and non-latex strings.
  return processResult(result);
};

class Latex extends React.Component<any, any> {
  static defaultProps = {
    children: '',
    displayMode: false,
    output: 'htmlAndMathml',
    leqno: false,
    fleqn: false,
    throwOnError: true,
    errorColor: '#cc0000',
    macros: {},
    minRuleThickness: 0,
    colorIsTextColor: false,
    strict: 'warn',
    trust: false
  };

  render() {
    const {
      children,
      displayMode,
      leqno,
      fleqn,
      throwOnError,
      errorColor,
      macros,
      minRuleThickness,
      colorIsTextColor,
      maxSize,
      maxExpand,
      strict,
      trust
    } = this.props;
    const output = 'html';

    const renderUs = latexify(children, {
      displayMode,
      output,
      leqno,
      fleqn,
      throwOnError,
      errorColor,
      macros,
      minRuleThickness,
      colorIsTextColor,
      maxSize,
      maxExpand,
      strict,
      trust
    });
    renderUs.unshift(null);
    renderUs.unshift('span'); //put everything in a span
    // spread renderUs out to children args
    return React.createElement.apply(null, renderUs);
  }
}

let elements: any[] = [];

function SelectedComponent() {
  const { enabledElements } = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter(el => enabledElements[el]);

  return (
    <div className="cmp-list" style={{ margin: '10px', display: 'flex' }}>
      {getElementsList().map((elt: any) => (
        // <StandalonePeriodicComponent
        //   key={elt}
        //   size={50}
        //   disabled={false}
        //   enabled={false}
        //   hidden={false}
        //   element={elt}
        //   onElementClicked={() => {}}
        //   onElementHovered={() => {}}
        // />
        <li key={elt}>{elt}</li>
      ))}
    </div>
  );
}

const vis = { atoms: true };

function SceneSwitcher() {
  const [_scene, setScene] = useState(s2) as any;
  const [_vis, setVisibility] = useState(vis) as any;
  const [_anim, setAnim] = useState(AnimationStyle.NONE) as any;

  return (
    <div>
      <div onClick={() => setScene(s2)}> SCENE A </div>
      <div onClick={() => setScene(s3)}> SCENE B </div>
      <div onClick={() => setScene(s4)}> SCENE C </div>
      <div onClick={() => setScene(scene)}> SCENE D </div>
      <div onClick={() => setAnim(AnimationStyle.PLAY)}> PLAY </div>
      <div onClick={() => setAnim(AnimationStyle.NONE)}> NONE </div>
      <div onClick={() => setAnim(AnimationStyle.SLIDER)}> SLIDER </div>
      <div
        onClick={() => {
          vis.atoms = !vis.atoms;
          setVisibility({ ...vis });
        }}
      >
        {' '}
        TOGGLE VIS{' '}
      </div>
      <Simple3DSceneComponent
        sceneSize={'30vw'}
        animation={_anim}
        settings={{
          staticScene: false,
          renderer: Renderer.WEBGL,
          extractAxis: false,
          isMultiSelectionEnabled: true,
          secondaryObjectView: true
        }}
        data={_scene}
        debug={true}
        toggleVisibility={_vis}
      />
    </div>
  );
}

function SelectedComponentSimple() {
  const { enabledElements } = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter(el => enabledElements[el]);
  return (
    <ul>
      {getElementsList().map(el => (
        <li key={el}>{el}</li>
      ))}
    </ul>
  );
}

function TestComponent(props: any) {
  const [d, sd] = useState(props.d as any);
  const [z, sz] = useState(props.e as any);
  const [sel, ss] = useState(2);

  return (
    <div>
      <div
        onClick={() => {
          console.log('CLICKED');
          sd(['K', 'Be']);
        }}
      >
        CLICK ME
      </div>
      <PeriodicContext hiddenElements={props.e} enabledElements={z} disabledElements={d}>
        <div>
          <SelectableTable
            forwardOuterChange={true}
            maxElementSelectable={sel}
            onStateChange={a => {
              console.log('new elements', a);
            }}
          />
          <TableFilter />
          <SelectedComponent />
          <div>{props.toString()}</div>
        </div>
      </PeriodicContext>
      )
    </div>
  );
}

export default class MpPeriodicContextTable extends Component {
  public props: any;
  render() {
    return (
      <PeriodicContext
        enabledElements={this.props.enabledElements}
        hiddenElements={this.props.hiddenElements}
        forwardOuterChange={this.props.forwardOuterChange}
        disabledElements={this.props.disabledElements}
      >
        <SelectableTable
          forceTableLayout={this.props.forceTableLayout}
          maxElementSelectable={this.props.maxElementSelectable}
          onStateChange={v => console.log(v)}
        />
      </PeriodicContext>
    );
  }
}

function TestPV() {
  return (
    <MtPrintViewContext>
      <MTGridWithContext onChange={p => console.log(p)} />
      <MtMaterialTable data={dmr} />
    </MtPrintViewContext>
  );
}

const dmr = [
  {
    material_id: 'mp-1215014',
    full_formula: 'Cd2N24Cl12',
    volume: 6688.621386213006,
    nsites: 38,
    e_above_hull: 1.9335258098334513,
    density: 0.24489156024981024,
    'band_gap.search_gap.band_gap': 0.7977000000000007,
    theoretical: true,
    has_bandstructure: false,
    tags: ['K4CdCl6']
  },
  {
    material_id: 'mp-1206226',
    full_formula: 'Ag1Bi3Te6',
    volume: 6701.61836554716,
    nsites: 10,
    e_above_hull: 1.3255363188749967,
    density: 0.3717741370489926,
    'band_gap.search_gap.band_gap': 0.0,
    theoretical: true,
    has_bandstructure: false,
    tags: ['AgBiTe2 rhom', 'NaFeO2']
  },
  {
    material_id: 'mp-1080365',
    full_formula: 'Ce24Se48',
    volume: 6721.531137530642,
    nsites: 72,
    e_above_hull: 0.5462626098611114,
    density: 1.7670988464949904,
    'band_gap.search_gap.band_gap': 1.0405000000000002,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-684034',
    full_formula: 'Ba84Cd16Sb72',
    volume: 6754.249494070039,
    nsites: 172,
    e_above_hull: 0,
    density: 5.433495086026505,
    'band_gap.search_gap.band_gap': 0.7315,
    theoretical: false,
    has_bandstructure: false,
    tags: ['Barium cadmium antimonide (21/4/18)']
  },
  {
    material_id: 'mp-1247881',
    full_formula: 'Ba1Cu6P2',
    volume: 6819.27991938967,
    nsites: 9,
    e_above_hull: 3.1593028507407372,
    density: 0.14136783079594392,
    'band_gap.search_gap.band_gap': 0.03909999999999991,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-685503',
    full_formula: 'K4Zr48I112',
    volume: 6832.213866418306,
    nsites: 164,
    e_above_hull: 0.22981566390243824,
    density: 4.556725955208774,
    'band_gap.search_gap.band_gap': 0.04220000000000024,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-1206888',
    full_formula: 'Dy1I6',
    volume: 6832.325310734165,
    nsites: 7,
    e_above_hull: 0.6892699107142861,
    density: 0.22455262080432084,
    'band_gap.search_gap.band_gap': 0.037799999999999834,
    theoretical: true,
    has_bandstructure: false,
    tags: ['CdCl2', 'DyI2']
  },
  {
    material_id: 'mp-680178',
    full_formula: 'In80Br112',
    volume: 6897.599712636393,
    nsites: 192,
    e_above_hull: 0.005331164479166706,
    density: 4.365773407675701,
    'band_gap.search_gap.band_gap': 2.0373,
    theoretical: false,
    has_bandstructure: false,
    tags: ['Bromotriindium(I) hexabromodiindate(II)']
  },
  {
    material_id: 'mp-684055',
    full_formula: 'Tl42Bi18I96',
    volume: 6901.604393525596,
    nsites: 156,
    e_above_hull: 0.009613172564102879,
    density: 5.9016214097166095,
    'band_gap.search_gap.band_gap': 2.2653999999999996,
    theoretical: false,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-1212550',
    full_formula: 'Sc3Sb2',
    volume: 6918.678032455805,
    nsites: 5,
    e_above_hull: 3.3884920427499994,
    density: 0.09081613639740171,
    'band_gap.search_gap.band_gap': 0.12919999999999998,
    theoretical: true,
    has_bandstructure: false,
    tags: ['DEPRECATED', 'Sc2Sb', 'Cu2Sb']
  },
  {
    material_id: 'mp-1206751',
    full_formula: 'Dy2Se2I2',
    volume: 6936.659416611323,
    nsites: 6,
    e_above_hull: 2.9698624961111157,
    density: 0.17636258223060533,
    'band_gap.search_gap.band_gap': 0.0658000000000003,
    theoretical: true,
    has_bandstructure: false,
    tags: ['DySeI', 'FeClO']
  },
  {
    material_id: 'mp-1080638',
    full_formula: 'Ce24Se48',
    volume: 6946.8272965489305,
    nsites: 72,
    e_above_hull: 0.5429636762500003,
    density: 1.7097891473005467,
    'band_gap.search_gap.band_gap': 0.9861999999999997,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-1250639',
    full_formula: 'Si120O240',
    volume: 6978.668765898773,
    nsites: 360,
    e_above_hull: 0.00817499386111109,
    density: 1.715610742185253,
    'band_gap.search_gap.band_gap': 5.6677,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-1197560',
    full_formula: 'Ga32Sb28Te32Cl116',
    volume: 6991.135272098002,
    nsites: 208,
    e_above_hull: 0,
    density: 3.2863747576933577,
    'band_gap.search_gap.band_gap': 1.4760999999999997,
    theoretical: false,
    has_bandstructure: false,
    tags: [' Heptaantimony-octatellurium - bis(heptachloridodigallate)-tris(tetrachloridogallate)']
  },
  {
    material_id: 'mp-1207336',
    full_formula: 'Pb1I6',
    volume: 7062.869306423033,
    nsites: 7,
    e_above_hull: 0.6943192842857149,
    density: 0.2277321836237747,
    'band_gap.search_gap.band_gap': 0.09729999999999972,
    theoretical: true,
    has_bandstructure: false,
    tags: ['CdCl2', 'PbI2 6R']
  },
  {
    material_id: 'mp-1212042',
    full_formula: 'Ta24Al8Co2C2',
    volume: 7100.3449979636935,
    nsites: 36,
    e_above_hull: 4.320619217527777,
    density: 1.0992910706669878,
    'band_gap.search_gap.band_gap': 0.03639999999999999,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-1215155',
    full_formula: 'Ba84Cd16Bi72',
    volume: 7131.810149222151,
    nsites: 172,
    e_above_hull: 0,
    density: 6.608020650892473,
    'band_gap.search_gap.band_gap': 0.32220000000000004,
    theoretical: true,
    has_bandstructure: false,
    tags: ['Ba21Cd4Sb18', 'Ba21Cd4Bi18']
  },
  {
    material_id: 'mp-1207362',
    full_formula: 'Tb2Cu1Sb3',
    volume: 7256.199262691886,
    nsites: 6,
    e_above_hull: 3.233039162500001,
    density: 0.17087262432046252,
    'band_gap.search_gap.band_gap': 0.1936,
    theoretical: true,
    has_bandstructure: false,
    tags: ['CuTbSb2', 'CuHfSi2']
  },
  {
    material_id: 'mp-1215073',
    full_formula: 'Ag12S1I1',
    volume: 7286.142181339207,
    nsites: 14,
    e_above_hull: 1.6846920478571394,
    density: 0.33123252859085106,
    'band_gap.search_gap.band_gap': 0.4024000000000001,
    theoretical: true,
    has_bandstructure: false,
    tags: ['Ag3SI rt', 'Ag3SI']
  },
  {
    material_id: 'mp-1207319',
    full_formula: 'Tl1Bi3Se6',
    volume: 7308.1452824523,
    nsites: 10,
    e_above_hull: 1.4427458181406259,
    density: 0.2965381336838557,
    'band_gap.search_gap.band_gap': 0.0,
    theoretical: true,
    has_bandstructure: false,
    tags: ['NaFeO2', 'TlBiSe2']
  },
  {
    material_id: 'mp-1212183',
    full_formula: 'Li7Al6',
    volume: 7320.900146963333,
    nsites: 13,
    e_above_hull: 1.7852464815384614,
    density: 0.047740577326253225,
    'band_gap.search_gap.band_gap': 0.06420000000000003,
    theoretical: true,
    has_bandstructure: false,
    tags: ['Li3Al2 rt', 'b.c.c. atom arrangement', 'Li3Al2']
  },
  {
    material_id: 'mp-1215080',
    full_formula: 'Ag12S1Br1',
    volume: 7332.202128929559,
    nsites: 14,
    e_above_hull: 1.6891390007142661,
    density: 0.31850747456208484,
    'band_gap.search_gap.band_gap': 0.39449999999999985,
    theoretical: true,
    has_bandstructure: false,
    tags: ['Ag3SI', 'Ag3SBr rt']
  },
  {
    material_id: 'mp-1207329',
    full_formula: 'Ho2Cu1As3',
    volume: 7406.67676536734,
    nsites: 6,
    e_above_hull: 3.481032536666666,
    density: 0.13859087443005316,
    'band_gap.search_gap.band_gap': 0.16930000000000023,
    theoretical: true,
    has_bandstructure: false,
    tags: ['CuHoAs2', 'CuHfSi2']
  },
  {
    material_id: 'mp-1080628',
    full_formula: 'Ce28Se56',
    volume: 7480.036211572139,
    nsites: 84,
    e_above_hull: 0.5444600138690472,
    density: 1.8525594236661906,
    'band_gap.search_gap.band_gap': 0.9944999999999999,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-1213171',
    full_formula: 'K3Yb1Se6',
    volume: 7540.35992558863,
    nsites: 10,
    e_above_hull: 1.1430537191249996,
    density: 0.16826907790026316,
    'band_gap.search_gap.band_gap': 0.06840000000000002,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-1207323',
    full_formula: 'Nd3Tl1Te6',
    volume: 7547.2571416622695,
    nsites: 10,
    e_above_hull: 2.277187038,
    density: 0.30862252480615204,
    'band_gap.search_gap.band_gap': 0.0,
    theoretical: true,
    has_bandstructure: false,
    tags: ['NaFeO2', 'TlNdTe2']
  },
  {
    material_id: 'mp-1080371',
    full_formula: 'Ce28Se56',
    volume: 7549.576508413688,
    nsites: 84,
    e_above_hull: 0.545173348273809,
    density: 1.8354952172044394,
    'band_gap.search_gap.band_gap': 0.9910000000000001,
    theoretical: true,
    has_bandstructure: false,
    tags: []
  },
  {
    material_id: 'mp-623782',
    full_formula: 'Eu4Ag4',
    volume: 7697.812542566868,
    nsites: 8,
    e_above_hull: 2.6747938512499996,
    density: 0.224199542175505,
    'band_gap.search_gap.band_gap': 0.2822,
    theoretical: false,
    has_bandstructure: false,
    tags: ['Silver europium (1/1)']
  }
];

const menuContent = [
  {
    label: 'Table of Contents',
    items: [
      {
        label: 'Crystal Structure',
        targetId: 'one'
      },
      {
        label: 'Properties',
        targetId: 'two',
        items: [
          {
            label: 'Prop One',
            targetId: 'three'
          }
        ]
      }
    ]
  }
];

//    <Latex output={'html'}>{'What is $\\epsilon_{poly}^\\infty $'}</Latex>
ReactDOM.render(
  <>
    <div>
      <SearchFilters />
    </div>
  </>,

  mountNode
);
console.log('RUNNING in', process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
/**
 <PeriodicContext>
        <div>
          <ElementsInput />
          <SelectableTable
            maxElementSelectable={20}
            forceTableLayout={TableLayout.MINI}
            hiddenElements={[]}
            onStateChange={enabledElements => {
              elements = Object.keys(enabledElements).filter(el => enabledElements[el]);
            }}
            enabledElements={['Co']}
            disabledElements={['H', 'C']}
          />
        </div>
      </PeriodicContext>
 */
/* 
<div className="sidebar-story">
      <Scrollspy menuGroups={menuContent}
        menuClassName="menu"
        menuItemContainerClassName="menu-list"
        activeClassName="is-active">
      </Scrollspy>
      <div className="content">
        <div id="one">
          <h1>Crystal Structure</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?</p>
        </div>
        <div id="two">
          <h1>Properties</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?</p>
        </div>
        <div id="three">
          <h1>Prop One</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?</p>
        </div>
      </div>
    </div> 
*/

/*
<CameraContextWrapper>
        <SceneSwitcher />
      <>
        <Simple3DSceneComponent
          settings={{ renderer: Renderer.WEBGL, extractAxis: false }}
          data={scene}
          debug={true}
          toggleVisibility={{}}
        />
        <Simple3DSceneComponent
          settings={{ renderer: Renderer.WEBGL, extractAxis: true }}
          data={scene2}
          debug={false}
          toggleVisibility={{}}
        />
        <Simple3DSceneComponent data={scene3} debug={false} toggleVisibility={{}} />
      </>
    </CameraContextWrapper>
*/

/*
<div>
  {<TestComponent d={['B']} b={[]} e={[]} />}
  {
    <PeriodicContext>
      <div>
        <div>
          <SelectableTable
            maxElementSelectable={2}
            forceTableLayout={TableLayout.COMPACT}
            hiddenElements={[]}
            onStateChange={enabledElements => {
              elements = Object.keys(enabledElements).filter(el => enabledElements[el]);
            }}
            enabledElements={[]}
            disabledElements={['H', 'C']}
          />
          <TableFilter />
          <SelectableTable
            maxElementSelectable={1}
            forceTableLayout={TableLayout.MAP}
            enabledElements={['H', 'C']}
            disabledElements={[]}
            hiddenElements={[]}
          />
        </div>
        <SelectedComponentSimple />
      </div>
    </PeriodicContext>
  }
</div>
*/
