const arrayToDictionnary = (array: any[], dicoValue: any = true) => array.reduce((acc, el) => {
      acc[el] = dicoValue;
      return acc;
    }, {});

export {
  arrayToDictionnary
}
