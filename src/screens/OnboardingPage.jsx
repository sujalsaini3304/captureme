import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Footer from "../components/created_ui/Footer";
import Button from "@mui/material/Button";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import AOS from "aos";
import { SignInButton } from "@clerk/clerk-react";

const Onboarding = () => {
    useEffect(() => {
        AOS.refresh();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

                {/* ================= NAVBAR ================= */}
                <div
                    className="fixed top-0 left-0 w-full h-14 
                     bg-white dark:bg-gray-900
                     border-b border-gray-200 dark:border-gray-700
                     z-50 flex items-center px-4 "
                >
                    <div className="flex items-center gap-2 text-xl font-semibold">
                        <img
                            src="/icon.png"
                            className="h-8 w-8 object-contain"
                            loading="lazy"
                            alt="logo"
                        />
                        <span>
                            Snap<span className="text-blue-600">Dock</span>
                        </span>
                    </div>
                </div>

                {/* ================= HERO SECTION ================= */}
                <section className="flex flex-col items-center pt-26 sm:pt-28 text-center px-6  md:pt-30">
                    <img
                        data-aos="zoom-in"
                        src="/icon.png"
                        className="inline-block h-48 mb-6 w-48 object-contain"
                        loading="lazy"
                        alt="logo"
                    />

                    <h2
                        data-aos="zoom-in"
                        className="inline-block text-4xl md:text-6xl font-semibold leading-[1.1] max-w-4xl tracking-tight"
                    >
                        <span>
                            Snap<span className="text-blue-600">Dock</span>
                        </span>
                        <br />
                        <span className="font-bold">
                            Built for Storage Reliability
                        </span>
                    </h2>

                    <p
                        data-aos="zoom-in"
                        className="inline-block mt-6 text-gray-500 dark:text-gray-400 max-w-2xl text-lg"
                    >
                        SnapDock helps you upload, manage, and deliver media effortlessly.
                        Designed for everyone who want storage reliability.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <SignInButton>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="medium"
                                className="gap-2"
                            >
                                Get Started <ArrowRight size={18} />
                            </Button>
                        </SignInButton>
                    </div>
                </section>

                {/* ================= FEATURE SECTION ================= */}
                <section className="grid md:grid-cols-3 gap-8 px-6 md:px-20 mt-28 pb-24">

                    <FeatureCard
                        icon={<CloudUploadOutlinedIcon color="primary" sx={{ fontSize: 26 }} />}
                        title="Mega Cloud Storage"
                        desc="All data are highly secured in the cloud, only authorized user can access his/her data."
                    />

                    <FeatureCard
                        icon={<LockOutlineIcon color="primary" sx={{ fontSize: 26 }} />}
                        title="Secure by Design"
                        desc="Enterprise-grade authentication and secure access control."
                    />

                    <FeatureCard
                        icon={<FlashOnOutlinedIcon color="primary" sx={{ fontSize: 26 }} />}
                        title="Lightning Access from Anywhere"
                        desc="Anyone can access this storage service from anywhere in the world."
                    />

                </section>

                <Footer />
            </div>
        </>
    );
};

const FeatureCard = ({ icon, title, desc }) => {
    return (
        <div
            data-aos="zoom-in"
            className="cursor-pointer 
                 bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 
                 p-8 rounded-3xl 
                 hover:shadow-xl hover:-translate-y-1 
                 transition duration-300"
        >
            <div className="mb-4 text-blue-600">{icon}</div>
            <h3 className="text-xl font-semibold mb-3">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
                {desc}
            </p>
        </div>
    );
};

export default Onboarding;