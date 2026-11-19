import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return (tree, file) => {
    const textOnPage = toString(tree);
    const stats = getReadingTime(textOnPage);
    if (file.data?.astro?.frontmatter) {
      file.data.astro.frontmatter.readingTime = stats.text;
      file.data.astro.frontmatter.minutesRead = Math.max(1, Math.ceil(stats.minutes));
      file.data.astro.frontmatter.wordCount = stats.words;
    }
  };
}
