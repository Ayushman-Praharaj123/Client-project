import Contact from "../models/Contact.js";

// Submit contact form
export async function submitContact(req, res) {
  try {
    const { name, email, phoneNumber, message } = req.body;

    if (!name || !email || !phoneNumber || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({
      name,
      email,
      phoneNumber,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We will contact you soon.",
      contact,
    });
  } catch (error) {
    console.log("Error in submitContact controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

