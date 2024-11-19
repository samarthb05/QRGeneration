const express = require("express");
const bodyParser = require("body-parser");
const QRCode = require("qrcode");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/createOrder", async (req, res) => {
  const { ver, mode, tr, tn, pn, pa, mc, am, cu, qrMedium, QRexpire } =
    req.body;

  let qrString = `upi://pay?ver=${ver}&mode=${mode}&tr=${tr}&tn=${tn}&pn=${pn}&pa=${pa}&mc=${mc}&am=${am}&cu=${cu}&qrMedium=${qrMedium}`;

  if (QRexpire) {
    qrString += `&QRexpire=${QRexpire}`;
  }

  try {
    const qrCodeURL = await QRCode.toDataURL(qrString);

    const order = {
      ver,
      mode,
      tr,
      tn,
      pn,
      pa,
      mc,
      am,
      cu,
      qrMedium,
      qrCodeURL,
    };

    return res.status(201).json({
      message: "Order created successfully (DYNAMICQR)",
      data: {
        order,
        qrCodeURL,
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return res.status(500).json({ error: "Failed to generate QR code" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
