import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { MenuItem, TextField } from '@mui/material';

import getStandaloneQueries from 'utils/fetching/getStandaloneQueries';
import { PersonQueryViewColumn } from 'features/views/components/types';
import ZUIQuery from 'zui/ZUIQuery';

interface PersonQueryColumnConfigFormProps {
  column: PersonQueryViewColumn;
  onChange: (config: PersonQueryViewColumn) => void;
}

const PersonQueryColumnConfigForm: FunctionComponent<
  PersonQueryColumnConfigFormProps
> = ({ column, onChange }) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;

  return (
    <ZUIQuery
      queries={{
        standaloneQueriesQuery: useQuery(
          ['standaloneQueries', orgId],
          getStandaloneQueries(orgId as string)
        ),
      }}
    >
      {({ queries: { standaloneQueriesQuery } }) => {
        const onQueryChange = (queryId: number) => {
          onChange({
            ...column,
            config: {
              query_id: queryId,
            },
            title:
              standaloneQueriesQuery.data.find((query) => query.id === queryId)
                ?.title || '',
          });
        };
        return (
          <TextField
            variant="standard"
            fullWidth
            label={intl.formatMessage({
              id: 'misc.views.columnDialog.editor.fieldLabels.smartSearch',
            })}
            margin="normal"
            onChange={(ev) =>
              onQueryChange(ev.target.value as unknown as number)
            }
            select
            value={column.config?.query_id || ''}
          >
            {standaloneQueriesQuery.data.map((query) => (
              <MenuItem key={query.id} value={query.id}>
                {query.title}
              </MenuItem>
            ))}
          </TextField>
        );
      }}
    </ZUIQuery>
  );
};

export default PersonQueryColumnConfigForm;
