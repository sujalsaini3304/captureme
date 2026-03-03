import { LogOut, Menu, Settings, Upload, User, X } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const toggleDrawer = (newOpen) => {
        setOpen(newOpen);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        console.log("Selected files:", files);
        e.target.value = null;
    };

    /* ---------------- Drawer Content ---------------- */
    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <User />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />

            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/setting"
                        onClick={() => toggleDrawer(false)}
                    >
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText primary="Setting" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            setLogoutOpen(true);
                            toggleDrawer(false);
                        }}
                    >
                        <ListItemIcon>
                            <LogOut />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <div className="fixed top-0 left-0 w-full h-14 bg-white shadow-sm z-50 flex items-center px-4">

                {/* Mobile Menu Button */}
                <div
                    onClick={() => toggleDrawer(true)}
                    className="p-1 cursor-pointer sm:hidden"
                >
                    <Menu size={24} />
                </div>

                {/* Logo */}
                <div className="flex items-center gap-2 mx-auto sm:mx-0 text-xl font-semibold">
                    <img
                        src="/icon.png"
                        className="h-8 w-8 object-contain"
                        loading="lazy"
                        alt="logo"
                    />
                    <span>CaptureMe</span>
                </div>

                {/* ================= DESKTOP MENU ================= */}
                <div className="hidden sm:flex items-center gap-6 ml-auto">

                    {/* Upload */}
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className="cursor-pointer hover:text-blue-600"
                    >
                        <Upload size={22} />
                    </div>

                    {/* Profile */}
                    <div className="cursor-pointer hover:text-blue-600">
                        <User size={22} />
                    </div>

                    {/* Setting */}
                    <Link to="/setting" className="hover:text-blue-600">
                        <Settings size={22} />
                    </Link>

                    {/* Logout */}
                    <div
                        onClick={() => setLogoutOpen(true)}
                        className="cursor-pointer hover:text-red-600"
                    >
                        <LogOut size={22} />
                    </div>
                </div>

                {/* Mobile Upload */}
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="p-1 cursor-pointer sm:hidden ml-auto"
                >
                    <Upload size={22} />
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                />
            </div>

            {/* ================= LOGOUT DIALOG ================= */}
            <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle >Logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to logout?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel variant="text" className="cursor-pointer"  >Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                console.log("Logout logic here");
                                setLogoutOpen(false);
                            }}
                            className="bg-red-600 hover:bg-red-700 cursor-pointer"
                        >
                            Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ================= DRAWER ================= */}
            <Drawer open={open} onClose={() => toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </>
    );
};

export default Navbar;