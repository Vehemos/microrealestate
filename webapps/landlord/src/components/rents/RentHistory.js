import { Box, Paper, Typography } from '@material-ui/core';
import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getPeriod } from './RentPeriod';
import Link from '../Link';
import Loading from '../Loading';
import moment from 'moment';
import { NumberFormat } from '../../utils/numberformat';
import { StoreContext } from '../../store';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import useTranslation from 'next-translate/useTranslation';

const NavTableRow = React.forwardRef(function NavTableRow(
  { tenantId, tenant, rent, selected },
  ref
) {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  const backPath = `/${store.organization.selected.name}/rents/${moment(
    rent.term,
    'YYYYMMDDHH'
  ).format('YYYY.MM')}`;
  const backPage = t('Rents of {{date}}', {
    date: moment(rent.term, 'YYYYMMDDHHMM').format('MMM YYYY'),
  });
  return (
    <TableRow ref={ref} key={rent.term} hover selected={selected} size="small">
      <TableCell>
        <Link
          color="inherit"
          variant="body1"
          underline="always"
          href={`/${store.organization.selected.name}/payment/${tenantId}/${
            rent.term
          }/${encodeURI(backPage)}/${encodeURIComponent(backPath)}`}
        >
          {getPeriod(t, rent.term, tenant.occupant.frequency)}
        </Link>
      </TableCell>
      <TableCell align="right">
        <NumberFormat
          variant="body1"
          value={rent.totalWithoutBalanceAmount + rent.promo - rent.extracharge}
        />
      </TableCell>
      <TableCell align="right">
        {rent.extracharge > 0 && (
          <NumberFormat variant="body1" value={rent.extracharge} />
        )}
      </TableCell>
      <TableCell align="right">
        {rent.promo > 0 && <NumberFormat variant="body1" value={rent.promo} />}
      </TableCell>
      <TableCell align="right">
        {rent.payment > 0 && (
          <NumberFormat variant="body1" value={rent.payment} withColor />
        )}
      </TableCell>
      <TableCell align="right">
        <NumberFormat variant="body1" value={rent.newBalance} />
      </TableCell>
    </TableRow>
  );
});

const RentHistory = ({ tenantId }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState();
  const selectedRowRef = useRef();
  const selectedTerm = useMemo(
    () => moment().startOf('month').format('YYYYMMDDHH'),
    []
  );

  useEffect(() => {
    const fetchTenantRents = async () => {
      setLoading(true);
      const response = await store.rent.fetchTenantRents(tenantId);
      if (response.status !== 200) {
        store.pushToastMessage({
          message: t('Cannot get tenant information'),
          severity: 'error',
        });
      } else {
        setTenant(response.data);
      }
      setLoading(false);
    };

    fetchTenantRents();
  }, [t, tenantId, store.rent, store]);

  useEffect(() => {
    if (!loading) {
      selectedRowRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [tenant, loading]);

  return (
    <>
      {loading ? (
        <Loading fullScreen />
      ) : (
        <>
          <Box pb={4}>
            <Typography variant="h5">{tenant.occupant.name}</Typography>
            {tenant.occupant.beginDate && tenant.occupant.endDate && (
              <Typography color="textSecondary" variant="body2">
                {t('Contract from {{beginDate}} to {{endDate}}', {
                  beginDate: moment(
                    tenant.occupant.beginDate,
                    'DD/MM/YYYY'
                  ).format('L'),
                  endDate: moment(tenant.occupant.endDate, 'DD/MM/YYYY').format(
                    'L'
                  ),
                })}
              </Typography>
            )}
          </Box>
          <Paper variant="outlined" square>
            <Table stickyHeader aria-label="rents history table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography>{t('Period')}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{t('Rent')}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{t('Additional costs')}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{t('Discounts')}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{t('Settlement')}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{t('Balance')}</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenant?.rents?.map((rent) => {
                  const isSelected = String(rent.term) === selectedTerm;
                  return (
                    <NavTableRow
                      key={rent.term}
                      ref={isSelected ? selectedRowRef : null}
                      tenantId={tenantId}
                      tenant={tenant}
                      rent={rent}
                      selected={isSelected}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </>
  );
};

export default memo(RentHistory);
