import React from 'react'
import GridBox from '../components/created_ui/GridBox'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Cross, Search, X } from 'lucide-react';
import { AlertDescription, AlertTitle } from "@/components/ui/alert"

function PaginationRounded() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} shape="rounded" />
    </Stack>
  );
}

function AlertBasic() {
  return (
    <div className='mt-2 flex justify-center sm:justify-end mx-4 '>
      <Alert severity='success' className="max-w-md w-full">
        <AlertTitle>Uploaded successfully
        </AlertTitle>
        <AlertDescription>
          Image(s) uploaded successfully.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function AlertDestructive() {
  return (
    <div className='mt-2 flex justify-center sm:justify-end  mx-4'>
      <Alert severity="error" className="max-w-md w-full">
        {/* <AlertCircleIcon /> */}
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>
          Image upload failed , please try again.
        </AlertDescription>
      </Alert>
    </div>
  )
}

const Dashboard = () => {
  const images = [
    "https://picsum.photos/300?1",
    "https://picsum.photos/300?2",
    "https://picsum.photos/300?3",
    "https://picsum.photos/300?4",
    "https://picsum.photos/300?5",
    "https://picsum.photos/300?6",
    "https://picsum.photos/300?7",
    "https://picsum.photos/300?8",
    "https://picsum.photos/300?9",
    "https://picsum.photos/300?10",
  ];

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    if (open) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [open]);

  return (
    <div>
      {/* <AlertDestructive/> */}
      {/* <AlertBasic/> */}

      <Backdrop
        sx={(theme) => ({ gap: 1, color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherited" size={20} />
        <span>Please Wait ...</span>
      </Backdrop>

      <Alert onClick={handleOpen} severity="warning" className='mt-2 mx-4'>This website is in development mode. Please contact developer.</Alert>

      {images.length != 0 &&
        (
          <div>
            <GridBox images={images} />
            <div className='flex mb-6 mt-6 justify-center sm:justify-end sm:mr-2' >
              <PaginationRounded />
            </div>
          </div>
        )
      }
      {images.length == 0 && <div className="flex text-gray-400 flex-col gap-2 items-center justify-center h-screen  text-center">
        <Search size={42} />
        Nothing here
      </div>
      }
    </div>
  )
}

export default Dashboard