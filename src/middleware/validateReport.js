const STANDARD_ANIMALS = ["Snake", "Bee Swarm", "Stray Dog", "Cockroach", "Other"];

const VALID_THREAT_LEVELS = [
  "🟢 Benign — Non-threatening observation",
  "🔵 Informational — Monitor only",
  "🟡 Priority — Requires response",
  "🔴 Extreme — Immediate danger"
];

const validateReport = (req, res, next) => {
  let { animal, customAnimal, location, date, time, description, threatLevel } = req.body;

  // Sanitize
  animal      = animal?.trim();
  customAnimal = customAnimal?.trim();
  location    = location?.trim();
  date        = date?.trim();
  time        = time?.trim();
  description = description?.trim();
  threatLevel = threatLevel?.trim();

  req.body = { animal, customAnimal, location, date, time, description, threatLevel };

  // Required fields
  if (!animal || !location || !date || !time || !description || !threatLevel) {
    return res.status(400).json({ message: "All report fields are required." });
  }

  // Animal: allow standard types or any custom non-empty string (max 80 chars)
  if (animal.length > 80) {
    return res.status(400).json({ message: "Animal name must be 80 characters or fewer." });
  }
  const animalRegex = /^[a-zA-Z0-9\s\-'().]+$/;
  if (!animalRegex.test(animal)) {
    return res.status(400).json({ message: "Animal name contains invalid characters." });
  }

  // If "Other" is selected, require a custom animal name
  if (animal === "Other")
  {
    if (!customAnimal)
    {
      return res.status(400).json({ message: "Please specify the animal." });
    }

    if (customAnimal.length > 80)
    {
      return res.status(400).json({ message: "Custom animal name must be 80 characters or fewer." });
    }

    if (!animalRegex.test(customAnimal))
    {
      return res.status(400).json({ message: "Custom animal name contains invalid characters." });
    }
  }

  // Threat level
  if (!VALID_THREAT_LEVELS.includes(threatLevel)) {
    return res.status(400).json({ message: "Invalid threat level selection." });
  }

  // Location
  if (location.length < 5 || location.length > 120) {
    return res.status(400).json({ message: "Location must be between 5 and 120 characters." });
  }
  const locationRegex = /^[a-zA-Z0-9\s.,\-()]+$/;
  if (!locationRegex.test(location)) {
    return res.status(400).json({ message: "Location contains invalid characters." });
  }

  // Description
  if (description.length < 15 || description.length > 500) {
    return res.status(400).json({ message: "Description must be between 15 and 500 characters." });
  }

  // Date — accept both YYYY-MM-DD (HTML input) and DD/MM/YYYY
  let parsedDate;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date))
  {
    const [year, month, day] = date.split("-");

    parsedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day));
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const [d, m, y] = date.split("/");
    parsedDate = new Date(`${y}-${m}-${d}`);
  } else {
    return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsedDate > today) {
    return res.status(400).json({ message: "Incident date cannot be in the future." });
  }

  // Time — HH:MM 24-hour
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    return res.status(400).json({ message: "Invalid time format. Use HH:MM (24-hour)." });
  }

  next();
};

export default validateReport;
