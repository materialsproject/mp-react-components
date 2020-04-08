import React, { useState } from 'react';
import { DualSlider } from './dual-slider';
import './card-style.less';
import ReactSwitch from 'react-switch';
import { Card, WIDGET } from './cards-definition';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { MorphReplace } from 'react-svg-morph';
import { CheckboxList } from './checkbox-list';

export enum CARD_SIZE {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  BIG = 'BIG'
}

/**
  A search card is make of multiple components
  A card can be enabled/disabled ( e.g = It will be used for a search )
  Each component has an a `search` value
  Every time a component is touched, we pass a snapshot of the current state

  We use a reducer to notify the change to the parent
 */

const getWidget = (type: WIDGET, widgetProps) => {
  switch (type) {
    case WIDGET.SLIDERS: {
      return <DualSlider {...widgetProps} />;
      break;
    }
    case WIDGET.CHECKBOX_LIST: {
      return <CheckboxList {...widgetProps} />;
      break;
    }
  }
};

export function SearchCard(props: Card) {
  const [isActive, setActive] = useState(true);
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`card small ${isCollapsed ? 'collapsed' : 'expanded'} ${
        isActive ? 'active' : 'disabled'
      } `}
    >
      <div className="card-header">
        {props.title}

        <div className="card-tools">
          <div className="collapser" onClick={() => setCollapsed(!isCollapsed)}>
            {isCollapsed ? <AiOutlineFullscreen key="a" /> : <AiOutlineFullscreenExit key="b" />}
          </div>
          <ReactSwitch
            checked={isActive}
            onChange={c => {
              setActive(!isActive);
            }}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={15}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={10}
            width={24}
            className="react-switch"
            id="material-switch"
          />
        </div>
      </div>
      <div className="card-content">
        {props.widgets.map((widget, idx) => (
          <div className="widget" key={idx}>
            {widget.name && <div className="widget-title">{widget.name()}</div>}
            {getWidget(widget.type, widget.configuration)}
          </div>
        ))}
      </div>
    </div>
  );
}
