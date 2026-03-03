import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import Button from '@mui/material/Button';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TriangleAlert } from "lucide-react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function Setting() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <FieldGroup className="  w-full max-w-sm justify-self-center my-4">
        <FieldLabel htmlFor="switch-share" className="border-none cursor-pointer shadow-sm" >
          <Field orientation="horizontal" >
            <FieldContent>
              <FieldTitle>Dark Mode</FieldTitle>
              <FieldDescription>
                Enable the dark mode theme.
              </FieldDescription>
            </FieldContent>
            <Switch id="switch-share" className="data-[state=checked]:bg-blue-600" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="permanent-account-deletion" className="border-none cursor-pointer shadow-sm" >
          <Field orientation="vertical" >
            <FieldContent>
              <FieldTitle>Permanent Account Deletion</FieldTitle>
              <FieldDescription>
                All assets associated with this account will be deleted permanently and also account will be removed from our database.
              </FieldDescription>
            </FieldContent>
            <Button variant="outlined" color={'error'} onClick={handleClickOpen}  >Delete account</Button>
            {/* <Switch id="switch-share" className="data-[state=checked]:bg-blue-600" /> */}
          </Field>
        </FieldLabel>
        <div>
          <div className="text-center text-gray-400 text-md  " >Contact Developer : </div>
          <div className="justify-center items-center flex gap-2 text-md text-gray-400">
            <img
              src="/gmail.png"
              className="h-5 w-5 object-contain"
              loading="lazy"
            />
            <a href="mailto:sujalsaini3304@gmail.com" className="underline" >
              sujalsaini3304@gmail.com
            </a>
          </div>
        </div>
      </FieldGroup>

      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Parmanent account deletion?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <TriangleAlert className="text-red-500" />
            Warning : Account will be deleted permanently and all data associated with this account will be destroy completely , do you really want to proceed with permanent account deletion?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}
            color="primary"
          >Close</Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
