import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const appointments = await prisma.appointment.findMany();
      res.status(200).json(appointments);
      break;
    case 'POST':
      {
        // to use the same variable names
        const { patientId, practitionerId, startDate, endDate } = JSON.parse(
          req.body,
        );
        const appointment = await prisma.appointment.create({
          data: {
            patientId: parseInt(patientId),
            practitionerId: parseInt(practitionerId),
            startDate: startDate,
            endDate: endDate,
          },
        });
        res.status(200).json(appointment);
      }
      break;
    case 'PATCH':
      {
        // to use the same variable names
        const { patientId, practitionerId, startDate, endDate, id } = req.body;
        const appointment = await prisma.appointment.update({
          where: { id },
          data: {
            patientId: parseInt(patientId),
            practitionerId: parseInt(practitionerId),
            startDate: startDate,
            endDate: endDate,
          },
        });
        res.status(200).json(appointment);
      }
      break;
    case 'DELETE':
      {
        // to use the same variable names
        const { id } = req.body;
        await prisma.appointment.delete({
          where: { id },
        });
        res.status(200).json({ id });
      }
      break;
  }
};
