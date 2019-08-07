import React from 'react';
import WithBreakpoint from "./WithBreakpoints";


const Hello = (props) => {

  const { name, currentBreakpointName, breakpointName, children } = props;
  return (
    <>
      <div>{children}</div>
    </>
  )

};

export default WithBreakpoint(
  Hello
);

// import React from 'react';
// import withSecretToLife from './WithBreakpoints';

// export default withSecretToLife(
// props => (
//   <div>
//     The secret to life is {props.secretToLife}.
//   </div>
// )
// );;