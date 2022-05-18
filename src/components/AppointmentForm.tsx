import { Button, MenuItem, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import React from 'react';
import { availabilitiesSelectors } from 'store/availabilities';
import { patientsSelectors } from 'store/patients';
import { practitionersSelectors } from 'store/practitioners';
import { formatDateRange, formatDateRangeEdit } from 'utils/date';
import {
  Appointment,
  Patient,
  Availability,
  Practitioner,
} from '@prisma/client';
import * as yup from 'yup';

interface IProps {
  patients: any;
  availabilities: any;
  practitioners: any;
  getAvailabilities: any;
  addNewAppointment: any;
  handleEditAppointment?: any;
  defaultValue?: Appointment;
  type: string;
}
interface FormValues {
  practitionerId: any;
  patientId: any;
  availability: any;
}

const AppointmentForm: React.FC<IProps> = ({
  patients,
  availabilities,
  practitioners,
  getAvailabilities,
  addNewAppointment,
  handleEditAppointment,
  defaultValue,
  type,
}) => {
  const allPatients = patientsSelectors?.selectAll(patients);
  const allPractitioners = practitionersSelectors?.selectAll(practitioners);
  const allAvailabilities = availabilitiesSelectors?.selectAll(availabilities);

  const initialValues: FormValues = defaultValue
    ? {
        practitionerId: defaultValue.practitionerId,
        availability: `${defaultValue.startDate} ${defaultValue.endDate}`,
        patientId: defaultValue.patientId,
      }
    : {
        practitionerId: '',
        availability: '',
        patientId: '',
      };

  const validationSchema = yup.object({
    practitionerId: yup.string().required('Please Select the practitioner'),
    patientId: yup.string().required('Please Select the patient'),
    availability: yup.string().required('Please Select the availability'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleAddAppointment(values, resetForm);
    },
  });

  const handlePractitionerChange = (e) => {
    formik.handleChange(e);
    getAvailabilities(e.target.value);
  };

  const handleAddAppointment = (data, resetForm) => {
    const date = data.availability.split(' ');
    const startDate = date[0];
    const endDate = date[1];
    data = {
      patientId: data.patientId,
      practitionerId: data.practitionerId,
      startDate,
      endDate,
    };
    type === 'edit'
      ? handleEditAppointment({ ...defaultValue, ...data })
      : addNewAppointment(data);
    resetForm();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        select
        id="practitionerId"
        name="practitionerId"
        label="Practitioners"
        variant="outlined"
        value={formik.values.practitionerId}
        onChange={(e) => handlePractitionerChange(e)}
        error={
          formik.touched.practitionerId && Boolean(formik.errors.practitionerId)
        }
        helperText={
          formik.touched.practitionerId && formik.errors.practitionerId
        }
        style={{ margin: '10px 0px' }}
      >
        {allPractitioners ? (
          allPractitioners.map((p, i) => (
            <MenuItem key={i} value={p.id}>
              {p.firstName} {p.lastName}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="none">-- No Practitioners to show</MenuItem>
        )}
      </TextField>
      <TextField
        fullWidth
        select
        id="patientId"
        name="patientId"
        label="Patients"
        variant="outlined"
        value={formik.values.patientId}
        onChange={formik.handleChange}
        error={formik.touched.patientId && Boolean(formik.errors.patientId)}
        helperText={formik.touched.patientId && formik.errors.patientId}
        style={{ margin: '10px 0px' }}
      >
        {allPatients ? (
          allPatients.map((p, i) => (
            <MenuItem key={i} value={p.id}>
              {p.firstName} {p.lastName}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="none">-- No Patients to show</MenuItem>
        )}
      </TextField>
      <TextField
        fullWidth
        select
        id="availability"
        name="availability"
        label="Availabilities"
        variant="outlined"
        value={formik.values.availability}
        onChange={formik.handleChange}
        error={
          formik.touched.availability && Boolean(formik.errors.availability)
        }
        helperText={formik.touched.availability && formik.errors.availability}
        style={{ margin: '10px 0px' }}
      >
        {allAvailabilities ? (
          allAvailabilities.map((a) => (
            <MenuItem key={a.id} value={`${a.startDate} ${a.endDate}`}>
              {formatDateRange({ from: a.startDate, to: a.endDate })}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="none"> -- No time slot available</MenuItem>
        )}
      </TextField>

      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        style={{ padding: '15px 0px' }}
      >
        Submit
      </Button>
    </form>
  );
};

export default AppointmentForm;
