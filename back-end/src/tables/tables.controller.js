const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name, capacity");

/**
 * List handler for table resources
 */
async function list(req, res) {
  const tableList = await service.list();
  console.log(tableList);
  res.json({ data: tableList });
}

/**
 * Post handler for creating a table in the database
 */
async function create(req, res) {
  const newTable = ({ table_name, capacity } = req.body.data);
  const createdTable = await service.create(newTable);
  res.status(201).json({ data: createdTable });
}
module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredProperties, asyncErrorBoundary(create)],
};
