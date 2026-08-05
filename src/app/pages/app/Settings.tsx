import { ContentLayout } from '@/components/layouts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { ProfileContent, FamilyContent } from '@/features/settings/components';
import { useSearchParams } from 'react-router-dom';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'profile';

  return (
    <ContentLayout title="Settings">
      <Tabs
        defaultValue={tab}
        testID="settings-tabs"
        onValueChange={(value) => {
          const next = new URLSearchParams(searchParams);
          next.set('tab', value);
          setSearchParams(next, { replace: true });
        }}
      >
        <TabsList testID="settings-tabs-list">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notification">Notification</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileContent />
        </TabsContent>
        <TabsContent value="notification">Notification Settings</TabsContent>
        <TabsContent value="family">
          <FamilyContent />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
};

export default Settings;
