import { useContext } from "react";
import { MatchBreakpointsContext } from "@src/components-v2/shared/contexts/break-point";

const useMatchBreakpoints = () => {
  const matchBreakpointContext = useContext(MatchBreakpointsContext);

  if (matchBreakpointContext === undefined) {
    throw new Error("Match Breakpoint context is undefined");
  }

  return matchBreakpointContext;
};

export default useMatchBreakpoints;
