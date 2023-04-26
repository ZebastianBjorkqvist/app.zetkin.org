import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';

import EventContactCard from 'features/events/components/EventParticipansTab/EventContactCard';
import EventDataModel from 'features/events/models/EventDataModel';
import EventLayout from 'features/events/layout/EventLayout';
import EventParticipansList from 'features/events/components/EventParticipansTab/EventParticipantsList';
import { PageWithLayout } from 'utils/types';
import ParticipantSummaryCard from 'features/events/components/ParticipantSummaryCard';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, eventId } = ctx.params!;

    return {
      props: {
        campId,
        eventId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,

    localeScope: [],
  }
);

interface ParticipantsProps {
  campId: string;
  eventId: string;
  orgId: string;
}

const ParticipantsPage: PageWithLayout<ParticipantsProps> = ({
  eventId,
  orgId,
}) => {
  const dataModel = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );

  return (
    <ZUIFuture future={dataModel.getData()}>
      {(data) => {
        return (
          <>
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <ParticipantSummaryCard model={dataModel} />
              </Grid>
              <Grid item md={4} xs={8}>
                <EventContactCard data={data} />
              </Grid>
            </Grid>
            <EventParticipansList
              data={data}
              model={dataModel}
              orgId={parseInt(orgId)}
            ></EventParticipansList>
          </>
        );
      }}
    </ZUIFuture>
  );
};

ParticipantsPage.getLayout = function getLayout(page, props) {
  return (
    <EventLayout
      campaignId={props.campId}
      eventId={props.eventId}
      orgId={props.orgId}
    >
      {page}
    </EventLayout>
  );
};

export default ParticipantsPage;
