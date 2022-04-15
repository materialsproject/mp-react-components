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
        <DrawerContextProvider>
          <DrawerTrigger for="drawer-1">
            <button>Drawer 1</button>
          </DrawerTrigger>
          <DrawerTrigger for="drawer-2">
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
        <DataBlock
          disableRichColumnHeaders={true}
          className="box"
          data={{
            material_id: 'mp-19395',
            formula_pretty: 'MnO2',
            volume: 143.9321176
          }}
          columns={
            [
              {
                title: 'Material ID',
                selector: 'material_id',
                formatType: 'LINK',
                formatOptions: {
                  baseUrl: 'https://next-gen.materialsproject.org',
                  target: '_blank'
                },
                minWidth: '300px',
                maxWidth: '300px'
              },
              {
                title: 'Formula',
                selector: 'formula_pretty',
                formatType: 'FORMULA',
                minWidth: '300px',
                maxWidth: '300px'
              },
              {
                title: 'Volume',
                selector: 'volume',
                formatType: 'FIXED_DECIMAL',
                formatOptions: {
                  decimals: 2
                }
              }
            ] as Column[]
          }
        />
      </div>
    </>
  );
};
