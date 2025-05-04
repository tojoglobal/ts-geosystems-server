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
  order_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  shipping_name VARCHAR(255),
  shipping_address TEXT,
  shipping_city VARCHAR(255),
  shipping_zip VARCHAR(50),
  shipping_phone VARCHAR(50),
  shipping_comments TEXT,
  billing_address TEXT,
  payment_method VARCHAR(50),
  paymentStatus VARCHAR(50),
  items JSON,
  total DECIMAL(10,2),
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

CREATE TABLE hire (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    infoBox TEXT NOT NULL,
    imageUrl VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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