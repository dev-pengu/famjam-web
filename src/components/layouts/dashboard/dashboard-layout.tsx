import { useEffect, useState } from 'react';
import {
  NavLink,
  useNavigate,
  useNavigation,
  Link as RouterLink,
} from 'react-router-dom';

import logo from '@/assets/logo-icon.png';
import {
  Button,
  ButtonVariant,
  ButtonSize,
  Link,
  LinkUnderline,
  IconName,
  Typography,
  TypographyTextSize,
  Color,
  Icon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ButtonColor,
} from '@famjam/ui';
import { ProgressBar, ProgressBarVariant } from '@famjam/ui/progress';
import { paths } from '@/config/paths';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerVariants,
} from '@/components/ui';
import { cx } from '@/utils/cx';
import styles from './dashboard-layout.module.css';
import { FamilySelector } from '@/features/family/components/family-selector/family-selector';
import { useFamily } from '@/features/family/context/family-context';
import { CreateFamily } from '@/features/family/components';
import { RequiresVerification } from '@/features/auth/components/requires-verification';
import { useLogout } from '@/features/auth/auth';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: IconName;
};

const Logo = () => {
  return (
    <Link
      as={RouterLink}
      to={paths.home.getHref()}
      className={styles.logoLink}
      underline={LinkUnderline.None}
    >
      <img className={styles.logo} src={logo} alt="FamJam Logo" />
      <Typography.Body
        as="span"
        size={TypographyTextSize.Small}
        bold
        className={styles.logoText}
      >
        FamJam
      </Typography.Body>
    </Link>
  );
};

const Progress = () => {
  const { state, location } = useNavigation();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const resetProgress = async () => {
      setProgress(0);
    };
    resetProgress();
  }, [location?.pathname]);

  useEffect(() => {
    if (state === 'loading') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev === 100) {
            clearInterval(timer);
            return 100;
          }
          const newProgress = prev + 10;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 300);

      return () => {
        clearInterval(timer);
      };
    }
  }, [state]);

  if (state !== 'loading') {
    return null;
  }

  return (
    <ProgressBar
      progress={progress}
      maxValue={100}
      height={16}
      variant={ProgressBarVariant.Bar}
      bgColor={Color.SurfaceAccentDark}
    />
  );
};

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const logout = useLogout({
    mutationConfig: {
      onSuccess: () => {
        navigate(paths.auth.login.getHref());
      },
    },
  });
  const { families } = useFamily();

  // const {checkAccess} = useAuthorization();
  const navigation = [
    {
      name: 'Dashboard',
      to: paths.app.dashboard.getHref(),
      icon: IconName.Home,
    },
    {
      name: 'Calendar',
      to: paths.app.calendar.getHref(),
      icon: IconName.Calendar,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <div className={styles.container}>
      <aside className={styles.navContainer}>
        <nav className={styles.nav}>
          <div className={styles.logoWrapper}>
            <Logo />
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.name !== 'Discussions'}
              className={({ isActive }) =>
                cx(styles.navLink, isActive && styles.activeNavLink)
              }
            >
              <Icon
                name={item.icon}
                decorative
                size={18}
                className={styles.navIcon}
              />
              <Typography.Body as="span" size={TypographyTextSize.Medium}>
                {item.name}
              </Typography.Body>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <Progress />
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant={ButtonVariant.Text}
                className={styles.desktopNavTrigger}
                color={ButtonColor.Default}
              >
                <Icon
                  name={IconName.Apps}
                  size={24}
                  accessibilityLabel="Toggle Menu"
                  decorative={false}
                />
              </Button>
            </DrawerTrigger>
            <DrawerContent
              variant={DrawerVariants.right}
              className={styles.dashboardDrawerContent}
            >
              <nav className={styles.drawerNav}>
                <div className={styles.drawerLogoWrapper}>
                  <Logo />
                </div>
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      cx(styles.navLink, isActive && styles.activeNavLink)
                    }
                  >
                    <Icon
                      name={item.icon}
                      decorative
                      size={18}
                      className={styles.navIcon}
                    />
                    <Typography.Body as="span" size={TypographyTextSize.Medium}>
                      {item.name}
                    </Typography.Body>
                  </NavLink>
                ))}
              </nav>
            </DrawerContent>
          </Drawer>
          <span className={styles.endActions}>
            <RequiresVerification>
              <span className={styles.familyAction}>
                {families.length <= 0 ? <CreateFamily /> : <FamilySelector />}
              </span>
            </RequiresVerification>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={ButtonVariant.Text}
                  size={ButtonSize.Small}
                  color={ButtonColor.Default}
                  className={styles.dropdownTrigger}
                >
                  <Icon
                    name={IconName.Account}
                    size={22}
                    accessibilityLabel="Open user menu"
                    decorative={false}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => navigate(paths.app.settings.getHref())}
                  className={styles.dropdownItem}
                >
                  <Icon
                    name={IconName.Settings}
                    size={16}
                    decorative
                    className={styles.dropdownIcon}
                  />
                  <Typography.Body as="span">Settings</Typography.Body>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout.mutate(undefined);
                  }}
                  className={styles.dropdownItem}
                >
                  <Icon
                    name={IconName.Logout}
                    size={16}
                    decorative
                    className={styles.dropdownIcon}
                  />
                  <Typography.Body as="span">Sign Out</Typography.Body>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};
