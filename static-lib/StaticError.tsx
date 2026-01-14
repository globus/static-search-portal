import { z } from "zod";
import _STATIC from "../static.json" assert { type: "json" };
import { safeParse } from ".";
import { PropsWithChildren } from "react";

export function StaticError({ children }: PropsWithChildren) {
  const result = safeParse();
  if (result.error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>
          <code>static.json</code> Error
        </h1>
        <p>There was an error with the portal configuration.</p>
        <pre
          style={{
            backgroundColor: "#f8f8f8",
            padding: "1rem",
            borderRadius: "4px",
            overflowX: "auto",
          }}
        >
          {z.prettifyError(result.error)}
        </pre>
        <details style={{ marginTop: "1rem" }}>
          <summary>Raw static.json content</summary>
          <pre
            style={{
              backgroundColor: "#f0f0f0",
              padding: "1rem",
              borderRadius: "4px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(_STATIC, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
  return children;
}
