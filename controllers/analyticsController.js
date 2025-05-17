import Application from "../models/Application.js";

export const getApplicantsPerJob = async (req, res) => {
  try {
    // Use aggregation to group applications by job and count them.
    const results = await Application.aggregate([
      {
        $group: {
          _id: "$job",
          applicantsCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $project: {
          jobId: "$_id",
          title: "$jobDetails.title",
          applicantsCount: 1,
          _id: 0, // Do not return the _id field from the group stage
        },
      },
    ]);

    res.json(results);
  } catch (error) {
    console.error("Error getting applicants per job:", error);
    res.status(500).json({ message: "Server error" });
  }
};
