-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema queue_control
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema queue_control
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `queue_control` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `queue_control` ;

-- -----------------------------------------------------
-- Table `queue_control`.`log_fila`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `queue_control`.`log_fila` (
  `id` INT NOT NULL,
  `counter` BIGINT NOT NULL,
  `mesa` VARCHAR(15) NOT NULL,
  `timestamp` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
