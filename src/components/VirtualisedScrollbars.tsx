import React, { useCallback } from "react";
import { Scrollbars } from "react-custom-scrollbars";

const VirtualisedScrollbars = ({ onScroll, className, forwardedRef, style, children }: any) => {
  const refSetter = useCallback((scrollbarsRef) => {
    if (scrollbarsRef) {
      forwardedRef(scrollbarsRef.view);
    } else {
      forwardedRef(null);
    }
  }, []);

  return (
    <Scrollbars
      ref={refSetter}
      style={{ ...style, overflow: "hidden" }}
      onScroll={onScroll}
      className={className}
    >
      {children}
    </Scrollbars>
  );
};

export default React.forwardRef((props, ref) => (
  <VirtualisedScrollbars {...props} forwardedRef={ref} />
));
