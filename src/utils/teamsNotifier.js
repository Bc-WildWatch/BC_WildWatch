import axios from "axios";

export const postToTeams = async (incident) =>
{
    try
    {
        await axios.post(process.env.TEAMS_WEBHOOK_URL,
        {
            text:
            `🚨 NEW INCIDENT REPORTED ON BC WildWatch

Animal: ${incident.animal}
Location: ${incident.location}
Threat Level: ${incident.threatLevel}
Description: ${incident.description}
Reported At: ${incident.reportedAt}`
        });

    console.log("Teams notification sent.");
    } catch (error)
    {
        console.error("Failed to send Teams notification:", error.message);
    }
};