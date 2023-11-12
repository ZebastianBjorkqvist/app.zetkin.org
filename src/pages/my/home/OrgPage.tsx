import { FC } from 'react';
import NextLink from 'next/link';
import { scaffold } from 'utils/next';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import { ZetkinMembership } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { Avatar, Box, Link, List, ListItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type PageProps = void;

const Page: FC<PageProps> = () => {
  const organizations = useOrganizations();
  return (
    <Box
      sx={{
        pl: '1em',
        pr: '1em',
      }}
    >
      <h1>Organizations</h1>
      <p>
        In order to take part in your organization's work you have to be
        connected. These are the organizations you are connected to today.
      </p>
      <ZUIFuture future={organizations}>
        {(data) => (
          <List>
            {data?.map((org: ZetkinMembership['organization']) => (
              <ListItem
                key={org.id}
                sx={{ color: 'var(--color-primary)' }}
                secondaryAction={
                  <Box sx={{ fontSize: '0.8em' }}>
                    <p>Disconnect</p>
                  </Box>
                }
              >
                <Avatar
                  src={`/api/orgs/${org.id}/avatar`}
                  sx={{ mr: '10px' }}
                />
                <NextLink href={`/o/${org.id}`} passHref>
                  <Link underline="hover">{org.title}</Link>
                </NextLink>
                {/* <ListItemText primary={''} secondary={'Secondary text'} /> */}
              </ListItem>
            ))}
          </List>
        )}
      </ZUIFuture>
    </Box>
  );
};

export default Page;