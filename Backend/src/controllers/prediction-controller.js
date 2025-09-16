const PredictionService = require('../services/prediction-service');

const predictionService = new PredictionService();

const handleFile = async (req, res) => {
    try {
        const response = await predictionService.saveFile({
            fileName: req.body.fileName,
            fileData: req.body.fileData
        });
        return res.status(201).json({
            success: true,
                message: "File successfully saved and processed",
                data: response,
                err: {}
        })
    } catch (error) {
        return res.status(error.statusCode).json({
            message: error.message,
            data: {},
            success: false,
            err: error.explanation
        });
    }
}

const getFile = async (req, res) => {
    try {
        const response = await predictionService.getFile({
            id: req.params
        })
        return res.status(200).json({
            success: true,
            message: "File retrieved successfully",
            data: response,
            err: {}
        });
    } catch (error) {
         return res.status(error.statusCode).json({
            message: error.message,
            data: {},
            success: false,
            err: error.explanation
        });
    }
}

module.exports = {
    handleFile,
    getFile
}