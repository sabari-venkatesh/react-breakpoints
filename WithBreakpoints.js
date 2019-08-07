import React from "react";
import { debounce } from "lodash";

const WithBreakpoint = (WrappedComponent) => {
  class Breakpoint extends React.Component {
    constructor(props) {
      const defaultBreakpoints = [
        { xsmall: 0 }, // all mobile devices
        { small: 576 }, // mobile devices (not sure which one's this big)
        { medium: 768 }, // ipad, ipad pro, ipad mini, etc
        { large: 992 }, // smaller laptops
        { xlarge: 1200 } // laptops and desktops
      ];
      this.allBreakpoints = defaultBreakpoints;
      this.state = {
        currentWidth: this.getCurrentWidth(),
        currentBreakpointName: this.getBreakpointName(this.getCurrentWidth()),
      };
      this.handleResize = debounce(this.handleResize.bind(this), 100);
    }

    componentDidMount() {
      window.addEventListener('resize', (this.handleResize));
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    getCurrentWidth() {
      return window ? Math.max(document.documentElement.clientWidth, window.innerWidth || 0) : 9999;
    }

    getBreakpointName(width) {
      console.log(width);
      let bpName;

      this.allBreakpoints.forEach((obj) => {
        let currentKey = Object.keys(obj)[0];
        if (obj[currentKey] <= width) bpName = currentKey;
      });

      return bpName;
    }

    extractBreakpointAndModifierFromProps(allProps) {
      let breakpoint, modifier;

      Object.keys(allProps).forEach((prop) => {
        if (prop === 'up' || prop === 'down' || prop === 'only') {
          modifier = prop;
        } else if (prop !== 'tagName' && prop !== 'className') {
          breakpoint = prop;
        }
      });

      if (!modifier) modifier = 'only';

      return {
        breakpoint,
        modifier
      };
    }

    handleResize() {
      const currentWidth = this.getCurrentWidth();

      this.setState({
        currentWidth: currentWidth,
        currentBreakpointName: this.getBreakpointName(currentWidth)
      });
    }

    getBreakpointWidth(breakpointName) {
      let breakpointWidth = 0;
      this.allBreakpoints.forEach((obj) => {
        let currentKey = Object.keys(obj)[0];
        if (currentKey === breakpointName) breakpointWidth = obj[currentKey];
      });

      return breakpointWidth;
    }

    getNextBreakpointWidth(breakpointName) {
      let nextBreakpointName;
      let nextBreakpointWidth = 9999;
      let currentBreakpointIndex = 0;

      for (let i = 0; i < this.allBreakpoints.length; i++) {
        let obj = this.allBreakpoints[i];
        let currentKey = Object.keys(obj)[0];
        if (currentKey === breakpointName) {
          currentBreakpointIndex = i;
        }

        if (currentBreakpointIndex > 0) {
          let nextBreakpointIndex = currentBreakpointIndex + 1;
          if (this.allBreakpoints.length > nextBreakpointIndex) {
            let nextBreakpointObj = this.allBreakpoints[nextBreakpointIndex];
            nextBreakpointName = Object.keys(nextBreakpointObj)[0];
            nextBreakpointWidth = nextBreakpointObj[nextBreakpointName];
          }

          break;
        }
      }

      return nextBreakpointWidth;
    }

    shouldRender({ breakpointName, modifier, currentBreakpointName, currentWidth }) {
      if (modifier === 'only') {
        if (breakpointName === currentBreakpointName) return true;
      } else if (modifier === 'up') {
        const breakpointWidth = this.getBreakpointWidth(breakpointName);
        if (currentWidth >= breakpointWidth) return true;
      } else if (modifier === 'down') {
        const nextBreakpointWidth = this.getNextBreakpointWidth(breakpointName);
        if (currentWidth < nextBreakpointWidth) return true;
      }

      return false;
    }

    render() {
      const { children, ...rest } = this.props;
      const { currentBreakpointName, currentWidth } = this.state;
      const { breakpoint, modifier } = this.extractBreakpointAndModifierFromProps(rest);

      const shouldRender = this.shouldRender({
        breakpointName: breakpoint,
        modifier,
        currentBreakpointName,
        currentWidth,
      });

      if (!shouldRender) return null;
      return (
        <WrappedComponent
          {...this.props}
          currentWidth={this.state.currentWidth}
          currentBreakpointName={this.state.currentBreakpointName}
          breakpointName={breakpoint}
        />
      );
    }
  }

  return Breakpoint;
}
export default WithBreakpoint;