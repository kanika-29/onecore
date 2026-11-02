import React from 'react';

/**
 * Normalizes a brand name so that the trademark symbol (™) strictly appears
 * on the first brand word only, never duplicated on suffixes or numbers.
 *
 * Examples:
 *   "Frecox™ Gel™"  -> "Frecox™ Gel"
 *   "Frecox™-R™"    -> "Frecox™-R"
 *   "Trypcor™-BR™"  -> "Trypcor™-BR"
 *   "Tofcore™-11™"  -> "Tofcore™-11"
 *   "Frecox Gel"     -> "Frecox™ Gel"
 */
function normalizeBrandNameWithSingleTM(name) {
  if (!name || typeof name !== 'string') return '';
  let str = name.trim();

  // If there are multiple ™ marks, retain only the first one
  const tmMatches = str.match(/™/g);
  if (tmMatches && tmMatches.length > 1) {
    let seenFirst = false;
    str = str.replace(/™/g, () => {
      if (!seenFirst) {
        seenFirst = true;
        return '™';
      }
      return '';
    });
  }

  // If no ™ is present, attach ™ strictly to the first brand word
  if (!str.includes('™')) {
    str = str.replace(/^([A-Za-z0-9]+)/, '$1™');
  }

  return str.trim();
}

/**
 * Formats a product brand name with a styled superscript trademark symbol (™)
 * placed strictly on the primary brand name word.
 *
 * @param {string} name - Product name to format
 * @returns {React.ReactNode} React element with superscript ™ on first word
 */
export function formatProductName(name) {
  if (!name || typeof name !== 'string') return name || '';
  const clean = normalizeBrandNameWithSingleTM(name);

  if (!clean.includes('™')) {
    return clean;
  }

  const parts = clean.split('™');
  const brandRoot = parts[0];
  const suffix = parts.slice(1).join('');

  // Extract the immediate word before ™ so it cannot break away from the ™ symbol
  const lastSpaceIdx = brandRoot.lastIndexOf(' ');
  const prefix = lastSpaceIdx !== -1 ? brandRoot.slice(0, lastSpaceIdx + 1) : '';
  const lastWord = lastSpaceIdx !== -1 ? brandRoot.slice(lastSpaceIdx + 1) : brandRoot;

  // If the suffix immediately attaches via hyphen (e.g. Frecox™-R, Tofcore™-11), keep that unit bound as well
  let boundSuffix = '';
  let restSuffix = suffix;
  const hyphenMatch = suffix.match(/^(-\w+)/);
  if (hyphenMatch) {
    boundSuffix = hyphenMatch[1];
    restSuffix = suffix.slice(boundSuffix.length);
  }

  const boundWordWithTM = React.createElement(
    'span',
    {
      className: 'whitespace-nowrap inline-block',
      style: {
        whiteSpace: 'nowrap',
        display: 'inline-block',
      },
    },
    lastWord,
    React.createElement(
      'span',
      {
        className: 'product-trademark text-[0.6em] font-normal align-super leading-none inline-block ml-[0.05em] select-none text-current',
        style: {
          fontSize: '0.6em',
          verticalAlign: 'super',
          lineHeight: 1,
          marginLeft: '0.05em',
          display: 'inline-block',
          fontWeight: 'normal',
        },
      },
      '™'
    ),
    boundSuffix
  );

  return React.createElement(
    React.Fragment,
    null,
    prefix,
    boundWordWithTM,
    restSuffix
  );
}

/**
 * Formats a product brand name as plain text (e.g. for HTML attributes or document title)
 * ensuring only a single ™ exists on the primary brand word.
 *
 * @param {string} name - Product name to format
 * @returns {string} Product name with clean single ™
 */
export function formatProductNameText(name) {
  return normalizeBrandNameWithSingleTM(name);
}

export default formatProductName;
