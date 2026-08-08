import { ContentLayout } from '@/components/layouts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { useSearchParams } from 'react-router-dom';
import { useFamily } from '@/features/family/context/family-context';
import {
  AgendaView,
  CalendarView,
  CalendarSettingsContent,
  CalendarViewToggle,
  type CalendarViewMode,
} from '@/features/calendar/components';
import { Typography } from '@famjam/ui';

const Calendar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'agenda';
  const view: CalendarViewMode =
    searchParams.get('view') === 'calendar' ? 'calendar' : 'agenda';
  const { activeFamily } = useFamily();

  const setView = (next: CalendarViewMode) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', next);
    setSearchParams(params, { replace: true });
  };

  return (
    <ContentLayout title="Calendar">
      {!activeFamily && (
        <Typography.Body>
          Join or create a family to start using the calendar.
        </Typography.Body>
      )}
      {activeFamily && (
        <Tabs
          defaultValue={tab}
          testID="calendar-tabs"
          onValueChange={(value) => {
            const next = new URLSearchParams(searchParams);
            next.set('tab', value);
            setSearchParams(next, { replace: true });
          }}
        >
          <TabsList testID="calendar-tabs-list">
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="agenda">
            <CalendarViewToggle value={view} onChange={setView} />
            {view === 'agenda' && <AgendaView familyId={activeFamily.id} />}
            {view === 'calendar' && <CalendarView familyId={activeFamily.id} />}
          </TabsContent>
          <TabsContent value="settings">
            <CalendarSettingsContent familyId={activeFamily.id} />
          </TabsContent>
        </Tabs>
      )}
    </ContentLayout>
  );
};

export default Calendar;
