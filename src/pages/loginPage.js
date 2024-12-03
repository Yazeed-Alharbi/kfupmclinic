import React, { useState } from "react";
import { Button, Checkbox, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import supabase from "../commonComponents/supabase";
import kfupmIllustration from "../assets/KFUPM-illustration.png";
import kfupmlogo from "../assets/kfupmlogo.png";
import healthIcon from "../assets/HealthCareIcon.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // For potential future use
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [error, setError] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(null); // Reset error state
    
        try {
            console.log("Authenticating user with email:", email);
    
        

    
            // Case-insensitive query on Patient table
            const { data: patientData, error: patientError } = await supabase
                .from("Patient")
                .select("*")
                .ilike("email", email) // Use ilike for case-insensitivity
                .single();
            console.log("Patient Query:", patientData, patientError);
    
            // Case-insensitive query on DocInfo table
            const { data: docData, error: docError } = await supabase
                .from("DocInfo")
                .select("*")
                .ilike("Email", email) // Use ilike for case-insensitivity
                .single();
            console.log("DocInfo Query:", docData, docError);
    
            // Case-insensitive query on Receptionist table
            // Case-insensitive query on Receptionist table
            const { data: receptionistData, error: receptionistError } = await supabase
                .from("Receptionist")
                .select("*")
                .ilike("email", email) // Use ilike for case-insensitivity
                .single();
            console.log("Receptionist Query:", receptionistData, receptionistError);

    
            // Determine which table contains the user
            const userData = patientData || docData || receptionistData;
    
            if (!userData) {
                setError("Please enter valid credentials.");
                return;
            }
    
            // Identify user type
            const userType = patientData
                ? "Patient"
                : docData
                ? "Doctor"
                : "Receptionist";
    
            // Create user object
            const userObject = {
                name: userData.name || userData.Name || "Unknown", // Match the column name
                email: userData.email || userData.Email,
                type: userType,
                ...userData, // Add all data for further use
            };
    
            // Store user in localStorage
            localStorage.setItem("user", JSON.stringify(userObject));
    
            console.log("User stored in localStorage:", userObject);
    
            // Redirect to the respective page based on user type
            if (userType === "Patient") {
                navigate("/schedule-appointment");
            } else if (userType === "Doctor") {
                navigate("/doctor-schedule");
            } else if (userType === "Receptionist") {
                navigate("/generate-appointment");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("An error occurred while logging in. Please try again.");
        }
    };
    
    
    
    
    

    return (
        <div className="relative h-screen flex items-center justify-center">
            {/* Background Illustration */}
            <div
                className="absolute inset-0 top-16 bg-cover bg-left-bottom opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url(${kfupmIllustration})`,
                }}
            ></div>

            {/* Header */}
            <div className="p-8 h-24 flex items-center justify-center space-x-3 mt-4 absolute top-0 left-0">
                <img src={kfupmlogo} className="w-12" alt="KFUPM Logo" />
                <div className="font-semibold text-2xl text-kfupmgreen">
                    KFUPM <span className="text-textgray">Clinic</span>
                </div>
            </div>

            {/* Login Form */}
            <div className="relative px-16 z-10 w-full max-w-5xl flex justify-center items-center space-x-8 lg:space-x-32">
                <form className="flex flex-col space-y-6 w-full max-w-md flex-shrink-0">
                    {showForgotPassword && (
                        <Button
                            variant="light"
                            className="text-sm text-kfupmgreen self-start p-0"
                            onClick={() => setShowForgotPassword(false)}
                            startContent={<IoMdArrowBack />}
                        >
                            Back to login
                        </Button>
                    )}

                    <h1 className="font-semibold text-2xl">
                        {showForgotPassword ? "Forgot your password?" : "Login"}
                    </h1>
                    <p className="text-textgray">
                        {showForgotPassword
                            ? "Enter your email below to recover your password."
                            : "Login to access your account"}
                    </p>

                    <Input
                        variant="faded"
                        label="Email"
                        type="email"
                        size="sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        classNames={{
                            input: ["bg-white"],
                            inputWrapper: [
                                "bg-white",
                                "group-data-[focus=true]:border-kfupmgreen",
                                "group-data-[hover=true]:border-kfupmgreen",
                            ],
                        }}
                    />

                    {!showForgotPassword && (
                        <Input
                            variant="faded"
                            label="Password"
                            type="password"
                            size="sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            classNames={{
                                input: ["bg-white"],
                                inputWrapper: [
                                    "bg-white",
                                    "group-data-[focus=true]:border-kfupmgreen",
                                    "group-data-[hover=true]:border-kfupmgreen",
                                ],
                            }}
                        />
                    )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {!showForgotPassword ? (
                        <>
                            <div className="flex justify-between items-center">
                                <Checkbox>
                                    <span className="text-sm">Remember me</span>
                                </Checkbox>
                                <Button
                                    className="text-kfupmgreen font-medium text-sm"
                                    variant="light"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot Password
                                </Button>
                            </div>
                            <Button
                                radius="sm"
                                className="bg-kfupmgreen text-white font-medium text-md w-full"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </>
                    ) : (
                        <Button
                            radius="sm"
                            className="bg-kfupmgreen text-white font-medium text-md w-full"
                            onClick={onOpen}
                        >
                            Recover Password
                        </Button>
                    )}
                </form>

                <img src={healthIcon} className="w-[400px] h-auto flex-shrink-0 pointer-events-none" alt="Healthcare Icon" />
            </div>

            {/* Forgot Password Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Password Recovery</ModalHeader>
                            <ModalBody>
                                <p>
                                    We have sent an email with instructions to reset your password if the account exists.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" variant="light" onPress={onClose}>
                                    OK
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default LoginPage;
