export interface CrossrefAuthor {
  given: string;
  family: string;
  sequence?: 'first' | 'additional';
  [id: string]: any;
}

export const shortenCrossrefAuthors = (authors: CrossrefAuthor[]) => {
  if (authors.length === 1) {
    return authors[0].family;
  } else if (authors.length === 2) {
    return `${authors[0].family}, ${authors[1].family}`;
  } else {
    return `${authors[0].family} et al.`;
  }
};

export const shortenBibjsonAuthors = (authors: string[]) => {
  if (authors.length === 1) {
    return authors[0];
  } else if (authors.length === 2) {
    return `${authors[0]}, ${authors[1]}`;
  } else {
    return `${authors[0]} et al.`;
  }
};

export const getCrossrefAuthorString = (authors: CrossrefAuthor[]): string => {
  let authorStr = '';
  if (authors.length === 1) {
    authorStr = `${authors[0].given} ${authors[0].family}`;
  } else if (authors.length === 2) {
    authorStr = `${authors[0].given} ${authors[0].family} and ${authors[1].given} ${authors[1].family}`;
  } else {
    authors.forEach((a, i) => {
      if (i !== authors.length - 1) {
        authorStr += `${a.given} ${a.family}, `;
      } else {
        authorStr += `and ${a.given} ${a.family}`;
      }
    });
  }

  return authorStr;
};

const getBibjsonAuthorString = (authors: string | string[]): string => {
  if (Array.isArray(authors)) {
    let authorStr = '';
    if (authors.length === 1) {
      authorStr = authors[0].split(', ').reverse().join(' ');
    } else if (authors.length === 2) {
      authorStr = `${authors[0].split(', ').reverse().join(' ')} and ${authors[1]
        .split(', ')
        .reverse()
        .join(' ')}`;
    } else {
      authors.forEach((a, i) => {
        if (i !== authors.length - 1) {
          authorStr += a.split(', ').reverse().join(' ') + ', ';
        } else {
          authorStr += 'and ' + a.split(', ').reverse().join(' ');
        }
      });
    }
    return authorStr;
  } else {
    return authors;
  }
};

const isCrossrefAuthor = (author: any): boolean => {
  return (
    typeof author === 'object' && author.hasOwnProperty('family') && author.hasOwnProperty('given')
  );
};

export const getAuthorString = (authors?: any[]) => {
  if (!authors) {
    return;
  } else if (isCrossrefAuthor(authors[0])) {
    return getCrossrefAuthorString(authors);
  } else {
    return getBibjsonAuthorString(authors);
  }
};

export const shortenAuthorString = (authors?: any[]) => {
  if (!authors) {
    return;
  } else if (isCrossrefAuthor(authors[0])) {
    return shortenCrossrefAuthors(authors);
  } else {
    return shortenBibjsonAuthors(authors);
  }
};
