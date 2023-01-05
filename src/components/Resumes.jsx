import React, { useState, useCallback } from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import SelectEditor from '@inovua/reactdatagrid-community/SelectEditor'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import RefreshIcon from '@material-ui/icons/Refresh'

import appStore from '../store/AppStore'

const countryData = [
  { id: 'uk', label: 'United Kindom' },
  { id: 'usa', label: 'United States' },
  { id: 'ca', label: 'Canada' },
]

const columns = [
  { name: 'name', header: 'Name', defaultFlex: 1 },
  { name: 'email', header: 'Email', defaultFlex: 1 },
  { name: 'phone', header: 'Phone', defaultFlex: 1 },
  { name: 'role', header: 'Role', defaultFlex: 1 },
  { name: 'submitted-on', header: 'Submitted On', defaultFlex: 1, editable: false },
  { name: 'note', header: 'Note', defaultFlex: 1, sortable: false },
  { name: 'resume', header: 'Résumé', defaultFlex: 1, sortable: false },
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
  },
]

const data = [
  { name: 'John Grayner', age: 35, uniqueId: 1 },
  { name: 'Mary Stones', age: 25, uniqueId: 2 },
  { name: 'Robert Fil', age: 27, uniqueId: 3 },
  { name: 'Roger Bobson', age: 81, uniqueId: 4 },
  { name: 'Billary Konwik', age: 18, uniqueId: 5 },
  { name: 'Bob Martin', age: 18, uniqueId: 6 },
  { name: 'Matthew Richardson', age: 54, uniqueId: 7 },
  { name: 'Richy Peterson', age: 54, uniqueId: 8 },
  { name: 'Bryan Martin', age: 40, uniqueId: 9 },
]

const downloadBlob = (blob, fileName = 'grid-data.csv') => {
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
  const [dataSource, setDataSource] = useState(data)
  const [gridRef, setGridRef] = useState(null)
  const classes = useStyles()

  const onEditComplete = useCallback(
    ({ value, columnId, rowId }) => {
      console.log({ value, columnId, rowId })
      const data = [...dataSource]
      data[rowId - 1][columnId] = value

      setDataSource(data)
    },
    [dataSource]
  )

  const exportCSV = () => {
    const columns = gridRef.current.visibleColumns

    const header = columns.map((c) => c.name).join(SEPARATOR)
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
            // setRefresh((prev) => !prev)
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
        Total Results: {[].length}
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
          dataSource={dataSource}
          onEditComplete={onEditComplete}
          editable={true}
        />
      </Paper>
    </Paper>
  )
}

export default ResumesCard
