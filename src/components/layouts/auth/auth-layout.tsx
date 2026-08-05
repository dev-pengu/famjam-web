import { useEffect } from 'react';
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from 'react-router-dom';

import {
  Link,
  LinkUnderline,
  Typography,
  TypographyTextSize,
} from '@famjam/ui';

import logo from '@/assets/logo.png';
import { paths } from '@/config/paths';
import { Head } from '@/components/seo';
import styles from './auth-layout.module.css';
import { useUser } from '@/features/auth/auth';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const user = useUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate(redirectTo ? redirectTo : paths.app.dashboard.getHref(), {
        replace: true,
      });
    }
  }, [user, navigate, redirectTo]);

  return (
    <>
      <Head title={title} />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Link
              as={RouterLink}
              to={paths.home.getHref()}
              underline={LinkUnderline.None}
              aria-description="Navigate to home page"
              className={styles.homeLink}
            >
              <img className={styles.logo} src={logo} alt="Logo" />
            </Link>
          </div>
          <Typography.Headline
            size={TypographyTextSize.Medium}
            className={styles.title}
            bold
          >
            {title}
          </Typography.Headline>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.formWrapper}>{children}</div>
        </div>
      </div>
    </>
  );
};
