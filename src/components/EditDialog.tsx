import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

const EditDialog = ({ open, setOpen, children }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'md'} fullWidth>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default EditDialog;
