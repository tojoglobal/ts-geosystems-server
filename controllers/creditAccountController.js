import db from "../Utils/db.js";

// Save Credit Account Application
export const saveCreditAccountApplication = async (req, res) => {
  try {
    const {
      companyName,
      tradingName,
      invoiceAddress,
      deliveryAddress,
      registeredOffice,
      tradingAddress,
      companyType,
      partnersInfo,
      vatNumber,
      companyNumber,
      incorporationDate,
      website,
      buyersContactName,
      buyersPhone,
      buyersEmail,
      accountsContactName,
      accountsPhone,
      accountsEmail,
      emailInvoices,
      invoiceEmail,
      ref1Company,
      ref1Phone,
      ref1Contact,
      ref1Email,
      ref1Address,
      ref2Company,
      ref2Phone,
      ref2Contact,
      ref2Email,
      ref2Address,
      applicantName,
      applicantPosition,
      applicantPhone,
      applicationDate,
      discoveryMethod,
      g2RepName,
    } = req.body;

    // Save file paths as JSON array
    const files = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const sql = `
  INSERT INTO credit_account_applications
  (companyName, tradingName, invoiceAddress, deliveryAddress, registeredOffice, tradingAddress, companyType, partnersInfo, vatNumber, companyNumber, incorporationDate, website,
   buyersContactName, buyersPhone, buyersEmail, accountsContactName, accountsPhone, accountsEmail, emailInvoices, invoiceEmail,
   ref1Company, ref1Phone, ref1Contact, ref1Email, ref1Address,
   ref2Company, ref2Phone, ref2Contact, ref2Email, ref2Address,
   applicantName, applicantPosition, applicantPhone, applicationDate, files, discoveryMethod, g2RepName)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    const values = [
      companyName,
      tradingName,
      invoiceAddress,
      deliveryAddress,
      registeredOffice,
      tradingAddress,
      companyType,
      partnersInfo,
      vatNumber,
      companyNumber,
      incorporationDate || null,
      website,
      buyersContactName,
      buyersPhone,
      buyersEmail,
      accountsContactName,
      accountsPhone,
      accountsEmail,
      emailInvoices,
      invoiceEmail,
      ref1Company,
      ref1Phone,
      ref1Contact,
      ref1Email,
      ref1Address,
      ref2Company,
      ref2Phone,
      ref2Contact,
      ref2Email,
      ref2Address,
      applicantName,
      applicantPosition,
      applicantPhone,
      applicationDate || null,
      JSON.stringify(files),
      discoveryMethod,
      g2RepName,
    ];

    await db.query(sql, values);

    res
      .status(201)
      .json({ message: "Credit Account Application submitted successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error saving credit account application." });
  }
};

// Get All Credit Account Applications
export const getAllCreditAccountApplications = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM credit_account_applications ORDER BY createdAt DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching credit account applications." });
  }
};
