import React, { useState } from "react";
import { useHistory } from "react-router";
import CreateTableForm from "./CreateTableForm";
import { createTables } from "../../utils/api";

function CreateTable() {
  const history = useHistory();

  const initialTableInfo = {
    table_name: "",
    capacity: 0,
  };
  const [tableInfo, setTableInfo] = useState(initialTableInfo);

  //Send the table info to the express server
  const handleCreateTable = async (evt) => {
    evt.preventDefault();
    await createTables({
      ...tableInfo,
      capacity: parseInt(tableInfo.capacity),
    });
    setTableInfo(initialTableInfo);
    history.push("/");
  };

  //Go back to the previous page or to the dashboard after clicking cancel
  const onCancel = () => {
    setTableInfo(initialTableInfo);
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
  };
  return (
    <main>
      <h1>Create Table</h1>
      <CreateTableForm
        onSubmit={handleCreateTable}
        onCancel={onCancel}
        tableInfo={tableInfo}
        setTableInfo={setTableInfo}
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
    </main>
  );
}

export default CreateTable;
