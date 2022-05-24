import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkHighlight from 'remark-highlight.js';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

export interface MarkdownProps {
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id?: string;

  /**
   * Class name of the container element
   */
  className?: string;

  /**
   * Remove matching leading whitespace from all lines.
   * Lines that are empty, or contain *only* whitespace, are ignored.
   * Both spaces and tab characters are removed, but only if they match;
   * we will not convert tabs to spaces or vice versa.
   */
  dedent?: boolean;

  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state?: any;

  /**
   * User-defined inline styles for the rendered Markdown
   */
  style?: any;
}

const dedentLines = (text) => {
  const lines = text.split(/\r\n|\r|\n/);
  let commonPrefix: string | null = null;
  for (const line of lines) {
    const preMatch = line && line.match(/^\s*(?=\S)/);
    if (preMatch) {
      const prefix = preMatch[0];
      if (commonPrefix !== null) {
        for (let i = 0; i < commonPrefix.length; i++) {
          // Like Python's textwrap.dedent, we'll remove both
          // space and tab characters, but only if they match
          if (prefix[i] !== commonPrefix[i]) {
            commonPrefix = commonPrefix.substr(0, i);
            break;
          }
        }
      } else {
        commonPrefix = prefix;
      }

      if (!commonPrefix) {
        break;
      }
    }
  }

  const commonLen = commonPrefix ? commonPrefix.length : 0;
  return lines
    .map((line) => {
      return line.match(/\S/) ? line.substr(commonLen) : '';
    })
    .join('\n');
};

/**
 * A custom re-worked version of dcc.Markdown.
 * Uses v6 of react-markdown and applies four plugins
 * to the markdown component by default:
 * - remark-slug
 * - remark-highlight.js
 * - remark-math
 * - rehype-katex
 */
export const Markdown: React.FC<MarkdownProps> = (props) => {
  const textProp =
    props.children && Array.isArray(props.children) ? props.children.join('\n') : props.children;
  const displayText = props.dedent && textProp ? dedentLines(textProp) : textProp;

  return (
    <div
      id={props.id}
      style={props.style}
      className={props.className}
      data-dash-is-loading={(props.loading_state && props.loading_state.is_loading) || undefined}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkHighlight]}
        rehypePlugins={[rehypeSlug as any, rehypeKatex]}
      >
        {displayText}
      </ReactMarkdown>
    </div>
  );
};

Markdown.defaultProps = {
  dedent: true
};
