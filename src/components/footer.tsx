export const Footer = () => {
  return (
    <footer className="p-6 text-sm text-gray-500 lg:fixed lg:bottom-0 lg:left-0">
      <div>
        ikaskey-emoji-form — powered by{' '}
        <a
          href="https://waku.gg/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Waku
        </a>{' '}
        on Cloudflare Workers
      </div>
    </footer>
  );
};
