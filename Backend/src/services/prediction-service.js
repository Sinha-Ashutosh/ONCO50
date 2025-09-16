const FileRepository = require('../repository/File-repository');
const AppErrors = require('../utils/error-handler');

class PredictionService {
    constructor() {
        this.fileRepository = new FileRepository();
    }

    async saveFile(fileName, fileData) {
        try {
            const data = { fileName, fileData};
            const saveFile = await this.fileRepository.create(data);
            return saveFile;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw error;
            }
            console.log("Something went wrong in service layer");
            throw error;
        }
    }

    async getFile(fileId) {
        try {
            const file = await this.fileRepository.getById(fileId);
            return file;
        } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
        }
    }
}

module.exports = PredictionService;