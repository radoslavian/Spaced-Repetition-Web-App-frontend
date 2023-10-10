import React from "react";

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
