const VALID_ELEMENTS = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar Kr K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Ar Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La-Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac-Lr Rf Db Sg Bh Hs Mt Ds Rg Cn La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(
  ' '
);
// from pymatgen.core.periodic_table import get_el_sp
// from pymatgen import Element
// element_symbols = [e.symbol for e in Element]
// elements__X_asc = sorted(element_symbols,
//                          key=lambda s: (get_el_sp(s).X, s))
const ELEMENTS_X_ASC = 'Ar Eu He Lr Ne Pm Rn Tb Yb Fr Cs K Rb Ba Ra Na Sr Li Ca Ac La Ce Pr Nd Sm Gd Dy Y Ho Er Tm Lu Pu Am Bk Cf Cm Es Fm Hf Md No Th Mg Zr Np Sc U Pa Ta Ti Mn Be Nb Al Tl V Zn Cr Cd In Ga Fe Co Cu Re Si Tc Ni Ag Sn Hg Po Ge Bi B Sb Te Mo As P At H Ir Os Pd Ru Pt Rh Pb W Au C Se S Xe I Br Kr N Cl O F'.split(
  ' '
);
export const MatgenUtilities = {
  orderByElectronegativity: function(elements: any[], data) {
    if (data == undefined) data = ELEMENTS_X_ASC;
    return elements;
    /*return _.sortBy(elements, function(e) {
      return data.indexOf(e);
    }); not sure it would have work*/
  },

  isNumber: function(tok) {
    if (tok == null) return false;

    if (tok.search(/\d+\.?\d*/) >= 0) return true;
    else return false;
  },

  isCloseParens: function(tok) {
    if (tok == ')') return true;
    else return false;
  },

  isElement: function(elm, data = VALID_ELEMENTS) {
    if (data.indexOf(elm) !== -1) {
      return true;
    } else {
      return false;
    }
  },

  // Parse a string of element states.
  // eg.
  // 'Fe2+ Fe3+ O2-' => { Fe: [2, 3], O: [-2]}
  //
  parseElNumList: function(states) {
    // > states='Fe2+ Fe3+ O2-'
    // > states.match(/[A-Z][a-z]?\d+[+-]?/g)
    // [ 'Fe2+', 'Fe3+', 'O2-' ]
    const tokens = states.match(/[A-Z][a-z]?\d+[+-]?/g);
    const state_hash = {};
    const tok_len = tokens.length;
    for (let i = 0; i < tok_len; i++) {
      // > "Fe2+".match(/([A-Z][a-z]?)(\d+)([+-]?)/)
      // [ 'Fe2+', 'Fe', '2', '+', index: 0, input: 'Fe2+' ]
      const components = tokens[i].match(/([A-Z][a-z]?)(\d+)([+-]?)/);
      const el = components[1];
      const num = parseInt('' + components[3] + components[2], 10);
      if (!Array.isArray(state_hash[el])) {
        state_hash[el] = [];
      }
      state_hash[el].push(num);
    }
    return state_hash;
  },

  // Explicitly add 1s to array
  insertOnes: function(tokens) {
    let i;
    let new_toks: any = [];
    for (i = 0; i < tokens.length; i++) {
      if (
        (MatgenUtilities.isElement(tokens[i]) || MatgenUtilities.isCloseParens(tokens[i])) &&
        !MatgenUtilities.isNumber(tokens[i + 1])
      ) {
        new_toks.push(tokens[i]);
        new_toks.push('1');
      } else {
        new_toks.push(tokens[i]);
      }
    }
    return new_toks;
  },

  // Return Formula tokens: elements, numbers, (, )
  tokenize: function(formula) {
    return formula.match(/([A-Z][a-z]?|\d+\.?\d*|[()])/g);
  },

  parseUnitcellFormula: function(formulaString: string) {
    let formula;
    formula = formulaString.replace(/[*]/g, '').trim();
    formula = formulaString.replace(/-/g, '').trim(); // ??????
    if (true || MatgenUtilities.isValidWildcard(formulaString)) {
      return [];
    } else {
      if (formula.match(/[^\d\w\s().]/)) {
        throw "Illegal character in formula: '" + formula + "'";
      }
      let test_formula = formula.match(/(\(?[A-Z][a-z]?\d*\.?\d*\)?\d*\.?\d*)/g);
      if (test_formula != null) {
        test_formula = test_formula.join('');
      }
      // Make sure things were in the right format. Break down the formula and put it back together
      if (test_formula != formula && !MatgenUtilities.isValidWildcard(formulaString)) {
        throw "Invalid formula: '" + formula + "'";
      }
      // Tokens are elements, numbers, and parens
      const tokens = MatgenUtilities.tokenize(formula);
      // Explicitly add 1s to simplify parsing of implied value 1
      // eg. H2O -> ['H', '2', 'O'] -> ['H', '2', 'O', '1']
      const expanded_tokens = MatgenUtilities.insertOnes(tokens);
      let ans: any = {};
      for (let i = 0; i < expanded_tokens.length; i = i + 2) {
        ans[expanded_tokens[i]] = parseInt(expanded_tokens[i + 1]);
      }
      return ans;
    }
  },

  isValidWildcard: function(string) {
    let elements = string.split(/-/g);
    if (elements.indexOf('*') > -1) {
      return elements.every(function(el) {
        return MatgenUtilities.isElement(el) || el == '*';
      });
    } else {
      const m = string.match(/([^A-Z]|^)+[a-z]|[^\.\w(),]+/g);
      const a = Array.from(new Set(m));
      //return _.isEqual(_.uniq(m), ["*"]);
      return a[0] === '*';
    }
  },

  /**
   * Parses a chemical formula and returned a normalized sanitized formula.
   *
   * @param {string} formula A chemical formula.
   *
   * @return {hash} A hash containing [ elements, sanitized_formula ]. For
   *    example, Li4Fe4P4O16 will return [ ['Li', 'Fe', 'O'], 'LiFePO4']
   */
  parseFormula: function(formula) {
    const cleanformula = formula.replace(/\s/g, '');
    let m = cleanformula.match(/([^A-Z]|^)+[a-z]|[^\.\w(),]+/g);
    if (m != null && !MatgenUtilities.isValidWildcard(cleanformula)) {
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

      const gcd = MatgenUtilities.getGCD(amtnum);
      const form_santized: any[] = [];
      for (i = 0; i < elements.length; i++) {
        form_santized.push(elements[i] + amounts[elements[i]] / gcd);
      }

      return [elements.sort().join('&'), form_santized.sort().join(' ')];
    }
    return null;
  },

  /**
   * Returns the greatest common denominator of two numbers.
   *
   * @param {integer} a First number.
   * @param {integer} b Second number.
   *
   * @return {integer} Greatest common denominator.
   */
  gcd: function(a, b) {
    let w, x, y;
    x = a;
    y = b;
    while (y != 0) {
      w = x % y;
      x = y;
      y = w;
    }
    return x;
  },

  /**
   * Returns the greatest common denominator of a sequence of numbers.
   *
   * @param {array} numbers An array of numbers.
   *
   * @return {integer} Greatest common denominator.
   */
  getGCD: function(numbers) {
    let GCD = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      GCD = MatgenUtilities.gcd(GCD, numbers[i]);
    }
    return GCD;
  },

  /**
   * Returns a HTML version of a formula, with proper subscripts.
   */
  htmlFormula: function(formula): string {
    let htmlFormula = formula.replace('PCO7', 'PO4CO3');
    const oxidNumRegex = /([A-Z][a-z]*)([\d\.]+(?=-|\+).)/g;
    const oxidRegex = /([A-Z][a-z]*)(-|\+)/g;
    if (!htmlFormula.match(oxidRegex) && !htmlFormula.match(oxidNumRegex)) {
      htmlFormula = htmlFormula.replace(/([A-Z][a-z]*)([\d\.]+)/g, '$1<sub>$2</sub>');
      htmlFormula = htmlFormula.replace(/(\))([\d\.]+)/g, '$1<sub>$2</sub>');
    } else {
      htmlFormula = htmlFormula.replace(oxidNumRegex, '$1<sup>$2</sup>');
      htmlFormula = htmlFormula.replace(oxidRegex, '$1<sup>$2</sup>');
    }
    return '<span class="chemform">' + htmlFormula + '</span>';
  },

  validateInput: function(text, type) {
    let re;
    if (type == 'text') {
      re = /^[A-Za-z0-9\s\&\|\-\(\)]*$/;
    } else if (type == 'numeric') {
      re = /^[0-9\.\-\s\&\|<>]*$/;
    } else if (type == 'boolean') {
      re = /^(t|f)$/;
    }

    return re.test(text);
  },

  cleanDecimals: function(num, decimalPlaces, fixed) {
    const numStr = new Number(num).toFixed(decimalPlaces);
    if (fixed) {
      return numStr;
    }
    const clean = parseFloat(numStr);
    if (isNaN(clean)) {
      return '';
    } else {
      return clean;
    }
  },

  stripSpace: function(text) {
    return text.replace(/^\s+|\s+$/g, '');
  }
};
