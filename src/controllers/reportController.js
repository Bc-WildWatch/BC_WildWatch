import reports from "../data/reports.js";

export const getReports = (req,res) =>
{
    res.json(reports);
};

export const createReport = (req,res) =>
{
    const { animal,
            location,
            date,
            time,
            description,
            threatLevel } = req.body;

    if (!animal || !location || !threatLevel)
    {
        return res.status(400).json({ message: "Animal, location, and threat level are required." });
    }

    const newReport = { id: reports.length+1,
                        animal,
                        location,
                        date,
                        time,
                        description,
                        threatLevel,
                        status: "Active",
                        reportedAt: new Date() };

    reports.push(newReport);

    res.status(201).json({ message: "Report created successfully.",
                           data: newReport });
};//createReport

export const updateReport = (req,res) =>
{
    const reportId = parseInt(req.params.id);

    const report = reports.find(r => r.id === reportId);

    if (!report)
    {
        return res.status(404).json({ message: "Report not found." });
    }

    const { animal,
            location,
            date,
            time,
            description,
            threatLevel,
            status } = req.body;

    if (animal) report.animal = animal;
    if (location) report.location = location;
    if (date) report.date = date;
    if (time) report.time = time;
    if (description) report.description = description;
    if (threatLevel) report.threatLevel = threatLevel;
    if (status) report.status = status;

    res.json({ message: "Report updated successfully.",
               data: report });
};//updateReport

export const deleteReport = (req,res) =>
{
    const reportId = parseInt(req.params.id);

    const reportIndex = reports.findIndex(r => r.id === reportId);

    if (reportIndex === -1)
    {
        return res.status(404).json({ message: "Report not found." });
    }

    const deletedReport = reports.splice(reportIndex,1);

    res.json({ message: "Report deleted successfully.",
               data: deletedReport[0] });
};//deleteReport