function validateJobQuery(req, res, next) {
  const { search, location, minSalary, maxSalary, page, limit, sort } =
    req.query;

  let parsedPage = 1;
  let parsedLimit = 10;

  if (page !== undefined) {
    parsedPage = Number(page);

    if (!Number.isFinite(parsedPage) || parsedPage <= 0) {
      return res.status(400).json({
        message: "Page must be a positive number.",
      });
    }
  }

  if (limit !== undefined) {
    parsedLimit = Number(limit);

    if (
      !Number.isFinite(parsedLimit) ||
      parsedLimit <= 0 ||
      parsedLimit > 100
    ) {
      return res.status(400).json({
        message: "Limit must be a positive number between 1 and 100.",
      });
    }
  }

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

  if (sort !== undefined) {
    const allowedSorts = ["salary_asc", "salary_desc"];

    if (!allowedSorts.includes(sort)) {
      return res.status(400).json({
        message:
          "Invalid sort option. Allowed values are 'salary_asc' or 'salary_desc'.",
      });
    }
  }

  req.jobQuery = {
    search: search?.trim(),
    location: location?.trim(),
    minSalary: parsedMinSalary,
    maxSalary: parsedMaxSalary,
    page: parsedPage,
    limit: parsedLimit,
    sort,
  };

  next();
}

module.exports = validateJobQuery;
