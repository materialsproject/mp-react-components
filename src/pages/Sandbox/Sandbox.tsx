import React, { useState } from 'react';
import { DualRangeSlider } from '../../components/data-entry/DualRangeSlider';
import { Switch } from '../../components/data-entry/Switch';
import { Drawer } from '../../components/data-display/Drawer';
import { ModalContextProvider, ModalTrigger } from '../../components/data-display/Modal';
import { ModalCloseButton } from '../../components/data-display/Modal/ModalCloseButton';
import { DataBlock } from '../../components/data-display/DataBlock';
import { Column } from '../../components/data-display/SearchUI/types';
import { DrawerContextProvider } from '../../components/data-display/Drawer/DrawerContextProvider';
import { DrawerTrigger } from '../../components/data-display/Drawer/DrawerTrigger';
import { CrossrefCard } from '../../components/publications/CrossrefCard';
import { Markdown } from '../../components/data-display/Markdown';
import { Link } from '../../components/navigation/Link';
import { PublicationButton } from '../../components/publications/PublicationButton';

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  const [state, setState] = useState({ slider: [10, 45], switch: false });
  const [switchState, setSwitchState] = useState({ value: false });
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <header>
        <h1 className="title">Sandbox</h1>
      </header>
      <div className="mp-app-content">
        <Link href="/dash">Dash Link</Link>
        <div>{JSON.stringify(state.slider)}</div>
        <div>{JSON.stringify(state.switch)}</div>
        <div style={{ width: '300px' }}>
          {/* <RangeSlider value={-1} domain={[-2, 3]} step={0.01} isLogScale /> */}
        </div>
        <div style={{ width: '300px' }}>
          {/* <RangeSlider value={-1} domain={[-2, 3]} step={0.1} /> */}
        </div>
        <DualRangeSlider
          value={state.slider}
          domain={[-97, 88]}
          step={1}
          onChange={(min, max) => setState({ ...state, slider: [min, max] })}
          ticks={5}
        />
        {/* <DualRangeSlider value={[-1, 1]} domain={[-2, 3]} step={0.01} isLogScale /> */}
        <Switch
          value={state.switch}
          onChange={(val) => setState({ ...state, switch: val })}
          hasLabel
          truthyLabel="Enabled"
          falsyLabel="Disabled"
        />
        <DrawerContextProvider>
          <DrawerTrigger forDrawerId="drawer-1">
            <button>Drawer 1</button>
          </DrawerTrigger>
          <DrawerTrigger forDrawerId="drawer-2">
            <button>Drawer 2</button>
          </DrawerTrigger>
          <Drawer id="drawer-1">
            <h2>Drawer Content</h2>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
            </ul>
          </Drawer>
          <Drawer id="drawer-2">
            <h2>Another Drawer</h2>
            <p>here is its content</p>
          </Drawer>
        </DrawerContextProvider>
        <PublicationButton doi="10.1103/physrevb.84.045115" compact tagClassName="is-white" />
      </div>
    </>
  );
};
