import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const text = toString(tree);
    const stats = getReadingTime(text);

    data.astro.frontmatter.minutesRead = stats.text;
  };
}
