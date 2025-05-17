import Application from "../models/Application.js";
import Invoice from "../models/Invoice.js";
// Mock payment processing
import { processPayment } from "../services/paymentService.js";

// @desc    Process payment for an application
// @route   POST /api/payments/process
// @access  Private/JobSeeker
const processApplicationPayment = async (req, res) => {
  const { applicationId, paymentMethod } = req.body;

  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the user is the applicant
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Check if payment is already done
    if (application.paymentStatus === "paid") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    // Process payment
    const paymentResult = await processPayment(applicationId, paymentMethod);

    if (paymentResult.success) {
      // Update application payment status
      application.paymentStatus = "paid";
      await application.save();

      // Create invoice
      const invoice = new Invoice({
        application: application._id,
        amount: 100,
        paymentMethod,
        transactionId: paymentResult.transactionId,
        status: "paid",
        paidAt: Date.now(),
      });

      await invoice.save();

      res.json({
        message: "Payment processed successfully",
        invoice,
      });
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get payment invoice
// @route   GET /api/payments/invoice/:id
// @access  Private
const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate({
      path: "application",
      populate: [
        {
          path: "job",
          select: "title company",
          populate: {
            path: "company",
            select: "name",
          },
        },
        {
          path: "applicant",
          select: "name email",
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Check if the user is the applicant or the job poster
    if (
      invoice.application.applicant._id.toString() !==
        req.user._id.toString() &&
      invoice.application.job.company._id.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { processApplicationPayment, getInvoice };
