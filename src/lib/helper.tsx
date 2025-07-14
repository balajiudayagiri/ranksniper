import React from "react";

/**
 * Utility function to convert markdown-style links to HTML anchor tags (React JSX elements).
 * @param text - The input text containing markdown-style links.
 * @returns JSX element containing the converted HTML.
 */
function linkifyMarkdownTextToJSX(text: string): React.ReactNode {
  // Regular expression to match markdown-style links
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;

  const result: React.ReactNode[] = [];
  let lastIndex = 0; // To track the last position for text between links
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const [anchorText, url] = match;

    // Text before the current match
    const beforeText = text.slice(lastIndex, match.index);

    // Push the text before the link as a normal string
    if (beforeText) {
      result.push(beforeText);
    }

    // Create the anchor tag for the markdown link
    result.push(
      <a
        href={url}
        className="text-blue-500 hover:underline"
        key={match.index}
        target="_blank"
        rel="noopener noreferrer">
        {anchorText}
      </a>
    );

    // Update the last index to after the current match
    lastIndex = markdownLinkRegex.lastIndex;
  }

  // Append any remaining text after the last match
  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    result.push(remainingText);
  }

  // Return the result as a JSX element (array of strings and anchor tags)
  return <>{result}</>;
}

export { linkifyMarkdownTextToJSX };
