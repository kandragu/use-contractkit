import React, { ReactElement } from 'react';

import cls from '../utils/tailwind';

interface Footer {
  url: string;
  CTA?: string;
}
interface NamedFooter extends Footer {
  name: string;
}
interface FooterWithDescription extends Footer {
  name?: never;
  desc: string;
}
interface Props {
  title: string | ReactElement;
  content: ReactElement;
  footer?: NamedFooter | FooterWithDescription;
}

const styles = cls({
  container: `
    tw-flex
    tw-flex-col
    tw-items-stretch
    tw-justify-start
    tw-h-full
    tw-gap-2`,
  title: `
    tw-text-xl
    tw-text-center
    dark:tw-text-slate-200
    tw-font-medium`,
  contentContainer: `
    tw-flex
    tw-flex-col
    tw-items-center
    tw-flex-grow justify-center`,
  footer: `
    tw-flex
    tw-flex-row
    tw-justify-between
    tw-items-stretch
    tw-text-sm self-end`,
  footerText: `
    tw-text-slate-500
    tw-font-medium`,
  footerCTA: `
    tw-rounded
    tw-bg-indigo-50
    tw-text-indigo-500
    dark:tw-text-indigo-50
    dark:tw-bg-indigo-500
    tw-px-2
    tw-py-1
    tw-font-medium`,
});

export default function ConnectorScreen({ title, content, footer }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.contentContainer}>{content}</div>
      {footer && (
        <div className={styles.footer}>
          <div>
            <p className={styles.footerText}>
              {'desc' in footer ? footer.desc : `Don't have ${footer.name}?`}
            </p>
          </div>
          <div>
            <a
              href={footer.url}
              target="_blank"
              rel="noreferrer"
              className={styles.footerCTA}
            >
              {footer.CTA || 'GET'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// 296.500
// 248.762
