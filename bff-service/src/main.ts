import express from "express";
import axios from "axios";

const PORT = process.env.PORT || 7777;

const servicePathIdentity = ["product", "cart"];

const isProxyAllowedFor = (serviceName: string) =>
  servicePathIdentity.includes(serviceName);

const getProxyHost = (recipient: string) =>
  process.env.hasOwnProperty(recipient) ? process.env[recipient] : "";

const app = express();

app.all("/:recipient*", (req, res) => {
  const recipient = req.params.recipient;
  const rest = req.params[0]; // dictionary, not array

  if (!isProxyAllowedFor(recipient)) {
    res.status(502).json({ error: "Cannot process request" });
    return;
  }

  const proxyHost = getProxyHost(recipient);

  if (!proxyHost) {
    res.status(404).json({ error: "Cannot find such proxy service" });
    return;
  }

  const proxyRequest = {
    url: `${proxyHost}${rest}`,
    method: req.method,
    data: req.body,
  };

  console.info(JSON.stringify(proxyRequest));

  const handleSuccess = (response: any) => {
    console.log("response from recipient", response);

    res.json(response.data);
  };

  const handleErrors = (e: any) => {
    if (!e.response) {
      res.status(500).json({ error: e.message });
      return;
    }

    const { status, data } = e.response;

    console.log("data", data);

    res.status(status).json(data);
  };

  // @ts-ignore
  axios(proxyRequest).then(handleSuccess).catch(handleErrors);
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
