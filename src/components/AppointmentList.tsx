import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  List,
  Typography,
} from '@material-ui/core';
import { formatDateRange } from 'utils/date';
import { practitionersSelectors } from 'store/practitioners';
import { patientsSelectors } from 'store/patients';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

const AppointmentList = ({
  practitioners,
  patients,
  appointments,
  handleDeleteAppointment,
}) => {
  // utils functions
  const getAppointmentPractitioner = (id) =>
    practitionersSelectors.selectById(practitioners, id);
  const getAppointmentPatient = (id) =>
    patientsSelectors.selectById(patients, id);
  const getTimeSlotDatacy = (id: string) => `timeslot-${id}`;

  return (
    appointments && (
      <List className="appointments" datacy="timeslot-list">
        {appointments.map((item) => {
          const practitioner = getAppointmentPractitioner(item.practitionerId);
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
    )
  );
};

export default AppointmentList;
