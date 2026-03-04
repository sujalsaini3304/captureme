import { LogOut, Menu, Settings, Upload, User } from "lucide-react";
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
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from '@mui/material/Avatar';

import { SignOutButton, useUser } from "@clerk/clerk-react";
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
    const { user, isLoaded } = useUser();

    const [open, setOpen] = React.useState(false);
    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const toggleDrawer = (state) => setOpen(state);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        console.log("Selected files:", files);
        e.target.value = null;
    };

    /* ================= DRAWER ================= */

    /* ================= DRAWER ================= */

    const DrawerList = (
        <Box
            sx={{ width: 280 }}
            role="presentation"
            className="h-full bg-white text-gray-900 dark:bg-[#0f172a] dark:text-gray-200 transition-colors duration-300"
        >
            <List>

                {/* ── USER PROFILE ── */}
                {isLoaded && (
                    <ListItem disablePadding>
                        <ListItemButton
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                borderRadius: "12px",
                                overflow: "hidden",   // clip the whole row
                                mx: 1, my: 0.5,
                            }}
                        >
                            {/* Avatar */}
                            <Box sx={{ flexShrink: 0 }}>
                                {user?.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt="profile"
                                        className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                    />
                                ) : (
                                    <Avatar sx={{ width: 40, height: 40 }}>
                                        {user?.fullName?.charAt(0).toUpperCase()}
                                    </Avatar>
                                )}
                            </Box>

                            {/* User Info */}
                            <ListItemText
                                primary={user?.fullName || "User"}
                                secondary={user?.primaryEmailAddress?.emailAddress}
                                sx={{
                                    overflow: "hidden",
                                    minWidth: 0,
                                    flex: "1 1 0",
                                    m: 0,
                                }}
                                primaryTypographyProps={{
                                    title: user?.fullName,
                                    sx: {
                                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                        fontWeight: 600,
                                        lineHeight: 1.3,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                        width: "100%",
                                        color: "hsl(var(--foreground))",
                                    },
                                }}
                                secondaryTypographyProps={{
                                    title: user?.primaryEmailAddress?.emailAddress,
                                    sx: {
                                        fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                        lineHeight: 1.3,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                        width: "100%",
                                        color: "hsl(var(--muted-foreground))",
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                )}

            </List>

            <Divider
                sx={{ borderColor: "hsl(var(--border))" }}
                className="opacity-20"
            />

            {/* ── NAVIGATION ── */}
            <List>

                {/* SETTINGS */}
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/setting"
                        onClick={() => toggleDrawer(false)}
                        sx={{ borderRadius: "12px", mx: 1, my: 0.5 }}
                        className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <ListItemIcon sx={{ minWidth: "auto" }}>
                            <Settings size={20} className="text-foreground" />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>

                {/* LOGOUT */}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            setLogoutOpen(true);
                            toggleDrawer(false);
                        }}
                        sx={{ borderRadius: "12px", mx: 1, my: 0.5 }}
                        className="flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950 transition"
                    >
                        <ListItemIcon sx={{ minWidth: "auto" }}>
                            <LogOut size={20} className="text-red-600" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{ className: "text-red-600" }}
                        />
                    </ListItemButton>
                </ListItem>

            </List>
        </Box>
    );
    /* ================= NAVBAR ================= */

    return (
        <>
            <div
                className="fixed top-0 left-0 w-full h-14 
        bg-white text-gray-900 shadow-sm
        dark:bg-[#0f172a] dark:text-gray-200
        border-b border-gray-200 dark:border-gray-800
        transition-colors duration-300
        z-50 flex items-center px-4 "
            >

                {/* MOBILE MENU */}
                <div
                    onClick={() => toggleDrawer(true)}
                    className="p-1 cursor-pointer sm:hidden mr-2 hover:text-blue-600"
                >
                    <Menu size={22} />
                </div>

                {/* LOGO */}
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <img
                        src="/icon.png"
                        className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                        alt="logo"
                    />
                    <span>
                        Snap<span className="text-blue-600">Dock</span>
                    </span>
                </div>

                {/* DESKTOP MENU */}
                <div className="hidden sm:flex items-center gap-4 ml-auto">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="
                            cursor-pointer
                              p-2 rounded-full
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              transition-all duration-200
                              flex items-center justify-center
                            "
                    >
                        <Upload size={20} />
                    </button>

                    <Link to="/setting">
                        <button
                            className="
                            cursor-pointer
                              p-2 rounded-full
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              transition-all duration-200
                              flex items-center justify-center
                            "
                        >
                            <Settings size={20} />
                        </button>
                    </Link>

                    <button
                        onClick={() => setLogoutOpen(true)}
                        className="
                            cursor-pointer
                              p-2 rounded-full
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              transition-all duration-200
                              flex items-center justify-center
                            "
                    >
                        <LogOut size={20} />
                    </button>

                </div>

                {/* MOBILE UPLOAD */}
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="sm:hidden ml-auto cursor-pointer hover:text-blue-600"
                >
                    <Upload size={20} />
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                />
            </div>

            {/* ================= LOGOUT MODAL ================= */}

            <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
                <AlertDialogContent className="bg-white dark:bg-[#1e293b] dark:text-gray-200 rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to logout?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="dark:bg-gray-800 dark:text-white">
                            Cancel
                        </AlertDialogCancel>

                        <SignOutButton>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => setLogoutOpen(false)}
                            >
                                Logout
                            </AlertDialogAction>
                        </SignOutButton>

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