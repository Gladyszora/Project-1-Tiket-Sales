/** load library 'multer', 'path', and 'fs' */
const multer = require(`multer`)
const path = require(`path`)
const fs = require(`fs`)

/** storage configuration */
const storage = multer.diskStorage({
    /** define storage folder */
    destination: (req, file, cb) => {
        // PERBAIKAN PATH:
        // __dirname merujuk ke folder tempat file upload-image.js berada.
        // path.resolve(__dirname, '..', 'image') akan menunjuk ke [ROOT_PROJECT]/image
        const storagePath = path.resolve(__dirname, '..', 'image')

        // Buat folder secara otomatis jika belum ada
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true })
        }

        cb(null, storagePath)
    },

    /** define filename for upload file */
    filename: (req, file, cb) => {
        cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB limit
    },
    fileFilter: (req, file, cb) => {
        const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`]
        
        if (!acceptedType.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type (${file.mimetype}). Only JPG, JPEG, and PNG are allowed.`))
        }

        cb(null, true)
    }
})

module.exports = upload