import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import FirstPage from '@material-ui/icons/FirstPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import LastPage from '@material-ui/icons/LastPage';

const styles = theme => ({
  margin: {
    margin: '0px 5px',
  },
});

class MyPegination extends Component {

  /**
	 * Constructor
	 * 
	 * @param {Object} props
	 */
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="MyPagination">
        <Fab size="small" color="primary" aria-label="First" className={classes.margin}>
          <FirstPage />
        </Fab>
        <Fab size="small" color="primary" aria-label="Left" className={classes.margin}>
          <ChevronLeft />
        </Fab>
        <Fab size="small" color="primary" aria-label="Right" className={classes.margin}>
          <ChevronRight />
        </Fab>
        <Fab size="small" color="primary" aria-label="Last" className={classes.margin}>
          <LastPage />
        </Fab>
      </div>
    )
  }
}

MyPegination.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyPegination);