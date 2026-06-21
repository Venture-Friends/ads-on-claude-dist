// src/footer.ts
var ESC = "\x1B";
var BEL = "\x07";
function hyperlink(text, url) {
  return `${ESC}]8;;${url}${BEL}${text}${ESC}]8;;${BEL}`;
}
function renderFooter(ad) {
  return `Sponsored \xB7 ${hyperlink(ad.text, ad.url)}`;
}

// src/statusline.ts
var STUB_AD = {
  text: "Clerk \u2014 drop-in Next.js auth",
  url: "https://clerk.com"
};
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}
async function main() {
  await readStdin();
  process.stdout.write(renderFooter(STUB_AD));
}
main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(0);
});
