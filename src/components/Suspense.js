import React from "react";
// Custom component for conditional rendering - to remove
// clutter from code.
// Warning: be aware that 'children' are executed anyway
// (no matter if 'displayChildren' is true or false)
// so in certain scenarios it is safer to use
// ternary or && operator.

export default function Suspense(
    {children, fallback, displayChildren = false}) {

    return (
        <>
          {
              displayChildren ?
                  children 
                  :
                  fallback
          }
        </>
    );
}
