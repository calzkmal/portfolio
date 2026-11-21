"use client";

import { useRef, useState } from "react";

/** Round "Email" button that copies the address, with the address shown as plain text below. */
export function CopyEmail({ email }: { email: string }) {
  const [label, setLabel] = useState("Email");
  const addrRef = useRef<HTMLAnchorElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setLabel("Copied");
    } catch {
      // Clipboard refused: select the address so it can be copied by hand.
      const range = document.createRange();
      if (addrRef.current) range.selectNodeContents(addrRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      setLabel("Selected");
    }
    window.setTimeout(() => setLabel("Email"), 1800);
  };

  return (
    <>
      <button type="button" className="anri-mail" onClick={copy} aria-live="polite">
        {label}
      </button>
      <a ref={addrRef} className="anri-addr" href={`mailto:${email}`}>
        {email}
      </a>
    </>
  );
}
