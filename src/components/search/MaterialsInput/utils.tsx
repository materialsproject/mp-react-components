import { MaterialsInputType } from '../MaterialsInput';

const VALID_ELEMENTS = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar Kr K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Ar Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La-Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac-Lr Rf Db Sg Bh Hs Mt Ds Rg Cn La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(
  ' '
);

/**
 * Check if a string is a valid element symbol
 *
 * @param {string} elementStr String to check if element symbol
 * @param data [optional] String of valid elements to check against
 */
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
 * @returns {integer} Greatest common denominator.
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
 * @returns {integer} Greatest common denominator.
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
  if (m != null) {
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
    return [elements.sort().join('&'), form_santized.sort().join(' ')];
  }
  return null;
};

/**
 * Validates a string as a checmical formula and returns
 * a parsed array of valid elements if successful.
 *
 * @param {string} formula An unparsed chemical formula string
 * @returns {string[] or null} Array of valid element symbols or null
 */
export const validateFormula = (formula: string): string[] | null => {
  const cleanformula = formula.replace(/\s/g, '');
  const illegalChars = cleanformula.match(/([^A-Z]|^)+[a-z]|[^\w()\*\-]+/g);
  if (illegalChars != null) {
    return null;
  }

  /** Finds occurrences of an element symbol and numbers */
  const re = /([A-Z][a-z]*)([\d\.]*)/g;
  let elements: string[] = [];
  let match: RegExpExecArray | null = null;
  /** Loop through matches using exec(), match will be null once there are no more matches in the formula string */
  while ((match = re.exec(cleanformula))) {
    if (!isElement(match[1])) {
      return null;
    }
    if (elements.indexOf(match[1]) === -1) {
      elements.push(match[1]);
    }
  }

  return elements.length > 0 ? elements : null;
};

/**
 * Determines if a string is delimited by commas, hyphens, or spaces
 * If multiple delimiters are present, the delimiter with the lowest index is used
 * If none is present, defaults to comma
 *
 * @param {string} input String to parse for a delimiter
 * @returns Delimiter as a regular expression object
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
 * Validates a string as a valid list of element symbols or wildcards.
 * Elements can be delimited by a comma, space, or hyphen
 *
 * @param {string} elementStr String of element symbols to be validated
 * @returns Array of valid element symbols
 */
export const validateElements = (elementStr: string): string[] | null => {
  let cleanElementsStr = '';
  const delimiter = getDelimiter(elementStr);
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

/**
 * Validates a string as a possible Simplified Molecular-Input Line-Entry System (SMILES)
 *
 * @param {string} value String value to be validated
 * @returns Validated SMILES string or null
 */
export const validateSmiles = (value: string): string | null => {
  const result = value.trim().match(/^([^J][0-9BCOHNSOPrIFla@+\-\[\]\(\)\\\/%=#$]{6,})$/gi);
  if (Array.isArray(result)) {
    return value;
  } else {
    return null;
  }
};

/**
 * Validates a string as a possible material, molecule, or battery id
 * Note: this only validates the string's format, not its existence in the database.
 *
 * @param {string} value String value to be validated
 * @returns Validated id string or null
 */
export const validateMPID = (value: string): string | null => {
  if (
    value.match(/mp\-\d/) !== null ||
    value.match(/mvc\-\d/) !== null ||
    value.match(/mol\-\d/) !== null
  ) {
    return value;
  } else {
    return null;
  }
};

export type MaterialsInputTypesMap = Partial<Record<MaterialsInputType, any>>;

/**
 * Object to map MaterialsInputType values to validation functions
 * Object keys must be one of the values defined in the MaterialsInputType enum
 */
export const materialsInputTypes: MaterialsInputTypesMap = {
  mpid: {
    validate: validateMPID,
  },
  elements: {
    validate: validateElements,
  },
  formula: {
    validate: validateFormula,
  },
  smiles: {
    validate: validateSmiles,
  },
  text: {
    validate: () => true,
  },
};

/**
 * Detects and validates a MaterialsInputType type from
 * a raw input string.
 *
 * @param {string} value Input value string for a MaterialsInput
 * @returns Array with two values:
 *   1. The detected MaterialsInputType or null none detected
 *   2. The parsed value returned from the detcted inputType's validation method
 */
const detectInputType = (value: string): [MaterialsInputType | null, any] => {
  for (const inputType in materialsInputTypes) {
    const parsedValue = materialsInputTypes[inputType].validate(value);
    if (parsedValue) {
      return [inputType as MaterialsInputType, parsedValue];
    }
  }
  return [null, null];
};

/**
 * Validate a MaterialsInput value.
 * This method will always return an array with two values.
 * Failed validations will return null in the second value in the returned array.
 *
 * @param {string} value Input value string for a MaterialsInput
 * @param {string} inputType [optional] MaterialsInputType type to use to validate the input value (will detect field type if not included)
 * @returns Array with two values:
 *   1. The MaterialsInputType (only null if no field is supplied or detected)
 *   2. The validated parsed value returned from the field's validation method (null if validation failed)
 */
export const validateInputType = (
  value: string,
  inputType?: MaterialsInputType
): [MaterialsInputType | null, any] => {
  if (inputType) {
    const parsedValue = materialsInputTypes[inputType].validate(value);
    return [inputType, parsedValue];
  } else {
    const [detectedField, parsedValue] = detectInputType(value);
    return [detectedField, parsedValue];
  }
};

const sortInputTypes = (a, b) => {
  const orderA = materialsInputTypes[a].order;
  const orderB = materialsInputTypes[b].order;
  return orderA < orderB ? -1 : orderA > orderB ? 1 : 0;
};

/**
 * Validate a MaterialsInput value.
 * This method will always return an array with two values.
 * Failed validations will return null in the second value in the returned array.
 *
 * @param {string} value Input value string for a MaterialsInput
 * @param {string} allowedInputTypes [optional] MaterialsInputType type to use to validate the input value (will detect field type if not included)
 * @returns Array with two values:
 *   1. The MaterialsInputType (only null if no field is supplied or detected)
 *   2. The validated parsed value returned from the field's validation method (null if validation failed)
 */
export const detectAndValidateInputType = (
  value: string,
  allowedInputTypes: MaterialsInputType[]
): [MaterialsInputType | null, any] => {
  const sortedAllowedInputTypes = allowedInputTypes?.sort(sortInputTypes);
  for (const inputType of sortedAllowedInputTypes) {
    const parsedValue = materialsInputTypes[inputType].validate(value);
    if (parsedValue) {
      return [inputType as MaterialsInputType, parsedValue];
    }
  }
  return [null, null];
};
