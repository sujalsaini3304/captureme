import LockOutlineIcon from '@mui/icons-material/LockOutline';

const Footer = () => {
    return (
        <>
            <div className="h-14 flex flex-col justify-center items-center text-gray-400 font-light border-t">
                {/* <div>developed - Sujal Kumar Saini</div> */}
                <div className=' text-md items-center flex gap-1 justify-center font-light  text-gray-400'>
                    {/* <ShieldCheck size={20} /> */}
                    <LockOutlineIcon color='primary' sx={{ fontSize: 20 }} />
                    Encrypted & Secure Vault
                </div>
                <div className=''>&copy;copyright - {new Date().getFullYear()}</div>
            </div>
        </>
    )
}

export default Footer