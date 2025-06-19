import db from "../Utils/db.js";

// GET site settings (only one row)
export const getSettings = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM site_settings LIMIT 1");
  if (!rows.length)
    return res.status(404).json({ message: "No settings found" });
  // Parse meta_keywords
  rows[0].meta_keywords = JSON.parse(rows[0].meta_keywords || "[]");
  res.json(rows[0]);
};

// PUT update site settings (all fields)
export const updateSettings = async (req, res) => {
  let {
    appName,
    homeTitle,
    metaKeywords,
    metaDescription,
    mainLogo,
    favicon,

    // New extra fields
    decimalSeparatorEnable,
    decimalSeparator,
    currencyDirectionEnable,
    currencyDirection,
    decimalSeparatorSelectorEnable,
    decimalSeparatorSelector,
    thousandSeparatorEnable,
    thousandSeparator,

    // Script tab fields
    enableGoogleAnalytics,
    googleAnalyticsCode,
    enableGoogleAdsense,
    googleAdsenseCode,
    displayGoogleRecaptcha,
    googleRecaptchaSiteKey,
    googleRecaptchaSecretKey,
    displayFacebookPixel,
    facebookPixelCode,
    displayFacebookMessenger,
    facebookMessengerPageId,
    displayDisqus,
    disqusLink,
  } = req.body;

  console.log("appName", appName);

  // Get current row
  const [rows] = await db.query("SELECT * FROM site_settings LIMIT 1");
  if (!rows.length) {
    return res.status(404).json({ message: "No settings found" });
  }
  const settings = rows[0];

  // metaKeywords should be an array of strings, store as JSON string
  if (typeof metaKeywords === "string") {
    try {
      metaKeywords = JSON.parse(metaKeywords);
    } catch {
      metaKeywords = [];
    }
  }

  await db.query(
    `UPDATE site_settings SET 
      app_name = ?, 
      home_title = ?, 
      main_logo = ?, 
      favicon = ?, 
      meta_keywords = ?, 
      meta_description = ?, 

      decimal_separator_enable = ?, 
      decimal_separator = ?, 
      currency_direction_enable = ?, 
      currency_direction = ?, 
      decimal_separator_selector_enable = ?, 
      decimal_separator_selector = ?, 
      thousand_separator_enable = ?, 
      thousand_separator = ?,

      enable_google_analytics = ?,
      google_analytics_code = ?,
      enable_google_adsense = ?,
      google_adsense_code = ?,
      display_google_recaptcha = ?,
      google_recaptcha_site_key = ?,
      google_recaptcha_secret_key = ?,
      display_facebook_pixel = ?,
      facebook_pixel_code = ?,
      display_facebook_messenger = ?,
      facebook_messenger_page_id = ?,
      display_disqus = ?,
      disqus_link = ?,

      updated_at = NOW()
     WHERE id = ?`,
    [
      appName || settings.app_name,
      homeTitle || settings.home_title,
      mainLogo || settings.main_logo,
      favicon || settings.favicon,
      JSON.stringify(metaKeywords || []),
      metaDescription || settings.meta_description,

      // New extra fields
      Boolean(decimalSeparatorEnable),
      decimalSeparator || "off",
      Boolean(currencyDirectionEnable),
      currencyDirection || "left",
      Boolean(decimalSeparatorSelectorEnable),
      decimalSeparatorSelector || "dot",
      Boolean(thousandSeparatorEnable),
      thousandSeparator || "dot",

      // Script tab fields
      Boolean(enableGoogleAnalytics),
      googleAnalyticsCode || "",
      Boolean(enableGoogleAdsense),
      googleAdsenseCode || "",
      Boolean(displayGoogleRecaptcha),
      googleRecaptchaSiteKey || "",
      googleRecaptchaSecretKey || "",
      Boolean(displayFacebookPixel),
      facebookPixelCode || "",
      Boolean(displayFacebookMessenger),
      facebookMessengerPageId || "",
      Boolean(displayDisqus),
      disqusLink || "",

      settings.id,
    ]
  );
  res.json({ message: "Settings updated" });
};

// POST /api/settings/upload/mainLogo
export const uploadMainLogo = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const filePath = `/uploads/${req.file.filename}`;
  // Update DB
  const [rows] = await db.query("SELECT * FROM site_settings LIMIT 1");
  if (!rows.length)
    return res.status(404).json({ message: "No settings found" });

  await db.query(
    "UPDATE site_settings SET main_logo = ?, updated_at = NOW() WHERE id = ?",
    [filePath, rows[0].id]
  );
  res.json({ url: filePath, message: "Main logo uploaded" });
};

// POST /api/settings/upload/favicon
export const uploadFavicon = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const filePath = `/uploads/${req.file.filename}`;
  // Update DB
  const [rows] = await db.query("SELECT * FROM site_settings LIMIT 1");
  if (!rows.length)
    return res.status(404).json({ message: "No settings found" });

  await db.query(
    "UPDATE site_settings SET favicon = ?, updated_at = NOW() WHERE id = ?",
    [filePath, rows[0].id]
  );
  res.json({ url: filePath, message: "Favicon uploaded" });
};
