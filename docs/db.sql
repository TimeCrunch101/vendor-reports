CREATE DATABASE  IF NOT EXISTS `vendor_reports`;
USE `vendor_reports`;
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` varchar(36) NOT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `qty` int DEFAULT 0,
  `vendor` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vendor_fk_idx` (`vendor`),
  CONSTRAINT `vendor_fk` FOREIGN KEY (`vendor`) REFERENCES `vendors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE IF EXISTS `restocks`;
CREATE TABLE `restocks` (
  `id` varchar(36) NOT NULL,
  `item` varchar(36) DEFAULT NULL,
  `restock_qty` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_fk_idx` (`item`),
  CONSTRAINT `vendor_resk_fk` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `id` int NOT NULL,
  `item` varchar(36) DEFAULT NULL,
  `qty_sold` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_fk_idx` (`item`),
  CONSTRAINT `item_fk` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(45) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `full_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);
DROP TABLE IF EXISTS `vendor_poc`;
CREATE TABLE `vendor_poc` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS `vendors`;
CREATE TABLE `vendors` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `poc` varchar(36) DEFAULT NULL,
  `consignment` decimal(2,2) DEFAULT NULL,
  `bm_ven_code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `poc_fk_idx` (`poc`),
  CONSTRAINT `poc_fk` FOREIGN KEY (`poc`) REFERENCES `vendor_poc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);