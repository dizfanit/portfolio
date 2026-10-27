// Initial setup for a persistent single-server deployment. Does not overwrite an existing account.
const {promises:fs} = require("node:fs");
const path = require("node:path");
const {randomBytes,scryptSync} = require("node:crypto");
const readline = require("node:readline");
const folder = path.resolve(process.env.PORTFOLIO_CONTENT_DIR || path.join(process.cwd(),".portfolio-content"));
async function main() {
  if(!process.stdin.isTTY) throw Error("Run this in a private interactive terminal.");
  const password = await new Promise(resolve => {
    const rl = readline.createInterface({input:process.stdin,output:process.stdout,terminal:true});
    rl.stdoutMuted=false; rl._writeToOutput = function(text) { if(!this.stdoutMuted) process.stdout.write(text); };
    rl.question("New admin password (10+ characters): ", value => {rl.close();process.stdout.write("\n");resolve(value);}); rl.stdoutMuted=true;
  });
  if(password.length<10 || password.length>200) throw Error("Use 10–200 characters.");
  const salt=randomBytes(32).toString("hex"); const hash=scryptSync(password,salt,64).toString("hex");
  await fs.mkdir(folder,{recursive:true}); await fs.writeFile(path.join(folder,"admin.json"),JSON.stringify({salt,hash,secret:randomBytes(32).toString("hex")}),{flag:"wx",mode:0o600});
  console.log("Admin password configured.");
}
main().catch(e => {console.error(e.code === "EEXIST" ? "Admin already configured.":e.message);process.exitCode=1;});

