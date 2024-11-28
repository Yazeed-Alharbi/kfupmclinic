import React, { useState, useMemo } from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { Card, CardBody, Button, Calendar, Select, SelectItem, ScrollShadow, Input, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { today, getLocalTimeZone, now } from "@internationalized/date";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FaVialVirus, FaHandsHoldingChild, FaEye, FaSyringe, FaHandHoldingMedical, FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { GiStomach, GiToothbrush } from "react-icons/gi";
import { TbDental, TbDentalBroken, TbVaccineBottle } from "react-icons/tb";
import { BsEar } from "react-icons/bs";

dayjs.extend(customParseFormat);
const AdminScheduleAppointmentPage = () => {
  const sidebarButtons = [
    { label: "Generate Appointment", icon: FaCalendarPlus, path: "/generate-appointment" },
    { label: "Schedule Appointment", icon: FaCalendarCheck, path: "/admin-schedule-appointment" },
    { label: "Doctor Schedule", icon: RiCalendarScheduleFill, path: "/admin-doctor-schedule" },
    { label: "Queue Management", icon: FaPersonWalkingDashedLineArrowRight, path: "/queue-management" },
  ];
  

  const clinics = [
    { label: "Internal Medicine Clinic - عيادة الباطنية", icon: GiStomach, time: "20 minutes" },
    { label: "HPV vaccine - تطعيم فيروس الورم الحليمي البشري", icon: FaVialVirus, time: "15 minutes" },
    { label: "Ophthalmology Clinic - عيادة العيون", icon: FaEye, time: "20 minutes" },
    { label: "Teeth Cleaning and polishing - تنظيف الأسنان", icon: GiToothbrush, time: "40 minutes" },
    { label: "Recombinant Zoster Vaccine - لقاح الحزام الناري", icon: FaSyringe, time: "20 minutes" },
    { label: "Obstetrics & Gynecology - النساء والولادة", icon: FaHandsHoldingChild, time: "20 minutes" },
    { label: "Dermatology Clinic - عيادة الجلدية", icon: FaHandHoldingMedical, time: "20 minutes" },
    { label: "Root canal treatment- علاج عصب الاسنان", icon: TbDentalBroken, time: "40 minutes" },
    { label: "Dental clinic - عيادة الاسنان", icon: TbDental, time: "40 minutes" },
    { label: "ENT Clinic - عيادة الأنف والأذن والحنجرة", icon: BsEar, time: "20 minutes" },
    { label: "Children vaccination - تطعيم الاطفال", icon: TbVaccineBottle, time: "20 minutes" }
  ];

  const workHours = {
    Sunday: "7:30 AM-10:00 PM", Monday: "7:30 AM-10:00 PM", Tuesday: "7:30 AM-10:00 PM",
    Wednesday: "7:30 AM-10:00 PM", Thursday: "7:30 AM-10:00 PM", Friday: "9:00 AM-2:00 PM", Saturday: "9:00 AM-2:00 PM"
  };

  const doctors = {
    "Internal Medicine Clinic - عيادة الباطنية": ["Anyone", "Dr. Abdullah Alrashed", "Dr. Damodar Tolani"],
    "HPV vaccine - تطعيم فيروس الورم الحليمي البشري": ["Anyone", "HPV vaccine specialist"],
    "Ophthalmology Clinic - عيادة العيون": ["Anyone", "Dr. Salman Abu Mazyad"],
    "Teeth Cleaning and polishing - تنظيف الأسنان": ["Anyone", "Dr. Eman Al-Saif", "Dr. Fares Al-Harbi", "Dr. Samar Azher yousuf"],
    "Recombinant Zoster Vaccine - لقاح الحزام الناري": ["Anyone", "Zoster Vaccine specialist"],
    "Obstetrics & Gynecology - النساء والولادة": ["Anyone", "Dr. Hanan Al Shaikh"],
    "Dermatology Clinic - عيادة الجلدية": ["Anyone", "Dr. Mohammed Jaafar"],
    "Root canal treatment- علاج عصب الاسنان": ["Anyone", "Dr. Samar Azher yousuf"],
    "Dental clinic - عيادة الاسنان": ["Anyone", "Dr. Eman Mahdi Al-Saif", "Dr. Fares Nawaf Al-Harbi"],
    "ENT Clinic - عيادة الأنف والأذن والحنجرة": ["Anyone", "Dr. Imtiaz Ahmad"],
    "Children vaccination - تطعيم الاطفال": ["Anyone", "Children vaccination specialist"]
  };

  const [selectedClinic, setSelectedClinic] = useState(clinics[0].label);
  const [focusedDate, setFocusedDate] = useState(today(getLocalTimeZone()));
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(new Set(["Anyone"]));
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  const generateAvailableTimes = (start, end, interval) => {
    const startTime = dayjs(start, 'h:mmA');
    const endTime = dayjs(end, 'h:mmP');
    const times = [];

    let currentTime = startTime;
    while (currentTime.isBefore(endTime)) {
      times.push(currentTime.format('h:mm A'));
      currentTime = currentTime.add(interval, 'minute');
    }

    return times;
  };

  const handleClinicSelection = (clinic) => {
    setSelectedClinic(clinic);
    setAvailableTimes([]);
    setSelectedTime("");
  };

  const handleDateChange = (date) => {
    setFocusedDate(date);
    const dayOfWeek = dayjs(date.toDate(getLocalTimeZone())).format('dddd');
    const [start, end] = workHours[dayOfWeek].split('-');
    const interval = parseInt(clinics.find(c => c.label === selectedClinic).time);
    const times = generateAvailableTimes(start, end, interval);
    setAvailableTimes(times);
  };

  const handleBookAppointment = () => {
    setIsModalOpen(true);
  };

  const confirmBooking = () => {
    const appointmentData = {
      clinic: selectedClinic,
      date: focusedDate.toString(),
      time: selectedTime,
      doctor: Array.from(selectedDoctor)[0],
      patientName,
      patientPhone,
      patientEmail
    };
    console.log("Appointment booked:", appointmentData);
    // Here you would typically send this data to your backend
    setBookingStatus('success');
    setIsModalOpen(false);
    
    // Reset form
    setSelectedClinic(clinics[0].label);
    setFocusedDate(today(getLocalTimeZone()));
    setSelectedTime("");
    setSelectedDoctor(new Set(["Anyone"]));
    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    
    // Clear booking status after 5 seconds
    setTimeout(() => setBookingStatus(null), 5000);
  };

  const isBookingDisabled = useMemo(() => {
    return !selectedClinic || !focusedDate || !selectedTime || !selectedDoctor.size || !patientName || !patientPhone || !patientEmail;
  }, [selectedClinic, focusedDate, selectedTime, selectedDoctor, patientName, patientPhone, patientEmail]);


  return (
    <MainLayout title="Schedule Appointment" sidebarButtons={sidebarButtons} userName="Someone" userType="Admin">
      <div className="p-4 space-y-6">
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold mb-4">Select a Clinic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinics.map((clinic) => (
                <Button
                  key={clinic.label}
                  startContent={<clinic.icon className="text-xl" />}
                  className={`justify-start h-auto py-2 ${
                    selectedClinic === clinic.label
                      ? "bg-kfupmgreen text-primary-foreground"
                      : "bg-kf-100"
                  }`}
                  onClick={() => handleClinicSelection(clinic.label)}
                >
                  <div className="flex flex-col items-start">
                    <span>{clinic.label}</span>
                    <span className="text-xs opacity-70">{clinic.time}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold mb-4">Select Date & Time</h2>
              <Calendar
                aria-label="Appointment Date"
                value={focusedDate}
                onChange={handleDateChange}
                minValue={now(getLocalTimeZone())}
                maxValue={now(getLocalTimeZone()).add({ months: 1 })}
              />
              <ScrollShadow className="h-40 mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      size="sm"
                      variant={selectedTime === time ? "solid" : "flat"}
                      color={selectedTime === time ? "primary" : "default"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </ScrollShadow>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
              <div className="space-y-4">
                <Select
                  label="Select Doctor"
                  placeholder="Choose a doctor"
                  selectedKeys={selectedDoctor}
                  onSelectionChange={setSelectedDoctor}
                >
                  {doctors[selectedClinic].map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                />
                <Input
                  label="Email"
                  placeholder="Enter your email address"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                />
                <Button
                  size="lg"
                  color="primary"
                  className="bg-kfupmgreen text-white w-full mt-4"
                  onClick={handleBookAppointment}
                  isDisabled={isBookingDisabled}
                >
                  Book Appointment
                </Button>
                
                {bookingStatus === 'success' && (
                  <p className="text-success mt-2 text-center">Appointment booked successfully!</p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Appointment Summary</ModalHeader>
            <ModalBody>
              <Chip color="primary" variant="flat">Clinic: {selectedClinic}</Chip>
              <Chip color="primary" variant="flat">Date: {focusedDate.toString()}</Chip>
              <Chip color="primary" variant="flat">Time: {selectedTime}</Chip>
              <Chip color="primary" variant="flat">Doctor: {Array.from(selectedDoctor)[0]}</Chip>
              <Chip color="primary" variant="flat">Patient: {patientName}</Chip>
              <Chip color="primary" variant="flat">Phone: {patientPhone}</Chip>
              <Chip color="primary" variant="flat">Email: {patientEmail}</Chip>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" className="bg-kfupmgreen text-white" onPress={confirmBooking}>
                Confirm Booking
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminScheduleAppointmentPage;
