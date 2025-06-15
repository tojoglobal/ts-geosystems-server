/* products add table  */
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255),
  category VARCHAR(255),
  sub_category VARCHAR(255),
  sku VARCHAR(100),
  product_condition VARCHAR(50),
  product_options TEXT,
  software_options TEXT,
  brand_name VARCHAR(255),
  product_overview TEXT,
  video_urls TEXT,
  warranty_info TEXT,
  flash_sale TINYINT(1) DEFAULT 0,
  flash_sale_end DATETIME DEFAULT NULL;
  image_urls TEXT
  clearance TINYINT(1) DEFAULT 0;
);

/* categories */
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255),
  serialNumber INT,
  slug_name VARCHAR(255),
  photo VARCHAR(255),
  metaKeyword TEXT,
  meta_description TEXT,
  status TINYINT DEFAULT 1,
  is_feature TINYINT DEFAULT 0
);

/* subcategories */
CREATE TABLE subcategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(255),
  photo VARCHAR(255),
  main_category_id INT,
  status TINYINT DEFAULT 1,
  FOREIGN KEY (main_category_id) REFERENCES categories(id)
);


/* brand crete code */
CREATE TABLE brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brands_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  photo VARCHAR(255),
  status TINYINT(1) DEFAULT 1,
  is_populer TINYINT(1) DEFAULT 0,
  home_page_show TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* softwares crete code */
CREATE TABLE softwares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  softwar_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  softwarlink VARCHAR(255) NOT NULL,
  photo VARCHAR(255), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/* user_manuals crete code */
DROP TABLE user_manuals


CREATE TABLE user_manuals (
  id INT AUTO_INCREMENT PRIMARY KEY,
 user_manuals_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  user_manuals_link VARCHAR(255) NOT NULL,
  photo VARCHAR(255), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/* Quick Guides crete code */
CREATE TABLE quick_guides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quick_guides_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  quick_guides_link VARCHAR(255) NOT NULL,
  photo VARCHAR(255), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* Homepage Control Table */
CREATE TABLE homepage_control (
  id INT AUTO_INCREMENT PRIMARY KEY,
  components JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/* orders table  */

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(255),
  email VARCHAR(255),
  shipping_name VARCHAR(255),
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_zip VARCHAR(20),
  shipping_phone VARCHAR(20),
  shipping_comments TEXT,
  billing_address TEXT,
  payment_method VARCHAR(50),
  paymentStatus VARCHAR(50),
  items JSON,
  total DECIMAL(10, 2),
  status VARCHAR(50),
  payment_info TEXT,
  promo_code VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* PromoCodes */
CREATE TABLE promo_codes (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255),
  code_name VARCHAR(255),
  no_of_times INT NOT NULL DEFAULT 0,
  discount DOUBLE NOT NULL DEFAULT 0,
  status TINYINT(4) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  type VARCHAR(255),
  PRIMARY KEY (id)
);

-- Certificate tracking added in this table
CREATE TABLE contact_us (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phoneNumbers JSON NOT NULL,
    emails JSON NOT NULL,
    officeAddresses JSON NOT NULL,
    socialLinks JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE certificate_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tracking_title VARCHAR(255) NOT NULL,
  tracking_description TEXT NOT NULL,
  image_url VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* taxes table */
CREATE TABLE taxes (
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    value DOUBLE NULL,
    status TINYINT(4) NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

/* promo_order_usage */
CREATE TABLE promo_order_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_transaction_id VARCHAR(100) NOT NULL,
    promo_code VARCHAR(50) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



/* maka new row in the tabel  */
ALTER TABLE (tableName)
ADD COLUMN (columName) (dataType)

 /* Delete a Table */
 DROP TABLE IF EXISTS (tableName );
 

 /* Rename a Table */
 RENAME TABLE old_table_name TO new_table_name;

CREATE TABLE service (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    info_after_images TEXT NOT NULL,
    image_grid VARCHAR(255),
    image_banner VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/* about us tabel  */
CREATE TABLE about_us (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section1_title VARCHAR(255) NOT NULL,
    section1_description TEXT NOT NULL,
    section2_title VARCHAR(255) NOT NULL,
    section2_points JSON NOT NULL,
    section3_title VARCHAR(255) NOT NULL,
    section3_description TEXT NOT NULL,
    section4_title VARCHAR(255),
    section4_description TEXT,
    section5_title VARCHAR(255),
    section5_description TEXT,
    section6_title VARCHAR(255),
    section6_description TEXT,
    section7_title VARCHAR(255),
    section7_description TEXT,
    section8_title VARCHAR(255),
    section8_description TEXT,
    section9_title VARCHAR(255),
    section9_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* how set the unicode caracter */
ALTER TABLE users 
MODIFY city VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE hire (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  infoBox TEXT NOT NULL,
  imageUrl VARCHAR(255),
  show_hire_enquiry_button BOOLEAN DEFAULT TRUE,
  show_credit_account_button BOOLEAN DEFAULT TRUE,
  show_info_box BOOLEAN DEFAULT TRUE;
  links JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    postcode VARCHAR(50) NOT NULL,
    phone_number VARCHAR(50),
    company_name VARCHAR(255),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* home page banner (promo_product_banner_02) image dynamic table  */

CREATE TABLE Feature_highlight_banner_03_left_01_image (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  photourl VARCHAR(255) NOT NULL,
  `order` INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 
Home page single images create
 */
CREATE TABLE home_page_single_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uniqueName VARCHAR(255) NOT NULL UNIQUE,
  imageUrl TEXT NOT NULL,
  createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  updateDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/*  slide  images update */

CREATE TABLE slides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slide_number INT NOT NULL,
  product_name VARCHAR(255),
  product_link TEXT,
  product_description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* blog types  */

CREATE TABLE blog_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/* blog table */
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100),
  blog_type VARCHAR(100),
  content TEXT,
  tags JSON,
  images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE experience_center_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  photourl VARCHAR(255) NOT NULL,
  `order` INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- SQL to create the about_us_image_controls table
CREATE TABLE about_us_image_controls (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    images LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
);

-- SQL to create the services_image_controls table
CREATE TABLE services_image_controls (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    images LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
);

/* trade in  */
CREATE TABLE trade_in_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  equipment VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  serialNumber VARCHAR(100),
  software VARCHAR(255),
  manufactureDate VARCHAR(50),
  `condition` VARCHAR(10),
  sellOrTrade ENUM('sell', 'tradeIn') NOT NULL,
  comments TEXT,
  photos JSON, -- Store file paths as JSON
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/* support  table */
CREATE TABLE support_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  equipment VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  supportIssues JSON NOT NULL, -- Array of support issues
  details TEXT,
  files JSON, -- Array of file paths
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table for hire enquiries
CREATE TABLE hire_enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  existingCustomer ENUM('yes', 'no') NOT NULL,
  equipment JSON NOT NULL, -- Store selected equipment as JSON array
  hireDate DATE NOT NULL,
  hirePeriod VARCHAR(100) NOT NULL,
  comments TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  view_count INT DEFAULT 1,
  last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (product_id, user_email)
);

/* Hire equipment edit  */
CREATE TABLE equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/* recommended_products tabe */
CREATE TABLE recommended_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL UNIQUE,
  product_name VARCHAR(255) NOT NULL,
  product_category VARCHAR(60) NOT NULL,
  product_subcategory VARCHAR(60) NOT NULL,
  product_count INT DEFAULT 1,
  last_ordered_at DATETIME NOT NULL
);

CREATE TABLE user_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  admin_reply TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE email_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
/* servce page service inquire form data  */
CREATE TABLE service_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  company VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  equipment VARCHAR(100),
  model VARCHAR(100),
  request_service BOOLEAN DEFAULT 0,
  request_calibration BOOLEAN DEFAULT 0,
  request_repair BOOLEAN DEFAULT 0,
  comments TEXT,
  file_paths JSON,  -- stores array of uploaded file paths
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* log the email rotues */
CREATE TABLE emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender VARCHAR(255) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  folder ENUM('inbox','sent','trash') DEFAULT 'inbox',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trade_in_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title1 VARCHAR(255),
  description1 TEXT,
  title2 VARCHAR(255),
  process_points JSON,
  title3 VARCHAR(255),
  description3 TEXT,
  instrument_makes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE support_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  instrument_types JSON,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE used_equipment_content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  banner_image VARCHAR(255),
  banner_image_show BOOLEAN DEFAULT TRUE,
  description TEXT,
  benefits_box_title VARCHAR(255) DEFAULT 'USED SURVEYING EQUIPMENT BENEFITS',
  benefits_box_description TEXT,
  benefits_box_show BOOLEAN DEFAULT TRUE,
  links JSON DEFAULT NULL
);

-- WeProvide Table
CREATE TABLE we_provide (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(512) NOT NULL,
    section_title VARCHAR(255) DEFAULT NULL;
    description JSON NOT NULL
);

-- OurAchievements Table
CREATE TABLE our_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(32) NOT NULL,
    section_title VARCHAR(255) DEFAULT NULL;
    text VARCHAR(255) NOT NULL
);

-- OurAdServices Table
CREATE TABLE our_ad_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    section_title VARCHAR(255) DEFAULT NULL;
    description TEXT NOT NULL
);

CREATE TABLE footer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    address1 TEXT NOT NULL,
    address2 TEXT,
    iso_image_url_1 VARCHAR(255) NULL,
    iso_image_url_2 VARCHAR(255) NULL,
    iso_image_url_3 VARCHAR(255) NULL;
    mailing_title VARCHAR(255) DEFAULT 'JOIN OUR MAILING LIST',
    mailing_text TEXT DEFAULT 'Signup for our newsletter to receive specials and up to date product news and releases.',
    bg_color VARCHAR(15) DEFAULT '#585c5d',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `last_banner_images` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `photourl` VARCHAR(255) NOT NULL,
  `order` INT NOT NULL
);

CREATE TABLE helpdesk_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  helpline_number VARCHAR(40),
  whatsapp VARCHAR(40),
  email VARCHAR(100),
  contact_btn_label VARCHAR(40) DEFAULT 'Contact Us',
  contact_btn_link VARCHAR(200) DEFAULT '/contact-us',
  tooltip_text VARCHAR(100) DEFAULT 'Need Support?',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE youtube_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_title VARCHAR(255) DEFAULT 'OUR YOUTUBE CHANNEL',
    link VARCHAR(512) NOT NULL
);

CREATE TABLE addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE dynamic_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  show_in_footer BOOLEAN DEFAULT TRUE,
  show_in_header BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- MySQL table for the given fields
CREATE TABLE site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_name VARCHAR(255) NOT NULL DEFAULT 'My App',
    home_title VARCHAR(255) NOT NULL DEFAULT 'Welcome to My App',
    main_logo VARCHAR(255) NOT NULL DEFAULT '/uploads/default-logo.png', -- store file path or URL
    favicon VARCHAR(255) NOT NULL DEFAULT '/uploads/default-favicon.ico', -- store file path or URL
    meta_keywords JSON NOT NULL DEFAULT (JSON_ARRAY('app','website','react','business')),
    meta_description TEXT NOT NULL DEFAULT 'This is the default meta description of your site.',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
/* ts-cc equipments list */
CREATE TABLE ts_cc_equipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trackingNo VARCHAR(100) NOT NULL,
  equipment VARCHAR(100) NOT NULL,
  serialNo VARCHAR(100) NOT NULL,
  accuracy VARCHAR(100),
  manufacturer VARCHAR(100) NOT NULL,
  companyName VARCHAR(100),
  validity DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ts_clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  companyName VARCHAR(100) NOT NULL,
  ownerName VARCHAR(100) NOT NULL,
  mobileNumber VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE credit_account_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  companyName VARCHAR(255) NOT NULL,
  tradingName VARCHAR(255),
  invoiceAddress TEXT NOT NULL,
  deliveryAddress TEXT NOT NULL,
  registeredOffice TEXT,
  tradingAddress TEXT,
  companyType VARCHAR(50),
  partnersInfo TEXT,
  vatNumber VARCHAR(50),
  companyNumber VARCHAR(50),
  incorporationDate DATE,
  website VARCHAR(255),
  buyersContactName VARCHAR(255),
  buyersPhone VARCHAR(50),
  buyersEmail VARCHAR(255),
  accountsContactName VARCHAR(255),
  accountsPhone VARCHAR(50),
  accountsEmail VARCHAR(255),
  emailInvoices VARCHAR(10),
  invoiceEmail VARCHAR(255),
  ref1Company VARCHAR(255),
  ref1Phone VARCHAR(50),
  ref1Contact VARCHAR(255),
  ref1Email VARCHAR(255),
  ref1Address TEXT,
  ref2Company VARCHAR(255),
  ref2Phone VARCHAR(50),
  ref2Contact VARCHAR(255),
  ref2Email VARCHAR(255),
  ref2Address TEXT,
  applicantName VARCHAR(255),
  applicantPosition VARCHAR(255),
  applicantPhone VARCHAR(50),
  applicationDate DATE,
  files JSON,
  discoveryMethod VARCHAR(255),
  g2RepName VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE top_clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imageUrl VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('order','question','message') NOT NULL,
    ref_id INT DEFAULT NULL,
    content VARCHAR(255) NOT NULL,
    link VARCHAR(255) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shop_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vat_enabled TINYINT(1) NOT NULL DEFAULT 1
);
INSERT INTO shop_settings (vat_enabled) VALUES (1) ON DUPLICATE KEY UPDATE vat_enabled=1;