import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import FirstPage from '@material-ui/icons/FirstPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import LastPage from '@material-ui/icons/LastPage';

const styles = theme => ({
  pagBtn: {
    margin: '0px 3px',
    width: 36,
    height: 36,
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
    this.state = {
      pages: [],
      numberOfPages: props.totalProp,
      actual: parseInt(props.activePageProp),
      prevVisible: parseInt(props.activePageProp) - 1 < 1 ? parseInt(props.activePageProp) + 2 : parseInt(props.activePageProp) - 1,
      nextVisible: parseInt(props.activePageProp) + 1 > props.totalProp ? parseInt(props.activePageProp) - 2 : parseInt(props.activePageProp) + 1,
    };
  }

  componentDidMount = () => {
    let previousPages = this.state.pages;
    let { actual, prevVisible, nextVisible, numberOfPages } = this.state;

    if (numberOfPages === 1) {
      previousPages.push(
        <Fab
          size="small"
          key={numberOfPages}
          color="default"
          aria-label={numberOfPages}
          className={this.props.classes.pagBtn + ` pag-btn active-pag-btn`}
          onClick={(e) => { this.handlePagButtonClicked(numberOfPages) }}
        >
          {numberOfPages}
        </Fab>
      )

      this.setState({
        actual: 1
      });

    } else {
      for (let i = 1; i <= numberOfPages; i++) {
        let activePagBtn = actual === i ? 'pag-btn active-pag-btn' : 'pag-btn';
        let hiddenPagBtn = prevVisible === i || nextVisible === i || actual === i ? '' : 'hidden-pag-btn';

        previousPages.push(
          <Fab
            size="small"
            key={i}
            color="default"
            aria-label={i}
            className={this.props.classes.pagBtn + ` ${activePagBtn} ${hiddenPagBtn}`}
            onClick={(e) => { this.handlePagButtonClicked(i) }}
          >
            {i}
          </Fab>
        )
      }
    }

    this.setState({
      pages: previousPages
    });
  }

  /**
   * Pagination button clicked
   */
  handlePagButtonClicked = (pageId) => {
    this.setState({
      actual: pageId
    });

    this.props.pagBtnClickedProp(pageId);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="MyPagination">
        <Fab
          disabled={this.state.actual === 1 ? true : false}
          size="small"
          color="primary"
          aria-label="First"
          className={classes.pagBtn}
          onClick={(e) => { this.handlePagButtonClicked(1) }}
        >
          <FirstPage />
        </Fab>
        <Fab
          size="small"
          color="primary"
          aria-label="Left"
          className={classes.pagBtn}
          onClick={(e) => { this.handlePagButtonClicked(this.state.actual - 1) }}
          disabled={this.state.actual === 1 ? true : false}
        >
          <ChevronLeft />
        </Fab>
        {
          this.state.pages.map((btn, index) => {
            return btn;
          })
        }
        <Fab
          size="small"
          color="primary"
          aria-label="Right"
          className={classes.pagBtn}
          onClick={(e) => { this.handlePagButtonClicked(this.state.actual + 1) }}
          disabled={this.state.actual === this.state.pages.length ? true : false}
        >
          <ChevronRight />
        </Fab>
        <Fab
          size="small"
          color="primary"
          aria-label="Last"
          className={classes.pagBtn}
          onClick={(e) => { this.handlePagButtonClicked(this.state.pages.length) }}
          disabled={this.state.actual === this.state.pages.length ? true : false}
        >
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