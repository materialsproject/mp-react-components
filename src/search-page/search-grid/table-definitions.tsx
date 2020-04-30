import { MatgenUtilities } from '../../utils/matgen';
import { AiOutlineWarning } from 'react-icons/ai';
import React from 'react';
import { Card, CardState, WIDGET, Widget } from './cards-definition';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';

// fix typings
export const columns = [
  {
    name: 'Material Id',
    selector: 'material_id',
    sortable: true
  },
  {
    name: 'Formula',
    selector: 'full_formula',
    cell: row => {
      return (
        <div dangerouslySetInnerHTML={{ __html: MatgenUtilities.htmlFormula(row.full_formula) }} />
      );
    },
    sortable: true
  },
  /*{
    name: "Spacegroup",
    selector: "year",
    sortable: true
  },*/
  {
    name: 'Volume',
    selector: 'volume',
    format: r => r.volume.toFixed(2),
    sortable: true
  },
  {
    name: 'Number of sites',
    selector: 'nsites',
    sortable: true
  },
  {
    name: 'Energy above Hull',
    selector: 'e_above_hull',
    format: r => r['e_above_hull'].toFixed(8),
    sortable: true
  },
  {
    name: 'Density',
    selector: 'density',
    format: r => r.density.toFixed(2),
    sortable: true
  },
  {
    name: 'Band Gap',
    querySelector: 'band_gap.search_gap.band_gap',
    cell: row => (
      <div data-tip data-for="no-bs">
        {' '}
        {row['band_gap.search_gap.band_gap'].toFixed(2)}
        <span> {!row['has_bandstructure'] ? <AiOutlineWarning /> : ''}</span>
      </div>
    ),
    selector: r => r['band_gap.search_gap.band_gap'],
    sortable: true
  }
];

export const properties = columns.map(q => (q.querySelector ? q.querySelector : q.selector));
properties.push('theoretical', 'has_bandstructure', 'tags');
// search_gap.band_gap does not work

const CancelToken = axios.CancelToken;
let cancel;
export const onChange = (c, executePost) => {
  const query = {};
  // filter cards
  const cards = c.cardSettings.reduce((acc, card, idx) => {
    if (card.state !== CardState.PRISTINE && !card.disabled) {
      acc.push({ cardDef: c.cardDef[idx], cardSettings: card });
    }
    return acc;
  }, []);
  // write mongodb query
  if (cards.length === 0 && !c.heroCardSetting && !c.heroCardSetting.disabled) {
    return;
  } // do not query for empty cards

  if (
    c.heroCardSetting &&
    !c.heroCardSetting.disabled &&
    c.heroCardSetting.state !== CardState.PRISTINE
  ) {
    const state = c.heroCardSetting.values[0]; // holds the enabled disabled/enabled elements

    if (state) {
      if (state.enabledElements && state.enabledElements.length > 0) {
        query['elements'] = { $in: state.enabledElements };
      }
      if (state.disabledElements && state.disabledElements.length > 0) {
        if (query['elements']) {
          query['elements'].$not = { $in: state.disabledElements };
        } else {
          query['elements'] = { $not: { $in: state.disabledElements } };
        }
      }
    }
    const maxNumberOfElements = c.heroCardSetting.values[1];
    if (maxNumberOfElements && maxNumberOfElements > 0) {
      query['nelements'] = maxNumberOfElements;
    }
  }

  cards.forEach(card => {
    // look at card widget
    const def: Card = card.cardDef;
    def.widgets.forEach((widget: Widget<WIDGET>, widgetIndex) => {
      if (card.cardSettings.widgetState[widgetIndex] === CardState.PRISTINE) {
        return;
      }
      if (widget.type === WIDGET.SLIDERS) {
        const key = widget.id;
        const prefix = def.bypassIdForKey ? '' : def.id + '.';
        query[prefix + key] = {
          $gte: card.cardSettings.values[widgetIndex][0],
          $lte: card.cardSettings.values[widgetIndex][1]
        };
      } else if (widget.type === WIDGET.TAG_SEARCH) {
        card.cardSettings.values[widgetIndex] &&
          (query[card.cardSettings.id] = card.cardSettings.values[widgetIndex]);
      } else if (widget.type === WIDGET.SP_SEARCH) {
        const spaceGroups = card.cardSettings.values[widgetIndex];
        spaceGroups &&
          spaceGroups.length > 0 &&
          (query['spacegroup.number'] = {
            $in: spaceGroups.map(s => s['space-group.number'])
          });
      } else if (widget.type === WIDGET.CHECKBOX_LIST) {
        //TODO(chab) fix the update logic of the widget.
        console.log(card.cardSettings, card.cardDef);
        query['provenance'] = card.cardSettings.values[0];
      }
    });
  });

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // if there is only one key, and its the number of elements, we do not query!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if (Object.keys(query).length === 1 && !!query['nelements']) {
    return;
  }

  // we are queuing update, otherwise, we would trigger a re-render immediately
  // FIXME(chab) the reducer should be defined here anyway
  setTimeout(() => {
    if (cancel) {
      console.warn('cancelling');
      cancel();
    }
    const params = new URLSearchParams();
    params.append('properties', JSON.stringify(properties));
    params.append('criteria', JSON.stringify(query));
    executePost({
      data: params,
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        console.log('executor token');
        cancel = c;
      })
    }).then(() => {
      cancel = null;
      setTimeout(() => {
        ReactTooltip.rebuild();
      }, 0);
    });
  }, 0);
};
