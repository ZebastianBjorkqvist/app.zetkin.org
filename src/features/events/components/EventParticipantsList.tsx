import { Box } from '@mui/material';
import { FC } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import ParticipantListSection from 'features/events/components/ParticipantListSection';
import theme from 'theme';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventParticipantsListProps {
  data: ZetkinEvent;
  model: EventDataModel;
  orgId: number;
}

const EventParticipantsList: FC<EventParticipantsListProps> = ({
  data,
  model,
  orgId,
}) => {
  const messages = useMessages(messageIds);

  return (
    <Box>
      {model.getNumSignedParticipants() > 0 && (
        <ParticipantListSection
          chipColor={theme.palette.grey[500]}
          chipNumber={model.getNumSignedParticipants().toString()}
          description={messages.eventParticipantsList.descriptionSignups()}
          model={model}
          orgId={orgId}
          rows={model.getPendingSignUps() ?? []}
          title={messages.eventParticipantsList.signUps()}
        />
      )}
      <ParticipantListSection
        chipColor={model.getParticipantStatus()}
        chipNumber={
          model.getNumAvailParticipants() + '/' + data.num_participants_required
        }
        description={messages.eventParticipantsList.descriptionBooked()}
        model={model}
        orgId={orgId}
        rows={model.getParticipants().data ?? []}
        title={messages.eventParticipantsList.bookedParticipants()}
      />
    </Box>
  );
};

export default EventParticipantsList;