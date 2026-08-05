import { Icon, IconName, useTheme } from '@famjam/ui';
import type { CopyButtonProps } from './copy-button.types';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './copy-button.module.css';
import { cx } from '@/utils/cx';

const copyText = async (text: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let succeeded;
  try {
    succeeded = document.execCommand('copy');
  } catch {
    succeeded = false;
  } finally {
    document.body.removeChild(textarea);
  }

  return succeeded;
};

export const CopyButton = ({
  children,
  testID,
  className,
  ariaLabel = 'Copy to clipboard',
  copiedDuration = 2000,
  onCopy,
}: Readonly<CopyButtonProps>) => {
  useTheme();

  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleCopy = useCallback(async () => {
    const text =
      contentRef.current?.innerText ?? contentRef.current?.textContent ?? '';
    if (!text) return;

    const succeeded = await copyText(text);
    if (!succeeded) return;

    onCopy?.(text);
    setCopied(true);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), copiedDuration);
  }, [copiedDuration, onCopy]);

  return (
    <div className={cx(styles.wrapper, className)} data-testid={testID}>
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={handleCopy}
        data-copied={copied}
        aria-label={copied ? 'Copied' : ariaLabel}
        data-testid={testID ? `${testID}-button` : undefined}
      >
        {copied ? (
          <Icon name={IconName.Check} size={14} />
        ) : (
          <Icon name={IconName.Copy} size={14} />
        )}
      </button>

      <span aria-live="polite" className={styles.srOnly}>
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  );
};
