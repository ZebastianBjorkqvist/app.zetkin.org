import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  SvgIconTypeMap,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC, HTMLAttributes } from 'react';

type Option = {
  /**
   * The name of the option.
   */
  label: string;

  /**
   * Will render to the left of the option label.
   * Use an icon or a ZUIAvatar for example.
   */
  picture?: JSX.Element;

  /**
   * Subtitle of the option.
   */
  subtitle?: string;
};

type ZUIAutocompleteProps = {
  /**
   * This renders an action below the list of options, always visible.
   */
  action?: {
    icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
    label: string;
    onClick: () => void;
  };

  /**
   * If true a checkbox will be rendered next to each option.
   */
  checkboxes?: boolean;

  /**
   * The label of the autocomplete.
   */
  label: string;

  /**
   * If true, user can select multiple options.
   */
  multiple?: boolean;

  /**
   * The function that runs when an option is selected.
   * If the multiple property is "true" the newValue will be an array,
   * otherwise a single object.
   */
  onChange: (newValue: Option | Option[]) => void;

  /**
   * The options the user can select from.
   */
  options: Option[];

  /**
   * The value of the autoselect.
   * If the multiple property is "true" value should be an array,
   * otherwise a single object.
   */
  value: Option | Option[] | null;
};

const ZUIAutocomplete: FC<ZUIAutocompleteProps> = ({
  action,
  checkboxes,
  label,
  multiple,
  onChange,
  options,
  value,
}) => {
  const theme = useTheme();

  return (
    <Autocomplete
      multiple={multiple}
      onChange={(ev, newValue) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      options={options}
      PaperComponent={({ children }) => {
        return (
          <Paper
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {children}
            {action && [
              <Divider key="divider" />,
              <ListItem
                key="action"
                onClick={action.onClick}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>
                  <action.icon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="labelXlMedium">
                      {action.label}
                    </Typography>
                  }
                />
              </ListItem>,
            ]}
          </Paper>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{
            '& > label': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '1rem',
              fontWeight: '500',
              letterSpacing: '3%',
              transform: 'translate(0.875rem, 0.563rem)',
            },
            '& > label[data-shrink="true"]': {
              color: theme.palette.secondary.main,
              fontSize: '0.813rem',
              transform: 'translate(0.813rem, -0.625rem)',
            },
            '& >.MuiInputBase-root > fieldset > legend > span': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.813rem',
              fontWeight: '500',
              letterSpacing: '3%',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
            },
            '& >.MuiInputBase-root > input': {
              paddingY: '0.594rem',
            },
          }}
        />
      )}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } =
          props as HTMLAttributes<HTMLLIElement> & { key: string };
        return (
          <ListItem key={key} {...optionProps}>
            {checkboxes && (
              <Checkbox
                checked={selected}
                checkedIcon={<CheckBox fontSize="small" />}
                icon={<CheckBoxOutlineBlank fontSize="small" />}
              />
            )}
            {option.picture && (
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingRight: '0.5rem',
                }}
              >
                {option.picture}
              </Box>
            )}
            <ListItemText
              disableTypography
              primary={
                <Box
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography variant="labelXlMedium">
                    {option.label}
                  </Typography>
                </Box>
              }
              secondary={
                option.subtitle ? (
                  <Box
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Typography
                      sx={(theme) => ({
                        color: theme.palette.secondary.main,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        letterSpacing: '3%',
                      })}
                    >
                      {option.subtitle}
                    </Typography>
                  </Box>
                ) : (
                  ''
                )
              }
            />
          </ListItem>
        );
      }}
      size="small"
      sx={{
        '& .MuiIconButton-root, .MuiIconButton-root * ': {
          height: '1.25rem',
          width: '1.25rem',
        },
        '& input': {
          fontFamily: theme.typography.fontFamily,
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '3%',
        },
      }}
      value={value}
    />
  );
};

export default ZUIAutocomplete;
