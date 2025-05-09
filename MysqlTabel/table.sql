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
  image_urls TEXT
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


/* Homepage Control Table */
CREATE TABLE homepage_control (
  id INT AUTO_INCREMENT PRIMARY KEY,
  components JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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


CREATE TABLE contact_us (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phoneNumbers JSON NOT NULL,
    emails JSON NOT NULL,
    officeAddresses JSON NOT NULL,
    socialLinks JSON DEFAULT NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    who_we_serve_image VARCHAR(512),
    bottom_section_image VARCHAR(512),
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

CREATE TABLE promo_product_banner_02_image (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  photourl VARCHAR(255) NOT NULL,
  `order` INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
