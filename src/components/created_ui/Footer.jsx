import LockOutlineIcon from "@mui/icons-material/LockOutline";

const Footer = () => {
    return (
        <footer className="w-full 
                       bg-white dark:bg-gray-900 
                       border-t border-gray-200 dark:border-gray-700">

            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">

                {/* Brand */}
                <div>
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

                    <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xs">
                        Secure, scalable and powerful media cloud platform built for everyone.
                    </p>
                </div>

                {/* Security Section */}
                <div className="flex flex-col gap-3">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                        Security
                    </span>

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <LockOutlineIcon color="primary" sx={{ fontSize: 26 }} />
                        Encrypted & Secure Vault
                    </div>

                    <p className="text-gray-400 dark:text-gray-500 text-xs">
                        Your files are protected with modern authentication and secure
                        storage infrastructure.
                    </p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="h-14 
                      border-t border-gray-100 dark:border-gray-800 
                      flex items-center justify-center 
                      text-gray-400 dark:text-gray-500 
                      text-sm">
                © {new Date().getFullYear()} SnapDock. All rights reserved.
            </div>

        </footer>
    );
};

export default Footer;