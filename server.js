const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const htmlDir = path.join(__dirname, "pages");
const cssDir = path.join(__dirname, "styles");

async function readContent(fileDir) {
  try {
    return await fs.readFile(path.join(htmlDir, fileDir), "utf-8");
  } catch (err) {
    throw new Error(`Error reading file: ${err.message}`);
  }
}

async function getContent(response, filename, contentType) {
  try {
    const navData = await readContent("nav.html");
    const mainContent = await readContent(filename);
    const footerData = await readContent("footer.html");

    const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
           <title>Digital Paradise - Computers</title>
            <link rel="stylesheet" href="/styles/main.css">
            <link rel="stylesheet" href="/styles/nav-footer.css">
             <link rel="icon" href="https://i.ibb.co/7GwfYSX/digital-paradise-favicon-white.png"  type="image/x-icon">
            <script src="https://kit.fontawesome.com/46dc6ecec6.js" crossorigin="anonymous"></script>
          </head>
          <body>
          <div class="container">
            ${navData}
            <div class="content">
            ${mainContent}
            </div>
            ${footerData}
            </div>
          </body>
        </html>
      `;

    response.writeHead(200, { "Content-Type": contentType });
    response.write(fullHtml);
    response.end();
  } catch (err) {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.write("Server Error");
    response.end();
    console.error(err);
  }
}

async function readFile(filePath, contentType, response) {
  try {
    const data = await fs.readFile(filePath);
    response.writeHead(200, { "Content-Type": contentType });
    response.write(data);
    response.end();
  } catch (err) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write(`${filePath} not found`);
    response.end();
    console.error(err);
  }
}

const server = http.createServer(async (request, response) => {
  let filePath;
  let contentType;

  switch (request.url) {
    case "/":
      filePath = "index.html";
      contentType = "text/html";
      break;
    case "/user":
      filePath = "user.html";
      contentType = "text/html";
      break;
    case "/login":
      filePath = "login.html";
      contentType = "text/html";
      break;
    case "/products":
      filePath = "products.html";
      contentType = "text/html";
      break;
    case "/styles/main.css":
      await readFile(path.join(cssDir, "main.css"), "text/css", response);
      return;
    case "/styles/nav-footer.css":
      await readFile(path.join(cssDir, "nav-footer.css"), "text/css", response);
      return;
    case "/styles/home.css":
      await readFile(path.join(cssDir, "home.css"), "text/css", response);
      return;
    case "/styles/login.css":
      await readFile(path.join(cssDir, "login.css"), "text/css", response);
      return;
    case "/styles/user.css":
      await readFile(path.join(cssDir, "user.css"), "text/css", response);
      return;
    case "/styles/products.css":
      await readFile(path.join(cssDir, "products.css"), "text/css", response);
      return;
    case "/styles/error.css":
      await readFile(path.join(cssDir, "error.css"), "text/css", response);
      return;
    default:
      filePath = "error.html";
      contentType = "text/html";
      break;
  }

  await getContent(response, filePath, contentType);
});

server.listen(4000, () => console.log("Server is Running on port 4000"));
