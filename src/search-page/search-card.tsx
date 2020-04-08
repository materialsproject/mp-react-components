import React, { useRef, useState } from 'react';
import { DualSlider } from './dual-slider';
import './card-style.less';
import ReactSwitch from 'react-switch';
import { Card, DICO, ItemTypes, WIDGET } from './cards-definition';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { MorphReplace } from 'react-svg-morph';
import { CheckboxList } from './checkbox-list';
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSourceMonitor,
  DropTargetMonitor
} from 'react-dnd';
import { DragSource, DropTarget } from 'react-dnd';

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

const getWidget = (type: WIDGET, widgetProps) => {
  switch (type) {
    case WIDGET.SLIDERS: {
      return <DualSlider {...widgetProps} />;
    }
    case WIDGET.CHECKBOX_LIST: {
      return <CheckboxList {...widgetProps} />;
    }
  }
  return <div> no component</div>;
};

export interface CardProps extends Card {
  moveCard: Function;
  findCard: Function;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  isDragging: boolean;
}

const SearchCard: React.FC<CardProps> = (props: CardProps) => {
  const [isActive, setActive] = useState(true);
  const [isCollapsed, setCollapsed] = useState(false);

  const opacity = props.isDragging || DRAGGING_ITEMS[props.id] ? 0.4 : 1;
  const ref = useRef(null);

  props.connectDragSource(ref);
  props.connectDropTarget(ref);

  return (
    <div
      ref={ref}
      style={{ opacity: DICO[props.id].dragging ? 0.3 : 1 }}
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
        DICO[props.id].dragging = true;
        return {
          id: props.id,
          originalIndex: props.findCard(props.id).index
        };
      },
      endDrag(props: CardProps, monitor: DragSourceMonitor) {
        const { id: droppedId, originalIndex } = monitor.getItem();
        DICO[droppedId].dragging = false;
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
