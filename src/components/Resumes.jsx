import React, { useState, useCallback, useEffect, useMemo } from 'react'
import Masonry from 'react-responsive-masonry'
import { Scrollbars } from 'react-custom-scrollbars'
import { Observer } from 'mobx-react-lite'
import dayjs from 'dayjs'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import SelectEditor from '@inovua/reactdatagrid-community/SelectEditor'
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'
import CancelIcon from '@material-ui/icons/Cancel'
import LinkIcon from '@material-ui/icons/Link'
import EditIcon from '@material-ui/icons/Edit'

import appStore from '../store/AppStore'
import {
  getAllResumesLive,
  getAllRolesLive,
  getAllStatusesLive,
  addRole,
  addStatus,
  removeRole,
  removeStatus,
  editResumeData,
} from '../scripts/remoteActions'
import { showToast, getContrastYIQ, convertToKey } from '../scripts/localActions'

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
    paperModal: {
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
)

const ResumesCard = () => {
  const [roles, setRoles] = useState({})
  const [statuses, setStatuses] = useState({})
  const [resumes, setResumes] = useState([])
  const [gridRef, setGridRef] = useState(null)
  const [showStatusEditModal, setShowStatusEditModal] = useState(false)
  const [showRoleEditModal, setShowRoleEditModal] = useState(false)
  const classes = useStyles()

  const groups = useMemo(
    () => [
      { name: 'personalInfo', header: 'Personal info' },
      { name: 'resumeInfo', header: 'Résumé Info' },
      { name: 'assessment', header: 'Assessment' },
    ],
    []
  )

  const roleSelectionList = useMemo(() => {
    return Object.values(roles).map((role) => {
      return { id: role.roleKey, label: role.roleName }
    })
  }, [roles])

  const statusSelectionList = useMemo(() => {
    return Object.values(statuses).map((status) => {
      return { id: status.statusKey, label: status.statusName }
    })
  }, [statuses])

  const columns = useMemo(
    () => [
      { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 50 },
      { name: 'name', header: 'Name', defaultWidth: 120, group: 'personalInfo' },
      { name: 'email', header: 'Email', defaultWidth: 140, group: 'personalInfo' },
      { name: 'phoneNumber', header: 'Phone', defaultWidth: 120, group: 'personalInfo' },
      {
        name: 'submittedOn',
        header: 'Submitted On',
        defaultWidth: 140,
        editable: false,
        group: 'resumeInfo',
      },
      {
        name: 'pdfUrl',
        header: 'Résumé',
        defaultWidth: 80,
        render: ({ value }) => (
          <LinkIcon style={{ cursor: 'pointer' }} onClick={() => window.open(value, '_blank')} />
        ),
        sortable: false,
        editable: false,
        group: 'resumeInfo',
      },
      {
        name: 'role',
        header: (
          <>
            <span style={{ marginRight: 5 }}>Role</span>
            <EditIcon
              fontSize='small'
              style={{ marginBottom: '-5px', cursor: 'pointer' }}
              onClick={() => setShowRoleEditModal(true)}
            />
          </>
        ),
        defaultWidth: 180,
        render: ({ value }) => {
          if (!value || !roles[value]) {
            return null
          }
          const role = roles[value]
          return (
            <div
              style={{
                backgroundColor: role ? role.roleColor : 'white',
                color: role ? getContrastYIQ(role.roleColor) : 'black',
                padding: '5px',
                borderRadius: 50,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}>
              {role ? role.roleName : ''}
            </div>
          )
        },
        editor: SelectEditor,
        editorProps: {
          idProperty: 'id',
          dataSource: roleSelectionList,
          collapseOnSelect: true,
          clearIcon: null,
        },
        group: 'assessment',
        sortable: false,
      },
      {
        name: 'status',
        header: (
          <>
            <span style={{ marginRight: 5 }}>Status</span>
            <EditIcon
              fontSize='small'
              style={{ marginBottom: '-5px', cursor: 'pointer' }}
              onClick={() => setShowStatusEditModal(true)}
            />
          </>
        ),
        defaultWidth: 120,
        render: ({ value }) => {
          if (!value || !statuses[value]) {
            return null
          }
          const status = statuses[value]
          return (
            <div
              style={{
                backgroundColor: status ? status.statusColor : 'white',
                color: status ? getContrastYIQ(status.statusColor) : 'black',
                padding: '5px',
                borderRadius: 50,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                textAlign: 'center',
              }}>
              {status ? status.statusName : ''}
            </div>
          )
        },
        editor: SelectEditor,
        editorProps: {
          idProperty: 'id',
          dataSource: statusSelectionList,
          collapseOnSelect: true,
          clearIcon: null,
        },
        group: 'assessment',
        sortable: false,
      },
      { name: 'note', header: 'Custom Note', defaultFlex: 1, sortable: false, group: 'assessment' },
    ],
    [roleSelectionList, roles, statusSelectionList, statuses]
  )

  useEffect(() => {
    const unsubscribeRolesData = getAllRolesLive(
      (snapshot) => {
        let allRoles = {}
        snapshot.docs.forEach((doc) => {
          const docData = doc.data()
          docData.id = doc.id
          allRoles[docData.roleKey] = docData
        })
        setRoles(allRoles)
      },
      (err) => {
        console.log(err)
        showToast('Error Fetching Roles', 'error')
      }
    )

    const unsubscribeStatusesData = getAllStatusesLive(
      (snapshot) => {
        let allStatuses = {}
        snapshot.docs.forEach((doc) => {
          const docData = doc.data()
          docData.id = doc.id
          allStatuses[docData.statusKey] = docData
        })
        setStatuses(allStatuses)
      },
      (err) => {
        console.log(err)
        showToast('Error Fetching Statuses', 'error')
      }
    )

    return () => {
      unsubscribeRolesData()
      unsubscribeStatusesData()
    }
  }, [])

  useEffect(() => {
    const unsubscribeResumeData = getAllResumesLive(
      (snapshot) => {
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
      },
      (err) => {
        console.log(err)
        showToast('Error Fetching Resumes', 'error')
      }
    )

    return () => {
      unsubscribeResumeData()
    }
  }, [])

  const onEditComplete = useCallback(({ data, columnId, value }) => {
    const newResumeData = { ...data }
    newResumeData[columnId] = value
    delete newResumeData.id
    delete newResumeData.submittedOn
    editResumeData(data.id, newResumeData).catch((err) => {
      console.log(err)
      showToast('Error Updating Resume Data', 'error')
    })
  }, [])

  const exportCSV = () => {
    const columns = gridRef.current.visibleColumns
    const header = columns.map((c) => c.header).join(SEPARATOR)
    const rows = gridRef.current.data.map((data) => columns.map((c) => data[c.id]).join(SEPARATOR))
    const contents = [header].concat(rows).join('\n')
    const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob)
  }

  return (
    <Observer>
      {() => (
        <Paper className={classes.paper}>
          <Typography variant='h4' color='textPrimary' align='left' gutterBottom>
            Résumés{' '}
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
          {showRoleEditModal && (
            <RoleEditModal onClose={() => setShowRoleEditModal(false)} roles={roles} />
          )}
          {showStatusEditModal && (
            <StatusEditModal onClose={() => setShowStatusEditModal(false)} statuses={statuses} />
          )}
        </Paper>
      )}
    </Observer>
  )
}

const getModalStyle = () => {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    borderRadius: 20,
  }
}

const DEFAULT_COLOR = '#ffc723'

const RoleEditModal = ({ onClose, roles }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [modalStyle] = useState(getModalStyle())
  const [roleName, setRoleName] = useState('')
  const [roleColor, setRoleColor] = useState(DEFAULT_COLOR)

  const handleAddRole = () => {
    const roleData = { roleKey: convertToKey(roleName), roleName: roleName.trim(), roleColor }
    addRole(roleData)
      .then(() => {
        setRoleName('')
        setRoleColor(DEFAULT_COLOR)
      })
      .catch((err) => {
        console.log(err)
        showToast('Error Adding Role', 'error')
      })
  }

  const handleRemoveRole = (roleId) => {
    removeRole(roleId).catch((err) => {
      console.error(err)
      showToast('Error Removing Role', 'error')
    })
  }

  return (
    <Observer>
      {() => (
        <Modal open={true} onClose={onClose}>
          <div
            style={{
              ...modalStyle,
              width: isMobile ? '90%' : '50%',
              height: isMobile ? '60%' : '60%',
            }}
            className={classes.paperModal}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant='h4'
                  gutterBottom
                  className='center-flex-row'
                  style={{ justifyContent: 'space-between' }}>
                  Edit Roles
                  <CancelOutlinedIcon
                    style={{ float: 'right', cursor: 'pointer' }}
                    fontSize='large'
                    onClick={() => onClose()}
                  />
                </Typography>
              </Grid>
              <div style={{ width: '100%' }}>
                <Grid item xs={12}>
                  {Object.values(roles).length === 0 ? (
                    <div style={{ border: '2px solid black', borderRadius: 10, padding: 15 }}>
                      <Typography variant='h6' color='textSecondary' align='center' gutterBottom>
                        No Roles Found
                      </Typography>
                    </div>
                  ) : (
                    <div
                      style={{
                        border: '2px solid black',
                        borderRadius: 10,
                        padding: 15,
                        zIndex: 10,
                      }}>
                      <Scrollbars style={{ height: 160, zIndex: 10 }}>
                        <Masonry
                          columnsCount={isMobile ? 2 : 3}
                          gutter='10px'
                          style={{ zIndex: 10 }}>
                          {Object.values(roles).map((role) => (
                            <div
                              key={role.roleKey}
                              style={{
                                padding: '14px',
                                backgroundColor: role.roleColor,
                                color: getContrastYIQ(role.roleColor),
                                borderRadius: 50,
                                position: 'relative',
                              }}>
                              {role.roleName}{' '}
                              <CancelIcon
                                fontSize='small'
                                style={{
                                  cursor: 'pointer',
                                  position: 'absolute',
                                  right: '.5em',
                                  top: '50%',
                                  transform: 'translate(0,-50%)',
                                }}
                                onClick={() => handleRemoveRole(role.id)}
                              />
                            </div>
                          ))}
                        </Masonry>
                      </Scrollbars>
                    </div>
                  )}
                </Grid>
                <br />
                <br />
                <Grid item xs={12}>
                  <div className='center-flex-row'>
                    <TextField
                      label='Role Name'
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      variant='outlined'
                      style={{ maxWidth: '30%', marginRight: 10 }}
                    />
                    <input
                      type='color'
                      style={{ marginRight: 20 }}
                      value={roleColor}
                      onChange={(e) => setRoleColor(e.target.value)}
                    />
                    <Button
                      variant='contained'
                      color='primary'
                      size='small'
                      disabled={roleName.trim() === '' || roles[convertToKey(roleName)]}
                      style={{ marginRight: 10 }}
                      onClick={handleAddRole}>
                      Add Role
                    </Button>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        </Modal>
      )}
    </Observer>
  )
}

const StatusEditModal = ({ onClose, statuses }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [modalStyle] = useState(getModalStyle())
  const [statusName, setStatusName] = useState('')
  const [statusColor, setStatusColor] = useState(DEFAULT_COLOR)

  const handleAddStatus = () => {
    const statusData = {
      statusKey: convertToKey(statusName),
      statusName: statusName.trim(),
      statusColor,
    }
    addStatus(statusData)
      .then(() => {
        setStatusName('')
        setStatusColor(DEFAULT_COLOR)
      })
      .catch((err) => {
        console.log(err)
        showToast('Error Adding Status', 'error')
      })
  }

  const handleRemoveStatus = (statusId) => {
    removeStatus(statusId).catch((err) => {
      console.error(err)
      showToast('Error Removing Status', 'error')
    })
  }

  return (
    <Observer>
      {() => (
        <Modal open={true} onClose={onClose}>
          <div
            style={{
              ...modalStyle,
              width: isMobile ? '90%' : '50%',
              height: isMobile ? '60%' : '60%',
            }}
            className={classes.paperModal}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant='h4'
                  gutterBottom
                  className='center-flex-row'
                  style={{ justifyContent: 'space-between' }}>
                  Edit Statuses
                  <CancelOutlinedIcon
                    style={{ float: 'right', cursor: 'pointer' }}
                    fontSize='large'
                    onClick={() => onClose()}
                  />
                </Typography>
              </Grid>
              <div style={{ width: '100%' }}>
                <Grid item xs={12}>
                  {Object.values(statuses).length === 0 ? (
                    <div style={{ border: '2px solid black', borderRadius: 10, padding: 15 }}>
                      <Typography variant='h6' color='textSecondary' align='center' gutterBottom>
                        No Statuses Found
                      </Typography>
                    </div>
                  ) : (
                    <div
                      style={{
                        border: '2px solid black',
                        borderRadius: 10,
                        padding: 15,
                        zIndex: 10,
                      }}>
                      <Scrollbars style={{ height: 160, zIndex: 10 }}>
                        <Masonry
                          columnsCount={isMobile ? 2 : 3}
                          gutter='10px'
                          style={{ zIndex: 10 }}>
                          {Object.values(statuses).map((status) => (
                            <div
                              key={status.statusKey}
                              style={{
                                padding: '14px',
                                backgroundColor: status.statusColor,
                                color: getContrastYIQ(status.statusColor),
                                borderRadius: 50,
                                position: 'relative',
                              }}>
                              {status.statusName}{' '}
                              <CancelIcon
                                fontSize='small'
                                style={{
                                  cursor: 'pointer',
                                  position: 'absolute',
                                  right: '.5em',
                                  top: '50%',
                                  transform: 'translate(0,-50%)',
                                }}
                                onClick={() => handleRemoveStatus(status.id)}
                              />
                            </div>
                          ))}
                        </Masonry>
                      </Scrollbars>
                    </div>
                  )}
                </Grid>
                <br />
                <br />
                <Grid item xs={12}>
                  <div className='center-flex-row'>
                    <TextField
                      label='Status Name'
                      value={statusName}
                      onChange={(e) => setStatusName(e.target.value)}
                      variant='outlined'
                      style={{ maxWidth: '30%', marginRight: 10 }}
                    />
                    <input
                      type='color'
                      style={{ marginRight: 20 }}
                      value={statusColor}
                      onChange={(e) => setStatusColor(e.target.value)}
                    />
                    <Button
                      variant='contained'
                      color='primary'
                      size='small'
                      disabled={statusName.trim() === '' || statuses[convertToKey(statusName)]}
                      style={{ marginRight: 10 }}
                      onClick={handleAddStatus}>
                      Add Status
                    </Button>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        </Modal>
      )}
    </Observer>
  )
}

export default ResumesCard
