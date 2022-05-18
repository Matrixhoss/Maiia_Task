import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  TextField,
  Typography,
} from '@material-ui/core';
import { formatDateRange } from 'utils/date';
import { practitionersSelectors } from 'store/practitioners';
import { patientsSelectors } from 'store/patients';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { useState } from 'react';

const AppointmentList = ({
  practitioners,
  patients,
  appointments,
  handleDeleteAppointment,
  handleEditAppointment,
}) => {
  //state
  const [search, setSearch] = useState('');

  // utils functions
  const getAppointmentPractitioner = (id) =>
    practitionersSelectors.selectById(practitioners, id);
  const getAppointmentPatient = (id) =>
    patientsSelectors.selectById(patients, id);
  const getTimeSlotDatacy = (id: string) => `timeslot-${id}`;

  const searchArray = (array, search) => {
    if (!search) return array;

    return array.filter((a) => {
      const patient = getAppointmentPatient(a.patientId);
      const practitioner = getAppointmentPractitioner(a.practitionerId);

      return (
        patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
        practitioner.firstName.toLowerCase().includes(search.toLowerCase()) ||
        practitioner.lastName.toLowerCase().includes(search.toLowerCase())
      );
    });
  };

  return (
    appointments && (
      <>
        <TextField
          value={search}
          placeholder="Search by name"
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
        />
        <List className="appointments" datacy="timeslot-list">
          {searchArray(appointments, search).map((item) => {
            const practitioner = getAppointmentPractitioner(
              item.practitionerId,
            );
            const patient = getAppointmentPatient(item.patientId);
            return (
              <Card
                key={item.id}
                datacy={getTimeSlotDatacy(item.id)}
                className="appointment__item btn"
              >
                <CardHeader
                  avatar={<CalendarTodayIcon />}
                  title={
                    <Typography datacy={`${getTimeSlotDatacy(item.id)}-range`}>
                      {formatDateRange({
                        from: new Date(item.startDate),
                        to: new Date(item.endDate),
                      })}
                    </Typography>
                  }
                />
                <CardContent>
                  <Typography>
                    Practitioner :
                    {`${practitioner?.firstName} ${practitioner?.lastName}`}
                  </Typography>
                  <Typography>
                    Patient : {`${patient?.firstName} ${patient?.lastName}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    onClick={() => handleEditAppointment(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    style={{ backgroundColor: '#f44949', color: '#fff' }}
                    onClick={() => {
                      handleDeleteAppointment(item.id);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </List>
      </>
    )
  );
};

export default AppointmentList;
