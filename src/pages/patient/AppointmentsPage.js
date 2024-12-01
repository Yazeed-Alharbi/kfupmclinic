import React from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Card,CardBody,Calendar,ScrollShadow,Select,SelectItem,Input
  } from "@nextui-org/react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useState, useMemo } from "react";
import supabase from "../../commonComponents/supabase";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { today, getLocalTimeZone, now , parseDate} from "@internationalized/date";
import dayjs from 'dayjs';
import { FaVialVirus, FaHandsHoldingChild, FaSyringe, FaHandHoldingMedical, FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { GiStomach, GiToothbrush } from "react-icons/gi";
import { TbDental, TbDentalBroken, TbVaccineBottle } from "react-icons/tb";
import { BsEar } from "react-icons/bs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RiCalendarScheduleFill } from "react-icons/ri";

dayjs.extend(customParseFormat);

const PatientID = 1;

let appointments = await supabase.from('Appointment').select('*').eq('patientID',PatientID);
appointments = appointments['data'];
console.log(appointments)

const statusColorMap = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const AppointmentsPage =  () => {



  const sidebarButtons = [
    { label: "Schedule Appointment", icon: FaCalendarPlus, path: "/schedule-appointment" },
    { label: "Appointments", icon: FaCalendarCheck, path: "/appointments" },
    { label: "Queue", icon: FaPersonWalkingDashedLineArrowRight, path: "/queue" },
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

  
  const [DeleteModalOpen , setDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen,setIsViewModalOpen] = useState(false)
  const [UpdateAppointmentInfo,setUpdateAppointmentInfo] =  useState(false);
  const [DeletedRow,setDeletedRow] = useState("");
  const [SelectedApp,setSelectedApp] = useState({});



  const [selectedClinic, setSelectedClinic] = useState(clinics[0].label);
  const [focusedDate, setFocusedDate] = useState(today(getLocalTimeZone()));
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");


  const [selectedDoctor, setSelectedDoctor] = useState(new Set([""]));
  const [selectedDoctoBackend, setselectedDoctoBackend] = useState("");
  const [selectedDoctorID, setSelectedDoctorID] = useState(0)
  const [selectedDoctorRoom,setselectedDoctorRoom] = useState(0)
  const [patientID, setPatientID] = useState(0);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);


  const HandleEditSection = async (App) =>{
    setSelectedApp(App);
    setSelectedClinic(App['clinic']);
    setSelectedDoctor(new Set([App['doctorName']]));
    setselectedDoctoBackend(App['doctorName']);
    setFocusedDate(parseDate(App['AppDate']));
    setSelectedTime(App['scheduledTime']);
  

    setSelectedDoctorID(App['appointmentId']);
    setselectedDoctorRoom(App['roomNumber']);
    setPatientID(App['patientID']);
    setPatientName(App['patientName']);
    setPatientPhone(App['PatientPhone']);
    setPatientEmail(App['PatientEmail']);



    let date = parseDate(App['AppDate'])
    const dayOfWeek = dayjs(date.toDate(getLocalTimeZone())).format('dddd');
    const [start, end] = workHours[dayOfWeek].split('-');
    const interval = parseInt(clinics.find(c => c.label === selectedClinic).time);

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
          if((times[i]== Dates[j]['scheduledTime'] )& (times[i] !=selectedTime) ){
            times.splice(i,1);
          }

        }
      } 
      setAvailableTimes(times);
      setUpdateAppointmentInfo(true);
   }
  
  }

  const HandleViewDetails = (App) =>{
    setSelectedApp(App);
    setIsViewModalOpen(true);
  }



  const GoBack = ()=>{
    setSelectedApp({})
    setSelectedClinic(clinics[0].label);
    setSelectedDoctor(new Set([""]));
    setselectedDoctoBackend("");
    setFocusedDate(today(getLocalTimeZone()));
    setSelectedTime("");
    setSelectedDoctorID("");
    setselectedDoctorRoom("");
    setPatientID("");
    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    setAvailableTimes([]);
    
    setUpdateAppointmentInfo(false);
    
  };


  const HandleDeleteModal = (App) => {
    setDeleteModalOpen(true);
    setDeletedRow(App['appointmentId'])
    
  }
  const HandleDelete = async () => {
    let RowToDelete = +DeletedRow;
    await supabase.from('Appointment').update({ Finished: true }).eq('appointmentId',RowToDelete);
    let temp  = await supabase.from('Appointment').select('*').eq('patientID',PatientID);
    appointments= temp['data']
    setDeleteModalOpen(false);
  }


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

  const handleClinicSelection = (clinic) => {
    setSelectedClinic(clinic);
    setAvailableTimes([]);
    setSelectedTime("");
    setSelectedDoctor(new Set([""]));
    setselectedDoctoBackend("");

  };

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
          if((times[i]== Dates[j]['scheduledTime'] )& (times[i] !=selectedTime) ){
            times.splice(i,1);
          }

        }
      } 
      
      if(date != SelectedApp['AppDate']){setSelectedTime("")}
      else{setSelectedTime(SelectedApp['scheduledTime'])}
      setAvailableTimes(times);
   }
  };


  const handleDateChange = (date) => {
    setFocusedDate(date);
    const dayOfWeek = dayjs(date.toDate(getLocalTimeZone())).format('dddd');
    const [start, end] = workHours[dayOfWeek].split('-');
    const interval = parseInt(clinics.find(c => c.label === selectedClinic).time);
    
    generateAvailableTimes(date,start, end, interval);
    
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

    if (SelectedApp['doctorID'] != selectedDoctorID){
      let DocInfo = await supabase.from("DocInfo").select('*').eq('DocID',selectedDoctorID);
      let new_AppNum=DocInfo['data'][0]['AppNum']+1 
      await supabase.from("DocInfo").update({ AppNum: new_AppNum }).eq('DocID',selectedDoctorID);

      DocInfo = await supabase.from("DocInfo").select('*').eq('DocID',SelectedApp['doctorID']);
      new_AppNum=DocInfo['data'][0]['AppNum']-1 
      await supabase.from("DocInfo").update({ AppNum: new_AppNum }).eq('DocID',SelectedApp['doctorID']);
    }
    else{
      let DocInfo = await supabase.from("DocInfo").select('*').eq('DocID',SelectedApp['doctorID']);
      let new_AppNum=DocInfo['data'][0]['AppNum']-1 
      await supabase.from("DocInfo").update({ AppNum: new_AppNum }).eq('DocID',SelectedApp['doctorID']);

    }
    



    const appointmentData = {
      appointmentId:SelectedApp['appointmentId'],
      patientID:patientID,
      clinic: selectedClinic,
      date: focusedDate.toString(),
      time: selectedTime,
      DocID:selectedDoctorID,
      doctor: selectedDoctoBackend,
      patientName,
      patientPhone,
      patientEmail,
      Priority: 1 ,
      RoomNum:selectedDoctorRoom,
      Finished:false,
      checkedIn:false
    };



  await supabase.from("Appointment").update([ { 
      appointmentId:SelectedApp['appointmentId'],
      patientID: patientID, 
      scheduledTime:selectedTime,
      Priority: 1 ,
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
    } ]).eq('appointmentId',SelectedApp['appointmentId']);

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
    setSelectedDoctorID(0);
    setselectedDoctorRoom(0);
    setPatientID(0);
    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    setTimeout(() => setBookingStatus(null), 5000);
    
    setUpdateAppointmentInfo(false);
      
    // Clear booking status after 5 seconds
    
    window.location.reload();

  };


  const isBookingDisabled = useMemo(() => {
    return !selectedClinic || !focusedDate || !selectedTime || !selectedDoctor.size || !patientName || !patientPhone || !patientEmail;
  }, [selectedClinic, focusedDate, selectedTime, selectedDoctor, patientName, patientPhone, patientEmail]);




  const renderCell = (appointment, columnKey,App) => {
    
    let Confirmed = appointment['Finished'] & appointment['checkedIn'];
    let Pending = (!appointment['Finished'] & !appointment['checkedIn']) || (!appointment['Finished'] & appointment['checkedIn']);
    let Cancelled = (appointment['Finished'] & !appointment['checkedIn']);
    let status = ""

    if (Confirmed){
      status = "Confirmed"
    }
    else if (Cancelled) {
      status = "Cancelled"
    }
    else if (Pending) {
      status = "Pending"
    }
     
    switch (columnKey) {
      case "status":
        return (        
          <Chip color={statusColorMap[status]} variant="flat">
            {status}
          </Chip>
        );
      case "actions":
        if (status == "Confirmed"){
          return (
          <div className="flex gap-2">
          <Tooltip content="View Details">
            <Button isIconOnly size="sm" variant="light" onPress={()=> HandleViewDetails(App)}>
              <FaEye />
            </Button>
          </Tooltip>
          <Tooltip content="Edit Appointment">
            <Button isIconOnly size="sm" variant="light" isDisabled>
              <FaEdit />
            </Button>
          </Tooltip>
          <Tooltip content="Cancel Appointment" color="danger">
            <Button isIconOnly size="sm" variant="light" color="danger" isDisabled>
              <FaTrash />
            </Button>
          </Tooltip>
        </div>
        );}
        else if (status == "Pending"){
          return (
            <div className="flex gap-2">
              <Tooltip content="View Details">
                <Button isIconOnly size="sm" variant="light" onPress={()=> HandleViewDetails(App)} >
                  <FaEye />
                </Button>
              </Tooltip>
              <Tooltip content="Edit Appointment">
                <Button isIconOnly size="sm" variant="light"   onPress={()=> HandleEditSection(App)}  >
                  <FaEdit />
                </Button>
              </Tooltip>
              <Tooltip content="Cancel Appointment" color="danger">
                <Button isIconOnly size="sm" variant="light" color="danger" onPress={()=>HandleDeleteModal(App)} >
                  <FaTrash />
                </Button>
              </Tooltip>
            </div>
          );}
        else if (status == "Cancelled"){
          return (
          <div className="flex gap-2">
          <Tooltip content="View Details">
            <Button isIconOnly size="sm" variant="light" isDisabled>
              <FaEye />
            </Button>
          </Tooltip>
          <Tooltip content="Edit Appointment">
            <Button isIconOnly size="sm" variant="light" isDisabled>
              <FaEdit />
            </Button>
          </Tooltip>
          <Tooltip content="Cancel Appointment" color="danger">
            <Button isIconOnly size="sm" variant="light" color="danger" isDisabled >
              <FaTrash />
            </Button>
          </Tooltip>
        </div>
        );}

      default:
        return status;
    }
  };
  return (
    <MainLayout title={!UpdateAppointmentInfo? "Appointments": "Edit Appointment Details" }sidebarButtons={sidebarButtons} userName="Abdullah Aalalwi" userType="Patient">
      {!UpdateAppointmentInfo?(
        <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Appointments</h1>
        <Table aria-label="Appointments table">
          <TableHeader>
            <TableColumn>DATE</TableColumn>
            <TableColumn>TIME</TableColumn>
            <TableColumn>DOCTOR</TableColumn>
            <TableColumn>CLINIC</TableColumn>
            <TableColumn>ROOM</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.appointmentId}>
              <TableCell>{appointment.AppDate}</TableCell>
              <TableCell>{appointment.scheduledTime}</TableCell>
              <TableCell>{appointment.doctorName}</TableCell>
              <TableCell>{appointment.clinic}</TableCell>
              <TableCell>{appointment.roomNumber}</TableCell>
              <TableCell>{renderCell(appointment, "status",appointment)}</TableCell>
              <TableCell>{renderCell(appointment, "actions",appointment)}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        
        <Modal size="2xl" isOpen={DeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-2">Appointment Summary</ModalHeader>
            <ModalBody>
              <p> This Action Will Delete The Appoinment Are You Sure ? </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button  color="danger" className="bg-danger text-white"  onPress={HandleDelete}>
                Delete Appoitnment
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Appointment Full Details</ModalHeader>
            <ModalBody>
              <Chip color="primary" variant="flat">Clinic: {SelectedApp['clinic']}</Chip>
              <Chip color="primary" variant="flat">Date: {SelectedApp['AppDate']}</Chip>
              <Chip color="primary" variant="flat">Time: {SelectedApp['scheduledTime']}</Chip>
              <Chip color="primary" variant="flat">Doctor: {SelectedApp['doctorName']}</Chip>
              <Chip color="primary" variant="flat">Room: {SelectedApp['roomNumber']}</Chip>
              <Chip color="primary" variant="flat">Patient: {SelectedApp['patientName']}</Chip>
              <Chip color="primary" variant="flat">Phone: {SelectedApp['PatientPhone']}</Chip>
              <Chip color="primary" variant="flat">Email: {SelectedApp['PatientEmail']}</Chip>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="bg-kfupmgreen text-white"  onPress={() => setIsViewModalOpen(false)} >
                Okay
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>


        </div>
        </>  
      ):(
        <>
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
              <h2 className="text-2xl font-bold mb-4 justify-center">Select Date & Time</h2>
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
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={patientName}
                  isDisabled
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
                 Update Apppointment Information
                </Button>

                <Button size="lg" className=" w-full mt-4 "onClick={GoBack} >
                  Go back
                </Button>
                
                {bookingStatus === 'success' && (
                  <p className="text-success mt-2 text-center">Appointment Information successfully Updated!</p>
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
              <Button color="primary" className="bg-kfupmgreen text-white"  onPress={confirmBooking}>
                Confirm Appointment Updates
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </div>

     
      </>

)}

    </MainLayout>
  );
};

export default AppointmentsPage;
