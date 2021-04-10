import { MaterialsInputField } from '../MaterialsInput';

const VALID_ELEMENTS = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar Kr K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Ar Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La-Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac-Lr Rf Db Sg Bh Hs Mt Ds Rg Cn La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(
  ' '
);

export const isMpIdInput = (value: string): boolean => {
  return value.indexOf('mp-') === 0 || value.indexOf('mvc-') === 0 || value.indexOf('mol-') === 0;
};

export const isElementsInput = (value: string): boolean => {
  const hasDelimeter = !!value.match(/,|-|\s/gi);
  const hasWildcard = !!value.match(/\*/gi);
  return hasDelimeter && !hasWildcard;
};

/**
 * Perform a naive validation of a string as a formula
 * Returns the string if it has more than one capital letter, a number, or wildcard character ("*")
 * Returns null if the string is not a "parsable" formula
 */
export const isFormulaInput = (value: string): boolean => {
  const capitalLettersMatch = value.match(/[A-Z]/g);
  const capitalLetters = capitalLettersMatch ? capitalLettersMatch.length : 0;
  const hasNumber = !!value.match(/[0-9]/gi);
  const hasWildcard = !!value.match(/\*/gi);
  return capitalLetters > 1 || hasNumber || hasWildcard;
};

const isElement = (elementStr: string, data = VALID_ELEMENTS) => {
  if (data.indexOf(elementStr) !== -1) {
    return true;
  } else {
    return false;
  }
};

const isValidWildcard = (string) => {
  let elements = string.split(/-/g);
  if (elements.indexOf('*') > -1) {
    return elements.every(function (el) {
      return isElement(el) || el == '*';
    });
  } else {
    const m = string.match(/([^A-Z]|^)+[a-z]|[^\.\w(),]+/g);
    const a = Array.from(new Set(m));
    //return _.isEqual(_.uniq(m), ["*"]);
    return a[0] === '*';
  }
};

/**
 * Returns the greatest common denominator of two numbers.
 *
 * @param {integer} a First number.
 * @param {integer} b Second number.
 *
 * @return {integer} Greatest common denominator.
 */
const gcd = (a, b) => {
  let w, x, y;
  x = a;
  y = b;
  while (y != 0) {
    w = x % y;
    x = y;
    y = w;
  }
  return x;
};

/**
 * Returns the greatest common denominator of a sequence of numbers.
 *
 * @param {array} numbers An array of numbers.
 *
 * @return {integer} Greatest common denominator.
 */
const getGCD = (numbers) => {
  let GCD = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    GCD = gcd(GCD, numbers[i]);
  }
  return GCD;
};

export const parseFormula = (formula) => {
  const cleanformula = formula.replace(/\s/g, '');
  let m = cleanformula.match(/([^A-Z]|^)+[a-z]|[^\.\w(),]+/g);
  if (m != null && !isValidWildcard(cleanformula)) {
    return null;
  }

  const re = /([A-Z][a-z]*)([\d\.]*)/;
  m = cleanformula.match(/([A-Z][a-z]*)([\d\.]*)/g);
  let elements: string[] = [];
  let amounts = {};
  let i;
  console.log('checking formula...');
  if (m != null) {
    console.log('still checking...');
    for (i = 0; i < m.length; i++) {
      const m2 = re.exec(m[i]);
      if (VALID_ELEMENTS.indexOf(m2![1]) === -1) {
        return null;
      }
      if (elements.indexOf(m2![1]) === -1) {
        elements.push(m2![1]);
        if (m2![2] == '') {
          amounts[m2![1]] = 1;
        } else {
          amounts[m2![1]] = m2![2];
        }
      } else {
        if (m2![2] == '') {
          amounts[m2![1]] += 1;
        } else {
          amounts[m2![1]] += m2![2];
        }
      }
    }

    const amtnum: any[] = [];

    for (const el in amounts) {
      amtnum.push(amounts[el]);
    }

    const gcd = getGCD(amtnum);
    const form_santized: any[] = [];
    for (i = 0; i < elements.length; i++) {
      form_santized.push(elements[i] + amounts[elements[i]] / gcd);
    }
    console.log('valid formula');
    return [elements.sort().join('&'), form_santized.sort().join(' ')];
  }
  return null;
};

export const validateFormula = (formula: string) => {
  const cleanformula = formula.replace(/\s/g, '');
  let m = cleanformula.match(/([^A-Z]|^)+[a-z]|[^\w()\*]+/g);
  if (m != null) {
    return null;
  }

  const re = /([A-Z][a-z]*)([\d\.]*)/;
  m = cleanformula.match(/([A-Z][a-z]*)([\d\.]*)/g);
  let elements: string[] = [];
  let amounts = {};
  let i;
  console.log('checking formula...');
  if (m != null) {
    console.log('still checking...');
    for (i = 0; i < m.length; i++) {
      const m2 = re.exec(m[i]);
      if (VALID_ELEMENTS.indexOf(m2![1]) === -1) {
        return null;
      }
      if (elements.indexOf(m2![1]) === -1) {
        elements.push(m2![1]);
        if (m2![2] == '') {
          amounts[m2![1]] = 1;
        } else {
          amounts[m2![1]] = m2![2];
        }
      } else {
        if (m2![2] == '') {
          amounts[m2![1]] += 1;
        } else {
          amounts[m2![1]] += m2![2];
        }
      }
    }

    const amtnum: any[] = [];

    for (const el in amounts) {
      amtnum.push(amounts[el]);
    }

    const gcd = getGCD(amtnum);
    const form_santized: any[] = [];
    for (i = 0; i < elements.length; i++) {
      form_santized.push(elements[i] + amounts[elements[i]] / gcd);
    }
    console.log('valid formula');
    return [elements.sort().join('&'), form_santized.sort().join(' ')];
  }
  return null;
};

/**
 * Determine if a string is delimited by commas, hyphens, or spaces
 * Return the delimiter as a regular expression object
 * If multiple delimiters are present, the delimiter with the lowest index is used
 */
export const getDelimiter = (input: string): RegExp => {
  const comma = input.match(/,/);
  const hyphen = input.match(/-/);
  const space = input.match(/\s/);
  if (
    comma &&
    comma.index &&
    (!hyphen || (hyphen.index && hyphen.index > comma.index)) &&
    (!space || (space.index && space.index > comma.index))
  ) {
    return new RegExp(',');
  } else if (
    hyphen &&
    hyphen.index &&
    (!comma || (comma.index && comma.index > hyphen.index)) &&
    (!space || (space.index && space.index > hyphen.index))
  ) {
    return new RegExp('-');
  } else if (
    space &&
    space.index &&
    (!comma || (comma.index && comma.index > space.index)) &&
    (!hyphen || (hyphen.index && space.index > space.index))
  ) {
    return new RegExp(/\s/);
  } else {
    return new RegExp(',');
  }
};

/**
 * Parses an array of valid elements from a string of elements separated by a delimiter
 * Returns an array of valid element symbols (e.g. ['Na', 'Cl'])
 */
export const parseElements = (elementStr: string, delimiter?: RegExp) => {
  let cleanElementsStr = '';
  if (!delimiter) delimiter = getDelimiter(elementStr);
  const delimiterString = delimiter.toString();
  if (delimiterString === new RegExp(/,/).toString()) {
    cleanElementsStr = elementStr.replace(/and|\s|-|[0-9]/gi, '');
  } else if (delimiterString === new RegExp(/-/).toString()) {
    cleanElementsStr = elementStr.replace(/and|\s|,|[0-9]/gi, '');
  } else if (delimiterString === new RegExp(/\s/).toString()) {
    cleanElementsStr = elementStr.replace(/and|,|-|[0-9]/gi, '');
  }
  const unparsedElements = delimiter ? cleanElementsStr.split(delimiter) : [cleanElementsStr];
  const parsedElements: string[] = [];
  let valid = true;
  unparsedElements.forEach((el) => {
    if (isElement(el)) {
      parsedElements.push(el);
    } else if (el !== '*' && el !== '') {
      valid = false;
    }
  });
  if (valid) {
    return parsedElements;
  } else {
    return null;
  }
};

export const isSmilesInput = (value: string): boolean => {
  const result = value.trim().match(/^([^J][0-9BCOHNSOPrIFla@+\-\[\]\(\)\\\/%=#$]{6,})$/gi);
  return Array.isArray(result);
};

export const getMaterialsInputType = (value: string) => {
  if (isMpIdInput(value)) {
    return MaterialsInputField.MP_ID;
  } else if (parseElements(value)) {
    return MaterialsInputField.ELEMENTS;
  } else if (isSmilesInput(value)) {
    return MaterialsInputField.SMILES;
  } else if (validateFormula(value)) {
    return MaterialsInputField.FORMULA;
  } else {
    return null;
  }
};
