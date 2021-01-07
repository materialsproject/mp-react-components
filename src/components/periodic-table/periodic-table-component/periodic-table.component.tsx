import * as React from 'react';
import './periodic-table.module.less';
import { DISPLAY_MODE, PeriodicElement } from '../periodic-element/periodic-element.component';
import { useDetailedElement } from '../periodic-table-state/table-store';
import { MatElement, TABLE_DICO_V2, TABLE_V2 } from '../periodic-table-data/table-v2';
import { useMediaQuery } from 'react-responsive';
import { useMemo } from 'react';
import { extent, range, max, min } from 'd3-array';
import { scaleLinear, scaleSequential } from 'd3-scale';
import * as d3Scale from 'd3-scale-chromatic';
import { PeriodicTableSpacer } from '../PeriodicTable/PeriodicTableSpacer';

export const DEFAULT_HEATMAP_COLOR = '#EDEEED';

export const COLORSCHEME = {
  Viridis: d3Scale.interpolateViridis,
  Turbo: d3Scale.interpolateTurbo,
  CubeHelix: d3Scale.interpolateCubehelixDefault,
  Cividis: d3Scale.interpolateCividis,
  Inferno: d3Scale.interpolateInferno,
  Blues: d3Scale.interpolateBlues,
  Oranges: d3Scale.interpolateOranges,
  Greens: d3Scale.interpolateGreens,
  Reds: d3Scale.interpolateReds,
  Purples: d3Scale.interpolatePurples,
};
Object.freeze(COLORSCHEME);

export interface TableProps {
  /** dictionnary of disabled elements */
  disabledElement: { [symbol: string]: boolean };
  /** dictionnary of enabled elements  */
  enabledElement: { [symbol: string]: boolean };
  /** dictonnary of hidden elements */
  hiddenElement: { [symbol: string]: boolean };
  /** Callback who gets called once the user clicked an element; the clicked element is passed **/
  onElementClicked: (mat: MatElement) => void;
  onElementMouseOver: (mat: MatElement) => void;
  onElementMouseLeave?: (mat: MatElement) => void;
  /** Force the layout of the table **/
  forceTableLayout?: TableLayout;
  /** Colorize the table by using an heatmap
   *  id: symbol of the element
   *  value: value used for the heatmap
   **/
  heatmap?: { [id: string]: number };
  /** Color scheme to use. Look at the COLORSCHEME definition for available color scheme
   *  If you pass an unknown color scheme or no scheme, the component will use a linear scale whose range
   *  is defined by the heatmapMax and heatmapMin value
   **/
  colorScheme?: keyof typeof COLORSCHEME;
  /** Color used for the highest value */
  heatmapMax?: string;
  /** Color used for the lowest value*/
  heatmapMin?: string;
  showSwitcher?: boolean;
  plugin?: JSX.Element;
  children?: any;
  selectorWidget?: any;
  /** toggle disabling all table components */
  disabled?: boolean;
}

export enum TableLayout {
  SPACED = 'spaced',
  COMPACT = 'compact',
  MINI = 'small',
  MAP = 'map',
}

const N_LEGEND_ITEMS = 10;

function computeHeatmap(
  h: { [symbol: string]: number },
  max: string,
  min: string,
  scheme: keyof typeof COLORSCHEME
) {
  if (!h) return { linearScale: null, legendScale: null };

  const heatmapExtent = extent(Object.values(h));
  const legendPosition = scaleLinear().domain(heatmapExtent).range([0, 100]);

  if (COLORSCHEME[scheme]) {
    return {
      linearScale: scaleSequential(COLORSCHEME[scheme]).domain(heatmapExtent),
      legendScale: scaleSequential(COLORSCHEME[scheme]).domain([0, N_LEGEND_ITEMS]),
      legendPosition,
    };
  }

  const linearScale = scaleLinear().range([min, max]);
  linearScale.domain(heatmapExtent);

  const legendScale = scaleLinear().range([min, max]).domain([0, N_LEGEND_ITEMS]);

  return { linearScale, legendScale, legendPosition };
}

export function Table({
  disabledElement,
  enabledElement,
  hiddenElement,
  onElementClicked,
  onElementMouseOver,
  onElementMouseLeave = () => {},
  forceTableLayout,
  heatmap,
  heatmapMax,
  heatmapMin,
  colorScheme,
  showSwitcher,
  selectorWidget,
  plugin,
  disabled,
}: TableProps) {
  const [isShown, setIsShown] = React.useState(true);
  const [legendPosition, setLegendPosition] = React.useState(-1);
  const isDesktop = useMediaQuery({ minWidth: 1436 });
  const isTablet = useMediaQuery({ minWidth: 900, maxWidth: 1436 });
  const isMobile = useMediaQuery({ maxWidth: 900 });

  // DO NOT REFACTORING USING || IT WILL CRASH THE APP, BECAUSE A DIFFERENT NUMBER OF HOOKS WILL BE
  // CALLED

  const isDesktopH = useMediaQuery({ minHeight: 670 });
  const isTabletH = useMediaQuery({ maxHeight: 670, minHeight: 400 });
  const isMobileH = useMediaQuery({ maxHeight: 400 });

  // we consider that either those properties are all defined, or not
  const {
    linearScale: heatmapscale,
    legendScale,
    legendPosition: legendPositionScale,
  } = useMemo(() => computeHeatmap(heatmap!, heatmapMax!, heatmapMin!, colorScheme!), [
    heatmapMax,
    heatmapMin,
    heatmap,
    colorScheme,
  ]);

  // TODO(chab) allow people to pass the number of subdivisions OR to have a continuous legend
  const legendItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const onHover = (element: MatElement) => {
    if (!hasHeatmap(heatmap)) {
      onElementMouseOver(element);
      return;
    }
    const value = heatmap![element.symbol];
    if (!value) {
      setLegendPosition(-1);
    } else {
      const legendPosition = legendPositionScale(value);
      setLegendPosition(legendPosition);
    }
    onElementMouseOver(element);
  };

  return (
    <div className={'table-legend-container'}>
      <div
        className={`table-container ${getLayout(
          isDesktop || isDesktopH,
          isTablet || isTabletH,
          isMobile || isMobileH,
          forceTableLayout
        )} ${isShown ? '' : 'elements-hidden'}`}
      >
        <PeriodicTableSpacer plugin={plugin} disabled={disabled} />
        {TABLE_V2.map((element: MatElement) => (
          <PeriodicElement
            onElementMouseOver={(element) => onHover(element)}
            onElementMouseLeave={(element) => {
              onElementMouseLeave(element);
            }}
            onElementClicked={(element) =>
              !DEFAULT_DISABLED_ELEMENTS[element.symbol] && onElementClicked(element)
            }
            color={
              hasHeatmap(heatmap)
                ? heatmap![element.symbol]
                  ? heatmapscale(heatmap![element.symbol])
                  : DEFAULT_HEATMAP_COLOR // TODO(maybe arbitrary color ?)
                : null
            }
            key={`${element.symbol}--${element.number}`}
            hidden={hiddenElement[element.symbol]}
            disabled={
              disabled ||
              disabledElement[element.symbol] ||
              DEFAULT_DISABLED_ELEMENTS[element.symbol]
            }
            enabled={enabledElement[element.symbol]}
            element={element}
          />
        ))}
      </div>
      {hasHeatmap(heatmap) && (
        <div className={'legend-container'}>
          <div className={'table-legend'}>
            {legendItems.map((n) => (
              <div
                key={`legend${n}`}
                className={'legend-division'}
                style={{
                  background: legendScale(n),
                  width: '10px',
                  height: `${100 / legendItems.length}%`,
                }}
              >
                {' '}
              </div>
            ))}
            <div
              className={'table-legend-pointer'}
              style={{
                position: 'absolute',
                width: '12px',
                height: '2px',
                right: '-1px',
                top: `${legendPosition}%`,
                background: 'black',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function getLayout(
  isDesktop: boolean,
  isTablet: boolean,
  isMobile: boolean,
  tableLayout?: TableLayout
) {
  if (tableLayout) return tableLayout;

  if (isMobile) {
    return TableLayout.MINI;
  }
  if (isTablet) {
    return TableLayout.COMPACT;
  }
  if (isDesktop) {
    return TableLayout.SPACED;
  }

  return TableLayout.SPACED;
}

function hasHeatmap(heatmap): boolean {
  return !!heatmap && Object.keys(heatmap).length > 0;
}

const DEFAULT_DISABLED_ELEMENTS = {
  Po: true,
  Rn: true,
  Ra: true,
  At: true,
  Fr: true,
  Rf: true,
  Db: true,
  Sg: true,
  Bh: true,
  Hs: true,
  Mt: true,
  Ds: true,
  Rg: true,
  Cn: true,
  Nh: true,
  Fl: true,
  Mc: true,
  Lv: true,
  Ts: true,
  Og: true,
  'La-Lu': true,
  'Ac-Lr': true,
  Am: true,
  Cm: true,
  Bk: true,
  Cf: true,
  Es: true,
  Fm: true,
  Md: true,
  No: true,
  Lr: true,
};
