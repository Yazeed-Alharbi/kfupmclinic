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
import supabase from "../../commonComponents/supabase";


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
    Sunday: "7:30 AM-22:00 PM", Monday: "7:30 AM-22:00 PM", Tuesday: "7:30 AM-22:00 PM",
    Wednesday: "7:30 AM-22:00 PM", Thursday: "7:30 AM-22:00 PM", Friday: "9:00 AM-14:00 PM", Saturday: "9:00 AM-14:00 PM"
  };
  const doctors = {
    "Internal Medicine Clinic - عيادة الباطنية": ["Anyone", "Dr. Abdullah Alrashed", "Dr. Damodar Tolani"],
    "HPV vaccine - تطعيم فيروس الورم الحليمي البشري": ["Anyone", "Dr. Mohammed Alrain" , "Dr. Ali Dawood"],
    "Ophthalmology Clinic - عيادة العيون": ["Anyone", "Dr. Salman Abu Mazyad","Dr. Abdulaziz Alghamdi"],
    "Teeth Cleaning and polishing - تنظيف الأسنان": ["Anyone", "Dr. Eman Al-Saif", "Dr. Fares Al-Harbi", "Dr. Samar Azher yousuf"],
    "Recombinant Zoster Vaccine - لقاح الحزام الناري": ["Anyone", "Dr. Hassan Ramda","Dr. Walter White"],
    "Obstetrics & Gynecology - النساء والولادة": ["Anyone", "Dr. Hanan Al Shaikh"],
    "Dermatology Clinic - عيادة الجلدية": ["Anyone", "Dr. Mohammed Jaafar"],
    "Root canal treatment- علاج عصب الاسنان": ["Anyone", "Dr. Samar Azher yousuf"],
    "Dental clinic - عيادة الاسنان": ["Anyone", "Dr. Eman Mahdi Al-Saif", "Dr. Fares Nawaf Al-Harbi"],
    "ENT Clinic - عيادة الأنف والأذن والحنجرة": ["Anyone", "Dr. Imtiaz Ahmad"],
    "Children vaccination - تطعيم الاطفال": ["Anyone", "Dr. Sarah Humlood" , "Dr. Sean John Combs"]
  };

  const [selectedClinic, setSelectedClinic] = useState(clinics[0].label);
  const [focusedDate, setFocusedDate] = useState(today(getLocalTimeZone()));
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [AppointmentID , setAppointmentID] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(new Set([""]));
  const [selectedDoctoBackend, setselectedDoctoBackend] = useState("");
  const [selectedDoctorID, setSelectedDoctorID] = useState(0)
  const [selectedDoctorRoom,setselectedDoctorRoom] = useState(0)
  const [selectedPriority ,setSelectedPriority]= useState(new Set([""]));
  const [patientID, setPatientID] = useState(0);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  const generateAvailableTimes = async (date,start, end, interval) => {
    const startTime = dayjs(start, 'h:mmA');
    const endTime = dayjs(end, 'h:mmP');
    const times = [];

    if ( selectedDoctoBackend == ""){
      return times
    }
    else {
      let currentTime = startTime;
      let Dates = await supabase.from('Appointment').select('*').eq('doctorID',selectedDoctorID).eq('AppDate',date.toString());
      Dates = Dates['data'];
      while (currentTime.isBefore(endTime)) {
        times.push(currentTime.format('h:mm A'));
        currentTime = currentTime.add(interval, 'minute'); 
      }

      for(let i=0 ; i <times.length;i++){
        for(let j=0 ; j<Dates.length;j++){
          if(times[i]== Dates[j]['scheduledTime']){
            times.splice(i,1);
          }

        }
      } 
      return times;
   }
  };

  const handleClinicSelection = (clinic) => {
    setSelectedClinic(clinic);
    setAvailableTimes([]);
    setSelectedTime("");
    setSelectedPriority(new Set([""]))
    setSelectedDoctor(new Set([""]))
    setselectedDoctoBackend("")

  };



  const HandleSelectedDoctor =async (Doctor) =>{
    
    if((Array.from(Doctor)[0] == "Anyone" ) ){
      let DocInfo = await supabase.from('DocInfo').select('*').eq('Clinic',selectedClinic);
      let MinAppNum=DocInfo['data'][0];     
      for(let i=1 ; i<DocInfo['data'].length;i++ ){
        if(DocInfo['data'][i]['AppNum']<MinAppNum['AppNum']){
          
          MinAppNum = DocInfo['data'][i]
        }
        setSelectedDoctor(new Set(["Anyone"]));
        setselectedDoctoBackend(MinAppNum['Name'])
        setSelectedDoctorID(MinAppNum['DocID']);
        setselectedDoctorRoom(MinAppNum['RoomNumber']); 
      }     
    }
    else if (Array.from(Doctor)[0] == undefined){
      setSelectedDoctor(new Set([""]))
      setselectedDoctoBackend("")
      setSelectedDoctorID(0);
      setselectedDoctorRoom(0);
    }
    else{
      let DocInfo = await supabase.from('DocInfo').select('*').eq('Clinic',selectedClinic).eq('Name',Array.from(Doctor)[0]);
      setSelectedDoctor(new Set([DocInfo['data'][0]['Name']]))
      setselectedDoctoBackend(DocInfo['data'][0]['Name'])
      setSelectedDoctorID(DocInfo['data'][0]['DocID']);
      setselectedDoctorRoom(DocInfo['data'][0]['RoomNumber']);
    }
  };

  const handleDateChange = async (date) => {
    setFocusedDate(date);
    const dayOfWeek = dayjs(date.toDate(getLocalTimeZone())).format('dddd');
    const [start, end] = workHours[dayOfWeek].split('-');
    const interval = parseInt(clinics.find(c => c.label === selectedClinic).time);
    const times = await generateAvailableTimes(date,start, end, interval);
    setAvailableTimes(times);
  };

  const handleBookAppointment = async() => {
    let PatientInfo = await supabase.from("Patient").select("*").eq("name",patientName);
    PatientInfo= PatientInfo['data']

    
    
    if(PatientInfo.length == 0){
      await supabase.from("Patient").insert([ { name: patientName, email: patientEmail, ContactNumber: patientPhone } ]);
      PatientInfo = await supabase.from("Patient").select("*").eq("name",patientName);
      PatientInfo= PatientInfo['data']
      
      setPatientID(PatientInfo[0]['patientID'])
      setIsModalOpen(true);
    }
    else{
    setPatientID(PatientInfo[0]['patientID'])
    setIsModalOpen(true);
    }
  };

  const confirmBooking = async () => {
    let last_row = await supabase.from("Appointment").select('*').order('appointmentId', { ascending: false }).limit(1);
    let appID = last_row['data'][0]['appointmentId'];
    appID = appID +1;
    setAppointmentID(appID)
    
    
    let DocInfo = await supabase.from("DocInfo").select('*').eq('DocID',selectedDoctorID);
    let new_AppNum=DocInfo['data'][0]['AppNum']+1;
    
    await supabase.from("DocInfo").update({ AppNum: new_AppNum }).eq('DocID',selectedDoctorID);

    const PriorityDetails = Array.from(selectedPriority)[0]=="zero"? 0 : 1 ;
    const appointmentData = {
      appointmentId:appID,
      patientID:patientID,
      clinic: selectedClinic,
      date: focusedDate.toString(),
      time: selectedTime,
      DocID:selectedDoctorID,
      doctor: selectedDoctoBackend,
      patientName,
      patientPhone,
      patientEmail,
      Priority: PriorityDetails ,
      RoomNum:selectedDoctorRoom,
      Finished:false,
      checkedIn:false
    };



  await supabase.from("Appointment").insert([ { 
      appointmentId:appID,
      patientID: patientID, 
      scheduledTime:selectedTime,
      Priority: PriorityDetails,
      Finished:false,
      checkedIn:false,
      roomNumber:selectedDoctorRoom,
      doctorID:selectedDoctorID,
      doctorName: selectedDoctoBackend,
      patientName: patientName,
      AppDate:focusedDate.toString(),
      clinic: selectedClinic,
      PatientEmail: patientEmail, 
      PatientPhone: patientPhone 
    } ]);

    console.log("Appointment booked:", appointmentData);
    // Here you would typically send this data to your backend
    setBookingStatus('success');
    setIsModalOpen(false);
    
    // Reset form
    setSelectedClinic(clinics[0].label);
    setFocusedDate(today(getLocalTimeZone()));
    setAvailableTimes([]);
    setSelectedTime("");
    setSelectedDoctor(new Set([""]));
    setselectedDoctoBackend("");
    setSelectedPriority(new Set([""]));
    setSelectedDoctorID(0);
    setselectedDoctorRoom(0);
    setPatientID(0);
    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");


      
    // Clear booking status after 5 seconds
    setTimeout(() => setBookingStatus(null), 5000);

  };


  const isBookingDisabled = useMemo(() => {
    return !selectedClinic || !focusedDate || !selectedTime || !selectedDoctor.size || !patientName || !patientPhone || !patientEmail || !selectedPriority.size;
  }, [selectedClinic, focusedDate, selectedTime, selectedDoctor, selectedPriority,patientName, patientPhone, patientEmail]);


  return (
    <MainLayout title="Schedule Appointment" sidebarButtons={sidebarButtons} userName="Abdullah Alalawi" userType="Patient">
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
                
                classNames={{
                  cellButton: "focus:bg-primary focus:text-secondary-foreground ",
                }}
                
                autoFocus={true}      
                defaultValue={focusedDate}
                value={focusedDate}
                focusedDate={focusedDate}
                hideDisabledDates={true}
                onChange={handleDateChange}
                minValue={now(getLocalTimeZone())}
                maxValue={now(getLocalTimeZone()).add({ months: 12 })}
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
                  onSelectionChange={HandleSelectedDoctor}
                >
                  {doctors[selectedClinic].map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Select Priority"
                  placeholder="Choose a Priority"
                  selectedKeys={selectedPriority}
                  onSelectionChange={setSelectedPriority}
                >
                    <SelectItem key={'zero'} value={'zero'}>
                      {'zero'}
                    </SelectItem>
                    <SelectItem key={'one'} value={'one'}>
                      {'one'}
                    </SelectItem>
             
                </Select>

                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value.toUpperCase())}
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
              <Chip color="primary" variant="flat">Priority: {Array.from(selectedPriority)[0]}</Chip>
              <Chip color="primary" variant="flat">Patient: {patientName}</Chip>
              <Chip color="primary" variant="flat">Phone: {patientPhone}</Chip>
              <Chip color="primary" variant="flat">Email: {patientEmail}</Chip>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" className="bg-kfupmgreen text-white"  onPress={confirmBooking}>
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
