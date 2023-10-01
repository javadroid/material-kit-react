import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

export const CustomsTable = (props) => {
  const {
    count = 0,
    items = [],
    headers=[],
    header2,
    handleOpenModal
    
  } = props;



  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    
                  />
                </TableCell>
                {
                  headers.map((h)=><TableCell> {h}</TableCell>)
                }
              
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((custom) => {
           
                return (
                  <TableRow
                  onClick={()=>handleOpenModal(custom)}
                    hover
                    key={custom.id}
                  
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        
                        
                      />
                    </TableCell>
                    {
                  header2.map((h)=><TableCell> {custom[h]}</TableCell>)
                }
                  
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      
    </Card>
  );
};

CustomsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
