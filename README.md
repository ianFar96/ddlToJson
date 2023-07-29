<div align="center">
  <h3>DDL to JSON</h3>
  <p>
    NodeJS/Browser library to parse <a href="https://docs.fileformat.com/database/ddl/">DDL</a> file contents into JSON format.
    <br />
    <a href="https://github.com/ianFar96/ddlToJson/issues">Report Bug</a>
    ·
    <a href="https://github.com/ianFar96/ddlToJson/issues">Request Feature</a>
  </p>
</div>

## Getting Started

### Installation

To install simply run
```bash
npm i ddltojson
```

### Usage

To use the library you just need to import the main function

```typescript
import ddlToJson from 'ddltojson';

const ddlFileContents = await readFile('path/to/file.ddl');
const json = ddlToJson(ddlFileContents.toString())
```

The `json` output has the following format



```json
{
  "statement": "name of the statement",
  "name": "name of the table",
  "columns": [
    {
      "name": "name of the column",
      "type": "data type of the column",
      "constraints": "constrains of the column"
    },
  ],
  "primaryKey": [
    "primary key column name"
  ],
  "foreignKeys": [
    {
      "column": "local column name",
      "references": {
        "table": "name of the referenced table",
        "column": "name of the referenced column"
      }
    }
  ]
}
```

Here's an example of what it might look like

```json
{
  "statement": "CREATE",
  "name": "addresses",
  "columns": [
    {
      "name": "id",
      "type": "int",
      "constraints": "NOT NULL AUTO_INCREMENT"
    },
    {
      "name": "customer_id",
      "type": "int",
      "constraints": "NOT NULL"
    },
    {
      "name": "street",
      "type": "varchar(255)",
      "constraints": "NOT NULL"
    },
    {
      "name": "city",
      "type": "varchar(255)",
      "constraints": "NOT NULL"
    },
    {
      "name": "state",
      "type": "varchar(255)",
      "constraints": "NOT NULL"
    },
    {
      "name": "zip",
      "type": "varchar(255)",
      "constraints": "NOT NULL"
    },
    {
      "name": "type",
      "type": "enum('SHIPPING','BILLING','LIVING')",
      "constraints": "NOT NULL"
    }
  ],
  "primaryKey": [
    "id"
  ],
  "foreignKeys": [
    {
      "column": "customer_id",
      "references": {
        "table": "customers",
        "column": "id"
      }
    }
  ]
}
```

#### Supported statements

- CREATE TABLE

More statements are gonna be supported in the future (bound to DDL syntax). If you have any request to support a particular statement don't hesitate to open an issue.

#### Supported SQL dialects

- PostgreSQL
- MySQL
- SQL Server
- SQLite

If you find other dialects are also supported correctly please let me know to include it on this list

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
