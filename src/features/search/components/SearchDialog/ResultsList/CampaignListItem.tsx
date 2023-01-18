import { Event } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinCampaign } from 'utils/types/zetkin';

const CampaignListItem: React.FunctionComponent<{
  campaign: ZetkinCampaign;
}> = ({ campaign }) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link
      key={campaign.id}
      href={`/organize/${orgId}/campaigns/${campaign.id}`}
      passHref
    >
      <ListItem button component="a" data-testid="SearchDialog-resultsListItem">
        <ListItemAvatar>
          <Avatar>
            <Event />
          </Avatar>
        </ListItemAvatar>
        <ResultsListItemText
          primary={campaign.title}
          secondary={<FormattedMessage id="misc.search.results.campaign" />}
        />
      </ListItem>
    </Link>
  );
};

export default CampaignListItem;
