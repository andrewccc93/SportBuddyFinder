// import Eventlist from '../components/Eventlist';
import { connect } from 'react-redux';
import CategoryList from '../components/CategoryList';
// import { toggleEvent } from '../actions';
import { eventlistFetch, eventDelete, eventToggle } from '../actions/EventActions';
import { VisibilityFilters } from '../actions/types';

// const mapStateToProps = state => ({
//   eventlist: state.eventlist,
//   isLoading: state.loading
// });

// const mapDispatchToProps = dispatch => ({
//   onToggleEvent: (id) => dispatch(toggleEvent(id))
// });

function filterEventlist(eventlist, filter) {
  const { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } = VisibilityFilters;
  switch (filter) {
    case SHOW_ALL:
      return eventlist;
    case SHOW_ACTIVE:
      return eventlist.filter(event => !event.done);
    case SHOW_COMPLETED:
      return eventlist.filter(event => event.done);
    default:
      return eventlist;
  }
}

const mapStateToProps = state => {
  const eventlist = Object.keys(state.eventlist).map(id => {
    return { ...state.eventlist[id], id };
  });
  return {
    eventlist: filterEventlist(eventlist, state.filter),
    isLoading: state.loading
  };
};

const VisibleCategoryList = connect(
mapStateToProps,
// mapDispatchToProps
{ eventlistFetch, delete: eventDelete, toggleEvent: eventToggle }
)(CategoryList);

export default VisibleCategoryList;
