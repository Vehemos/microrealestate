import { Hidden, ListItemIcon, Typography } from '@material-ui/core';
import { memo, useCallback, useContext, useMemo, useState } from 'react';

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MobileMenu from './MobileMenu';
import MobileMenuButton from './MobileMenuButton';
import moment from 'moment';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ReceiptIcon from '@material-ui/icons/Receipt';
import SettingsIcon from '@material-ui/icons/Settings';
import { StoreContext } from '../store';
import { useRouter } from 'next/router';
import { useStyles } from '../styles/components/Nav.styles';
import { useTimeout } from '../utils/hooks';
import useTranslation from 'next-translate/useTranslation';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

const MenuItem = memo(function MenuItem({
  item,
  selected,
  open,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  const classes = useStyles();

  const onMenuClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);

  return (
    <ListItem
      className={`${classes.item} ${selected ? classes.itemSelected : ''}`}
      button
      selected={selected}
      onClick={onMenuClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-cy={item.dataCy}
    >
      <ListItemIcon classes={{ root: classes.itemIcon }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        className={`${classes.itemText} ${
          open ? classes.itemTextOpen : classes.itemTextClose
        }`}
        primary={<Typography noWrap>{item.value}</Typography>}
      />
    </ListItem>
  );
});

const Nav = () => {
  const classes = useStyles();
  const { t } = useTranslation('common');
  const [openDebounced, setOpenDebounced] = useState(false);
  const store = useContext(StoreContext);

  const router = useRouter();
  const { pathname } = router;

  const menuItems = useMemo(
    () => [
      {
        key: 'dashboard',
        value: t('Dashboard'),
        pathname: '/dashboard',
        icon: <DashboardIcon />,
        dataCy: 'dashboardNav',
      },
      {
        key: 'rents',
        value: t('Rents'),
        pathname: '/rents/[yearMonth]',
        icon: <ReceiptIcon />,
        dataCy: 'rentsNav',
      },
      {
        key: 'tenants',
        value: t('Tenants'),
        pathname: '/tenants',
        icon: <PeopleAltIcon />,
        dataCy: 'tenantsNav',
      },
      {
        key: 'properties',
        value: t('Properties'),
        pathname: '/properties',
        icon: <VpnKeyIcon />,
        dataCy: 'propertiesNav',
      },
      {
        key: 'accounting',
        value: t('Accounting'),
        pathname: `/accounting/[year]`,
        icon: <AccountBalanceWalletIcon />,
        dataCy: 'accountingNav',
      },
      {
        key: 'settings',
        value: t('Settings'),
        pathname: '/settings',
        icon: <SettingsIcon />,
        dataCy: 'settingsNav',
      },
    ],
    [t]
  );

  const mobileItems = useMemo(
    () => menuItems.filter(({ key }) => !['accounting'].includes(key)),
    [menuItems]
  );

  const triggerOpen = useTimeout(() => {
    !openDebounced && setOpenDebounced(true);
  }, 1000);

  const triggerClose = useTimeout(() => {
    openDebounced && setOpenDebounced(false);
  }, 250);

  const handleMenuClick = useCallback(
    (menuItem) => {
      triggerOpen.clear();
      if (store.organization.selected?.name && store.rent?.periodAsString) {
        let pathname = menuItem.pathname.replace(
          '[yearMonth]',
          store.rent.periodAsString
        );
        pathname = pathname.replace('[year]', moment().year());
        router.push(`/${store.organization.selected.name}${pathname}`);
      }
    },
    [
      router,
      triggerOpen,
      store.organization.selected?.name,
      store.rent?.periodAsString,
    ]
  );

  const handleMouseEnter = useCallback(() => {
    triggerClose.clear();
    !openDebounced && triggerOpen.start();
  }, [openDebounced, triggerOpen, triggerClose]);

  const handleMouseLeave = useCallback(() => {
    triggerOpen.clear();
    openDebounced && triggerClose.start();
  }, [openDebounced, triggerOpen, triggerClose]);

  return (
    <>
      <Hidden smDown>
        <Drawer
          className={`${
            openDebounced ? classes.drawerOpen : classes.drawerClose
          }`}
          variant="permanent"
          classes={{
            paper: openDebounced ? classes.drawerOpen : classes.drawerClose,
          }}
        >
          <List className={classes.list}>
            {menuItems.map((item) => {
              return (
                <MenuItem
                  key={item.key}
                  item={item}
                  selected={pathname.indexOf(item.pathname) !== -1}
                  open={openDebounced}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleMenuClick}
                />
              );
            })}
          </List>
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <MobileMenu
          position="fixed"
          bottom={0}
          width="100%"
          display="flex"
          justifyContent="space-around"
        >
          {mobileItems.map((item) => {
            return (
              <MobileMenuButton
                key={item.key}
                item={item}
                selected={pathname.indexOf(item.pathname) !== -1}
                onClick={handleMenuClick}
              />
            );
          })}
        </MobileMenu>
      </Hidden>
    </>
  );
};

export default memo(Nav);
