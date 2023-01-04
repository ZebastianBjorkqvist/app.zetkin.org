import { Link } from '@material-ui/core';
import {
  Box,
  Button,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useState } from 'react';

import CallerInstructionsModel from '../models/CallerInstructionsModel';
import useModel from 'core/useModel';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUITextEditor from 'zui/ZUITextEditor';

interface CallerInstructionsProps {
  assignmentId: number;
  orgId: number;
}

const CallerInstructions = ({
  assignmentId,
  orgId,
}: CallerInstructionsProps) => {
  const intl = useIntl();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const model = useModel(
    (store) => new CallerInstructionsModel(store, orgId, assignmentId)
  );

  const onChange = (markdown: string) => {
    model.setInstructions(markdown);
  };

  const [key, setKey] = useState(1);
  return (
    <Paper
      //These styles are added to enable the editor to grow with the window.
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: isMobile ? '90vh' : 'calc(100vh - 300px)',
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          padding: 2,
        }}
      >
        <Typography variant="h4">
          <Msg id="pages.organizeCallAssignment.conversation.instructions.title" />
        </Typography>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            model.save();
          }}
          style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 2,
              marginTop: 4,
              minHeight: 0,
            }}
          >
            <ZUITextEditor
              key={key}
              initialValue={model.getInstructions()}
              onChange={onChange}
              placeholder={intl.formatMessage({
                id: 'pages.organizeCallAssignment.conversation.instructions.editorPlaceholder',
              })}
            />
          </Box>
          <Box alignItems="center" display="flex" justifyContent="flex-end">
            <Box marginRight={2}>
              {!model.isSaving && !model.hasUnsavedChanges && (
                <Typography>
                  <Msg id="pages.organizeCallAssignment.conversation.instructions.savedMessage" />
                </Typography>
              )}
              {!model.isSaving && model.hasUnsavedChanges && (
                <Typography component="span">
                  <Msg id="pages.organizeCallAssignment.conversation.instructions.unsavedMessage" />{' '}
                  <Link
                    color="textPrimary"
                    component="span"
                    onClick={() => {
                      showConfirmDialog({
                        onSubmit: () => {
                          model.revert();
                          //Force Slate to re-mount
                          setKey((current) => current + 1);
                        },
                        warningText: intl.formatMessage({
                          id: 'pages.organizeCallAssignment.conversation.instructions.confirm',
                        }),
                      });
                    }}
                    style={{ cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <Msg id="pages.organizeCallAssignment.conversation.instructions.revertLink" />
                  </Link>
                </Typography>
              )}
            </Box>
            <Button
              color="primary"
              disabled={!model.hasUnsavedChanges}
              type="submit"
              variant="contained"
            >
              {model.isSaving ? (
                <Msg id="pages.organizeCallAssignment.conversation.instructions.savingButton" />
              ) : (
                <Msg id="pages.organizeCallAssignment.conversation.instructions.saveButton" />
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Paper>
  );
};

export default CallerInstructions;
