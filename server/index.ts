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

    if (statusCode) {
      res.send({ statusCode });
      return;
    }

    /**
     * Should implement also other checks
     */
    if (!Number.isInteger(Number(req.params.page)) || req.params.page >= pages.length) {
      res.send({ statusCode: 404 });
      return;
    }

    res.send({
      numberOfPages: pages.length,
      transcript: {
        words: pages[req.params.page],
      },
    },
    );
    return;
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err: string) => {
    if (err) { throw err; }
  });
});
