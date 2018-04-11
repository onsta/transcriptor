import * as express from "express";
import * as fetch from "isomorphic-unfetch";
import * as next from "next";
import * as R from "ramda";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.get("/", (req, res) => {
    return app.render(req, res, "/", req.query);
  });

  server.get("/api/:page", async (req, res) => {
    const result: {
      statusCode?: number;
      json: () => Promise<any>
    } = await fetch("https://s3.amazonaws.com/com.trint.misc.challenge/transcript.json");
    const statusCode = result.statusCode > 200 ? result.statusCode : false;
    const data = await result.json();
    // req.params.page
    const pages: Array<{ name: string, para: string }> =
      R.groupWith((a: { name: string, para: string }, b: { name: string, para: string }) =>
        R.head(R.split("-", a.para)) === R.head(R.split("-", b.para))
        , data.transcript.words);
    res.send({
      numberOfPages: pages.length,
      statusCode,
      data: {
        transcript: {
          words: pages[req.params.page],
        },
      },
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err: string) => {
    if (err) { throw err; }
  });
});
