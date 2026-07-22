const Log = require("../models/Log");

// Bulk Upload
exports.uploadLogs = async (req, res) => {
  try {
    const logs = req.body.logs;
    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ message: "Invalid data format" });
    }
    await Log.insertMany(logs);
    res.status(201).json({ message: `${logs.length} logs uploaded successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Logs with Filter, Search, Sort, Pagination
exports.getLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "timestamp",
      order = "desc",
      search = "",
      severity,
      status,
      action,
      region,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { actor: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { resource: { $regex: search, $options: "i" } },
        { ipAddress: { $regex: search, $options: "i" } },
      ];
    }

    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (action) query.action = action;
    if (region) query.region = region;

    const sortObj = { [sort]: order === "desc" ? -1 : 1 };

    const total = await Log.countDocuments(query);
    const logs = await Log.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};