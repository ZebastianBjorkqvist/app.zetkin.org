import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import MapIcon from '@mui/icons-material/Map';
import { TimePicker } from '@mui/x-date-pickers-pro';
import { Add, Close } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import EventTypeAutocomplete from 'features/events/components/EventTypeAutocomplete';
import EventTypesModel from 'features/events/models/EventTypesModel';
import LocationModal from 'features/events/components/LocationModal';
import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import { ZetkinLocation } from 'utils/types/zetkin';
import ZUIFutures from 'zui/ZUIFutures';
import { dateIsBefore, isValidDate } from 'utils/dateUtils';

interface EventShiftModalProps {
  dates: [Date, Date];
  open: boolean;
  close: () => void;
}

const EventShiftModal: FC<EventShiftModalProps> = ({ close, dates, open }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const [invalidFormat, setInvalidFormat] = useState(false);
  const [endDate, setEndDate] = useState<Date>(dates[1]);
  const [editingTypeOrTitle, setEditingTypeOrTitle] = useState(false);
  const typesModel = useModel((env) => new EventTypesModel(env, orgId));
  const locationsModel = useModel((env) => new LocationsModel(env, orgId));
  const locations = locationsModel.getLocations().data;
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const options: (
    | ZetkinLocation
    | 'CREATE_NEW_LOCATION'
    | 'NO_PHYSICAL_LOCATION'
  )[] = locations
    ? [...locations, 'NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION']
    : ['NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION'];

  const [typeId, setTypeId] = useState<number>(0);
  const [typeTitle, setTypeTitle] = useState<string>('');
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<Date>(dates[0]);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [eventLink, setEventLink] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventParticipants, setEventParticipants] = useState<number | null>(
    null
  );
  const [eventStartTime, setEventStartTime] = useState<Date>(dates[0]);
  const [eventEndTime, setEventEndTime] = useState<Date>(dates[1]);
  const [eventShifts, setEventShifts] = useState<Date[]>([
    dates[0],
    dayjs(dates[0])
      .add(dayjs(dates[1]).diff(dayjs(dates[0]), 'minute') / 2, 'minute')
      .toDate(),
  ]);

  function updateShifts(noShifts: number) {
    const newShifts: Date[] = [];
    for (let i = 0; i < noShifts; i++) {
      newShifts.push(
        dayjs(eventStartTime)
          .add(
            (dayjs(eventEndTime).diff(dayjs(eventStartTime), 'minute') /
              noShifts) *
              i,
            'minute'
          )
          .toDate()
      );
    }
    setEventShifts(newShifts);
  }

  function durationHoursMins(start: Date, end: Date) {
    const diffMinute = dayjs(end).diff(dayjs(start), 'minute');
    const diffHour = dayjs(end).diff(dayjs(start), 'hour');

    if (diffMinute < 60) {
      return (
        <Typography>
          {messages.eventShiftModal.minutes({
            no: diffMinute,
          })}
        </Typography>
      );
    } else {
      if (diffMinute % 60 == 0) {
        return (
          <Typography>
            {messages.eventShiftModal.hours({
              no: diffHour,
            })}
          </Typography>
        );
      } else {
        return (
          <Typography>
            {diffHour} {messages.eventShiftModal.hoursShort()} {diffMinute % 60}{' '}
            {messages.eventShiftModal.minutesShort()}
          </Typography>
        );
      }
    }
  }

  return (
    <Dialog fullWidth maxWidth="md" onClose={close} open={open}>
      <Box display="flex" justifyContent="space-between" padding={2}>
        <Typography variant="h4">
          {messages.eventShiftModal.header()}
        </Typography>
        <Close
          color="secondary"
          onClick={() => {
            close();
          }}
          sx={{
            cursor: 'pointer',
          }}
        />
      </Box>
      <Box display="flex">
        <Box flex={1} margin={1}>
          <Box></Box>
          <ZUIFutures
            futures={{
              types: typesModel.getTypes(),
            }}
          >
            {({ data: { types } }) => {
              return (
                <EventTypeAutocomplete
                  onBlur={() => setEditingTypeOrTitle(false)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setTypeId(newValue.id);
                      setTypeTitle(newValue.title);
                    }
                    setEditingTypeOrTitle(false);
                  }}
                  onChangeNewOption={(newValueId) => setTypeId(newValueId)}
                  onFocus={() => setEditingTypeOrTitle(true)}
                  showBorder={editingTypeOrTitle}
                  types={types}
                  typesModel={typesModel}
                  value={{ id: typeId, title: typeTitle }}
                />
              );
            }}
          </ZUIFutures>

          <TextField
            fullWidth
            label={messages.eventShiftModal.customTitle()}
            maxRows={1}
            onChange={(ev) => setEventTitle(ev.target.value)}
            sx={{ margin: 1 }}
            value={eventTitle}
          />
          <Box margin={1}>
            <DatePicker
              inputFormat="DD-MM-YYYY"
              label={messages.eventShiftModal.date()}
              onChange={(newValue) => {
                if (newValue && isValidDate(newValue)) {
                  setInvalidFormat(false);
                  setEventDate(newValue);
                  if (dateIsBefore(newValue, endDate)) {
                    setEndDate(newValue);
                  }
                } else {
                  setInvalidFormat(true);
                }
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    error={invalidFormat}
                    inputProps={{
                      ...params.inputProps,
                    }}
                    sx={{ marginBottom: '15px' }}
                  />
                );
              }}
              value={eventDate}
            />
          </Box>

          <Box alignItems="center" display="flex" margin={1}>
            <Autocomplete
              disableClearable
              fullWidth
              getOptionLabel={(option) =>
                option === 'CREATE_NEW_LOCATION'
                  ? messages.eventOverviewCard.createLocation()
                  : option === 'NO_PHYSICAL_LOCATION'
                  ? messages.eventOverviewCard.noLocation()
                  : option.title
              }
              onChange={(ev, option) => {
                if (option === 'CREATE_NEW_LOCATION') {
                  setLocationModalOpen(true);
                  return;
                }
                if (option === 'NO_PHYSICAL_LOCATION') {
                  setLocationId(null);
                  return;
                }
                const location = locations?.find(
                  (location) => location.id === option.id
                );
                if (!location) {
                  return;
                }
                setLocationId(location.id);
              }}
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={messages.eventOverviewCard.location()}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '5px',
                  }}
                />
              )}
              renderOption={(params, option) =>
                option === 'CREATE_NEW_LOCATION' ? (
                  <li {...params}>
                    <Add sx={{ marginRight: 2 }} />
                    {messages.eventOverviewCard.createLocation()}
                  </li>
                ) : option === 'NO_PHYSICAL_LOCATION' ? (
                  <li {...params}>{messages.eventOverviewCard.noLocation()}</li>
                ) : (
                  <li {...params}>{option.title}</li>
                )
              }
              value={
                locationId === null
                  ? 'NO_PHYSICAL_LOCATION'
                  : options?.find(
                      (location) =>
                        location !== 'CREATE_NEW_LOCATION' &&
                        location !== 'NO_PHYSICAL_LOCATION' &&
                        location.id === locationId
                    )
              }
            />
            <MapIcon
              color="secondary"
              onClick={() => setLocationModalOpen(true)}
              sx={{ cursor: 'pointer', marginLeft: 1 }}
            />
            <LocationModal
              locationId={locationId}
              locations={locations || []}
              model={locationsModel}
              onCreateLocation={(newLocation: Partial<ZetkinLocation>) => {
                locationsModel.addLocation(newLocation);
              }}
              onMapClose={() => {
                setLocationModalOpen(false);
              }}
              onSelectLocation={(location: ZetkinLocation) =>
                setLocationId(location.id)
              }
              open={locationModalOpen}
            />
          </Box>

          <TextField
            fullWidth
            label={messages.eventShiftModal.link()}
            maxRows={1}
            onChange={(ev) => setEventLink(ev.target.value)}
            sx={{ margin: 1 }}
            value={eventLink}
          />

          <TextField
            fullWidth
            label={messages.eventShiftModal.description()}
            maxRows={4}
            multiline
            onChange={(ev) => setEventDescription(ev.target.value)}
            sx={{ margin: 1 }}
            value={eventDescription}
          />

          <Typography margin={1} variant="subtitle2">
            {messages.eventShiftModal.participation().toUpperCase()}
          </Typography>

          <TextField
            fullWidth
            label={messages.eventShiftModal.participationDescription()}
            onChange={(ev) => {
              const val = ev.target.value;

              if (val == '') {
                setEventParticipants(null);
                return;
              }

              const intVal = parseInt(val);
              if (!isNaN(intVal) && intVal.toString() == val) {
                setEventParticipants(intVal);
              }
            }}
            sx={{ margin: 1 }}
            value={eventParticipants === null ? '' : eventParticipants}
          />
        </Box>
        <Box flex={1} margin={1}>
          <Typography margin={1} variant="subtitle2">
            {messages.eventShiftModal.event().toUpperCase()}
          </Typography>
          <Box display="flex" flex="space-between">
            <Box flex={1} margin={1}>
              <TimePicker
                ampm={false}
                inputFormat="HH:mm"
                label={messages.eventShiftModal.start()}
                onChange={(newValue) => {
                  if (newValue && isValidDate(newValue.toDate())) {
                    setInvalidFormat(false);
                    setEventStartTime(dayjs(newValue).toDate());
                  } else {
                    setInvalidFormat(true);
                  }
                }}
                open={false}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  );
                }}
                value={dayjs(eventStartTime)}
              />
            </Box>

            <Box flex={1} margin={1}>
              <TimePicker
                ampm={false}
                inputFormat="HH:mm"
                label={messages.eventShiftModal.end()}
                onChange={(newValue) => {
                  if (
                    newValue &&
                    isValidDate(newValue.toDate()) &&
                    newValue.isAfter(eventStartTime)
                  ) {
                    setInvalidFormat(false);
                    setEventEndTime(dayjs(newValue).toDate());
                  } else {
                    setInvalidFormat(true);
                  }
                }}
                open={false}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  );
                }}
                value={dayjs(eventEndTime)}
              />
            </Box>

            <Box flex={1} margin={1}>
              <Typography variant="subtitle2">
                {messages.eventShiftModal.eventDuration().toUpperCase()}
              </Typography>
              <Box>{durationHoursMins(eventStartTime, eventEndTime)}</Box>
            </Box>
          </Box>
          <Typography marginLeft={1} marginTop={1} variant="subtitle2">
            {messages.eventShiftModal.shiftsHeader().toUpperCase()}
          </Typography>
          <Box
            alignItems="center"
            display="flex"
            marginBottom={1}
            marginLeft={1}
          >
            <Typography flex={3}>
              {messages.eventShiftModal.shifts({ no: eventShifts.length })}
            </Typography>
            <Box flex={4}>
              <Button
                onClick={() => {
                  updateShifts(eventShifts.length + 1);
                }}
                startIcon={<Add />}
                sx={{ margin: 1 }}
                variant="outlined"
              >
                {messages.eventShiftModal.addShift().toUpperCase()}
              </Button>
              {eventShifts.length > 2 && (
                <Button
                  onClick={() => {
                    updateShifts(2);
                  }}
                  sx={{ margin: 1 }}
                  variant="outlined"
                >
                  {messages.eventShiftModal.clear().toUpperCase()}
                </Button>
              )}
            </Box>
          </Box>
          {eventShifts.map((shift, index) => {
            return (
              <Box key={index} alignItems="center" display="flex" margin={1}>
                <TimePicker
                  ampm={false}
                  inputFormat="HH:mm"
                  label={messages.eventShiftModal.shiftStart({ no: index + 1 })}
                  onChange={(newValue) => {
                    if (
                      newValue &&
                      isValidDate(newValue.toDate()) &&
                      newValue.isAfter(eventShifts[index - 1]) &&
                      (eventShifts.length - index > 1
                        ? newValue.isBefore(eventShifts[index + 1])
                        : newValue.isBefore(eventEndTime))
                    ) {
                      setInvalidFormat(false);
                      setEventShifts([
                        ...eventShifts.slice(0, index),
                        dayjs(newValue).toDate(),
                        ...eventShifts.slice(index + 1),
                      ]);
                    } else {
                      setInvalidFormat(true);
                    }
                  }}
                  open={false}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                        }}
                      />
                    );
                  }}
                  value={dayjs(shift)}
                />
                <Box margin={1}>
                  <Typography variant="subtitle2">
                    {messages.eventShiftModal.shiftDuration().toUpperCase()}
                  </Typography>
                  {durationHoursMins(
                    shift,
                    eventShifts.length - index > 1
                      ? eventShifts[index + 1]
                      : eventEndTime
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-end"
        margin={1}
      >
        <Typography color="secondary" margin={1}>
          {messages.eventShiftModal.noEvents({ no: eventShifts.length })}
        </Typography>
        <Box margin={1}>
          <Button size="large" variant="text">
            {messages.eventShiftModal.draft().toUpperCase()}
          </Button>
        </Box>
        <Box margin={1}>
          <Button size="large" variant="contained">
            {messages.eventShiftModal.publish().toUpperCase()}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EventShiftModal;
