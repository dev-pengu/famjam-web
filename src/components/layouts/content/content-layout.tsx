import { Head } from '@/components/seo';
import styles from './content-layout.module.css';
import { Typography, TypographyTextSize } from '@famjam/ui';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <Typography.Title as="h1" size={TypographyTextSize.Large} bold className={styles.title}>
            {title}
          </Typography.Title>
        </div>
        <div className={styles.contentWrapper}>{children}</div>
      </div>
    </>
  );
};
