
import React, { useState } from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck ,FaHandHoldingMedical, FaEye,FaSyringe} from "react-icons/fa";
import { MdVaccines } from "react-icons/md";
import { FaVialVirus, FaHandsHoldingChild} from "react-icons/fa6";
import { GiStomach,GiToothbrush } from "react-icons/gi";
import { TbDental,TbDentalBroken , TbVaccineBottle} from "react-icons/tb";
import { BsEar } from "react-icons/bs";
import { Button, Calendar , Select, SelectItem,ScrollShadow,Input} from "@nextui-org/react";
import {today, getLocalTimeZone , now} from "@internationalized/date";
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const ScheduleAppointmentPage = () => {
  const sidebarButtons = [
    { label: "Schedule Appointment", icon: FaCalendarPlus, path: "/schedule-appointment" },
    { label: "Appointments", icon: FaCalendarCheck, path: "/appointments" },
  ];

  const clinics = [ 
    { label: "Flu vaccination (home service) - تطعيم الانفلونزا في المنازل", icon: MdVaccines, time:"15 minutes"},
    { label: "Internal Medicine Clinic - عيادة الباطنية" , icon: GiStomach, time:"20 minutes"},
    { label: "HPV vaccine - تطعيم فيروس الورم الحليمي البشري", icon: FaVialVirus, time:"15 minutes"},
    { label: "Ophthalmology Clinic - عيادة العيون" , icon: FaEye, time:"20 minutes"},
    { label: "Cleaning and polishing - تنظيف الأسنان", icon: GiToothbrush, time:"40 minutes"},
    { label: "Recombinant Zoster Vaccine - لقاح الحزام الناري", icon: FaSyringe, time:"20 minutes"},
    { label: "Obstetrics&Gynecology - النساء والولادة", icon: FaHandsHoldingChild, time:"20 minutes"},
    { label: "Dermatology Clinic - عيادة الجلدية" , icon: FaHandHoldingMedical, time:"20 minutes"},
    { label: "Root canal treatment- علاج عصب الاسنان", icon: TbDentalBroken, time:"40 minutes"},
    { label: "Dental clinic - عيادة الاسنان", icon: TbDental, time:"40 minutes"},
    { label: "ENT Clinic - عيادة الأنف والأذن والحنجرة", icon: BsEar, time:"20 minutes"},
    { label: "Children vaccination - تطعيم الاطفال"  , icon: TbVaccineBottle, time:"20 minutes"}
  ];
  const workHours = {Sunday:"7:30 AM-10:00 PM",Monday:"7:30 AM-10:00 PM",Tuesday:"7:30 AM-10:00 PM",
                     Wednesday:"7:30 AM-10:00 PM",Thursday:"7:30 AM-10:00 PM",Friday:"9:00 AM-2:00 PM",Saturday:"9:00 AM-2:00 PM"};

  const ClinicsTime = {"Flu vaccination (home service) - تطعيم الانفلونزا في المنازل":"15 minutes"
                      ,"Internal Medicine Clinic - عيادة الباطنية":"20 minutes", "HPV vaccine - تطعيم فيروس الورم الحليمي البشري":"15 minutes"
                      ,"Ophthalmology Clinic - عيادة العيون":"20 minutes","Cleaning and polishing - تنظيف الأسنان":"40 minutes"
                      ,"Recombinant Zoster Vaccine - لقاح الحزام الناري":"20 minutes","Obstetrics&Gynecology - النساء والولادة":"20 minutes"
                      ,"Dermatology Clinic - عيادة الجلدية":"20 minutes","Root canal treatment- علاج عصب الاسنان":"40 minutes"
                      ,"Dental clinic - عيادة الاسنان":"40 minutes"
                      ,"ENT Clinic - عيادة الأنف والأذن والحنجرة":"20 minutes","Children vaccination - تطعيم الاطفال":"20 minutes"
   };

  const Doctors = {"Flu vaccination (home service) - تطعيم الانفلونزا في المنازل":["Anyone"," Flu vaccination home service-تطعيم الانفلونزا في المنازل "]
                  , "Internal Medicine Clinic - عيادة الباطنية":["Anyone","Dr. Abdullah Alrashed / د. عبدالله الراشد","Dr. Damodar Tolani / د. دامودار تولانى"]
                  ,"HPV vaccine - تطعيم فيروس الورم الحليمي البشري":["Anyone","HPV vaccine-تطعيم فيروس الورم الحليمي البشري"]
                  ,"Ophthalmology Clinic - عيادة العيون":["Anyone"," Dr. Salman Abu Mazyad "]
                  ,"Cleaning and polishing - تنظيف الأسنان":["Anyone","Dr. Eman Al-Saif / د.ايمان السيف","Dr. Fares Al-Harbi / د. فارس الحربي","Dr. Samar Azher yousuf / د.سمر يوسف"]
                  , "Recombinant Zoster Vaccine - لقاح الحزام الناري":["Anyone","Recombinant Zoster Vaccine - لقاح الحزام الناري"]
                  ,"Obstetrics&Gynecology - النساء والولادة": ["Anyone","Dr. Hanan Al Shaikh / د. حنان الشيخ"]
                  ,"Dermatology Clinic - عيادة الجلدية":["Anyone","Dr. Mohammed Jaafar / د. محمد جعفر"]
                  ,"Root canal treatment- علاج عصب الاسنان":["Anyone","Dr. Samar Azher yousuf / د.سمر يوسف"]
                  ,"Dental clinic - عيادة الاسنان":["Anyone","Dr. Eman Mahdi Al-Saif / د.ايمان السيف","Dr. Fares Nawaf Al-Harbi / د. فارس نواف الحربي"]
                  ,"ENT Clinic - عيادة الأنف والأذن والحنجرة":["Anyone"," Dr. Imtiaz Ahmad / د. امتياز أحمد"]
                  ,"Children vaccination - تطعيم الاطفال":["Anyone","Children vaccination - تطعيم الاطفال"]
  };

  const AppointmentsTime = (start,end,dif) => {
    let StartparsedTime = dayjs(start, 'h:mmA'); 
    let Starthours = StartparsedTime.hour();
    let Startminutes = StartparsedTime.minute();
    let StartTime = Starthours * 60 + Startminutes; 

    let EndparsedTime = dayjs(end, 'h:mmP'); 
    let EndHours = EndparsedTime.hour();
    let EndMinutes = EndparsedTime.minute();
    let EndTime = (EndHours+12) * 60 + EndMinutes ; 

    let interval = parseInt(dif, 10);

    let AvailableTimes = [];

   for (let time = StartTime; time <= EndTime; time = time + interval) {
      let hours = Math.floor(time / 60);
      let minutes = time % 60;
      let formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`; 
      AvailableTimes.push(formattedTime);

  }
  setAvailableTimes(AvailableTimes);
}

  const handleButtonClick = (buttonName) => {
    setSelectedClinic(buttonName);
    setAvailableTimes([])
  };

  const handleFocusChange = (date) => {
    let DateInput  = `${date.year}-${date.month}-${date.day}`
    setFocusedDate(date);
    let DayInput =  dayjs(DateInput).format('dddd')
    let StartTime = workHours[DayInput].substring(0,7)
    let EndTime = workHours[DayInput].substring(8)
    let TimeInterval = ClinicsTime[SelectedClinic].substring(0,2)
    AppointmentsTime(StartTime,EndTime,TimeInterval)

    
  };

  const handleBookAppointment = () => {
    const PatientData= [SelectedClinic,focusedDate,selectedTimeButton,SelectedDoctor,inputRefName,inputRefNum,inputRefEmail]
    BookAppointment(PatientData)
    console.log("patientInfo",PatientData)

  };
  const handleSelectionChange = (keys) => {
    setSelectedDoctor(keys);

  };
 

  let defaultDate = today(getLocalTimeZone());
  const [focusedDate, setFocusedDate] = useState(defaultDate);
  const [SelectedClinic, setSelectedClinic] = useState("Flu vaccination (home service) - تطعيم الانفلونزا في المنازل");
  const [AvailableTimes, setAvailableTimes] = useState([]);
  const [selectedTimeButton,handleTimeButton] = useState("")
  const [PatientInfo ,BookAppointment ] = useState([])
  const [SelectedDoctor, setSelectedDoctor] = useState("");
  const [inputRefName,SetName] = useState("");
  const [inputRefNum,SetNum]= useState("");
  const [inputRefEmail,SetEmail] = useState("");



  return (
    <MainLayout title="Schedule Appointment" sidebarButtons={sidebarButtons} userName="Abdullah Alalawi" userType="Patient">
      <div className="grid grid-cols-2 grid-rows-2" >
          {clinics.map((clinic) => (
                  <Button
                    key={clinic.label}
                    ripple={true}
                    startContent={<><clinic.icon className="mr-2 w-10 h-10" />  </>}
                    className={`text-start justify-between px-4 text-base min-w-10 py-7 focus:outline-none rounded-lg ${
                      SelectedClinic === clinic.label
                        ? "bg-kfupmgreen text-white font-semibold"
                        : "bg-transparent text-textlightgray font-normal"
                    }`}

                    endContent={<span className={`${
                      SelectedClinic === clinic.label
                        ? "bg-kfupmgreen text-white font-semibold"
                        : "bg-transparent text-textlightgray font-normal" } 
                        bg-transparent text-textlightgray text-sm`}>{clinic.time}</span>}
                    onClick={() => handleButtonClick(clinic.label)}
                  >
                  {clinic.label}
                  </Button>
          ))}

            <Calendar 
                aria-label="Date (Controlled Focused Value)"
                classNames={{
                  cellButton: "hover:bg-kfupmgreen  hover:text-white focus:bg-kfupmgreen  focus:text-white"                    
                }}
                value={focusedDate}
                focusedValue={focusedDate}
                onChange={handleFocusChange}
                onFocusChange={handleFocusChange}
                minValue={now("Etc/UTC")}
                maxValue={now("Etc/UTC").add({ months: 1 })}   
            />
              
            <Select
                  
                    labelPlacement="outside-left"
                    placeholder="Select a Doctor"
                    className="max-w-full py-7 px-4"
                    classNames={{
                      base:"p-16",
                      selectorIcon: "-right-0",
                      inputWrapper: [
                        "bg-BackgroundWhite",
                        "data-[hover=true]:bg-BackgroundWhite/20",
                        "group-data-[focus=true]:bg-BackgroundWhite/30",
                      ]
                    }}
                    selectedKeys={SelectedDoctor}
                    onSelectionChange={handleSelectionChange}
                    
                    
                  >
                    {Doctors[SelectedClinic].map((Doctor,index) => (
                      <SelectItem name={Doctor} value={Doctor} key={Doctor}>
                        {Doctor}
                      </SelectItem>
                    ))}
            </Select>
            <div className="flex justify-start">
             <ScrollShadow  size={100} className="snap-center w-[700px] h-[px]">
            {AvailableTimes.map((Times) => (
            <Button 
                    key={Times}
                    ripple={true}
                    className={`text-start justify-between px-4 text-base  py-7 focus:outline-none rounded-lg ${
                      selectedTimeButton === Times
                        ? "bg-kfupmgreen text-white font-semibold"
                        : "bg-transparent text-textlightgray font-normal"
                    }`}
                    onClick={() => handleTimeButton(Times)}   
                    >
                    {Times}
            </Button>
             ))}
            
             </ScrollShadow>

        </div>
            
        </div>

        <div className="flex justify-center">
          <p className="text-3xl">Patient Infromation</p>
        </div>
        <div className="grid grid-cols-1 ">

          <Input type="name" className="max-w-full"
              classNames={{
                
                inputWrapper: [
                  "bg-BackgroundWhite",
                  "data-[hover=true]:bg-BackgroundWhite/20",
                  "group-data-[focus=true]:bg-BackgroundWhite/30",
                ],
                label: "text-kfupmdarkgray",
              }}
              
              value={inputRefName}
              onValueChange={SetName}

              color="kfupmlightgray"
              placeholder="Patient Name" />
          <Input type="name" className="max-w-full"
              classNames={{
                
                inputWrapper: [
                  "bg-BackgroundWhite",
                  "data-[hover=true]:bg-BackgroundWhite/20",
                  "group-data-[focus=true]:bg-BackgroundWhite/30",
                ],
                label: "text-kfupmdarkgray",
              }}
              value={inputRefNum}
              onValueChange={SetNum}
              
              color="kfupmlightgray"
              placeholder="Phone Number" />
            <Input type="email" className="max-w-sx"
              classNames={{
                
                inputWrapper: [
                  "bg-BackgroundWhite",
                  "data-[hover=true]:bg-BackgroundWhite/20",
                  "group-data-[focus=true]:bg-BackgroundWhite/30",
                ],
                label: "text-kfupmdarkgray",
              }}
              
              value={inputRefEmail}
              onValueChange={SetEmail}
              color="kfupmlightgray"
              placeholder="Email" />


        </div>
        <div className="flex justify-center">
        <Button 
                   
                    ripple={true}
                    className={`text-start justify-between px-4 text-base  py-7 focus:outline-none rounded-lg  bg-kfupmgreen text-white font-semibold`}
                    onClick={() => handleBookAppointment()} 
                    >
                    Book Appointment
            </Button>
        </div>
    </MainLayout>
  );
};

export default ScheduleAppointmentPage;
