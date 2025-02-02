import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { useCallback, useMemo } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import moment from 'moment';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import ScannerOutlinedIcon from '@material-ui/icons/ScannerOutlined';
import useTranslation from 'next-translate/useTranslation';

const DocumentItem = ({ document, onEdit, onDelete, disabled }) => {
  const { t } = useTranslation('common');

  const handleEditClick = useCallback(() => {
    onEdit(document);
  }, [onEdit, document]);

  const handleDeleteClick = useCallback(() => {
    onDelete(document);
  }, [onDelete, document]);

  const expiryMoment = useMemo(() => {
    return document.expiryDate ? moment(document.expiryDate) : null;
  }, [document.expiryDate]);

  const isExpired = useMemo(() => {
    return expiryMoment ? moment().isSameOrAfter(expiryMoment) : false;
  }, [expiryMoment]);

  return (
    <ListItem button onClick={handleEditClick}>
      <ListItemText
        id={document._id}
        primary={
          <Box
            display="flex"
            justifyContent="space-between"
            alignContent="center"
            mr={2}
          >
            <Box>
              <Box display="flex" alignContent="center">
                <Box mr={1}>
                  {document.type === 'text' ? (
                    <DescriptionOutlinedIcon color="action" />
                  ) : (
                    <ScannerOutlinedIcon color="action" />
                  )}
                </Box>
                <Typography>{document.name}</Typography>
              </Box>
              <Box ml={4}>
                <Typography variant="caption">
                  {document.description}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              {expiryMoment ? (
                <>
                  {isExpired && (
                    <ReportProblemIcon color="error" fontSize="small" />
                  )}
                  <Typography
                    variant="caption"
                    display="inline"
                    color={isExpired ? 'error' : 'inherit'}
                  >
                    {t('expiry {{relativeDate}}', {
                      relativeDate: expiryMoment.fromNow(),
                    })}
                  </Typography>
                </>
              ) : null}
              {document.hasExpiryDate ? (
                <Chip size="small" label={t('Expiry date required')} />
              ) : null}
            </Box>
          </Box>
        }
      />
      {!disabled ? (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default function DocumentList({
  documents,
  onEdit,
  onDelete,
  disabled = false,
}) {
  return (
    <Paper variant="outlined">
      <Box height={396} overflow="auto">
        {documents.length > 0 ? (
          <List dense>
            {documents
              .sort(({ type: type1 }, { type: type2 }) =>
                type1.localeCompare(type2)
              )
              .map((document) => (
                <DocumentItem
                  key={document._id}
                  document={document}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  disabled={disabled}
                />
              ))}
          </List>
        ) : null}
      </Box>
    </Paper>
  );
}
