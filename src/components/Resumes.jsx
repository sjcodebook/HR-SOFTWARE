import React, { useState, useCallback, useEffect } from 'react'
import dayjs from 'dayjs'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import SelectEditor from '@inovua/reactdatagrid-community/SelectEditor'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import RefreshIcon from '@material-ui/icons/Refresh'
import LinkIcon from '@material-ui/icons/Link'

import appStore from '../store/AppStore'
import { getAllResumes } from '../scripts/remoteActions'
import { showToast } from '../scripts/localActions'

const countryData = [
  { id: 'uk', label: 'United Kindom' },
  { id: 'usa', label: 'United States' },
  { id: 'ca', label: 'Canada' },
]

const groups = [
  { name: 'personalInfo', header: 'Personal info' },
  { name: 'resumeInfo', header: 'Résumé Info' },
  { name: 'assessment', header: 'Assessment' },
]

const columns = [
  { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 50 },
  { name: 'name', header: 'Name', defaultFlex: 1, group: 'personalInfo' },
  { name: 'email', header: 'Email', defaultFlex: 1, group: 'personalInfo' },
  { name: 'phoneNumber', header: 'Phone', defaultFlex: 1, group: 'personalInfo' },
  {
    name: 'submittedOn',
    header: 'Submitted On',
    defaultFlex: 1,
    editable: false,
    group: 'resumeInfo',
  },
  {
    name: 'pdfUrl',
    header: 'Résumé',
    defaultFlex: 1,
    render: ({ value }) => (
      <LinkIcon style={{ cursor: 'pointer' }} onClick={() => window.open(value, '_blank')} />
    ),
    sortable: false,
    editable: false,
    group: 'resumeInfo',
  },
  {
    name: 'role',
    header: 'Role',
    defaultFlex: 1,
    width: 100,
    render: ({ value }) => value,
    editor: SelectEditor,
    editorProps: {
      idProperty: 'id',
      dataSource: countryData,
      collapseOnSelect: true,
      clearIcon: null,
    },
    group: 'assessment',
  },
  {
    name: 'status',
    header: 'Status',
    defaultFlex: 1,
    width: 100,
    render: ({ value }) => value,
    editor: SelectEditor,
    editorProps: {
      idProperty: 'id',
      dataSource: countryData,
      collapseOnSelect: true,
      clearIcon: null,
    },
    group: 'assessment',
  },
  { name: 'note', header: 'Note', defaultFlex: 1, sortable: false, group: 'assessment' },
]

const downloadBlob = (blob, fileName = 'resumes.csv') => {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.position = 'absolute'
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const gridStyle = { minHeight: 400 }

const SEPARATOR = ','

export const useStyles = makeStyles((theme) =>
  createStyles({
    rotateIcon: {
      animation: '$spin 1.2s linear infinite',
    },
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(360deg)',
      },
      '100%': {
        transform: 'rotate(0deg)',
      },
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    Innerpaper: {
      padding: theme.spacing(2),
    },
  })
)

const ResumesCard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [resumes, setResumes] = useState([])
  const [gridRef, setGridRef] = useState(null)
  const classes = useStyles()

  useEffect(() => {
    setIsLoading(true)
    getAllResumes()
      .then((snapshot) => {
        setResumes(
          snapshot.docs
            .map((doc) => {
              const docData = doc.data()
              docData.id = doc.id
              docData.submittedOn = dayjs.unix(docData.createdAt).format('DD/MM/YYYY')
              return docData
            })
            .sort((a, b) => b.createdAt - a.createdAt)
        )
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        showToast('Error fetching resumes', 'error')
        setIsLoading(false)
      })
  }, [refresh])

  const onEditComplete = useCallback(
    ({ value, columnId, rowId }) => {
      console.log({ value, columnId, rowId })
      const data = [...resumes]
      data[rowId - 1][columnId] = value

      setResumes(data)
    },
    [resumes]
  )

  const exportCSV = () => {
    const columns = gridRef.current.visibleColumns
    const header = columns.map((c) => c.header).join(SEPARATOR)
    const rows = gridRef.current.data.map((data) => columns.map((c) => data[c.id]).join(SEPARATOR))
    const contents = [header].concat(rows).join('\n')
    const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob)
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant='h4' color='textPrimary' align='left' gutterBottom>
        Résumés{' '}
        <RefreshIcon
          className={isLoading ? classes.rotateIcon : ''}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setRefresh((prev) => !prev)
            setIsLoading(true)
            setTimeout(() => {
              setIsLoading(false)
            }, 1200)
          }}
        />
        <Button
          style={{ float: 'right' }}
          onClick={exportCSV}
          variant='contained'
          color='secondary'>
          Export CSV
        </Button>
      </Typography>
      <Typography variant='body1' color='textSecondary' align='center' gutterBottom>
        Total Results: {resumes.length}
      </Typography>
      <Paper
        style={{ backgroundColor: appStore.darkMode ? '#303030' : '#fcfcfc' }}
        className={classes.Innerpaper}>
        <ReactDataGrid
          handle={setGridRef}
          theme={appStore.darkMode ? 'pink-dark' : 'pink-light'}
          style={gridStyle}
          idProperty='uniqueId'
          columns={columns}
          dataSource={resumes}
          onEditComplete={onEditComplete}
          editable={true}
          groups={groups}
        />
      </Paper>
    </Paper>
  )
}

export default ResumesCard
