'use client';

import { useEffect, useState } from 'react';
import * as mfm from 'mfm-js';
import type { MfmNode } from 'mfm-js';

type EmojiMap = Record<string, string>;

type CachedEmojiMap = { map: EmojiMap; fetchedAt: number };

let cachedMapPromise: Promise<EmojiMap> | null = null;
function loadEmojiMap(): Promise<EmojiMap> {
  if (!cachedMapPromise) {
    cachedMapPromise = fetch('/api/emoji-map')
      .then((r) => (r.ok ? (r.json() as Promise<CachedEmojiMap>) : Promise.reject(r.status)))
      .then((d) => d.map)
      .catch(() => ({}));
  }
  return cachedMapPromise;
}

type Props = {
  text: string;
  /** display: inline / block (デフォルト inline) */
  inline?: boolean;
  /** プレーンテキスト fallback (parse 不能時) */
  plain?: boolean;
};

/**
 * Misskey MFM (Markup For Misskey) を React で描画する最小限のレンダラー。
 * 対応ノード: text / bold / italic / strike / small / center / quote / link / mention
 *           / hashtag / url / emojiCode / unicodeEmoji / inlineCode / blockCode
 *           / mathInline / mathBlock / search / plain / fn (一部の x2/x3/x4,jelly,bounce 等)
 * 未知ノードは plain text にフォールバックする。
 */
export function Mfm({ text, inline = true, plain = false }: Props) {
  const [emojis, setEmojis] = useState<EmojiMap>({});

  useEffect(() => {
    loadEmojiMap().then(setEmojis);
  }, []);

  if (!text) return null;
  if (plain) return <>{text}</>;

  let nodes: MfmNode[];
  try {
    nodes = inline ? mfm.parseSimple(text) : mfm.parse(text);
  } catch {
    return <>{text}</>;
  }

  const Wrapper = inline ? 'span' : 'div';
  return (
    <Wrapper className="mfm">
      {nodes.map((n, i) => (
        <Node key={i} node={n} emojis={emojis} />
      ))}
    </Wrapper>
  );
}

function Node({ node, emojis }: { node: MfmNode; emojis: EmojiMap }) {
  switch (node.type) {
    case 'text':
      return <>{node.props.text}</>;

    case 'bold':
      return (
        <strong className="font-bold">
          <Children nodes={node.children} emojis={emojis} />
        </strong>
      );

    case 'italic':
      return (
        <em className="italic">
          <Children nodes={node.children} emojis={emojis} />
        </em>
      );

    case 'strike':
      return (
        <del className="line-through">
          <Children nodes={node.children} emojis={emojis} />
        </del>
      );

    case 'small':
      return (
        <small className="text-[0.85em] opacity-70">
          <Children nodes={node.children} emojis={emojis} />
        </small>
      );

    case 'center':
      return (
        <div className="text-center">
          <Children nodes={node.children} emojis={emojis} />
        </div>
      );

    case 'quote':
      return (
        <blockquote className="border-l-2 border-[var(--color-border-strong)] pl-3 my-1 text-[var(--color-text-muted)]">
          <Children nodes={node.children} emojis={emojis} />
        </blockquote>
      );

    case 'plain':
      return (
        <span>
          <Children nodes={node.children} emojis={emojis} />
        </span>
      );

    case 'link': {
      return (
        <a
          href={node.props.url}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--color-link)] underline-offset-2 hover:underline"
        >
          <Children nodes={node.children} emojis={emojis} />
        </a>
      );
    }

    case 'url':
      return (
        <a
          href={node.props.url}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--color-link)] underline-offset-2 hover:underline break-all"
        >
          {node.props.url}
        </a>
      );

    case 'mention':
      return (
        <span className="font-mono text-[var(--color-accent)]">
          @{node.props.username}
          {node.props.host ? `@${node.props.host}` : ''}
        </span>
      );

    case 'hashtag':
      return <span className="text-[var(--color-info)]">#{node.props.hashtag}</span>;

    case 'emojiCode': {
      const name = node.props.name;
      const url = emojis[name];
      if (url) {
        return (
          <img
            src={url}
            alt={`:${name}:`}
            title={`:${name}:`}
            referrerPolicy="no-referrer"
            className="mfm-emoji"
          />
        );
      }
      return <span className="opacity-60">:{name}:</span>;
    }

    case 'unicodeEmoji':
      return <>{node.props.emoji}</>;

    case 'inlineCode':
      return (
        <code className="rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] px-1 font-mono text-[0.875em]">
          {node.props.code}
        </code>
      );

    case 'blockCode':
      return (
        <pre className="overflow-x-auto rounded-md bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3 text-sm">
          <code className="font-mono">{node.props.code}</code>
        </pre>
      );

    case 'mathInline':
      return <code className="font-mono">{node.props.formula}</code>;

    case 'mathBlock':
      return <pre className="font-mono">{node.props.formula}</pre>;

    case 'search':
      return (
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(node.props.query)}`}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--color-link)] underline-offset-2 hover:underline"
        >
          {node.props.query} (検索)
        </a>
      );

    case 'fn': {
      const fname = node.props.name;
      // 静的環境では装飾だけ (アニメは省略)
      let cls = '';
      let style: React.CSSProperties | undefined;
      if (fname === 'x2') style = { fontSize: '200%' };
      else if (fname === 'x3') style = { fontSize: '400%' };
      else if (fname === 'x4') style = { fontSize: '600%' };
      else if (fname === 'tada') style = { fontSize: '200%' };
      else if (fname === 'rainbow') {
        cls =
          'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent';
      }
      return (
        <span className={cls} style={style}>
          <Children nodes={node.children} emojis={emojis} />
        </span>
      );
    }

    default:
      // 未対応: そのまま children を表示 (なければ何も出さない)
      // @ts-expect-error: node may not have children
      if (node.children) {
        // @ts-expect-error
        return <Children nodes={node.children} emojis={emojis} />;
      }
      return null;
  }
}

function Children({ nodes, emojis }: { nodes: MfmNode[]; emojis: EmojiMap }) {
  return (
    <>
      {nodes.map((n, i) => (
        <Node key={i} node={n} emojis={emojis} />
      ))}
    </>
  );
}
