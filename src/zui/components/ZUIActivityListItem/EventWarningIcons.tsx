import { Box } from '@mui/material';
import { FC } from 'react';
import {
  EmojiPeople,
  FaceRetouchingOff,
  MailOutline,
} from '@mui/icons-material';

import ZUIIcon from '../ZUIIcon';
import ZUITooltip from '../ZUITooltip';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

export type EventWarningIconsProps = {
  hasContact: boolean;
  numBooked: number;
  numRemindersSent: number;
  numSignups: number;
};

const EventWarningIcons: FC<EventWarningIconsProps> = ({
  hasContact,
  numBooked,
  numRemindersSent,
  numSignups,
}) => {
  const messages = useMessages(messageIds);

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
      <Box sx={{ alignItems: 'center', display: 'flex', width: '1.25rem' }}>
        {!hasContact && (
          <ZUITooltip label={messages.eventWarningIcons.contact()}>
            <span style={{ alignItems: 'center', display: 'flex' }}>
              <ZUIIcon color="danger" icon={FaceRetouchingOff} size="small" />
            </span>
          </ZUITooltip>
        )}
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex', width: '1.25rem' }}>
        {numSignups > 0 && (
          <ZUITooltip label={messages.eventWarningIcons.signUps()}>
            <span style={{ alignItems: 'center', display: 'flex' }}>
              <ZUIIcon color="danger" icon={EmojiPeople} size="small" />
            </span>
          </ZUITooltip>
        )}
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex', width: '1.25rem' }}>
        {numRemindersSent < numBooked && (
          <ZUITooltip
            label={messages.eventWarningIcons.reminders({
              numMissing: numBooked - numRemindersSent,
            })}
          >
            <span style={{ alignItems: 'center', display: 'flex' }}>
              <ZUIIcon color="danger" icon={MailOutline} size="small" />
            </span>
          </ZUITooltip>
        )}
      </Box>
    </Box>
  );
};

export default EventWarningIcons;
