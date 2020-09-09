export const getDelimiter = (str: string) => {
  const commaIndex = str.indexOf(',');
  const hyphenIndex = str.indexOf('-');
  if(commaIndex > -1 && hyphenIndex > -1) {
    return commaIndex < hyphenIndex ? ',' : '-';
  } else if(commaIndex === -1 && hyphenIndex > -1) {
    return '-';
  } else {
    return ',';
  }
}