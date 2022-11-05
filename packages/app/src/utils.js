/* eslint-disable import/prefer-default-export */

export function sanitize(name = '') {
  return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}
