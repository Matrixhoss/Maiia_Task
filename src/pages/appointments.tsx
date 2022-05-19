import AppointmentForm from 'components/AppointmentForm';
import AppointmentList from 'components/AppointmentList';
import Section from 'components/Section';
import AllTasks from 'components/AllTasks';
import {
  addAppointments,
  appointmentsSelectors,
  deleteAppointments,
  getAppointments,
  updateAppointments,
} from 'store/appointments';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatients } from 'store/patients';
import { getPractitioners } from 'store/practitioners';
import { getAvailabilities } from 'store/availabilities';
import EditDialog from 'components/EditDialog';

const AppointmentsPage = () => {
  // const
  const dispatch = useDispatch();

  // states
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState({
    id: 0,
    patientId: 0,
    practitionerId: 0,
    startDate: new Date(),
    endDate: new Date(),
  });

  // on mount
  useEffect(() => {
    dispatch(getPractitioners());
    dispatch(getPatients());
    dispatch(getAppointments());
  }, []);

  const getAvailabilitiesFormAPI = (practitionerId) => {
    dispatch(getAvailabilities(practitionerId));
  };

  const addNewAppointment = (data) => {
    dispatch(addAppointments(data));
  };

  const handleDeleteAppointment = (id) => {
    dispatch(deleteAppointments(id));
  };

  const handleEditAppointment = (data) => {
    setOpenDialog(false);
    dispatch(updateAppointments(data));
  };

  const handleOpenEditForm = (item) => {
    setOpenDialog(true);
    getAvailabilitiesFormAPI(item.practitionerId);
    setEditItem(item);
  };

  // Redux Store Data
  const practitioners = useSelector((state) => state.practitioners);
  const patients = useSelector((state) => state.patients);
  const availabilities = useSelector((state) => state.availabilities);
  const appointments = useSelector((state) =>
    appointmentsSelectors.selectAll(state.appointments),
  );

  return (
    <div className="appointment page">
      <h1>Appointments</h1>
      <Section
        name="instructions"
        title="Instructions"
        className="instructions"
      >
        <p>
          To book an appointment, we have to set the following required
          informations: the practitioner, the patient and date.
        </p>
        <p>
          The backend implementation is already done, you have all necessary
          routes to work and implement requested features.
        </p>
        <p>
          In first you have to create the appointment form. You are free to use
          the validation form that you want like Formik or React-hook-form.
        </p>
        <p>
          In the second time, you will show the list of all created appointments
          on the right side
        </p>
        <p>
          We don't have mock ups, you have to design your own solution and
          propose a simple workflow for users. It also should be responsive.
        </p>
        <p>
          We expect you to implement two bonus features: you can choose among
          the suggested features in the bonus section or choose to implement one
          of your choice.
        </p>
      </Section>
      <AllTasks className="goals" />
      <div className="structurePage">
        <Section
          name="appointment-form"
          title="Appointment Form"
          className="appointment__form"
        >
          <AppointmentForm
            getAvailabilities={getAvailabilitiesFormAPI}
            practitioners={practitioners}
            patients={patients}
            availabilities={availabilities}
            addNewAppointment={addNewAppointment}
            type="new"
          />
        </Section>
        <Section
          name="appointment-list"
          title="Appointment List"
          className="appointment__list"
        >
          <AppointmentList
            practitioners={practitioners}
            patients={patients}
            appointments={appointments}
            handleDeleteAppointment={handleDeleteAppointment}
            handleEditAppointment={handleOpenEditForm}
          />
        </Section>
        <EditDialog open={openDialog} setOpen={setOpenDialog}>
          <AppointmentForm
            getAvailabilities={getAvailabilitiesFormAPI}
            practitioners={practitioners}
            patients={patients}
            availabilities={availabilities}
            addNewAppointment={addNewAppointment}
            defaultValue={editItem}
            handleEditAppointment={handleEditAppointment}
            type={'edit'}
          />
        </EditDialog>
      </div>
    </div>
  );
};

AppointmentsPage.pageTitle = 'Appointments';
AppointmentsPage.pageSubtitle = "Let's get to work 👩‍💻";

export default AppointmentsPage;
