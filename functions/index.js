const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const { uuid } = require('uuidv4')
const dayjs = require('dayjs')

const { filesUpload } = require('./middleware')

admin.initializeApp()

const app = express()
const bucket = admin.storage().bucket()
const firestore = admin.firestore()

app.post('/saveCandidateData', filesUpload, (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const phoneNumber = req.body.phoneNumber
  const pdf = req.files[0]

  if (!name || !email || !phoneNumber || !pdf) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!pdf.mimeType.includes('pdf')) {
    return res.status(400).json({ error: 'File must be a PDF' })
  }

  const token = uuid()

  // Save the PDF to Cloud Storage
  const filePath = `resumes/${Date.now()}_${pdf.originalname}`
  const file = bucket.file(filePath)
  const buffer = Buffer.from(pdf.buffer, 'base64')
  const stream = file.createWriteStream({
    metadata: {
      contentType: pdf.mimeType,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  })
  stream.on('error', (err) => {
    console.error(err)
    return res.status(500).end()
  })

  stream.on('finish', () => {
    firestore
      .collection('resumes')
      .add({
        name,
        email,
        phoneNumber,
        pdfUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
          filePath
        )}?alt=media&token=${token}`,
        createdAt: dayjs().unix(),
      })
      .then(() => {
        return res.status(200).end()
      })
      .catch((err) => {
        console.error(err)
        return res.status(500).end()
      })
  })
  stream.end(buffer)
})

exports.api = functions.https.onRequest(app)
