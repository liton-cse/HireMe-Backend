import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { JOB_STATUS } from "../utils/constants.js";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: JOB_STATUS.ACTIVE }).populate(
      "createdBy",
      "name email role"
    );

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name email"
    );

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Employee
const createJob = async (req, res) => {
  const { title, description, requirements, location, salary, status } =
    req.body;

  try {
    const job = new Job({
      title,
      description,
      requirements,
      company: req.user._id,
      location,
      salary,
      status,
      createdBy: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Employee
const updateJob = async (req, res) => {
  const { title, description, requirements, location, salary, status } =
    req.body;

  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      // Check if the user is the owner of the job
      if (
        job.company.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(401).json({ message: "Not authorized" });
      }

      job.title = title || job.title;
      job.description = description || job.description;
      job.requirements = requirements || job.requirements;
      job.location = location || job.location;
      job.salary = salary || job.salary;
      job.status = status || job.status;
      job.updatedAt = Date.now();

      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Employee
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      // Check if the user is the owner of the job
      if (
        job.company.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(401).json({ message: "Not authorized" });
      }

      // Use deleteOne to delete the job
      await Job.deleteOne({ _id: req.params.id });

      res.json({ message: "Job removed" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private/JobSeeker
const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: job._id,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // Create application (payment will be handled separately)
    const application = new Application({
      job: job._id,
      applicant: req.user._id,
      cv: req.file.path,
      paymentStatus: "pending",
    });

    await application.save();

    res.status(201).json({
      message: "Application created. Please complete payment to submit.",
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get applications for a job how many applicant apply this job.
// @route   GET /api/jobs/:id/applications
// @access  Private/Employee
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user is the owner of the job
    if (
      job.company.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ job: job._id }).populate(
      "applicant",
      "name email"
    );

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Employee
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const application = await Application.findById(req.params.id).populate({
      path: "job",
      populate: {
        path: "createdBy",
        select: "_id",
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the user is the creator of the job
    if (
      application.job.createdBy._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
};
