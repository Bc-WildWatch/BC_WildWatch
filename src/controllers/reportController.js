import Incident from "../models/Incident.js";
import AnimalType from "../models/AnimalType.js";
import Location from "../models/Location.js";
import User from "../models/User.js";

// GET all reports
export const getReports = async (req, res) =>
{
  try
  {
    const reports = await Incident.find().sort({ reportedAt: -1 });

    res.json(reports);
  } catch (error)
  {
    res.status(500).json(
    {
      message: "Failed to fetch reports.",
      error: error.message
    });
  }
}; // getReports

// CREATE report
export const createReport = async (req, res) =>
{
  try
  {
    const { animal,
            location,
            date,
            time,
            description,
            threatLevel } = req.body;

    const animalType = await AnimalType.findOne({ name: animal });

    const locationDoc = await Location.findOne({ building_name: location });

    const defaultUser = await User.findOne({ role: "student" });

    const newReport = await Incident.create({ animal,
                                            animal_type_id:animalType?._id,
                                            location,
                                            location_id:locationDoc?._id,
                                            user_id:defaultUser?._id,
                                            date,
                                            time,
                                            description,
                                            threatLevel });

    res.status(201).json(
    {
      message: "Report created successfully.",
      data: newReport
    });
  } catch (error)
  {
    res.status(400).json(
    {
      message: "Failed to create report.",
      error: error.message
    });
  }
}; //createReport

// UPDATE report
export const updateReport = async (req, res) =>
{
  try
  {
    const updatedReport = await Incident.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        });

    if (!updatedReport)
    {
      return res.status(404).json(
      { message: "Report not found." });
    }

    res.json(
    {
      message: "Report updated successfully.",
      data: updatedReport
    });
  } catch (error)
  {
    res.status(400).json(
    {
      message: "Failed to update report.",
      error: error.message
    });
  }
}; // updateReport

// DELETE report
export const deleteReport = async (req, res) =>
{
  try
  {
    const deletedReport = await Incident.findByIdAndDelete(req.params.id);

    if (!deletedReport)
    {
      return res.status(404).json({ message: "Report not found." });
    }

    res.json(
    {
      message: "Report deleted successfully.",
      data: deletedReport
    });
  } catch (error)
  {
    res.status(500).json(
    {
      message: "Failed to delete report.",
      error: error.message
    });
  }
}; //deleteReport