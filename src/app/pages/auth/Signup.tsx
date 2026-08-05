import { AuthLayout } from '@/components/layouts';
import {
  Typography,
  Divider,
  Accordion,
  List,
  ListItem,
  ListItemIcon,
  Icon,
  IconName,
  ListItemText,
  Button,
} from '@famjam/ui';
import styles from './Signup.module.css';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { SignupForm } from '@/features/auth/components/signup-form';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { paths } from '@/config/paths';

const Signup = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isSuccess = Boolean(searchParams.get('success'));
  const handleOauthLogin = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
  };

  const handleRegistrationSuccess = () => {
    const next = new URLSearchParams(searchParams);
    next.set('success', 'true');
    setSearchParams(next, { replace: true });
  };

  // TODO add features here to showcase on the registration page
  const features = [
    {
      primary: 'Meal planning',
      secondary:
        'Keep track of family favorites and vote on meals for the week.',
    },
  ];

  const signupFragment = (
    <>
      <Typography.Title className={styles.subtitle}>
        Create your free account
      </Typography.Title>
      <Typography.Body className={styles.subtext}>
        Explore FamJam's core features for helping you manage your family.
      </Typography.Body>
      <Accordion summary="See what's included">
        <List dense>
          {features.map((feature) => (
            <ListItem>
              <ListItemIcon>
                <Icon name={IconName.Check} size={16} decorative />
              </ListItemIcon>
              <ListItemText
                primary={feature.primary}
                secondary={feature.secondary}
              />
            </ListItem>
          ))}
        </List>
      </Accordion>
      <div className={styles.oauthWrapper}>
        <GoogleLogin
          onSuccess={handleOauthLogin}
          theme="filled_black"
          text="continue_with"
        />
      </div>
      <Divider className={styles.divider}>
        <Typography.Body>OR</Typography.Body>
      </Divider>
      <SignupForm onSuccess={handleRegistrationSuccess} />
    </>
  );

  const successFragment = (
    <>
      <Typography.Title bold className={styles.centerText}>
        Success!
      </Typography.Title>
      <Typography.Body className={styles.centerText}>
        Your information has been successfully submitted. A verification email
        has been sent to the email entered. Please verify your email before
        continuing.
      </Typography.Body>
      <div className={styles.actionsWrapper}>
        <Button to={paths.home.getHref()} as={RouterLink}>
          Return Home
        </Button>
      </div>
    </>
  );

  return (
    <AuthLayout title="Register">
      {isSuccess && successFragment}
      {!isSuccess && signupFragment}
    </AuthLayout>
  );
};

export default Signup;
