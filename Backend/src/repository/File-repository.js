const file = require('../models/file');
const { file } = require('../models/index');
const ClientError = require('../utils/client-error');
const ValidationError = require('../utils/validation-error');
const { StatusCodes } = require('http-status-codes');

class FileRepository {
    async create(fileData) {
        try {
            const file = await file.create(fileData);
            return file;
        } catch (error) {
             if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async destroy(fileId) {
        try {
            await file.destroy({
                where: {
                    id: fileId
                }
            });
            return true;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async getById(fileId) {
        try {
            const file = await file.findByPk(fileId);
            if (!file) {
                throw new Error("File not found")
            }
            return file;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }
}

module.exports = FileRepository;