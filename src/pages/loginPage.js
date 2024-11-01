import React, { useState } from "react";
import kfupmIllustration from "../assets/KFUPM-illustration.png";
import { Button, Checkbox, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import kfupmlogo from "../assets/kfupmlogo.png";
import healthIcon from "../assets/HealthCareIcon.png";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/");
    };

    return (
        <div className="relative h-screen flex items-center justify-center">
            <div
                className="absolute inset-0 top-16 bg-cover bg-left-bottom opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url(${kfupmIllustration})`,
                }}
            ></div>

            <div className="p-8 h-24 flex items-center justify-center space-x-3 mt-4 absolute top-0 left-0">
                <img src={kfupmlogo} className="w-12" alt="KFUPM Logo" />
                <div className="font-semibold text-2xl text-kfupmgreen">
                    KFUPM <span className="text-textgray">Clinic</span>
                </div>
            </div>
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

                    {showForgotPassword ? (
                        <Button
                            radius="sm"
                            className="bg-kfupmgreen text-white font-medium text-md w-full"
                            onClick={onOpen}
                        >
                            Recover Password
                        </Button>
                    ) : (
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
                    )}
                </form>

                <img src={healthIcon} className="w-[400px] h-auto flex-shrink-0 pointer-events-none" alt="Healthcare Icon" />
            </div>

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
