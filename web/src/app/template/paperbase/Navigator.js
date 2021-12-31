import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
import SettingsIcon from '@material-ui/icons/Settings';
import AddBoxIcon from '@material-ui/icons/AddBox';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';

import roles from '../../utils/roles';
import useAuth from "../../hooks/auth/useAuth"

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
    roles: [roles.ADMIN],
    children: [
      { id: 'Usuarios', roles: [roles.ADMIN], icon: <PeopleAltIcon />, active: false, endpoint: 'usuarios' },
      { id: 'Configurações', roles: [roles.ADMIN], icon: <SettingsIcon />, active: false, endpoint: 'config' },
    ],
  },
  {
    id: 'Exposição',
    roles: [roles.EXPOSITOR, roles.VISITANTE],
    children: [
      { id: 'Visitar', roles: [roles.VISITANTE], icon: <VisibilityIcon />, active: false, endpoint: 'exposicao/visitar' },
      { id: 'Gerenciar', roles: [roles.EXPOSITOR], icon: <AddBoxIcon />, active: false, endpoint: 'exposicao' },
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

const isActiveMenu = (child, location) => {
  child.active = false
  if (location.pathname.substr(1).localeCompare(child.endpoint) === 0) {
    child.active = true
  }
  return child
}

function Navigator(props) {
  const history = useHistory()
  const location = useLocation()
  const user = useAuth().getUser()

  const { classes, ...other } = props
  const handleNavigation = (endpoint) => {
    history.push(endpoint)
  }

  categories.forEach(categoria => {
    categoria.children = categoria.children.map((child) => isActiveMenu(child, location))
  })

  useEffect(() => {
    categories.forEach(categoria => {
      categoria.children = categoria.children.map((child) => isActiveMenu(child, location))
    })
  }, [location])

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          MUSE
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
        {categories.map(category => (
          (category.roles.includes(user.role)) ?
          <React.Fragment key={category.id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {category.id}
              </ListItemText>
            </ListItem>
            {category.children && category.children.map(({ id: childId, icon, active, endpoint, roles }) => 
            (roles.includes(user.role) ? <ListItem
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
              : null
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
          : null
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);