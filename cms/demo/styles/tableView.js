export default {
  tableView: {},
  tableView__header: {
    display: 'flex',
    flexDirection: 'row',
    height: 30,
    lineHeight: '30px',
    borderBottom: '1px solid #DDD'
  },
  tableView__cell: {
    textDecoration: 'none',
    padding: '0 4px',
    flex: 1,
  },
  tableView__cell_bold: {
    fontWeight: 'bold'
  },
  tableView__body: {
    display: 'flex',
    flexDirection: 'column'
  },
  tableView__line: {
    flex: 1,
    display: 'flex',
    minHeight: '30px',
    lineHeight: '30px',
    borderBottom: '1px solid #EEE',
    flexDirection: 'row'
  },
  tableView__line_hover: {
    backgroundColor: '#EEE'
  }
}