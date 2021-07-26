import classNames from 'classnames';
import React from 'react';
import Collapsible from 'react-collapsible';
import './SynthesisRecipeCard.css';
import { Link } from '../../navigation/Link';
import { FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { validateFormula, validateRangedFormula } from '../MaterialsInput/utils';
import { PublicationButton } from '../../publications/PublicationButton';
import { DataBlock } from '../../data-display/DataBlock';
import { Formula } from '../Formula';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: any;
}

function RenderValues({ value }): string | null {
  if (value !== null) {
    if (Array.isArray(value.values)) {
      return value.values.map((x) => x + '').join(', ') + ' ' + value.units;
    } else if (value.min_value !== null && value.max_value !== null) {
      return 'between ' + value.min_value + ' and ' + value.max_value + ' ' + value.units;
    } else if (value.min_value !== null) {
      return 'above ' + value.min_value + ' ' + value.units;
    } else if (value.max_value !== null) {
      return 'below ' + value.max_value + ' ' + value.units;
    }
  }
  return null;
}

function RenderArray({ value }): string | null {
  if (Array.isArray(value) && value.length > 0) return value.join(', ');
  else return null;
}

const getConditionsString = (conditions: any): string => {
  let strings: Array<string> = [];

  if (typeof conditions === 'object') {
    const temperature_arrays = conditions.heating_temperature || [];
    temperature_arrays
      .map((x) => RenderValues({ value: x }))
      .map((x) => (x !== null ? 'at ' + x : null))
      .filter((x) => x !== null)
      .forEach((x) => strings.push(x));

    const time_arrays = conditions.heating_time || [];
    time_arrays
      .map((x) => RenderValues({ value: x }))
      .map((x) => (x !== null ? 'for ' + x : ''))
      .filter((x) => x !== null)
      .forEach((x) => strings.push(x));

    const heating_atm = RenderArray({ value: conditions.heating_atmosphere });
    if (heating_atm !== null) strings.push('in ' + heating_atm);

    if (conditions.mixing_device !== null) strings.push('using ' + conditions.mixing_device);
    if (conditions.mixing_media !== null) strings.push('with ' + conditions.mixing_media);
  }
  return strings.join(', ');
};

// function RenderOperations({ operations }) {
//   if (Array.isArray(operations) && operations.length > 0) {
//     return (
//       <div className="mpc-synthesis-card-operations content">
//         <ol>
//           {operations.map((op, i) => (
//             <li key={i}>
//               <span>
//                 {op.type} ({op.token})
//               </span>{' '}
//               <RenderConditions conditions={op.conditions} />
//             </li>
//           ))}
//         </ol>
//       </div>
//     );
//   } else {
//     return (
//       <div className="mpc-synthesis-card-operations content">
//         No operations specified in this recipe.
//       </div>
//     );
//   }
// }

function RenderParagraphOrHighlight(props) {
  return (
    <div className={classNames('mpc-synthesis-card-paragraph has-text-grey-dark', props.className)}>
      <p>
        "
        {props.highlights
          ? props.highlights.map((hl, i) => (
              <span key={i}>
                {hl.texts.map((text, j) => (
                  <span
                    key={j}
                    className={classNames({
                      'has-background-warning has-text-grey-darker': text.type === 'hit'
                    })}
                  >
                    {text.value}
                  </span>
                ))}
              </span>
            ))
          : props.paragraph_string}
        "
      </p>
      {/* <div>
        <i>Extracted from</i> <PublicationButton doi={props.doi} />
      </div> */}
    </div>
  );
}

const formulaToMaterialLink = (formula: string, composition?: any) => {
  if (validateFormula(formula) !== null) {
    return `/materials?formula=${formula}`;
  } else {
    let elements: Array<string> = [];
    composition.forEach((x) => {
      Object.keys(x.elements).forEach((y) => {
        elements.indexOf(y) === -1 && elements.push(y);
      });
    });
    return `/materials?formula=${elements.join('-')}`;
  }
};

const formatReactionString = (reactionString: string) => {
  const cleanedPrefix = reactionString.replace(/(^|[ ])(1(?=\s))/gi, '');
  const reactionSectionsSplit = cleanedPrefix.split(' ; ');
  const reactionSides = reactionSectionsSplit[0].split(' == ').map((r) => r.split(' '));
  const reactionInfo = reactionSectionsSplit.slice(1).map((r) => r.split(' '));
  return (
    <div>
      <div className="has-text-weight-bold">
        {reactionSides[0].map((d, i) =>
          validateRangedFormula(d) ? <Formula key={i}>{d}</Formula> : <span key={i}> {d} </span>
        )}
        <span>
          {' '}
          <FaArrowRight />{' '}
        </span>
        {reactionSides[1].map((d, i) =>
          validateRangedFormula(d) ? <Formula key={i}>{d}</Formula> : <span key={i}> {d} </span>
        )}
      </div>
      <div className="is-size-7 is-italic">
        {reactionInfo.map((s, k) => (
          <span key={k}>
            {s.map((d, i) =>
              validateRangedFormula(d) ? <Formula key={i}>{d}</Formula> : <span key={i}> {d} </span>
            )}
            {k !== reactionInfo.length - 1 && <span> &#183; </span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export const SynthesisRecipeCard: React.FC<Props> = (props) => {
  return (
    <DataBlock
      className={classNames('mpc-synthesis-card box', props.className)}
      data={{
        targetFormula: props.data.target.material_formula,
        precursorFormulas: props.data.precursors_formula_s,
        targetFormulaLink: formulaToMaterialLink(
          props.data.target.material_formula,
          props.data.target.composition
        ),
        precursorFormulaLinks: props.data.precursors.map((d: any) => {
          return formulaToMaterialLink(d.material_formula, d.composition);
        }),
        synthesisType: props.data.synthesis_type,
        paragraph: (
          <RenderParagraphOrHighlight
            doi={props.data.doi}
            paragraph_string={props.data.paragraph_string}
            highlights={props.data.highlights}
          />
        ),
        reactionString: formatReactionString(props.data.reaction_string),
        synthesisProcedures: props.data.operations.map((o, i) => {
          return `${i + 1}. ${o.token} ${getConditionsString(o.conditions)}`;
        })
      }}
      columns={[
        {
          name: 'Target Material',
          selector: 'targetFormulaLink',
          format: 'LINK',
          formatOptions: {
            linkLabelKey: 'targetFormula',
            linkLabelisFormula: true,
            target: ''
          },
          isTop: true,
          minWidth: '300px',
          maxWidth: '300px'
        },
        {
          name: 'Precursor Materials',
          selector: 'precursorFormulas',
          format: 'ARRAY',
          formatOptions: {
            arrayLinksKey: 'precursorFormulaLinks',
            arrayLinksTarget: ''
          },
          isTop: true
        },
        {
          name: 'Paragraph Excerpt',
          selector: 'paragraph',
          isBottom: true
        },
        {
          name: 'Reaction Equation',
          selector: 'reactionString',
          isBottom: true
        },
        {
          name: 'Synthesis Procedures',
          selector: 'synthesisProcedures',
          format: 'ARRAY',
          isBottom: true
        },
        {
          name: 'Synthesis Type',
          selector: 'synthesisType',
          isBottom: true
        }
      ]}
      footer={
        <div>
          <i>Extracted from</i> <PublicationButton doi={props.data.doi} />
        </div>
      }
      iconClassName="icon-fontastic-synthesis"
      iconTooltip="Synthesis Recipe"
    />
  );
};
