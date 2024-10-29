import React, { useState, useEffect } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import kfupmlogo from "../assets/kfupmlogo.png";
import profileImage from "../assets/default-avatar.jpg";
import { IoMdArrowDropdown } from "react-icons/io";

const SideBar = ({ buttons, userName, userType }) => {
  const [selectedButton, setSelectedButton] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedButton = buttons.find((button) => button.path === currentPath);
    if (matchedButton) {
      setSelectedButton(matchedButton.label);
    }
  }, [location, buttons]);

  const handleButtonClick = (buttonName, path) => {
    setSelectedButton(buttonName);
    navigate(path);
  };

  return (
    <div className="bg-white z-0 min-w-72 max-w-72 relative">
      <aside className="h-full border-r border-gray-200 flex flex-col">
        <div className="p-4 h-24 sm:h-16 flex items-center justify-center space-x-3 mt-4">
          <img src={kfupmlogo} className="w-10" alt="KFUPM Logo" />
          <div className="font-semibold text-xl text-kfupmgreen">
            KFUPM <span className="text-textgray">Clinic</span>
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-8 flex">
            <div className="space-y-2 p-2 pt-4">
              <div className="pl-2 pt-2 pr-2 space-y-8 min-w-full">
                {buttons.map((button) => (
                  <Button
                    key={button.label}
                    ripple={true}
                    startContent={<button.icon className="mr-2" />}
                    className={`text-start flex justify-start px-4 text-base min-w-full max-w-full py-7 focus:outline-none rounded-lg ${
                      selectedButton === button.label
                        ? "bg-kfupmgreen text-white font-semibold"
                        : "bg-transparent text-textlightgray font-normal"
                    }`}
                    onClick={() => handleButtonClick(button.label, button.path)}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 py-8 flex space-x-2 items-center">
            <img src={profileImage} className="w-11 h-11" alt="Profile" />
            <div className="flex flex-col items-start">
              <p className="font-semibold">{userName}</p>
              <p className="text-textlightgray">{userType}</p>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly={true} className="bg-transparent rounded-3xl">
                  <IoMdArrowDropdown className="text-2xl text-kfupmgreen" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Options">
                <DropdownItem key="1">Option 1</DropdownItem>
                <DropdownItem key="2">Option 2</DropdownItem>
                <DropdownItem key="3">Option 3</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
