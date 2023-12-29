const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const fetch = require("cross-fetch");

require("dotenv").config();

const axiosInstance = axios.create({
  baseURL: "https://api.whereby.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "*",
    methods: "GET,POST",
  })
);

app.post("/create-meeting", async (req, res) => {
  try {
    const data = {
      endDate: "2099-02-18T14:23:00.000Z",
      fields: ["hostRoomUrl"],
    };

    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("aqui", response);

    if (response.status === 201) {
      const responseData = await response.json();
      res.json(responseData);
    } else {
      res
        .status(response.status)
        .json({ error: "Erro ao criar reunião no Whereby" });
    }
  } catch (error) {
    console.error("Erro ao criar reunião no Whereby", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.get("/get-meeting/:meetingId", async (req, res) => {
  try {
    const { meetingId } = req.params;
    const response = await axiosInstance.get(`/meetings/${meetingId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter informações da reunião" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
