const validAnimals = ["Snake",
                      "Bee Swarm",
                      "Stray Dog",
                      "Cockroach",
                      "Other"];

const validThreatLevels = ["🟢 Benign — Non-threatening observation",
                          "🔵 Informational — Monitor only",
                          "🟡 Priority — Requires response",
                          "🔴 Extreme — Immediate danger"];

const validateReport = (req, res, next) =>
{
  let { animal,
        location,
        date,
        time,
        description,
        threatLevel } = req.body;

  // ─────────────────────────────
  // SANITIZATION
  // ─────────────────────────────

  animal = animal?.trim();
  location = location?.trim();
  date = date?.trim();
  time = time?.trim();
  description = description?.trim();
  threatLevel = threatLevel?.trim();

  // Save cleaned values back
  req.body = { animal,
             location,
             date,
             time,
             description,
             threatLevel };

  // ─────────────────────────────
  // REQUIRED FIELD VALIDATION
  // ─────────────────────────────

  if (!animal ||
     !location ||
     !date ||
     !time ||
     !description ||
     !threatLevel)
  {
    return res.status(400).json({ message:"All report fields are required." });
  }

  // ─────────────────────────────
  // ANIMAL VALIDATION
  // ─────────────────────────────

  if (!validAnimals.includes(animal))
  {
    return res.status(400).json({ message: "Invalid animal selection." });
  }

  // ─────────────────────────────
  // THREAT LEVEL VALIDATION
  // ─────────────────────────────

  if (!validThreatLevels.includes(threatLevel))
  {
    return res.status(400).json({ message: "Invalid threat level selection." });
  }

  // ─────────────────────────────
  // LOCATION VALIDATION
  // ─────────────────────────────

  if (location.length < 5 || location.length > 120)
  {
    return res.status(400).json({ message: "Location must be between 5 and 120 characters." });
  }

  // Campus-safe characters only
  const locationRegex = /^[a-zA-Z0-9\s.,\-()]+$/;

  if (!locationRegex.test(location))
  {
    return res.status(400).json({ message: "Location contains invalid characters." });
  }

  // ─────────────────────────────
  // DESCRIPTION VALIDATION
  // ─────────────────────────────

  if (description.length < 15 || description.length > 500)
  {
    return res.status(400).json({ message: "Description must be between 15 and 500 characters." });
  }

  // ─────────────────────────────
  // DATE VALIDATION
  // ─────────────────────────────

  // Convert DD/MM/YYYY → YYYY-MM-DD 
  const parts = date.split("/");
  
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  const submittedDate = new Date(formattedDate);

  const today = new Date();

  // Remove time component
  today.setHours(0, 0, 0, 0);

  if (submittedDate > today)
  {
    return res.status(400).json({ message: "Incident date cannot be in the future." });
  }

  // ─────────────────────────────
  // TIME VALIDATION
  // ─────────────────────────────

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(time))
  {
    return res.status(400).json({ message: "Invalid time format." });
  }

  // ─────────────────────────────
  // PASSED VALIDATION
  // ─────────────────────────────

  next();
};

export default validateReport;