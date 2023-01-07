import prettyMilliseconds from 'pretty-ms'
import Resizer from 'react-image-file-resizer'
import * as EmailValidator from 'email-validator'
import { toast } from 'react-toastify'
import { StripChar } from 'stripchar'
import { removeStopwords } from 'stopword'
import phone from 'phone'

export const showToast = (msg = '', mode = 'success') => {
  if (mode === 'error') {
    return toast.error(msg, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  } else if (mode === 'warning') {
    return toast.warn(msg, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  } else if (mode === 'info') {
    return toast.info(msg, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  } else {
    return toast.success(msg, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
}

export const getRoundValEst = (val = 0, prevMultiplier) => {
  return Math.round((val * prevMultiplier + Number.EPSILON) * 100) / 100
}

export const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces)
  return Math.round(number * factorOfTen) / factorOfTen
}

export const precisionRound = (number, decimalPlaces) => {
  return Number(
    Math.round(parseFloat(number + 'e' + decimalPlaces)) + 'e-' + decimalPlaces
  ).toFixed(decimalPlaces)
}

export const getOrdinal = (day) => {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export const getMonth = (monthIndex) => {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][monthIndex]
}

export const getDay = (dayIndex, short = false) => {
  if (short) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex]
  } else {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'][dayIndex]
  }
}

export const getSearchableKeywords = (string = '', limit = 2000) => {
  let searchableKeywords = []
  let strippedWord = StripChar.RSspecChar(string.toLowerCase(), '__').replace(/__/g, ' ')
  let words = [...new Set(removeStopwords(strippedWord.split(' ')))].filter((word) => word)
  words.forEach((word) => {
    let splits = word.split('').map((ch, i) => {
      if (i === 0) {
        return ch
      } else {
        let str = ''
        for (let j = 0; j <= i; j++) {
          str = str + word[j]
        }
        return str
      }
    })
    searchableKeywords.push(...splits)
  })
  words.forEach((word, i) => {
    if (i !== words.length - 1) {
      let splits = []
      for (let s = i + 1; s < words.length; s++) {
        if (splits.length === 0) {
          splits.push(word + ' ' + words[s])
        } else {
          splits.push(splits[splits.length - 1] + ' ' + words[s])
        }
      }
      searchableKeywords.push(...splits)
    }
  })
  return searchableKeywords.slice(0, limit)
}

export const getSearchingKeywords = (string = '') => {
  let strippedWord = StripChar.RSspecChar(string.toLowerCase(), '__').replace(/__/g, ' ')
  return [...new Set(removeStopwords(strippedWord.split(' ')))].filter((w) => w).slice(0, 10)
}

export const getArrayOfArrays = (originalArray, chunkSize) => {
  const arrayOfArrays = []
  for (let i = 0; i < originalArray.length; i += chunkSize) {
    arrayOfArrays.push(originalArray.slice(i, i + chunkSize))
  }
  return arrayOfArrays
}

export const isEmail = (string = '') => {
  return EmailValidator.validate(string)
}

export const isPhoneNumber = (string = '') => {
  if (phone(string) && phone(string).length !== 0) {
    return true
  }
  return false
}

export const isNumeric = (string = '') => {
  if (typeof string != 'string') return false
  return !isNaN(string) && !isNaN(parseFloat(string))
}

export const resizeFile = (file) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1000,
      1000,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri)
      },
      'file'
    )
  })
}

export const renameFile = (originalFile, newName) => {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  })
}

export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export const toCamelCase = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

export const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + '...'
  } else {
    return str
  }
}

export const numberWithCommas = (x) => {
  return x.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}

export const getPrettyMs = (miliSec, vanilla = false) => {
  let formatedMs = prettyMilliseconds(miliSec)
  if (vanilla) {
    return formatedMs
  }
  if (formatedMs.indexOf('d') > -1) {
    let chunksByDays = formatedMs.split('d')
    let daysInHrs = parseInt(chunksByDays[0]) * 24
    if (formatedMs.indexOf('h') > -1) {
      let chunksByHours = chunksByDays[1].split('h')
      let additionalHrs = parseInt(chunksByHours[0])
      return `${daysInHrs + additionalHrs}h${chunksByHours[1]}`
    } else {
      return `${daysInHrs}h${chunksByDays[1]}`
    }
  }
  return formatedMs
}

export const asyncForEach = (array, callback, done) => {
  const runAndWait = (i) => {
    if (i === array.length) return done()
    return callback(array[i], () => runAndWait(i + 1))
  }
  return runAndWait(0)
}

export const getContrastYIQ = (hexcolor) => {
  var r = parseInt(hexcolor.substring(1, 3), 16)
  var g = parseInt(hexcolor.substring(3, 5), 16)
  var b = parseInt(hexcolor.substring(5, 7), 16)
  var yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'black' : 'white'
}

export const convertToKey = (str) => {
  return str.trim().replace(/ /g, '_').toUpperCase()
}
