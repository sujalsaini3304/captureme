import React, { useEffect } from 'react'
import GridBox from '../components/created_ui/GridBox'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Cross, Search, X } from 'lucide-react';
import { AlertDescription, AlertTitle } from "@/components/ui/alert"
import useStore from '../../store';


function PaginationRounded() {
  return (
    <Stack spacing={2}>
      <Pagination
        count={10}
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "inherit",
            borderColor: "rgba(255,255,255,0.15)",
            "html.dark &": {
              color: "#f3f4f6",
              borderColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            },
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            "html.dark &": {
              backgroundColor: "#ffffff",
              color: "#0f1117",
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            },
          },
          "& .MuiPaginationItem-ellipsis": {
            "html.dark &": {
              color: "#9ca3af",
            },
          },
        }}
      />
    </Stack>
  );
}

function AlertBasic() {
  return (
    <div className='mt-2 flex justify-center sm:justify-end mx-4'>
      <Alert severity='success' className="max-w-md w-full">
        <AlertTitle>Uploaded successfully</AlertTitle>
        <AlertDescription>
          Image(s) uploaded successfully.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function AlertDestructive() {
  return (
    <div className='mt-2 flex justify-center sm:justify-end mx-4'>
      <Alert severity="error" className="max-w-md w-full">
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>
          Image(s) upload failed , please try again.
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
  const { isUploading ,  setIsUploading , isUploadErrorOccured , isUploadSuccessfull } =  useStore();


  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  

  useEffect(()=>{
    if(isUploading){
      setOpen(true);
    }
    else{
      setOpen(false);
    }
  },[isUploading])



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
    <div className="pt-4 min-h-screen bg-white text-gray-900 dark:bg-[#0f172a] dark:text-gray-200 transition-colors duration-300">

      {
        isUploadSuccessfull && !isUploadErrorOccured && (
          <AlertBasic/>
        )
      }
      {
        !isUploadSuccessfull && isUploadErrorOccured && (
          <AlertDestructive/>
        )
      }

      <Backdrop
        sx={(theme) => ({
          gap: 1,
          color: '#fff',
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={open}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" size={20} />
        <span>Please Wait ...</span>
      </Backdrop>

      {/* { !isUploadErrorOccured && !isUploadSuccessfull && <Alert
        severity="warning"
        className=' mx-4'
      >
        This website is in development mode. Please contact developer.
      </Alert>} */}

      {images.length != 0 && (
        <div>
          <GridBox images={images} />
          <div className='flex pb-6 mt-6 justify-center sm:justify-end sm:mr-2'>
            <PaginationRounded />
          </div>
        </div>
      )}

      {images.length == 0 && (
        <div className="flex flex-col gap-2 items-center justify-center h-screen text-center text-gray-400 dark:text-gray-500">
          <Search size={42} />
          Nothing here
        </div>
      )}

    </div>
  )
}

export default Dashboard