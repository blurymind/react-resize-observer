import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import throttle from "lodash.throttle";

class ResizeObserverComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 1,
      height: 1
    };

    this.ref = React.createRef();
  }

   setSizeStateThrottled = throttle((width, height) => {
    this.setState({
      width,
      height,
    });
  }, this.props.throttle ? this.props.throttle : 500);

  observeIfNeeded() {
    const element = this.ref.current;

    if (element && this.element !== element) {
      // clean up after a previous element
      if (this.element) {
        this.unobserve(this.element);
      }

      // start observing the new element
      this.observe(element);
    }
  }

  observe(element) {
    this.resizeObserver = new ResizeObserver(entries => {
      // Since we only observe the one element, we don't need to loop over the
      // array
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }

      const entry = entries[0];

      this.setSizeStateThrottled(entry.contentRect.width,entry.contentRect.height);
    });

    this.resizeObserver.observe(element);
    this.element = element;
  }

  unobserve(element) {
    this.resizeObserver.unobserve(element);
  }

  componentDidMount() {
    this.observeIfNeeded();
  }

  componentDidUpdate() {
    this.observeIfNeeded();
  }

  componentWillUnmount() {
    if (this.ref.current) {
      this.unobserve(this.ref.current);
    }
  }

  render() {
    if (!ref) {
      const { width, height } = this.state;
      const { children } = this.props;
      return <div ref={this.ref}>{children({ width, height })}</div>;
    }
    return this.props.children(this.ref, this.state.width, this.state.height); 
  }
}

ResizeObserverComponent.propTypes = {
  children: PropTypes.func.isRequired
};

export default ResizeObserverComponent;
