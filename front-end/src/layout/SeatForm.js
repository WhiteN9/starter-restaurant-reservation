function SeatForm({
  onSubmit,
  onCancel,
  // tables, not sure
  // setTables, not sure
  submitLabel,
  cancelLabel,
}) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <div className="row">
          <div className="form-group col">
            <label htmlFor="table_id">Seat at:</label>
            <select
              id="table_id"
              name="table_id"
              className="form-control required"
            >
              <option value>Select a table</option>
              <option>Insert the rest of the tables here</option>
              <option>
                {/* `{table.table_name} - {table.capacity}` */}
              </option>
            </select>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={onCancel}
        >
          <span className="oi oi-x"></span>
          &nbsp;{cancelLabel}
        </button>
        <button type="submit" className="btn btn-primary">
          <span className="oi oi-check"></span>
          &nbsp;{submitLabel}
        </button>
      </fieldset>
    </form>
  );
}

export default SeatForm;
