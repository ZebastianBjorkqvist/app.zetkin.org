import { FormattedMessage } from 'react-intl';
import { FunctionComponent } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { Group, ViewColumnOutlined } from '@mui/icons-material';

import useModel from 'core/useModel';
import ViewDataModel from '../models/ViewDataModel';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIFutures from 'zui/ZUIFutures';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';

const useStyles = makeStyles((theme) => ({
  main: {
    overflowX: 'hidden',
  },
  title: {
    marginBottom: '8px',
    transition: 'all 0.3s ease',
  },
  titleGrid: {
    alignItems: 'center',
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: '1fr auto',
    gridTemplateRows: 'auto',
    transition: 'font-size 0.2s ease',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

interface SharedViewLayoutProps {
  children?: React.ReactNode;
}

const SharedViewLayout: FunctionComponent<SharedViewLayoutProps> = ({
  children,
}) => {
  const router = useRouter();
  const { orgId, viewId } = router.query;
  const classes = useStyles();

  const dataModel = useModel(
    (env) =>
      new ViewDataModel(
        env,
        parseInt(orgId as string),
        parseInt(viewId as string)
      )
  );

  const title = (
    <ZUIFuture future={dataModel.getView()}>
      {(view) => <>{view.title}</>}
    </ZUIFuture>
  );
  const subtitle = (
    // TODO: Replace with model eventually
    <ZUIFutures
      futures={{
        cols: dataModel.getColumns(),
        rows: dataModel.getRows(),
      }}
    >
      {({ data: { cols, rows } }) => (
        <ZUIIconLabelRow
          iconLabels={[
            {
              icon: <Group />,
              label: (
                <FormattedMessage
                  id="pages.people.views.layout.subtitle.people"
                  values={{ count: rows.length }}
                />
              ),
            },
            {
              icon: <ViewColumnOutlined />,
              label: (
                <FormattedMessage
                  id="pages.people.views.layout.subtitle.columns"
                  values={{ count: cols.length }}
                />
              ),
            },
          ]}
        />
      )}
    </ZUIFutures>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      overflow="auto"
      position="relative"
      width={1}
    >
      <Box component="header" flexGrow={0} flexShrink={0} paddingLeft={2}>
        <Box className={classes.titleGrid} mt={2}>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="row"
            overflow="hidden"
          >
            <Box>
              <Typography
                className={classes.title}
                component="div"
                data-testid="page-title"
                noWrap
                style={{ display: 'flex' }}
                variant="h3"
              >
                {title}
              </Typography>
              <Typography color="secondary" component="h2" variant="h5">
                {subtitle}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className={classes.main}
        component="main"
        flexGrow={1}
        minHeight={0}
        position="relative"
      >
        {children}
      </Box>
    </Box>
  );
};

export default SharedViewLayout;