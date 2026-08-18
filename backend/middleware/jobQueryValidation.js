function validateJobQuery(req, res, next) {
  const { search, location, minSalary, maxSalary } = req.query;

  if (search !== undefined) {
    if (typeof search !== "string" || search.trim() === "") {
      return res.status(400).json({
        message: "Invalid search query. It must be a non-empty string.",
      });
    }
  }

  if (location !== undefined) {
    if (typeof location !== "string" || location.trim() === "") {
      return res.status(400).json({
        message: "Location must be a non-empty string.",
      });
    }
  }

  let parsedMinSalary;
  let parsedMaxSalary;

  if (minSalary !== undefined) {
    parsedMinSalary = Number(minSalary);

    if (!Number.isFinite(parsedMinSalary) || parsedMinSalary <= 0) {
      return res.status(400).json({
        message: "Minimum salary must be a positive number.",
      });
    }
  }

  if (maxSalary !== undefined) {
    parsedMaxSalary = Number(maxSalary);

    if (!Number.isFinite(parsedMaxSalary) || parsedMaxSalary <= 0) {
      return res.status(400).json({
        message: "Maximum salary must be a positive number.",
      });
    }
  }

  if (
    parsedMinSalary !== undefined &&
    parsedMaxSalary !== undefined &&
    parsedMinSalary > parsedMaxSalary
  ) {
    return res.status(400).json({
      message: "Minimum salary cannot be greater than maximum salary.",
    });
  }

  req.jobQuery = {
    search: search?.trim(),
    location: location?.trim(),
    minSalary: parsedMinSalary,
    maxSalary: parsedMaxSalary,
  };

  console.log("NORMALIZED QUERY:", req.jobQuery);
  console.log("minSalary type:", typeof req.jobQuery.minSalary);

  next();
}

module.exports = validateJobQuery;
