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
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Setting() {
  const [open, setOpen] = React.useState(false);
  const [dark, setDark] = React.useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccountDelete = async () => {
    try {
      setIsDeleting(true);
      const token = await getToken({ template: "SnapDock", skipCache: true });

      await axios.delete(
        `${import.meta.env.VITE_EXPRESS_SERVER_ENDPOINT}/api/account`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Account deleted successfully - redirect to home
      window.location.href = "/";
      
    } catch (error) {
      console.error("Account deletion error:", error);
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
      setOpen(false);
    }
  };


  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };



  return (
    <><div className="dark:bg-gray-900">

      <FieldGroup
        className="w-full max-w-lg  justify-self-center 
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-200
        border-gray-200 dark:border-gray-700
        p-6 h-screen
        transition-colors duration-300"
      >

        {/* ================= Dark Mode Toggle ================= */}
        <FieldLabel
          htmlFor="switch-share"
          className="border-none cursor-pointer"
        >
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Dark Mode</FieldTitle>
              <FieldDescription>
                Enable the dark mode theme.
              </FieldDescription>
            </FieldContent>

            <Switch
              id="switch-share"
              checked={dark}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-white"
            />

          </Field>
        </FieldLabel>

        {/* ================= Divider (Safe Version) ================= */}
        <div className="border-t border-gray-200 dark:border-gray-700 " />

        {/* ================= Permanent Account Deletion ================= */}
        <FieldLabel
          htmlFor="permanent-account-deletion"
          className="border-none cursor-pointer"
        >
          <Field orientation="vertical">
            <FieldContent>
              <FieldTitle>Permanent Account Deletion</FieldTitle>
              <FieldDescription>
                All assets associated with this account will be deleted permanently and also account will be removed from our database.
              </FieldDescription>
            </FieldContent>

            <Button
              variant="outlined"
              color="error"
              onClick={handleClickOpen}
            >
              Delete account
            </Button>

          </Field>
        </FieldLabel>

        {/* ================= Contact Section ================= */}
        <div className="mt-4">
          <div className="text-center text-gray-400 dark:text-gray-500 text-md">
            Contact Developer :
          </div>

          <div className="justify-center items-center flex gap-2 text-md text-gray-400 dark:text-gray-400">
            <img
              src="/gmail.png"
              className="h-5 w-5 object-contain"
              loading="lazy"
            />
            <a
              href="mailto:sujalsaini3304@gmail.com"
              className="underline hover:text-blue-600 transition-colors"
            >
              sujalsaini3304@gmail.com
            </a>
          </div>
        </div>

      </FieldGroup>

      {/* ================= Dialog ================= */}
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          className: "rounded-2xl shadow-2xl",
          sx: {
            bgcolor: "background.paper",
            backgroundImage: "none",
            // Dark mode via MUI's colorScheme-aware theming
            ".dark &, [data-theme='dark'] &": {
              bgcolor: "#111827", // gray-900
              color: "#e5e7eb",   // gray-200
            },
          },
        }}
        // Ensure the backdrop portal inherits dark styles
        slotProps={{
          backdrop: {
            sx: {
              ".dark ~ &": { bgcolor: "rgba(0,0,0,0.7)" },
            },
          },
        }}
      >
        <DialogTitle className="flex items-center gap-3">
          <TriangleAlert className="text-red-500 flex-shrink-0" size={22} />
          <span>Permanent account deletion?</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              ".dark &, [data-theme='dark'] &": { color: "#9ca3af" }, // gray-400
            }}
            className="text-sm text-gray-600"
          >
            Account will be deleted permanently and all data associated with this
            account will be destroyed completely.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button
            sx={{
              ".dark &, [data-theme='dark'] &": { color: "#e5e7eb" },
            }}
            onClick={handleClose}
            disabled={isDeleting}
          >
            Close
          </Button>
          <Button 
            onClick={handleAccountDelete} 
            variant="outlined" 
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  )
}


