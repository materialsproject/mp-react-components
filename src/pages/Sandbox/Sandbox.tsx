import React, { useState } from 'react';
import { DualRangeSlider } from '../../components/data-entry/DualRangeSlider';
import { Switch } from '../../components/data-entry/Switch';
import { Drawer } from '../../components/data-display/Drawer';
import { ModalContextProvider, ModalTrigger } from '../../components/data-display/Modal';
import { ModalCloseButton } from '../../components/data-display/Modal/ModalCloseButton';

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
        <ModalContextProvider isDrawer>
          <ModalTrigger>
            <button>Toggle Drawer</button>
          </ModalTrigger>
          <Drawer>
            <h2>Drawer Content</h2>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
            </ul>
          </Drawer>
        </ModalContextProvider>
      </div>
    </>
  );
};
