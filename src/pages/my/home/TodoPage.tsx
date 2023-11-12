import * as React from 'react';
import Box from '@mui/material/Box';
import CallAssignments from './CallAssignments';
import EventIcon from '@mui/icons-material/Event';
import { CheckBoxSharp } from '@mui/icons-material';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface TaskDisplayData {
  id: number;
  description: string;
  expectedTime: number;
  dueDate: string;
}

function createTaskDisplayData(
  id: number,
  description: string,
  expectedTime: number,
  dueDate: string
): TaskDisplayData {
  return {
    id,
    description,
    expectedTime,
    dueDate,
  };
}

const taskRows = [
  createTaskDisplayData(
    1,
    'Protest against crapitalism',
    60,
    new Date().toLocaleDateString(undefined, {
      month: 'numeric',
      day: 'numeric',
    })
  ),
  createTaskDisplayData(
    2,
    'Buy candy',
    30,
    new Date().toLocaleDateString(undefined, {
      month: 'numeric',
      day: 'numeric',
    })
  ),
  createTaskDisplayData(
    3,
    'Read a book',
    120,
    new Date().toLocaleDateString(undefined, {
      month: 'numeric',
      day: 'numeric',
    })
  ),
];

const taskColumns: GridColDef[] = [
  {
    field: 'description',
    headerName: 'Description',
    disableColumnMenu: true,
    minWidth: 130,
  },
  {
    field: 'expectedTime',
    type: 'number',
    headerName: 'Estimate',
    disableColumnMenu: true,
  },
  {
    field: 'dueDate',
    headerName: 'Due',
    type: 'number',
    disableColumnMenu: true,
  },
];

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
  return (
    <Box
      sx={{
        pl: '1em',
        pr: '1em',
      }}
    >
      <h1>My Todo</h1>

      <Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '5px',
            margin: 2,
          }}
        >
          <EventIcon />
          <h2>Events</h2>
        </Box>

        <p>TODO: Add events here</p>
      </Box>

      <Box>
        <CallAssignments />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '5px',
            margin: 2,
          }}
        >
          <CheckBoxSharp />
          <h2>Tasks</h2>
        </Box>

        <DataGrid
          rows={taskRows}
          columns={taskColumns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Page;