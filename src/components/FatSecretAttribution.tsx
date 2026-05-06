"use client";

// FatSecret Platform API attribution snippet — rendered verbatim per
// https://platform.fatsecret.com/attribution ("You must not modify the HTML
// of the Attribution snippet in any way"). The Begin/End HTML comments are
// part of the snippet and must be preserved.
const SNIPPET = `<!-- Begin fatsecret Platform API HTML Attribution Snippet -->
<a href="https://platform.fatsecret.com">Powered by fatsecret Platform API</a>
<!-- End fatsecret Platform API HTML Attribution Snippet -->`;

export function FatSecretAttribution({ className }: { className?: string }) {
  return (
    <div className={className} suppressHydrationWarning>
      <span dangerouslySetInnerHTML={{ __html: SNIPPET }} />
      {" · "}
      <a
        href="https://platform.fatsecret.com/terms"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms
      </a>
    </div>
  );
}
