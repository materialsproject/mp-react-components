import React, { useEffect, useRef, useState } from 'react';
import { DualSlider } from '../sliders/dual-slider';
import './card-style.less';
import ReactSwitch from 'react-switch';
import { Card, Field, getWidgetConfiguration, ItemTypes, Widget, WIDGET } from './cards-definition';
import { AiOutlineDelete, AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { MorphReplace } from 'react-svg-morph';
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceMonitor,
  DropTarget,
  DropTargetMonitor
} from 'react-dnd';
import Latex from 'react-latex';

import SP from '../group-space-search/property-search';
import TagSearch from '../tags/tag-search';
import { PeriodicContext, SelectableTable } from '../../periodic-table';
import { CheckboxList } from '../checkboxes-list/checkbox-list';
//TODO(move to table configuration, so we do not need to inject it)
import TableSelectionSelector, {
  MultipleElementsSelector
} from '../../periodic-table/table-selector';
import { ActionType } from './grid-reducer';
import { useForm } from 'react-hook-form';
import { Simpleform } from '../form/form';

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

const getWidget = (
  widget: Widget<WIDGET>,
  widgetValue,
  onChange: (value, overridenIdx?: number) => void
) => {
  const type = widget.type;
  //Note(chab) compiler can only infer type AFTER the switch statement
  switch (type) {
    case WIDGET.INPUT_FORM:
      const widgetProps = getWidgetConfiguration(type, widget);
      return <Simpleform {...widgetProps} onChange={c => onChange(c)} />;
    case WIDGET.SLIDERS: {
      const widgetProps = getWidgetConfiguration(type, widget);
      return <DualSlider {...widgetProps} value={widgetValue} onChange={c => onChange(c)} />;
    }
    case WIDGET.CHECKBOX_LIST: {
      const widgetProps = getWidgetConfiguration(type, widget);
      return <CheckboxList {...widgetProps} onChange={v => onChange(v)} />;
    }
    case WIDGET.SP_SEARCH: {
      //const widgetProps = getWidgetConfiguration(type, widget);
      return <SP value={widgetValue} onChange={change => onChange(change)} />;
    }
    case WIDGET.TAG_SEARCH: {
      //const widgetProps = getWidgetConfiguration(type, widget);
      return <TagSearch value={widgetValue} onChange={change => onChange(change)} />;
    }
    case WIDGET.PERIODIC_TABLE: {
      const widgetProps = getWidgetConfiguration(type, widget);

      let selectorWidget;
      switch (widgetProps.searchPlugin) {
        case 'classic': {
          break;
        }
        case 'enabledisable': {
          selectorWidget = <TableSelectionSelector />;
          break;
        }
        case 'multi': {
          selectorWidget = <MultipleElementsSelector labels={['label1', 'label2', 'label3']} />;
          break;
        }
        case 'formula': {
          break;
        }
      }

      const inputWidget = widgetProps.searchPlugin === 'enabledisable' && (
        <div className="number-elements">
          Number of elements :
          <input
            type="number"
            onChange={c => {
              const value = Number.parseInt(c.target.value);
              // null value means we want to not impose a limit
              if (Number.isInteger(value) || c.target.value === '' || !c.target.value) {
                setTimeout(() => onChange(value, 1), 0);
              }
            }}
          />
        </div>
      );

      return (
        <PeriodicContext {...widgetProps}>
          <>
            <SelectableTable
              selectorWidget={selectorWidget}
              inputWidget={inputWidget}
              onStateChange={change => onChange(change)}
              maxElementSelectable={5}
            />
          </>
        </PeriodicContext>
      );
    }
  }
  return <div> no component</div>;
};

export interface CardProps extends Card {
  dispatch: Function;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  values: any[];
  dragging: boolean;
  collapsed: boolean;
}

const SearchCard: React.FC<CardProps> = (props: CardProps) => {
  const [isActive, setActive] = useState(true);
  const opacity = (props as any).isDragging ? 0.4 : 1; // kind of magical
  const ref = useRef(null);

  useEffect(() => {
    props.connectDragSource(ref);
    props.connectDropTarget(ref);
  }, []);

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={`card ${props.id === 'periodic' ? '' : 'small'} ${
        props.collapsed ? 'collapsed' : 'expanded'
      } ${isActive ? 'active' : 'disabled'} `}
    >
      <div className="card-header">
        {props.title}

        <div className="card-tools">
          {!props.permanent && (
            <div
              className="collapser"
              onClick={() => props.dispatch({ type: ActionType.DELETE, id: props.id })}
            >
              <AiOutlineDelete />
            </div>
          )}
          <div
            className="collapser"
            onClick={() => props.dispatch({ type: ActionType.COLLAPSE, id: props.id })}
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
              props.dispatch({ type: ActionType.DISABLE, id: props.id });
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
            {getWidget(widget, props.values[idx], (value, overridenIdx?: number) => {
              const id = props.id;
              props.dispatch({
                type: ActionType.SET_VALUE,
                id: id,
                idx: !overridenIdx ? idx : overridenIdx,
                widget,
                value
              });
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
        props.dispatch({ type: ActionType.MOVE_CARD, targetId: overId, id: draggedId });
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
      canDrag: props => {
        console.log(props);
        return true;
      },
      beginDrag: (props: CardProps) => {
        props.dispatch({ type: ActionType.START_DRAG, id: props.id });
        return {
          id: props.id
        };
      },
      endDrag(props: CardProps, monitor: DragSourceMonitor) {
        const { id: droppedId } = monitor.getItem();
        props.dispatch({ type: ActionType.END_DRAG, id: droppedId });
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          props.dispatch({ type: ActionType.CANCEL_DRAG, id: props.id });
        }
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(SearchCard)
);
