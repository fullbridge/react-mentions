import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defaultStyle } from 'substyle';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import utils from './utils';

class Suggestion extends Component {

  // static propTypes = {
  //   id: PropTypes.string.isRequired,
  //   query: PropTypes.string.isRequired,
  //   index: PropTypes.number.isRequired,
  //
  //   suggestion: PropTypes.oneOfType([
  //     PropTypes.string,
  //     PropTypes.shape({
  //       id: PropTypes.string.isRequired,
  //       display: PropTypes.string
  //     }),
  //   ]).isRequired,
  //   descriptor: PropTypes.object.isRequired,
  //
  //   focused: PropTypes.bool,
  // };


  // THIS WAS THE PREVIOUS FIX FOR SCROLLING WITH ARROW KEYS NOT WORKING WHEN WE FIRST ADDED THIS PACKAGE.

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.focused && !prevProps.focused) {
  //     this.el.scrollIntoView({block: 'nearest'})
  //   }
  // }

  render() {
    let rest = omit(this.props, 'style', keys(Suggestion.propTypes));
    rest = utils.getFilteredProps(this.props)

    return (
      <li
        ref={el => this.el = el}
        { ...rest }
        className={this.props.suggestionClassName + (this.props.focused ? ` ${this.props.focusedSuggestionClassName}` : "")}
        // { ...this.props.style }
      >

        { this.renderContent() }
      </li>
    );
  }

  renderContent() {
    let { id, query, descriptor, suggestion, index } = this.props;

    let display = this.getDisplay();
    let highlightedDisplay = this.renderHighlightedDisplay(display, query);

    if(descriptor.props.renderSuggestion) {
      return descriptor.props.renderSuggestion(suggestion, query, highlightedDisplay, index);
    }

    return highlightedDisplay;
  }

  getDisplay() {
    let { suggestion } = this.props;

    if(suggestion instanceof String) {
      return suggestion;
    }

    let { id, display } = suggestion;

    if(!id || !display) {
      return id;
    }

    return display;
  }

  renderHighlightedDisplay(display) {
    const { query, style } = this.props;

    let i = display.toLowerCase().indexOf(query.toLowerCase());

    if(i === -1) {
      return <span { ...style("display") }>{ display }</span>;
    }

    return (
      <span>
        { display.substring(0, i) }
        <b { ...style("highlight") }>
          { display.substring(i, i+query.length) }
        </b>
        { display.substring(i+query.length) }
      </span>
    );
  }

}

const styled = defaultStyle({
  cursor: "pointer"
}, (props) => ({ "&focused": props.focused }))

export default styled(Suggestion);
