const express = require('express');
const cors = require('cors');

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/', function (req, res) {
    res.send("Hello World!!")
});

app.post('/servicos', async (req, res) => {
    await servico.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});
app.post('/clientes', async (req, res) => {
    await cliente.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Cliente criado com sucesso"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/pedidos', async (req, res) => {
    await pedido.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Pedido criado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/itenspedido', async (req, res) => {
    await itempedido.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Item criado com sucesso"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

let port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
    console.log("Servidor ativo: http://localhost:3001");
})