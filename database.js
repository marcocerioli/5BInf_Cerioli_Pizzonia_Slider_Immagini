const fs = require("fs");
const mysql = require("mysql2")
const conf = JSON.parse(fs.readFileSync("conf.json"));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);
console.log(connection)
const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {      
          connection.query(sql, function (err, result) {
             if (err) {
                console.error(err);
                reject();     
             }   
             console.log('done');
             resolve(result);         
       });
    })
 }

const database = {
    createTable: () => {
        return executeQuery(`
        CREATE TABLE IF NOT EXISTS images
           ( id INT PRIMARY KEY AUTO_INCREMENT, 
              name VARCHAR(255) NOT NULL) 
           `);      
    },
    insert: (name) => {
        const template = `
        INSERT INTO images (name) VALUES ('$NAME')
           `;
        let sql = template.replace("$NAME", name);
        return executeQuery(sql); 
    },
    select: () => {
        const sql = `
        SELECT id, name FROM images 
           `;
        return executeQuery(sql); 
    },
    delete: (id) => {
        let sql = `
        DELETE FROM images
        WHERE id=%ID
           `;
        sql = sql.replace("%ID", id);
        console.log(sql,id)
        return executeQuery(sql); 
    },
    truncate: () => {
      const sql = `
        TRUNCATE TABLE images;
           `;
      return executeQuery(sql)
    }
}
module.exports = database;