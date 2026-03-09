import { LogOut, Menu, Settings, Upload, ListChecks, X } from "lucide-react";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from '@mui/material/Avatar';
import pLimit from "p-limit";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { auth } from "../../../firebase.config";
import { getIdToken, onAuthStateChanged, signOut } from "firebase/auth";
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
import useStore from "../../../store";


const Navbar = () => {
    const MAX_FILES = 10;
    const { setIsUploading, setIsUploadSuccessfull, setIsUploadErrorOccured, selectionMode, setSelectionMode } = useStore();
    const limit = pLimit(5);
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const fileInputRef = React.useRef(null);
    const [firebaseUser, setFirebaseUser] = React.useState(auth.currentUser);

    const toggleDrawer = (state) => setOpen(state);


    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
        });

        return () => unsubscribe();
    }, []);

    const getValidToken = async () => {
        if (!auth.currentUser) {
            throw new Error("User is not authenticated");
        }

        const token = await getIdToken(auth.currentUser, true);

        if (!token) {
            throw new Error("Failed to obtain valid token");
        }

        return token;
    };


    const handleFileChange = async (e) => {

        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (files.length > MAX_FILES) {
            alert(`You can upload maximum ${MAX_FILES} images at a time`);
            e.target.value = null;
            return;
        }

        try {
            setIsUploading(true);
            const token = await getValidToken();
            // console.log("TOKEN:", token);

            /* ================= GET SIGNATURE ================= */
            const { data } = await axios.get(
                `${import.meta.env.VITE_EXPRESS_SERVER_ENDPOINT}/api/signature`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const { timestamp, signature, apiKey, cloudName, folder, transformation, type } = data;

            /* ================= Compressing and UPLOAD FILES ================= */
            const compressedFiles = await Promise.all(
                files.map((file) =>
                    limit(() =>
                        imageCompression(file, {
                            maxSizeMB: 2,
                            maxWidthOrHeight: 2000,
                            useWebWorker: true,
                        })
                    )
                )
            );


            const uploadedImages = await Promise.all(
                compressedFiles.map((file) =>
                    limit(async () => {

                        const formData = new FormData();

                        formData.append("file", file);
                        formData.append("api_key", apiKey);
                        formData.append("timestamp", timestamp);
                        formData.append("signature", signature);
                        formData.append("folder", folder);
                        formData.append("type", type);
                        formData.append("allowed_formats", "jpg,png,jpeg,webp");
                        formData.append("transformation", transformation);

                        const uploadRes = await axios.post(
                            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                            formData
                        );

                        return {
                            public_id: uploadRes.data.public_id,
                            secure_url: uploadRes.data.secure_url,
                            width: uploadRes.data.width,
                            height: uploadRes.data.height,
                            format: uploadRes.data.format,
                            bytes: uploadRes.data.bytes
                        };

                    })
                )
            );

            console.log("UPLOAD RESULT:", uploadedImages);


            await axios.post(
                `${import.meta.env.VITE_EXPRESS_SERVER_ENDPOINT}/api/images/save`,
                {
                    images: uploadedImages,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("All uploads completed");
            setIsUploadSuccessfull(true);

        } catch (err) {
            setIsUploadErrorOccured(true);
            console.error("Upload failed");

            if (err.response) {
                console.error(err.response.data);
            } else {
                console.error(err.message);
            }

        } finally {
            setIsUploading(false);
            setTimeout(() => {
                setIsUploadErrorOccured(false);
                setIsUploadSuccessfull(false);
            }, 4000);
        }

        e.target.value = null;
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setLogoutOpen(false);
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Failed to logout. Please try again.");
        }
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
                {firebaseUser && (
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
                                {firebaseUser.photoURL ? (
                                    <img
                                        src={firebaseUser.photoURL}
                                        alt="profile"
                                        className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                    />
                                ) : (
                                    <Avatar sx={{ width: 40, height: 40 }}>
                                        {(firebaseUser.displayName || firebaseUser.email || "U").charAt(0).toUpperCase()}
                                    </Avatar>
                                )}
                            </Box>

                            {/* User Info */}
                            <ListItemText
                                primary={firebaseUser.displayName || "User"}
                                secondary={firebaseUser.email || ""}
                                sx={{
                                    overflow: "hidden",
                                    minWidth: 0,
                                    flex: "1 1 0",
                                    m: 0,
                                }}
                                primaryTypographyProps={{
                                    title: firebaseUser.displayName,
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
                                    title: firebaseUser.email,
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

                    <button
                        onClick={() => setSelectionMode(!selectionMode)}
                        className={`
                            cursor-pointer
                              p-2 rounded-full
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              transition-all duration-200
                              flex items-center justify-center
                              ${selectionMode ? "text-blue-500" : ""}
                            `}
                        aria-label={selectionMode ? "Cancel selection" : "Select images"}
                    >
                        {selectionMode ? <X size={20} /> : <ListChecks size={20} />}
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

                {/* MOBILE UPLOAD + SELECT (mobile only) */}
                <div className="sm:hidden ml-auto flex items-center gap-3 flex-shrink-0">

                    {/* Upload */}
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className="cursor-pointer hover:text-blue-600 flex items-center justify-center p-1"
                    >
                        <Upload size={22} />
                    </div>

                    {/* Select toggle */}
                    <button
                        onClick={() => setSelectionMode(!selectionMode)}
                        className={`cursor-pointer transition-colors flex items-center justify-center p-1 ${selectionMode
                            ? "text-blue-500"
                            : "hover:text-blue-600"
                            }`}
                        aria-label={selectionMode ? "Cancel selection" : "Select images"}
                    >
                        {selectionMode ? <X size={22} /> : <ListChecks size={22} />}
                    </button>

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

                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleLogout}
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