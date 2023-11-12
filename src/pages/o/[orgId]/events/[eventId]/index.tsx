import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  Link,
  Modal,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import { Msg } from 'core/i18n';
import { scaffold } from 'utils/next';
import useEvent from 'features/events/hooks/useEvent';
import useEventSignup from 'features/events/hooks/useEventSignup';
import useServerSide from 'core/useServerSide';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIFuture from 'zui/ZUIFuture';
import { BeachAccess, CalendarToday, Place } from '@mui/icons-material';

const scaffoldOptions = {
  allowNonMembers: true,
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { eventId, orgId } = ctx.params!;

  return {
    props: {
      eventId,
      orgId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  eventId: string;
  orgId: string;
};

const Map = dynamic(
  () => import('features/events/components/ActivistEventPage/Map'),
  { ssr: false }
);

const Page: FC<PageProps> = ({ orgId, eventId }) => {
  const eventFuture = useEvent(parseInt(orgId, 10), parseInt(eventId, 10));
  const onServer = useServerSide();
  const eventSignupFuture = useEventSignup(
    parseInt(orgId, 10),
    parseInt(eventId, 10)
  );
  const [showBigMap, setShowBigMap] = useState(false);

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          <Msg id={messageIds.activistPortal.loadingTitle} />
        </title>
      </Head>
      <ZUIFuture future={eventFuture}>
        {(event) => {
          const location = event.location;
          return (
            <>
              <Head>
                <title>{event.title}</title>
              </Head>
              <Box display="flex" flexDirection="column" padding={2}>
                <Typography variant="h4">{event.title}</Typography>
                <Box alignItems="center" display="flex">
                  <Avatar
                    alt="icon"
                    src={`/api/orgs/${orgId}/avatar`}
                    sx={{ margingRight: 1 }}
                  />
                  <Typography color="secondary">
                    {event.organization.title}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={1} paddingY={1}>
                  {event.activity && (
                    <Box alignItems="center" display="flex">
                      <BeachAccess color="secondary" sx={{ marginRight: 1 }} />
                      <Typography>{event.activity.title}</Typography>
                    </Box>
                  )}
                  <Box alignItems="center" display="flex">
                    <CalendarToday color="secondary" sx={{ marginRight: 1 }} />
                    <ZUIDateTime datetime={event.start_time} />
                  </Box>
                  {location && (
                    <Box alignItems="center" display="flex">
                      <Place color="secondary" sx={{ marginRight: 1 }} />
                      <Typography sx={{ marginRight: 1 }}>
                        {location.title}
                      </Typography>
                      <Link
                        color="primary"
                        onClick={() => setShowBigMap(true)}
                        underline="hover"
                      >
                        Show on map
                      </Link>
                      <Modal
                        aria-describedby="parent-modal-description"
                        aria-labelledby="parent-modal-title"
                        disableEnforceFocus
                        onClose={() => setShowBigMap(false)}
                        open={showBigMap}
                      >
                        <Box
                          sx={{
                            height: '80%',
                            left: '50%',
                            position: 'absolute',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                          }}
                        >
                          <Map
                            interactive={true}
                            location={location!}
                            style={{ height: '100%', width: '100%' }}
                            zoomLevel={17}
                          />
                        </Box>
                      </Modal>
                    </Box>
                  )}
                </Box>
                <Typography>{event.info_text}</Typography>
                {location && (
                  <Box>
                    <Map
                      interactive={false}
                      location={location}
                      style={{ height: '35vmin', width: '100%' }}
                      zoomLevel={13.5}
                    />
                  </Box>
                )}
              </Box>
              <Drawer anchor="bottom" variant="permanent">
                <Box display="flex" flexDirection="column" padding={2}>
                  <ZUIFuture
                    future={eventSignupFuture}
                    skeleton={
                      <Button variant="contained">
                        <Msg id={messageIds.activistPortal.loadingButton} />
                      </Button>
                    }
                  >
                    {({ myResponseState, signup, undoSignup }) =>
                      myResponseState == 'notSignedUp' ? (
                        <Button onClick={signup} variant="contained">
                          <Msg id={messageIds.activistPortal.signupButton} />
                        </Button>
                      ) : myResponseState == 'signedUp' ? (
                        <Button onClick={undoSignup} variant="contained">
                          <Msg
                            id={messageIds.activistPortal.undoSignupButton}
                          />
                        </Button>
                      ) : myResponseState == 'booked' ? (
                        <Typography>
                          <Msg id={messageIds.activistPortal.bookedMessage} />
                        </Typography>
                      ) : (
                        <Typography>
                          <Msg id={messageIds.activistPortal.notInOrgMessage} />
                        </Typography>
                      )
                    }
                  </ZUIFuture>
                </Box>
              </Drawer>
            </>
          );
        }}
      </ZUIFuture>
    </>
  );
};

export default Page;
