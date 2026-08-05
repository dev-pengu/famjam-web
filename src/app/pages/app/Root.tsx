import { Typography } from '@famjam/ui';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts';

export const ErrorBoundary = () => {
  return <Typography.Body>Something went wrong!</Typography.Body>;
};

// TODO add layout
const AppRoot = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
