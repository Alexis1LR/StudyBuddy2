import {createRequire} from "module";
import express from "express";
import multer from "multer";
import fs from 'fs';
import path from 'path';

//for PDF-parse library
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

//configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        //Create uploads directory if it doesnt exist
        const uploadDir = 'uploads'
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir)
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        //Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
})

//configure multer upload settings
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        //Accept only PDF files
        if (file.mimetype === 'application/pdf'){
            cb(null, true);
        }
        else{
            cb(new Error('Only PDF files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 //limit file size to 10 MB
    }
});

//PDF processing function
async function processPDF(filePath){
    try{
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        //Clean up the text by removing extra white space and normalizing line breaks
        const cleanedText = data.text
            .replace(/\s+/g, ' ') //cleans up whitespace
            .trim()
            .split('\n')
            .filter(line => line.trim() !== '')
            .join('\n');
        
        return {
            text: cleanedText,
            pageCount: data.numpages,
            metadata: data.metadata
        };

    } catch (error) {
        throw new Error(`Error processing PDF:  ${error.message}`);
    }
}

//Express route handler
function setupPDFRoute(app){
    app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({error: 'No PDF file uploaded'});
            }

            const filePath = req.file.path;
            const pdfData = await processPDF(filePath);

            //Clean up: Remove the uploaded files after processing
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file: ', err);
            });
            res.json({
                success: true,
                data: pdfData
            });

        } catch (error){
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
}

export default setupPDFRoute;