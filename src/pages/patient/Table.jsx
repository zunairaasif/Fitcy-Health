import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { customPatientList } from "../../redux/patient/patientThunks";

const Table = () => {
  const dispatch = useDispatch();

  const customPatient = useSelector(
    (state) => state.patient.custom_patient_list
  );

  useEffect(() => {
    dispatch(customPatientList());
    console.log(customPatient?.results.map((x) => x.first_name));
  }, []);

  const columns = [
    {
      name: "id",
      label: "ID",
    },
    {
      name: "fname",
      label: "First Name",
    },
    {
      name: "lname",
      label: "Last Name",
    },
    {
      name: "email",
      label: "Email",
    },
  ];

  const options = {
    filter: true,
    sort: true,
    filterType: "textField",
    searchPlaceholder: "Search",
  };
  return (
    <MUIDataTable
      title={"Patient Table"}
      data={customPatient?.results.map((x) => {
        return [x.id, x.first_name, x.last_name, x.email];
      })}
      columns={columns}
      options={options}
    />
  );
};

export default Table;
