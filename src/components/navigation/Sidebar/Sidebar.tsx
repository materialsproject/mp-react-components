import React, { useEffect, useRef, useState } from 'react';
import '../../../assets/styles.css';
import './Sidebar.less';
import ReactTooltip from 'react-tooltip';
import { AiOutlineFund, AiOutlineSetting } from 'react-icons/ai';

interface SidebarProps {
  width?: number;
  height?: number;
  onAppSelected: (appId: string) => void;
  currentApp: string;
  layout: 'horizontal' | 'vertical';
}

//SettingOutlined

const mainApps = [
  {
    id: 'explore',
    icon: 'icon-fontastic-search',
    name: 'Explore',
    subApps: [
      { id: 'mat-explore', name: 'Materials Explorer', icon: 'icon-fontastic-search' },
      { id: 'mol-explore', icon: 'icon-fontastic-phase-diagram', name: 'Molecule Explorer' },
      { id: 'porus-explore', icon: 'icon-fontastic-nanoporous', name: 'Nanoporous Explorer' },
      {
        id: 'battery-explore',
        icon: 'icon-fontastic-battery',
        name: 'Battery Explorer',
        svg: <AiOutlineSetting />
      }
    ]
  },
  {
    id: 'analzye',
    name: 'Analyze',
    svg: <AiOutlineFund />,
    subApps: [
      { id: 'phase-diagram', icon: 'icon-fontastic-phase-diagram', name: 'Phase Diagram' },
      { id: 'pourbaix-diagram', icon: 'icon-fontastic-pourbaix-diagram', name: 'Pourbaix Diagram' },
      { id: 'reaction-calc', icon: 'icon-fontastic-reaction', name: 'Reaction Calculator' }
    ]
  },
  {
    id: 'char',
    icon: 'icon-fontastic-xas',
    name: 'Characterize',
    subApps: [{ name: 'XAS Matcher', id: 'xas', icon: 'icon-fontastic-xas' }]
  },
  {
    id: 'design',
    icon: 'icon-fontastic-toolkit',
    name: 'Design',
    subApps: [
      { id: 'crystal', icon: 'icon-fontastic-toolkit', name: 'Crystal toolkit' },
      {
        id: 'Structure Predictor',
        icon: 'icon-fontastic-struct-predictor',
        name: 'Structure Predictor'
      }
    ]
  },
  { id: 'apply', name: 'Apply', svg: <AiOutlineSetting />, subApps: [] }
];

function build_dico(dico, apps, parentId: string | null) {
  return apps.reduce((acc, app) => {
    acc[app.id] = app;
    parentId && (dico[app.id].parentId = parentId);
    app.subApps && build_dico(acc, app.subApps, app.id);
    return acc;
  }, dico);
}
const APP_DICO = build_dico({}, mainApps, null);

const AppItem = ({ name, idx, icon, svg, selectedAppId }) => {
  let subApp: string | null = null;
  const selectedParentAppId = !!selectedAppId.length ? APP_DICO[selectedAppId].parentId : '';
  if (!!selectedAppId.length && selectedParentAppId === idx) {
    icon = APP_DICO[selectedAppId].icon;
    svg = APP_DICO[selectedAppId].svg;
    subApp = APP_DICO[selectedAppId].name;
  }

  return (
    <span
      key={name}
      data-for="sidebar-menu"
      data-tip={idx}
      className={`sidebar-menu-item ${selectedParentAppId === idx ? 'selected' : ''}`}
    >
      {icon ? (
        <span className={'sidebar-item icon ' + icon} />
      ) : (
        <span className="sidebar-item"> {svg}</span>
      )}
      <span> {name}</span>
      {subApp && <span className="sub-app"> {subApp} </span>}
    </span>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  width,
  currentApp,
  onAppSelected,
  layout,
  height
}) => {
  const [currentAppId, setCurrentAppId] = useState('');
  const tooltip = useRef<any>(null);
  const isFirst = useRef(false);
  const sidebar = useRef<any>(null);

  useEffect(() => {
    setCurrentAppId(currentApp ? currentApp : '');
  }, [currentApp]);

  const setApp = id => {
    const app = APP_DICO[id];
    if (app) {
      setCurrentAppId(app.id);
      tooltip.current!.state.show = false;
      isFirst.current = app.parentId === mainApps[0].id;
      ReactTooltip.hide();
      onAppSelected(app.id);
    } else {
      console.error('incorrect app id', id);
    }
  };

  return (
    <div
      ref={sidebar}
      className={`sidebar ${layout === 'vertical' ? 'vertical' : 'horizontal'}`}
      style={layout === 'vertical' ? { width: width } : { height: height }}
    >
      <ReactTooltip
        id="sidebar-menu"
        ref={tooltip}
        offset={layout === 'vertical' ? { left: 20, top: 17 } : { left: 0, top: 0 }}
        place={layout === 'vertical' ? 'right' : 'bottom'}
        getContent={idx => {
          const app = APP_DICO[idx];
          if (idx === mainApps[0].id) {
            tooltip.current!.state.extraClass = 'top';
          } else {
            if (tooltip.current) tooltip.current!.state.extraClass = '';
          }

          return (
            <>
              {app &&
                app.subApps &&
                app.subApps.map(app => (
                  <span
                    onClick={() => setApp(app.id)}
                    key={app.name}
                    data-for="sidebar-menu"
                    data-tip="8"
                    className={`sidebar-menu-item ${currentAppId === app.id ? 'selected' : ''}`}
                  >
                    {app.icon ? (
                      <span className={'sidebar-item icon ' + app.icon} />
                    ) : (
                      <span className="sidebar-item"> {app.svg}</span>
                    )}
                    <span> {app ? app.name : 'null'}</span>
                  </span>
                ))}
            </>
          );
        }}
        overridePosition={({ left, top }, currentEvent, currentTarget, node) => {
          const d = document.documentElement;
          if (d && node) {
            left = Math.min(d.clientWidth - node.clientWidth, left);
            top = Math.min(d.clientHeight - node.clientHeight, top);
            left = Math.max(0, left);
            top = Math.max(0, top);
          }
          return { top, left };
        }}
        effect="solid"
        delayHide={50}
        delayShow={20}
        delayUpdate={200}
        border={true}
        type={'light'}
      />

      <div className="content">
        {mainApps.map((app, idx) => (
          <AppItem
            selectedAppId={currentAppId}
            key={app.name}
            name={app.name}
            idx={app.id}
            svg={app.svg}
            icon={app.icon}
          />
        ))}
      </div>
    </div>
  );
};
