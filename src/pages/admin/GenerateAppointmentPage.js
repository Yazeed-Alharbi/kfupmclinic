import React, { useState } from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import {DeleteIcon} from "../../assets/deleteIcon";
import {
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue
} from "@nextui-org/react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";

export const clinics = [
  { key: "Internal Medicine Clinic", label: "Internal Medicine Clinic" },
  { key: "Ophthalmology Clinic", label: "Ophthalmology Clinic" },
  { key: "Dermatology Clinic", label: "Dermatology Clinic" },
  { key: "Dental clinic", label: "Dental clinic" },
];

export const doctors = {
  "Internal Medicine Clinic": [
    { key: "Dr. Scut Tom", label: "Dr. Scut Tom", index: 1,status: "Vacation",name: "Dr. Banabas Paul",days:["Sunday","Tuesday"]},
    { key: "Dr. Amina Ahmed", label: "Dr. Amina Ahmed", index: 2,status: "Vacation", },
  ],
  "Ophthalmology Clinic": [
    { key: "Dr. Banabas Paul", label: "Dr. Banabas Paul", index: 1,status: "Vacation", name: "Dr. Banabas Paul",days:["Sunday","Tuesday"] },
    { key: "Dr. Ayo Jones", label: "Dr. Ayo Jones", index: 2,status: "Vacation",name: "Dr. Banabas Paul" ,days:["Sunday","Thursday"] },
    { key: "Dr. Michael Stwart", label: "Dr. Michael Stwart", index: 3,status: "Vacation", name: "Dr. Banabas Paul",days:["Sunday","Tuesday"] },
  ],
  "Dermatology Clinic": [
    { key: "Dr. Kemi Olowojeje", label: "Dr. Kemi Olowojeje", index: 1,status: "Vacation",name: "Dr. Banabas Paul",days:["Sunday","Tuesday"]  },
    { key: "Dr. Ebuka Kelechi", label: "Dr. Ebuka Kelechi", index: 2,status: "Vacation",name: "Dr. Banabas Paul" ,days:["Sunday","Tuesday"] },
  ],
  "Dental clinic": [
    { key: "Dr. Ibrahim Yekeni", label: "Dental clinic", index: 1,status: "Vacation", name: "Dr. Banabas Paul"  },
  ],
};

const GenerateAppointmentPage = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [clinicValue, setClinicValue] = useState("");
  const [doctorValue, setDocotrValue] = useState("");
  const [selected, setSelected] = useState([]);
  const [tableSelect, setTableSelect] = useState("");
  const [rows, setRows] = useState([]);
  const sidebarButtons = [
    {
      label: "Generate Appointment",
      icon: FaCalendarPlus,
      path: "/generate-appointment",
    },
    {
      label: "Schedule Appointment",
      icon: FaCalendarCheck,
      path: "/admin-schedule-appointment",
    },
    {
      label: "Doctor Schedule",
      icon: RiCalendarScheduleFill,
      path: "/admin-doctor-schedule",
    },
    { label: "Queue Management", icon: FaPersonWalkingDashedLineArrowRight, path: "/queue-management" },
  ];
  const TablekeyValue= () =>{

  }
  const handleClinicChange = (e) => {
    setClinicValue(e);
    setDocotrValue("");
  };
  const handleDoctorChange = (e) => {
    setDocotrValue(e);
  };
  const handlesCheckBox = (e) => {
    setSelected(e);
  };
  const handleAppointmentChange = () => {
    setShowSchedule(!showSchedule);
    setClinicValue("");
    setDocotrValue("");
    setSelected([]);
  };
  const handleSelection = (key) => {
    if(key){
      setTableSelect(key);
      console.log(key)
      let selectedRow=  doctors[key].map((item) => {if(item.days) return item}) // todo make this days
      setRows(selectedRow)
    }
    else{
      setTableSelect(key);
      setRows([])
    }
    
  };
  const handleDelete= (key,clinic) => {
     delete doctors[clinic][key-1].days; // TODO change handler later
     handleSelection(clinic)
  }
  const DayIcon = ( {day} ) => {
   
    const getDayLetter = (day) => {
      
      return day ? day.charAt(0).toUpperCase() : '';
    };
    const getDayLetterDuplicate = (day) => {
      if(day.charAt(0).toUpperCase()==='T'){
        return day.charAt(1).toUpperCase() === 'U'? 'T':'R';
      }
      if(day.charAt(0).toUpperCase()==='S'){
        return day.charAt(1).toUpperCase() === 'U'? 'U':'S';
      }
    };
  
  
    return (
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-kfupmgreen text-white text-s font-bold">
        {(getDayLetter(day)!=='S' &&  getDayLetter(day)!=='T')? getDayLetter(day): getDayLetterDuplicate(day)}
      </div>
    );
  };

  // const rows = [
  //   { key: "1", name: "Tony Reichert", days: "CEO", status: "Active" },
  //   { key: "2", name: "Zoey Lang", days: "Technical Lead", status: "Paused" },
  //   { key: "3", name: "Jane Fisher", days: "Senior Developer", status: "Active" },
  //   { key: "4", name: "William Howard", days: "Community Manager", status: "Vacation" },
  // ];
  
  const columns = [
    { key: "name", label: "NAME" },
    { key: "days", label: "DAYS" },
    { key: "action", label: "ACTION" },
  ];
  const DayIconList = ( days ) => {
    console.log(days)
    return (
      <div className="flex space-x-2">
        {days.map((day, index) => (
          <>
          <DayIcon key={index} day={day} />
          </>
        ))}
      </div>
    );
  };
  const handleGenerateAppointment = () => {
    
  };
  return (
    
    <MainLayout
      title="Generate Appointment"
      sidebarButtons={sidebarButtons}
      userName="Rayan Alamrani"
      userType="Admin"
    >
      {!showSchedule ? (
        <>
          <div className=" items-start flex w-full flex-wrap md:flex-nowrap gap-4 ml-10 mt-10 mb-5">
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
              isDisabled={!clinicValue}
              label="Doctor"
              placeholder="Choose a clinic"
              className="max-w-xs"
              onChange={(e) => handleDoctorChange(e.target.value)}
            >
              {clinicValue &&
                doctors[clinicValue].map((doctor) => (
                  <SelectItem key={doctor.key} value={doctor.key}>
                    {doctor.label}
                  </SelectItem>
                ))}
            </Select>
            <CheckboxGroup
                label="Select days"
                value={selected}
                onValueChange={(e) => handlesCheckBox(e)}
                className="flex-initial w-60 "
                isDisabled={!doctorValue}
                >
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <Checkbox value="Sunday">Sunday</Checkbox>
                  <Checkbox value="Monday">Monday</Checkbox>
                  <Checkbox value="Tuesday">Tuesday</Checkbox>
                  <Checkbox value="Wednesday">Wednesday</Checkbox>
                  <Checkbox value="Thursday">Thursday</Checkbox>
                  <Checkbox value="Friday">Friday</Checkbox>
                  <Checkbox value="Saturday">Saturday</Checkbox>
              </div>
            </CheckboxGroup>

          </div>
          <div className="buttonDiv ">
            <Button
              className="ml-10 bg-kfupmgreen text-white"
              isDisabled={selected.length === 0}
              onClick={handleGenerateAppointment}
            >
              Generate Appointment Slot 
            </Button>
            <Button
              className="ml-10 bg-kfupmgreen text-white"
              onClick={handleAppointmentChange}
            >
              View Appointment Slot
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className=" items-start flex w-full flex-wrap md:flex-nowrap gap-4 ml-10 mt-10 mb-5">
            <Select
              label="Select a clinic"
              className="max-w-xs"
              onChange={(e) => handleSelection(e.target.value)}
              placeholder="Choose a clinic"
            >
              {clinics.map((clinic) => (
                <SelectItem key={clinic.key} value={clinic.key}>
                  {clinic.label}
                </SelectItem>
              ))}
            </Select>
          </div>
         
          {(tableSelect)?(<>
          
          <div className="items-start flex flex-wrap md:flex-nowrap gap-4 ml-10 mt-10 mb-10 my-4  max-w-4xl p-0">
            <Table aria-label="Example table with dynamic content" className="">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  
                  <TableRow key={item.key}>
                    {/* {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>} */}
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{DayIconList(item.days)}</TableCell>
                    <TableCell className="flex justify-center">{ <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon onClick= {()=> handleDelete(item.index,tableSelect)} />
              </span>}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          </>):<div>
            
            </div>}
        
          <div>
            <Button
              className="ml-10 bg-kfupmgreen text-white"
              onClick={handleAppointmentChange}
            >
              Go Back
            </Button>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default GenerateAppointmentPage;
