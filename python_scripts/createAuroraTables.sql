-- {DB_NAME} というプレースホルダを使う
DROP DATABASE IF EXISTS {DB_NAME};
CREATE DATABASE {DB_NAME};
USE {DB_NAME};

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    id CHAR(28) NOT NULL PRIMARY KEY,
    receive_request JSON NULL,
    linked_accounts JSON NULL,
    name VARCHAR(255) NOT NULL,
    icon TEXT NOT NULL,
    send_request JSON NULL,
    email VARCHAR(255) NOT NULL,
    use_tab_ids JSON NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS tabs;
CREATE TABLE tabs (
    id CHAR(20) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    create_user_uid CHAR(28) NOT NULL,
    shared_accounts JSON NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    user_id CHAR(28) NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    id CHAR(20) NOT NULL PRIMARY KEY,                  
    is周期的 VARCHAR(50) NULL,
    周期単位 VARCHAR(50) NULL,
    周期日数 INT NULL,
    due_date VARCHAR(20) NULL,                           
    has_due_time BOOLEAN NULL,                    
    icon TEXT NULL,                               
    description TEXT NULL,                        
    task_text VARCHAR(255) NULL,                       
    due_time VARCHAR(50) NULL,                    
    user_id CHAR(28) NOT NULL,                        
    has_due BOOLEAN NULL,                         
    timestamp DATETIME NULL,                      
    toggle_completion_timestamp DATETIME NULL,    
    completed BOOLEAN NULL,                       
    tab_id CHAR(20) NOT NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS logs;
CREATE TABLE logs (
    id CHAR(20) NOT NULL PRIMARY KEY,             
    available_voice_announce BOOLEAN NOT NULL,   
    tab_id CHAR(20) NOT NULL,                    
    interval_num INT NOT NULL,                   
    available_memo BOOLEAN NOT NULL,             
    voice_announce_unit VARCHAR(20) NOT NULL,    
    interval_unit VARCHAR(20) NOT NULL,          
    icon TEXT NOT NULL,                          
    description VARCHAR(255) NULL,           
    user_id CHAR(28) NOT NULL,                   
    duration BOOLEAN NOT NULL,                   
    archived BOOLEAN NULL DEFAULT FALSE,                   
    accessible_accounts JSON NULL,           
    voice_announce_num INT NOT NULL,             
    reviewed BOOLEAN NULL DEFAULT FALSE,                   
    display_feature JSON NULL,               
    is_interval BOOLEAN NULL DEFAULT FALSE,                   
    task_text VARCHAR(255) NULL,                  
    timestamp DATETIME NOT NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS logs_complete_logs;
CREATE TABLE logs_complete_logs (
    id CHAR(20) NOT NULL PRIMARY KEY,       
    processed BOOLEAN NULL,            
    memo TEXT NULL,                    
    log_id CHAR(20) NOT NULL,              
    type VARCHAR(50) NOT NULL,             
    timestamp DATETIME NOT NULL,           
    user_id CHAR(28) NOT NULL,             
    tab_id CHAR(20) NOT NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS assets;
CREATE TABLE assets (
    id CHAR(20) NOT NULL PRIMARY KEY,
    tab_id CHAR(20) NOT NULL,
    name VARCHAR(255),
    user_id CHAR(28) NOT NULL,
    timestamp DATETIME
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS methods;
CREATE TABLE methods (
    id CHAR(20) NOT NULL PRIMARY KEY,
    timing_date INT NOT NULL,
    tab_id CHAR(20) NOT NULL,
    asset_id CHAR(20) NOT NULL,
    timing VARCHAR(50) NOT NULL,
    user_id CHAR(28) NOT NULL,
    timestamp DATETIME NULL,
    label VARCHAR(100) NOT NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS purchases;
CREATE TABLE purchases (
    id CHAR(20) NOT NULL PRIMARY KEY,
    date DATETIME NOT NULL,
    income BOOLEAN NULL DEFAULT FALSE,
    tab_id CHAR(20) NOT NULL,
    method CHAR(20) NOT NULL,
    price INT NULL DEFAULT 0,
    description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NULL,
    user_id CHAR(28) NOT NULL,
    child_purchase_id CHAR(20),
    difference INT NULL,
    asset_id CHAR(20) NOT NULL,
    pay_date DATETIME NULL,
    balance INT NULL,
    is_uncertain BOOLEAN NULL,
    is_group BOOLEAN NULL,
    parent_purchase_id CHAR(20) NULL,
    timestamp DATETIME NULL DEFAULT CURRENT_TIMESTAMP
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS purchase_schedules;
CREATE TABLE purchase_schedules (
    id CHAR(20) NOT NULL PRIMARY KEY,
    date INT NOT NULL,
    income BOOLEAN NOT NULL,
    tab_id CHAR(20) NOT NULL,
    method CHAR(20) NOT NULL,
    end_date DATETIME NOT NULL,
    description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    user_id CHAR(28) NOT NULL,
    cycle VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    is_uncertain BOOLEAN NULL,
    category VARCHAR(100) NOT NULL,
    day VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS purchase_templates;
CREATE TABLE purchase_templates (
    id CHAR(20) NOT NULL PRIMARY KEY,
    date DATETIME NOT NULL,
    income BOOLEAN NOT NULL,
    tab_id CHAR(20) NULL,
    method CHAR(20) NOT NULL,
    description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    user_id CHAR(28) NOT NULL,
    price INT NOT NULL,
    is_uncertain BOOLEAN NULL DEFAULT FALSE,
    is_group BOOLEAN NULL DEFAULT FALSE,
    category VARCHAR(100) NOT NULL,
    timestamp DATETIME NOT NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS transfer_templates;
CREATE TABLE transfer_templates (
    id CHAR(20) NOT NULL PRIMARY KEY,
    date DATETIME NOT NULL,
    tab_id CHAR(20) NOT NULL,
    price INT NOT NULL,
    description TEXT NOT NULL,
    from_method CHAR(20) NULL,
    to_method CHAR(20) NULL,
    user_id CHAR(28) NOT NULL,
    timestamp DATETIME NOT NULL
)
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
