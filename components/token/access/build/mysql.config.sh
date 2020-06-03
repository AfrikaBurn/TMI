mysqld_safe &
mysqladmin --silent --wait=30 ping || exit 1
mysql -e "
    CREATE DATABASE IF NOT EXISTS tmi_access_token_db;
    CREATE USER IF NOT EXISTS tmi_access_token_user@localhost
        IDENTIFIED BY 'tmi_access_token_pass';
    GRANT ALL ON tmi_access_token_db.*
        TO tmi_access_token_user@localhost;"
