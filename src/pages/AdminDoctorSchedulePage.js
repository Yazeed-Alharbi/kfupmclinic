import React, { useState } from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import {
  Select,
  SelectItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

export const clinics = [
  { key: "Internal Medicine Clinic", label: "Internal Medicine Clinic" },
  { key: "Ophthalmology Clinic", label: "Ophthalmology Clinic" },
  { key: "Dermatology Clinic", label: "Dermatology Clinic" },
  { key: "Dental clinic", label: "Dental clinic" },
];

export const doctors = {
  "Internal Medicine Clinic": [
    { key: "Dr. Scut Tom", label: "Dr. Scut Tom" },
    { key: "Dr. Amina Ahmed", label: "Dr. Amina Ahmed" },
  ],
  "Ophthalmology Clinic": [
    { key: "Dr. Banabas Paul", label: "Dr. Banabas Paul" },
    { key: "Dr. Ayo Jones", label: "Dr. Ayo Jones" },
    { key: "Dr. Michael Stwart", label: "Dr. Michael Stwart" },
  ],
  "Dermatology Clinic": [
    { key: "Dr. Kemi Olowojeje", label: "Dr. Kemi Olowojeje" },
    { key: "Dr. Ebuka Kelechi", label: "Dr. Ebuka Kelechi" },
  ],
  "Dental clinic": [{ key: "Dr. Ibrahim Yekeni", label: "Dental clinic" }],
};

const rows = [
  { key: "1", name: "Tony Reichert", role: "CEO", status: "Active" },
  { key: "2", name: "Zoey Lang", role: "Technical Lead", status: "Paused" },
  { key: "3", name: "Jane Fisher", role: "Senior Developer", status: "Active" },
  { key: "4", name: "William Howard", role: "Community Manager", status: "Vacation" },
];

const columns = [
  { key: "name", label: "NAME" },
  { key: "role", label: "ROLE" },
  { key: "status", label: "STATUS" },
];

const AdminDoctorSchedulePage = () => {
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleClinicChange = (value) => {
    setSelectedClinic(value);
    setSelectedDoctor(""); 
  };

  const handleDoctorChange = (value) => {
    setSelectedDoctor(value);
  };

  const handleViewSchedule = () => {
    if (selectedClinic && selectedDoctor) {
      setShowSchedule(true); 
    } else {
      onOpen(); 
    }
  };

  const handleGoBack = () => {
    setShowSchedule(false); 
    setSelectedClinic("");
    setSelectedDoctor("");
  };

  const sidebarButtons = [
    { label: "Generate Appointment", icon: FaCalendarPlus, path: "/generate-appointment" },
    { label: "Schedule Appointment", icon: FaCalendarCheck, path: "/admin-schedule-appointment" },
    { label: "Doctor Schedule", icon: RiCalendarScheduleFill, path: "/admin-doctor-schedule" },
  ];

  return (
    <MainLayout title="Doctor Schedule" sidebarButtons={sidebarButtons} userName="Turki Alsomari" userType="Admin">
      {!showSchedule ? (
        <>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 ml-10 mt-10 mb-5">
            <Select
              label="Select a clinic"
              className="max-w-xs"
              onChange={(e) => handleClinicChange(e.target.value)}
              placeholder="Choose a clinic"
            >
              {clinics.map((clinic) => (
                <SelectItem key={clinic.key} value={clinic.key}>
                  {clinic.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Select doctor"
              className="max-w-xs"
              onChange={(e) => handleDoctorChange(e.target.value)}
              placeholder="Choose a doctor"
              isDisabled={!selectedClinic} 
            >
              {selectedClinic &&
                doctors[selectedClinic].map((doctor) => (
                  <SelectItem key={doctor.key} value={doctor.key}>
                    {doctor.label}
                  </SelectItem>
                ))}
            </Select>
          </div>

          <Button className="ml-10 bg-kfupmgreen text-white" onClick={handleViewSchedule}>
            View Schedule
          </Button>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Selection Required</ModalHeader>
                  <ModalBody>
                    <p>Please select both a clinic and a doctor to view the schedule.</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      ) : (
        <div className="ml-10 mt-10">
          <div className="max-w-md">
            <div className="space-y-1">
              <h3 className="text-medium font-medium">Schedule for {selectedDoctor}</h3>
              <p className="text-small text-default-400">At {selectedClinic}</p>
            </div>
            <Divider className="my-4" />
          </div>

          <div className="flex justify-center my-4  max-w-4xl">
            <Table aria-label="Example table with dynamic content">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Button className=" bg-kfupmgreen text-white" onClick={handleGoBack}>
            Go back
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default AdminDoctorSchedulePage;
