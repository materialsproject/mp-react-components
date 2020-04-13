import React, { useRef, useState } from 'react';
import { DualSlider } from './dual-slider';
import './card-style.less';
import ReactSwitch from 'react-switch';
import { Card, ItemTypes, WIDGET } from './cards-definition';
import { AiOutlineDelete, AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { MorphReplace } from 'react-svg-morph';
import { CheckboxList } from './checkbox-list';
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceMonitor,
  DropTarget,
  DropTargetMonitor
} from 'react-dnd';
import Latex from 'react-latex';

import SP from './group-space-search/property-search';
import TagSearch from './tags/tag-search';

const DRAGGING_ITEMS: any = {};

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

const getWidget = (type: WIDGET, widgetProps, widgetValue, onChange) => {
  switch (type) {
    case WIDGET.SLIDERS: {
      return <DualSlider {...widgetProps} value={widgetValue} onChange={c => onChange(c)} />;
    }
    case WIDGET.CHECKBOX_LIST: {
      return <CheckboxList {...widgetProps} onChange={v => onChange(v)} />;
    }
    case WIDGET.SP_SEARCH: {
      return <SP value={widgetValue} onChange={change => onChange(change)}></SP>;
    }
    case WIDGET.TAG_SEARCH: {
      return <TagSearch value={widgetValue} onChange={change => onChange(change)}></TagSearch>;
    }
  }
  return <div> no component</div>;
};

export interface CardProps extends Card {
  moveCard: Function;
  findCard: Function;
  deleteCard: Function;
  dispatch: Function;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  values: any[];
  dragging: boolean;
  collapsed: boolean;
}

const SearchCard: React.FC<CardProps> = (props: CardProps) => {
  const [isActive, setActive] = useState(true);
  const opacity = props.dragging ? 0.4 : 1;
  const ref = useRef(null);
  props.connectDragSource(ref);
  props.connectDropTarget(ref);

  const remove = id => {
    props.deleteCard(id);
  };

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={`card small ${props.collapsed ? 'collapsed' : 'expanded'} ${
        isActive ? 'active' : 'disabled'
      } `}
    >
      <div className="card-header">
        {props.title}

        <div className="card-tools">
          <div className="collapser" onClick={() => remove(props.id)}>
            <AiOutlineDelete />
          </div>
          <div
            className="collapser"
            onClick={() => props.dispatch({ type: 'collapse', id: props.id })}
          >
            {props.collapsed ? (
              <AiOutlineFullscreen key="a" />
            ) : (
              <AiOutlineFullscreenExit key="b" />
            )}
          </div>
          <ReactSwitch
            checked={isActive}
            onChange={c => {
              setActive(!isActive);
              props.dispatch({ type: 'disable', id: props.id });
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
            {(widget.name || widget.latexName) && (
              <span className="widget-title">
                {widget.name && <span className="standard">{widget.name}</span>}
                {widget.latexName && <Latex>{widget.latexName}</Latex>}
              </span>
            )}
            {getWidget(widget.type, widget.configuration, props.values[idx], value => {
              const id = props.id;
              //console.log(idx, widget, value, props.id);
              props.dispatch({ type: 'setValue', id: id, idx, widget, value });
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropTarget(
  ItemTypes.CARD,
  {
    canDrop: () => false,
    hover(props: CardProps, monitor: DropTargetMonitor) {
      const { id: draggedId } = monitor.getItem();
      const { id: overId } = props;

      if (draggedId !== overId) {
        const { index: overIndex } = props.findCard(overId);
        props.moveCard(draggedId, overIndex);
      }
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  DragSource(
    ItemTypes.CARD,
    {
      beginDrag: (props: CardProps) => {
        props.dispatch({ type: 'startdragging', id: props.id });
        return {
          id: props.id,
          originalIndex: props.findCard(props.id).index
        };
      },
      endDrag(props: CardProps, monitor: DragSourceMonitor) {
        const { id: droppedId, originalIndex } = monitor.getItem();
        props.dispatch({ type: 'enddragging', id: droppedId });
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          props.moveCard(droppedId, originalIndex);
        }
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(SearchCard)
);
