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
