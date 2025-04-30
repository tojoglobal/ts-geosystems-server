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
