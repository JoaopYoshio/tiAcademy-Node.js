const express = require('express');
const cors = require('cors');

const { Sequelize } = require('./models')

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

let compra = models.Compra;
let itemcompra = models.ItemCompra;
let produto = models.Produto;

app.get('/', function (req, res) {
    res.send("Hello World!!")
});

//-----------------------CREATE--------------------------//

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

//-----------------------LIST--------------------------//

app.get('/listaclientes', async (req, res) => {
    await cliente.findAll({
        order: [['createdAt', 'ASC']]//ordem de antiguidade
    }).then(function (clientes) {
        res.json({ clientes })
    });
});

app.get('/listapedidos', async (req, res) => {
    await pedido.findAll({
        order: [['id', 'ASC']]
    }).then(function (pedidos) {
        res.json({ pedidos })
    });
});

app.get('/listaservicos', async (req, res) => {
    await servico.findAll({
        //raw: true,
        order: [['id', 'ASC']]
    }).then(function (servicos) {
        res.json({ servicos })
    });
});

app.get('/listaitenspedidos', async (req, res) => {
    await itempedido.findAll({
        order: [['valor', 'DESC']]//ordem de maior valor
    }).then(function (itemPedidos) {
        res.json({ itemPedidos })
    });
});

//-----------------------COUNT--------------------------//

app.get('/clientesbase', async (req, res) => {
    await cliente.count('id').then(function (clientes) {
        res.json({ clientes });
    });
});

app.get('/pedidosbase', async (req, res) => {
    await cliente.count('id').then(function (pedidos) {
        res.json({ pedidos });
    });
});

app.get('/servicosbase', async (req, res) => {
    await servico.count('id').then(function (servicos) {//conta o número de ids
        res.json({ servicos });
    });
});

//-----------------------SEARCH--------------------------//

app.get('/servico/:id', async (req, res) => {
    await servico.findByPk(req.params.id)
        .then(serv => {
            return res.json({
                error: false,
                serv
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro: Serviço não encontrado"
            });
        });
});

app.get('/servico/:id/pedidos', async (req, res) => {
    await itempedido.findAll({
        where: {ServicoId: req.params.id}})
        .then(item => {
            return res.json({
                error: false,
                item
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro: Não foi posssível se conectar!"
            });
        });
});

app.get('/cliente/:id', async (req, res) => {
    await cliente.findByPk(req.params.id)
        .then(cli => {
            return res.json({ cli });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro!!"
            });
        });
});


app.get('/pedidos/:id', async (req, res) => {
    await pedido.findByPk(req.params.id, { include: [{ all: true }] })
        .then(ped => {
            return res.json({ ped });
        });
});

app.get('/clientes/:id/pedidos', async (req, res) => {
    await cliente.findByPk(req.params.id, { include: [{ all: true }] })
        .then(peds => {
            return res.json({ peds });
        })
})

//-----------------------UPDATE--------------------------//

app.put("/servico/:id/editar", async (req, res) => {
    if(!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };

    const serv = {
        nome: req.body.nome,
        descricao: req.body.descricao
    }

    await servico.update(serv, {
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Serviço alterado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar o serviço."
        });
    });
});

app.put('/cliente/:id/editar', async (req, res) => {
    const cli = {
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        clienteDesde: req.body.clienteDesde
    };

    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Cliente não encontrado"
        })
    }
    await cliente.update(cli, {
        where: {id: req.params.id}
    }).then(function () {
        return res.json({
            error: false,
            message: "Cliente alterado com sucesso!",

        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        })
    });
});

app.put('/pedidos/:id/editaritem', async (req, res) => {
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Pedido não encontrado"
        })
    }
    if (!await servico.findByPk(req.body.ServicoId)) {
        return res.status(400).json({
            error: true,
            message: "Serviço não encontrado"
        })
    }
    await itempedido.update(item, {
        where: Sequelize.and({ ServicoId: req.body.ServicoId },
            { PedidoId: req.params.id })
    }).then(function (itens) {
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!",
            itens

        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        })
    });
});

//-----------------------DELETE-------------------------//

app.delete('/excluircliente/:id', async(req, res)=>{
     await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error:false, 
            message: "Cliente foi excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message: "Erro ao excluir o cliente"
        })
    })
});

//-----------------------DESAFIO-------------------------//

//-----------------------CREATE--------------------------//

app.post('/compras', async (req, res) => {
    await compra.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Compra criado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/produtos', async (req, res) => {
    await produto.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Produto criado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/itenscompra', async (req, res) => {
    await itemcompra.create(req.body
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

//-----------------------LIST--------------------------//

app.get('/listascompras', async (req, res) => {
    await compra.findAll({
        order: [['id', 'ASC']]
    }).then(function (compras) {
        res.json({ compras })
    });
});

app.get('/listasprodutos', async (req, res) => {
    await produto.findAll({
        //raw: true,
        order: [['nome', 'ASC']]
    }).then(function (produtos) {
        res.json({ produtos })
    });
});

app.get('/listaitenscompras', async (req, res) => {
    await itemcompra.findAll({
        order: [['valor', 'DESC']]//ordem de maior valor
    }).then(function (itemcompras) {
        res.json({ itemcompras })
    });
});

//-----------------------UPDATE--------------------------//

app.put("/atualizaproduto", async (req, res) => {
    await produto.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Produto alterado com sucesso"
        })
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do produto"
        })
    })
});

app.put("/atualizacompra", async (req, res) => {
    await compra.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Compra alterado com sucesso"
        })
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração da Compra"
        })
    })
});

app.put('/compras/:id/editaritem', async (req, res) => {
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Compra não encontrado"
        })
    }
    if (!await produto.findByPk(req.body.ProdutoId)) {
        return res.status(400).json({
            error: true,
            message: "Produto não encontrado"
        })
    }
    await itemcompra.update(item, {
        where: Sequelize.and({ ProdutoId: req.body.ProdutoId },
            { CompraId: req.params.id })
    }).then(function (itens) {
        return res.json({
            error: false,
            message: "Item da compra alterado com sucesso!",
            itens

        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        })
    });
});

//-----------------------DELETE-------------------------//

app.get('/excluircompra/:id', async(req, res)=>{
    await compra.destroy({
       where: {id: req.params.id}
   }).then(function(){
       return res.json({
           error:false, 
           message: "Compra foi excluído com sucesso!"
       });
   }).catch(function(erro){
       return res.status(400).json({
           error:true,
           message: "Erro ao excluir a compra"
       })
   })
});


app.get('/excluirproduto/:id', async(req, res)=>{
    await produto.destroy({
       where: {id: req.params.id}
   }).then(function(){
       return res.json({
           error:false, 
           message: "Produto foi excluído com sucesso!"
       });
   }).catch(function(erro){
       return res.status(400).json({
           error:true,
           message: "Erro ao excluir o produto"
       })
   })
});


let port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
    console.log("Servidor ativo: http://localhost:3001");
})

