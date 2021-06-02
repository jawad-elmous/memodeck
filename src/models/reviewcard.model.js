const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');

class ReviewCardModel {
    tableName = 'reviewcard';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (reviewcard)
        return result[0];
    }

    create = async ({ nbreview=1, issuspended=0, difficulty=1, nbdayreview=1, reviewdate, fkcard}) => {
        const sql = `INSERT INTO ${this.tableName}
        (nbreview, issuspended, difficulty, nbdayreview, reviewdate, fkcard) VALUES (?,?,?,?,?,?)`;

        const result = await query(sql, [nbreview, issuspended, difficulty, nbdayreview, reviewdate, fkcard]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE reviewcard SET ${columnSet} 
        , reviewdate = (NOW() + INTERVAL ? DAY)
        WHERE idreviewcard = ?`;

        const result = await query(sql, [...values, params.nbdayreview, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE idreviewcard = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new ReviewCardModel;