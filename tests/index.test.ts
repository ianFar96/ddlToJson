import assert from 'node:assert';
import { describe, it } from 'node:test';
import ddlToJson from '../lib/index';
import { readFile } from 'node:fs/promises';
import { Statement } from '../types/statement';
import inventoryJson from './fixtures/inventory.json';

describe('DDl to JSON casting', () => {
  it('should cast addresses ddl properly', async () => {
    const addressesDdl = `
      -- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
      --
      -- Host: 127.0.0.1    Database: inventory
      -- ------------------------------------------------------
      -- Server version 8.0.32

      /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
      /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
      /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
      /*!50503 SET NAMES utf8 */;
      /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
      /*!40103 SET TIME_ZONE='+00:00' */;
      /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
      /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
      /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
      /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

      --
      -- Table structure for table \`addresses\`
      --

      CREATE DATABASE IF NOT EXISTS \`inventory\` CHARACTER SET \`utf8mb4\`;

      USE \`inventory\`;

      DROP TABLE IF EXISTS \`addresses\`;
      /*!40101 SET @saved_cs_client     = @@character_set_client */;
      /*!50503 SET character_set_client = utf8mb4 */;
      CREATE TABLE \`addresses\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`customer_id\` int NOT NULL,
        \`street\` varchar(255) NOT NULL,
        \`city\` varchar(255) NOT NULL,
        \`state\` varchar(255) NOT NULL,
        \`zip\` varchar(255) NOT NULL,
        \`type\` enum('SHIPPING','BILLING','LIVING') NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`address_customer\` (\`customer_id\`),
        CONSTRAINT \`addresses_ibfk_1\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      /*!40101 SET character_set_client = @saved_cs_client */;

      --
      -- Dumping data for table \`addresses\`
      --

      LOCK TABLES \`addresses\` WRITE;
      /*!40000 ALTER TABLE \`addresses\` DISABLE KEYS */;
      INSERT INTO \`addresses\` VALUES (10,1001,'3183 Moore Avenue','Euless','Texas','76036','SHIPPING'),(11,1001,'2389 Hidden Valley Road','Harrisburg','Pennsylvania','17116','BILLING'),(12,1002,'281 Riverside Drive','Augusta','Georgia','30901','BILLING'),(13,1003,'3787 Brownton Road','Columbus','Mississippi','39701','SHIPPING'),(14,1003,'2458 Lost Creek Road','Bethlehem','Pennsylvania','18018','SHIPPING'),(15,1003,'4800 Simpson Square','Hillsdale','Oklahoma','73743','BILLING'),(16,1004,'1289 University Hill Road','Canehill','Arkansas','72717','LIVING');
      /*!40000 ALTER TABLE \`addresses\` ENABLE KEYS */;
      UNLOCK TABLES;
    `;
    
    const expectedResult: Statement[] = [
      {
        statement: 'CREATE',
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'int',
            constraints: 'NOT NULL AUTO_INCREMENT',
          },
          {
            name: 'customer_id',
            type: 'int',
            constraints: 'NOT NULL',
          },
          {
            name: 'street',
            type: 'varchar(255)',
            constraints: 'NOT NULL',
          },
          {
            name: 'city',
            type: 'varchar(255)',
            constraints: 'NOT NULL',
          },
          {
            name: 'state',
            type: 'varchar(255)',
            constraints: 'NOT NULL',
          },
          {
            name: 'zip',
            type: 'varchar(255)',
            constraints: 'NOT NULL',
          },
          {
            name: 'type',
            type: 'enum(\'SHIPPING\',\'BILLING\',\'LIVING\')',
            constraints: 'NOT NULL',
          }
        ],
        primaryKeys: ['id'],
        foreignkeys: [
          {
            column: 'customer_id',
            references: {
              table: 'customers',
              column: 'id'
            }
          }
        ]
      }
    ];

    const result = ddlToJson(addressesDdl);
    
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should cast inventory.ddl file properly', async () => {
    const ddlFileContents = await readFile('tests/fixtures/inventory.ddl');
    const result = ddlToJson(ddlFileContents.toString());
    assert.deepStrictEqual(result, inventoryJson);
  });
});