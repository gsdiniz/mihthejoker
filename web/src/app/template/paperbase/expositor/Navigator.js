import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
// import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory, useLocation } from 'react-router-dom';

const categories = [
  // {
  //   id: 'Usuários',
  //   children: [
  //     { id: 'Profissionais', icon: <PeopleIcon />, endpoint: 'profissionais' },
  //     { id: 'Alunos', icon: <PeopleIcon />, endpoint: 'alunos' },
  //   ]
  // },
  {
    id: 'Administração',
    children: [
      { id: 'Exercícios', icon: <SettingsIcon />, active: false, endpoint: 'exercicios' },
      // { id: 'Agendamentos', icon: <TimerIcon />, endpoint: 'jobs' },
    ],
  }
];

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const history = useHistory()
  const location = useLocation()
  const { classes, ...other } = props
  const handleNavigation = (endpoint) => {
    history.push(endpoint)
  }

  categories.forEach(categoria => {
    categoria.children = categoria.children.map(child => {
      child.active = false
      if (location.pathname.substr(1).localeCompare(child.endpoint) === 0) {
        child.active = true
      }
      return child
    })
  })

  useEffect(() => {
    categories.forEach(categoria => {
      categoria.children = categoria.children.map(child => {
        child.active = false
        if (location.pathname.substr(1).localeCompare(child.endpoint) === 0) {
          child.active = true
        }
        return child
      })
    })
  }, [location])

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          3D Visitation
        </ListItem>
        <ListItem
          button
          onClick={() => handleNavigation('/dashboard')}
          className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Dashboard
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, endpoint }) => 
            (<ListItem
                key={childId}
                button
                onClick={() => handleNavigation(endpoint)}
                className={clsx(classes.item, active && classes.itemActiveItem)}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}

            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);