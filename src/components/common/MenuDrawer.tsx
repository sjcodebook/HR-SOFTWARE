// @ts-nocheck

import React, { useState, useEffect, useMemo } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { Observer } from 'mobx-react-lite'
import { Scrollbars } from 'react-custom-scrollbars'
import { makeStyles } from 'tss-react/mui'
import Drawer from '@mui/material/Drawer'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import DehazeIcon from '@mui/icons-material/Dehaze'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { Constants } from '../../scripts/constants'

import appStore from '../../store/AppStore'

// import LogoShort from './../../assets/logo-short.png'
import userStore from '../../store/UserStore'

const useStyles = makeStyles()((theme) => ({
  list: {
    width: 250,
    overflow: 'hidden',
  },
  active: {
    backgroundColor: '#5f97eb',
  },
  title: {
    flexGrow: 1,
    color: '#3776f1',
    cursor: 'pointer',
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}))

const MenuDrawer = (props: any) => {
  const { classes } = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  const [hasActivatedRoutes, setHasActivatedRoutes] = useState(false)
  const [menuObj, setMenuObj] = useState(null)

  const routes = {
    adminRoutes: ['Admin'],
    estimatesRoutes: {
      label: 'Sales',
      routes: [
        'EstimatesRequest',
        'LeadsAssigned',
        'AppointmentScheduled',
        'EstimatesDraft',
        'EstimatesSent',
        'Sold',
        'SaleLost',
        'EstimatesScheduled',
      ],
    },
    invoicesRoutes: {
      label: 'Invoices',
      routes: ['InvoicesDraft', 'InvoicesSent', 'InvoicesPaid'],
    },
    otherRoutes: ['Clients', 'ProductionCalendar'],
    toolsRoutes: ['Estimate', 'Invoice', 'Timer'],
    generalRoutes: ['EstimatesRequestForm', 'ContactInfo', 'Profile'],
  }

  const allPaths = useMemo(() => {
    let pathsObj = {}
    Object.values(Constants.mainConfigs.allPaths).forEach((path) => {
      pathsObj = {
        ...pathsObj,
        ...path.routes,
      }
    })
    return pathsObj
  }, [])

  const filterRoutes = (
    route: string[] | { label: string; routes: string[] } | { label: string; routes: string[] },
    accessRoutes: string | any[]
  ) => {
    if (Array.isArray(route)) {
      return route.filter((r) => accessRoutes.includes(r) || routes.generalRoutes.includes(r))
    } else if (typeof route === 'object' && Array.isArray(route?.routes)) {
      route.routes = route.routes.filter(
        (r) => accessRoutes.includes(r) || routes.generalRoutes.includes(r)
      )
      return route
    }
  }

  useEffect(() => {
    let finalMenu = {}
    let accessRoutes = props.userStore.currentUser.jobConfig
      ? props.userStore.currentUser.jobConfig.paths
      : []
    Object.values(routes).forEach((route, i) => {
      finalMenu['menu' + (i + 1)] = props.userStore.currentUser.isAdmin
        ? route
        : filterRoutes(route, accessRoutes)
    })
    Object.keys(finalMenu).forEach((menu) => {
      if (Array.isArray(finalMenu[menu])) {
        finalMenu[menu] = finalMenu[menu].map((path) => ({
          path: allPaths[path]?.route,
          label: allPaths[path]?.label,
        }))
      } else if (typeof finalMenu[menu] === 'object' && Array.isArray(finalMenu[menu]?.routes)) {
        finalMenu[menu].routes = finalMenu[menu].routes.map((path) => ({
          path: allPaths[path]?.route,
          label: allPaths[path]?.label,
        }))
      }
    })
    setHasActivatedRoutes(props.userStore.currentUser.isAdmin || accessRoutes.length !== 0)
    setMenuObj(finalMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userStore.currentUser.jobConfig, props.userStore.currentUser.isAdmin])

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setIsOpen(open)
  }

  const list = () => (
    <div className={classes.list} role='presentation' onKeyDown={toggleDrawer(false)}>
      {!hasActivatedRoutes ? (
        <>
          <List>
            <div style={{ textAlign: 'center' }}>
              <b>Please contact admin to activate routes for your account.</b>
            </div>
          </List>
          <Divider />
          <List>
            {routes.generalRoutes.map((route) => (
              <ListItem button key={'sdsdds'} style={{ textAlign: 'center' }}>
                <NavLink
                  exact
                  to={allPaths[route]?.route}
                  onClick={toggleDrawer(false)}
                  activeClassName={classes.active}
                  style={{
                    width: '100%',
                    textDecoration: 'none',
                    color: appStore.darkMode ? '#fff' : '#292929',
                    padding: 10,
                  }}>
                  {allPaths[route]?.label}
                </NavLink>
              </ListItem>
            ))}
          </List>
          <Divider />
        </>
      ) : (
        <Scrollbars style={{ height: '80vh' }}>
          {Object.keys(menuObj).map((menu) => (
            <div key={'ksjhksdjds'}>
              {Array.isArray(menuObj[menu]) ? (
                <List>
                  {menu === 'menu1' && !userStore.currentUser.isAdmin && (
                    <ListItem button key={'ksjhksdjds'} style={{ textAlign: 'center' }}>
                      <NavLink
                        exact
                        to={allPaths.Home?.route}
                        onClick={toggleDrawer(false)}
                        activeClassName={classes.active}
                        style={{
                          width: '100%',
                          textDecoration: 'none',
                          color: appStore.darkMode ? '#fff' : '#292929',
                          padding: 10,
                        }}>
                        {allPaths.Home?.label}
                      </NavLink>
                    </ListItem>
                  )}
                  {menuObj[menu].map((obj) => (
                    <ListItem button key={'ksjhksdjds'} style={{ textAlign: 'center' }}>
                      <NavLink
                        exact
                        to={obj.path}
                        onClick={toggleDrawer(false)}
                        activeClassName={classes.active}
                        style={{
                          width: '100%',
                          textDecoration: 'none',
                          color: appStore.darkMode ? '#fff' : '#292929',
                          padding: 10,
                        }}>
                        {obj?.label}
                      </NavLink>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <>
                  {menuObj[menu].routes.length !== 0 && (
                    <List>
                      <ListItem>
                        <Accordion
                          style={{
                            width: '100%',
                          }}
                          defaultExpanded={menuObj[menu].routes.find(
                            (obj) => obj.path === props.location.pathname
                          )}>
                          <AccordionSummary>
                            <Typography
                              variant='body2'
                              align='center'
                              style={{ width: '100%', padding: 10 }}>
                              {menuObj[menu]?.label}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List
                              style={{
                                width: '100%',
                                backgroundColor: appStore.darkMode ? '#303030' : '#e4e4e4',
                              }}>
                              {menuObj[menu].routes.map((obj) => (
                                <ListItem button key={'ksjhksdjds'} style={{ textAlign: 'center' }}>
                                  <NavLink
                                    exact
                                    to={obj.path}
                                    onClick={toggleDrawer(false)}
                                    activeClassName={classes.active}
                                    style={{
                                      width: '100%',
                                      textDecoration: 'none',
                                      color: appStore.darkMode ? '#fff' : '#292929',
                                      padding: 10,
                                    }}>
                                    {obj?.label}
                                  </NavLink>
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      </ListItem>
                    </List>
                  )}
                </>
              )}
              <Divider />
            </div>
          ))}
        </Scrollbars>
      )}
    </div>
  )

  return (
    <Observer>
      {() => (
        <div>
          <React.Fragment key={'left'}>
            {!menuObj ? (
              <CircularProgress size={20} style={{ marginRight: 10 }} />
            ) : (
              <Button onClick={toggleDrawer(true)}>
                <DehazeIcon fontSize='large' />
              </Button>
            )}
            <Drawer open={isOpen} onClose={toggleDrawer(false)}>
              <Grid container spacing={1}>
                <Grid item xs={4} />
                <Grid item xs={4}>
                  <Avatar
                    alt='HR SOFTWARE'
                    src={'LogoShort'}
                    className={classes.large}
                    variant='square'
                    style={{
                      cursor: 'pointer',
                      alignSelf: 'center',
                      marginLeft: '1em',
                      marginTop: 10,
                    }}
                    onClick={() => props.history.push(allPaths.Home?.route)}
                  />
                </Grid>
                <Grid item xs={4} />
              </Grid>
              <div style={{ textAlign: 'center' }}>
                <Typography
                  variant='h6'
                  className={classes.title}
                  onClick={() => props.history.push(allPaths.Home?.route)}>
                  HR SOFTWARE
                </Typography>
              </div>
              <br />
              <Divider />
              {menuObj && <>{list('left')}</>}
            </Drawer>
          </React.Fragment>
        </div>
      )}
    </Observer>
  )
}

export default withRouter(MenuDrawer)
